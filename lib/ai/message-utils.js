import { createEmptyCoachTurnData, normalizeCoachTurnData } from "./types.js";

function createMessageId(prefix) {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function createUserMessage(text, id = createMessageId("user")) {
  return {
    id,
    role: "user",
    parts: [
      {
        type: "text",
        text,
      },
    ],
  };
}

export function createAssistantMessage({
  text,
  id = createMessageId("assistant"),
  suggestedActions = [],
  operations = [],
  warnings = [],
}) {
  const message = {
    id,
    role: "assistant",
    parts: [
      {
        type: "text",
        text,
      },
    ],
  };

  if (suggestedActions.length > 0 || operations.length > 0 || warnings.length > 0) {
    message.parts.push({
      type: "data-coach-turn",
      data: normalizeCoachTurnData({
        suggestedActions,
        operations,
        warnings,
      }),
    });
  }

  return message;
}

export function convertLegacyMessage(message) {
  const content = message.content ?? "";

  if (message.role === "assistant") {
    const suggestedActions = [
      ...(message.followUpQuestions ?? []).map((question) => ({
        label: question,
        message: question,
        kind: "question",
      })),
      ...(message.suggestedActions ?? []).map((action) => ({
        ...action,
        kind: "action",
      })),
    ];

    return createAssistantMessage({
      id: String(message.id),
      text: content,
      suggestedActions,
    });
  }

  return createUserMessage(content, String(message.id));
}

export function getTextFromMessage(message) {
  if (message?.content) {
    return message.content;
  }

  return (message?.parts ?? [])
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

export function getCoachTurnDataFromMessage(message) {
  const dataPart = (message?.parts ?? []).find((part) => part.type === "data-coach-turn");

  if (!dataPart) {
    return createEmptyCoachTurnData();
  }

  return normalizeCoachTurnData(dataPart.data);
}

export function getSuggestedActionsFromMessage(message) {
  return getCoachTurnDataFromMessage(message).suggestedActions;
}

export function getWarningsFromMessage(message) {
  return getCoachTurnDataFromMessage(message).warnings;
}

export function getPreviewText(message) {
  return getTextFromMessage(message).replace(/\n/g, " ").trim();
}

export function getMessagesSignature(messages = []) {
  return JSON.stringify(
    messages.map((message) => ({
      id: message.id,
      role: message.role,
      parts: (message.parts ?? []).map((part) => {
        if (part.type === "text") {
          return { type: part.type, text: part.text };
        }

        if (part.type === "data-coach-turn") {
          return { type: part.type, data: normalizeCoachTurnData(part.data) };
        }

        return { type: part.type };
      }),
    }))
  );
}

export function getLastUserText(messages = []) {
  const lastUserMessage = [...messages].reverse().find((message) => message.role === "user");
  return getTextFromMessage(lastUserMessage);
}
