"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Gauge, TrendingUp } from "lucide-react";
import { cn } from "../lib/utils";

const STARTER_SUGGESTIONS = [
  {
    id: 1,
    title: "Visão Geral",
    desc: "Me mostra uma visão geral do meu estado atual em hábitos, tarefas e progresso.",
    icon: Gauge,
  },
  {
    id: 2,
    title: "Quero me desafiar",
    desc: "Quero me desafiar um pouco. Me sugere aumentar um hábito ou tarefa sem exagerar.",
    icon: TrendingUp,
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
  conversationTitle,
  teamName,
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
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-2xs font-semibold uppercase tracking-[0.18em] text-hAccent">
                {teamName}
              </p>
              <h2 className="mt-1 text-xl font-primary text-title md:text-2xl">
                {conversationTitle}
              </h2>
              <p className="mt-1 text-sm text-subtitle">
                O coach aprende aos poucos e te puxa para o próximo passo viável.
              </p>
            </div>
          </div>

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
                    {message.suggestedActions?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2 border-t border-secondaryCardStroke/60 pt-3">
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
              Qual pequeno passo vamos dar hoje?
            </h1>
          </div>

          <div className="relative flex min-h-[60px] w-full items-center rounded-xl border border-secondaryCardStroke bg-secondaryCardBackground px-4 py-2 shadow-sm transition-all focus-within:ring-1 focus-within:ring-hAccent">
            <textarea
              ref={textareaRef}
              className="max-h-32 flex-1 resize-none bg-transparent py-2 pr-2 text-title outline-none placeholder:text-subtitle/60"
              placeholder="Conte como foi seu dia, seus minutos, passos ou o que está te travando..."
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
              const Icon = suggestion.icon;
              return (
                <button
                  key={suggestion.id}
                  onClick={() => onSendMessage?.(suggestion.desc)}
                  className="flex items-center gap-2 rounded-full border border-secondaryCardStroke bg-secondaryCardBackground px-3 py-2 text-sm font-medium text-subtitle transition-colors hover:border-hAccent hover:bg-cardBackgroundHover hover:text-title"
                >
                  <Icon size={16} className="text-icons" />
                  <span>{suggestion.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
