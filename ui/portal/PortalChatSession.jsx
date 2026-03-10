"use client";

import { useEffect, useRef } from "react";
import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { ChatbotUI } from "./ChatbotUI";
import { coachDataPartSchemas } from "@/lib/ai/types";
import { getMessagesSignature } from "@/lib/ai/message-utils";

export function PortalChatSession({
  conversationId,
  initialMessages,
  mode,
  teamId,
  context,
  isCentered,
  onUserMessage,
  onMessagesSync,
  onAssistantTurn,
}) {
  const lastExternalSignatureRef = useRef(getMessagesSignature(initialMessages));
  const processedAssistantIdsRef = useRef(new Set());

  const { messages, sendMessage, setMessages, status, error, clearError } = useChat({
    id: conversationId,
    messages: initialMessages,
    dataPartSchemas: coachDataPartSchemas,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest: ({ id, messages: nextMessages }) => ({
        body: {
          id,
          messages: nextMessages,
          body: {
            mode,
            teamId,
            context,
          },
        },
      }),
    }),
    onFinish: ({ message, messages: nextMessages }) => {
      onMessagesSync?.(conversationId, nextMessages);

      if (message.role !== "assistant" || processedAssistantIdsRef.current.has(message.id)) {
        return;
      }

      processedAssistantIdsRef.current.add(message.id);
      onAssistantTurn?.({
        conversationId,
        message,
        messages: nextMessages,
      });
    },
  });

  useEffect(() => {
    onMessagesSync?.(conversationId, messages);
  }, [conversationId, messages, onMessagesSync]);

  useEffect(() => {
    const externalSignature = getMessagesSignature(initialMessages);
    const currentSignature = getMessagesSignature(messages);

    if (
      externalSignature !== currentSignature &&
      externalSignature !== lastExternalSignatureRef.current
    ) {
      lastExternalSignatureRef.current = externalSignature;
      setMessages(initialMessages);
      return;
    }

    lastExternalSignatureRef.current = externalSignature;
  }, [initialMessages, messages, setMessages]);

  const handleSendMessage = async (text) => {
    clearError();
    onUserMessage?.({ conversationId, text });
    await sendMessage({ text });
  };

  return (
    <ChatbotUI
      messages={messages}
      onSendMessage={handleSendMessage}
      isCentered={isCentered}
      status={status}
      errorMessage={error?.message}
    />
  );
}
