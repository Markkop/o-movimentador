"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";

const STARTER_SUGGESTIONS = [
  {
    id: "sitting",
    label: "Fiquei sentado o dia todo hoje",
    message: "Fiquei sentado o dia todo hoje",
  },
  {
    id: "lower-back",
    label: "Sinto dores na lombar",
    message: "Sinto dores na lombar",
  },
  {
    id: "meditation",
    label: "Quero meditar",
    message: "Quero meditar",
  },
];

function renderRichText(content) {
  return content
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br/>")
    .replace(/^/, "<p>")
    .replace(/$/, "</p>");
}

export function ChatbotUI({
  messages,
  onSendMessage,
  isCentered,
}) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    onSendMessage?.(trimmed);
    setInputValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="relative flex h-full w-full flex-col bg-navBackground">
      <div
        className={cn(
          "flex flex-1 flex-col overflow-y-auto bg-navBackground p-6 scrollbar-thin",
          isEmpty && "justify-end"
        )}
      >
        <div
          className={cn(
            "mx-auto flex w-full flex-col transition-all duration-500",
            isCentered || isEmpty ? "max-w-3xl" : "max-w-4xl"
          )}
        >
          {!isEmpty && (
            <div className="flex flex-col space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex w-full animate-in fade-in slide-in-from-bottom-4 duration-500",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[82%] rounded-2xl p-4",
                      message.role === "user"
                        ? "bg-hAccent text-white-black"
                        : "border border-secondaryCardStroke bg-secondaryCardBackground text-title"
                    )}
                  >
                    <div
                      className="text-sm leading-relaxed [&>p]:mt-2 first:[&>p]:mt-0"
                      dangerouslySetInnerHTML={{ __html: renderRichText(message.content) }}
                    />
                    {(message.followUpQuestions?.length > 0 ||
                      message.suggestedActions?.length > 0) && (
                      <div className="mt-3 border-t border-secondaryCardStroke/60 pt-3">
                        {message.followUpQuestions?.length > 0 && (
                          <div>
                            <p className="mb-2 text-2xs font-semibold uppercase tracking-[0.18em] text-subtitle">
                              Perguntas opcionais
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {message.followUpQuestions.map((question) => (
                                <button
                                  key={question}
                                  onClick={() => onSendMessage?.(question)}
                                  className="rounded-full border border-secondaryCardStroke bg-cardBackground px-3 py-1.5 text-sm font-medium text-subtitle transition-colors hover:border-hAccent hover:bg-cardBackgroundHover hover:text-title"
                                >
                                  {question}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {message.suggestedActions?.length > 0 && (
                          <div className={cn(message.followUpQuestions?.length > 0 && "mt-3")}>
                            <p className="mb-2 text-2xs font-semibold uppercase tracking-[0.18em] text-subtitle">
                              Ações sugeridas
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {message.suggestedActions.map((action) => (
                                <button
                                  key={action.label}
                                  onClick={() => onSendMessage?.(action.message)}
                                  className="rounded-full border border-secondaryCardStroke bg-cardBackground px-3 py-1.5 text-sm font-medium text-title transition-colors hover:border-hAccent hover:bg-cardBackgroundHover"
                                >
                                  {action.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="flex-none bg-navBackground p-4">
        <div
          className={cn(
            "mx-auto w-full transition-all duration-500",
            isCentered || isEmpty ? "max-w-3xl" : "max-w-4xl"
          )}
        >
          <div
            className={cn(
              "mb-8 overflow-hidden text-center transition-all duration-500",
              isEmpty ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-hAccent/20 bg-hAccent/10 px-3 py-1 text-xs font-medium text-hAccent">
              <Sparkles size={14} />
              Movimentador
            </p>
            <h1 className="text-3xl font-primary text-title md:text-4xl">
              O que mais parece com o seu dia hoje?
            </h1>
          </div>

          <div className="relative flex min-h-[60px] w-full items-center rounded-xl border border-secondaryCardStroke bg-secondaryCardBackground px-4 py-2 shadow-sm transition-all focus-within:ring-1 focus-within:ring-hAccent">
            <textarea
              ref={textareaRef}
              className="max-h-32 flex-1 resize-none bg-transparent py-2 pr-2 text-title outline-none placeholder:text-subtitle/60"
              placeholder="Conte o que você está sentindo ou escolha um atalho abaixo..."
              value={inputValue}
              onChange={(event) => {
                setInputValue(event.target.value);
                event.target.style.height = "auto";
                event.target.style.height = `${event.target.scrollHeight}px`;
              }}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="flex-shrink-0 rounded-lg bg-hAccent p-2 text-white-black transition-opacity hover:bg-hAccent/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>

          <div
            className={cn(
              "mt-6 flex flex-wrap justify-center gap-2 overflow-hidden transition-all duration-500",
              isEmpty ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            {STARTER_SUGGESTIONS.map((suggestion) => {
              return (
                <button
                  key={suggestion.id}
                  onClick={() => onSendMessage?.(suggestion.message)}
                  className="rounded-full border border-secondaryCardStroke bg-secondaryCardBackground px-3 py-2 text-sm font-medium text-subtitle transition-colors hover:border-hAccent hover:bg-cardBackgroundHover hover:text-title"
                >
                  <span>{suggestion.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
