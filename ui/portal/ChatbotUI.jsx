"use client";

import { useState, useRef, useEffect } from 'react';
import { cn } from '../lib/utils';
import { Send, UploadCloud, FileText, X, Shield, Network, AlertTriangle } from 'lucide-react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

export function ChatbotUI({ messages, onSendMessage, onAddAsset, isCentered, recommendations = [], onRecommendationClick }) {
  const [inputValue, setInputValue] = useState('');
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const [attachedAssets, setAttachedAssets] = useState([]);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    return dropTargetForElements({
      element: el,
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: ({ source }) => {
        setIsDraggedOver(false);
        const asset = source.data?.asset;
        if (asset) {
          setAttachedAssets((prev) => {
            if (prev.some((a) => a.id === asset.id)) return prev;
            return [...prev, asset];
          });
        }
      },
    });
  }, []);

  const suggestions = [
    { id: 1, title: 'Montar minha semana 1', desc: 'Me ajuda a sair do zero com uma primeira semana simples', icon: <FileText size={16} /> },
    { id: 2, title: 'Destravar minha rotina', desc: 'Me mostra quais hábitos estão me travando', icon: <Shield size={16} /> },
    { id: 3, title: 'Manter constância', desc: 'Me dá um plano para continuar me movendo mesmo nos dias de baixa energia', icon: <Network size={16} /> },
  ];

  const handleSend = () => {
    if (!inputValue.trim() && attachedAssets.length === 0) return;
    onSendMessage(inputValue, attachedAssets);
    setInputValue('');
    setAttachedAssets([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleRemoveAsset = (assetId) => {
    setAttachedAssets((prev) => prev.filter((a) => a.id !== assetId));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isEmpty = messages.length === 0;

  return (
    <div 
      ref={containerRef}
      className={cn(
      "flex flex-col h-full w-full transition-all duration-700 ease-in-out bg-navBackground relative",
      isCentered || isEmpty ? "" : ""
    )}>
      {isDraggedOver && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-navBackground/80 backdrop-blur-sm border-2 border-dashed border-hAccent rounded-lg m-4 pointer-events-none">
          <div className="flex flex-col items-center text-hAccent">
            <UploadCloud size={48} className="mb-4" />
            <p className="text-xl font-medium">Solte aqui para anexar</p>
          </div>
        </div>
      )}
      {/* Messages Area - acts as top spacer when empty */}
      <div 
        className={cn(
          "flex flex-col overflow-y-auto space-y-6 transition-all duration-700 ease-in-out scrollbar-thin bg-navBackground flex-1",
          isEmpty ? "opacity-0 p-0" : "p-6 opacity-100"
        )}
      >
        <div className={cn("flex flex-col space-y-6 w-full mx-auto transition-all duration-700 ease-in-out", isCentered || isEmpty ? "max-w-3xl" : "max-w-4xl")}>
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={cn(
                "flex w-full animate-in fade-in slide-in-from-bottom-4 duration-500", 
                msg.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "max-w-[80%] rounded-lg p-4",
                msg.role === 'user' 
                  ? "bg-hAccent text-white-black" 
                  : "bg-secondaryCardBackground text-title border border-secondaryCardStroke"
              )}>
                <div className="text-sm leading-relaxed [&>p]:mt-2 first:[&>p]:mt-0" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>').replace(/^/, '<p>').replace(/$/, '</p>') }} />
                
                {msg.attachedAssets && msg.attachedAssets.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white-black/20">
                    {msg.attachedAssets.map((asset) => (
                      <div key={asset.id} className="flex items-center gap-1.5 px-2 py-1 bg-white-black/10 rounded text-xs">
                        <FileText size={12} />
                        <span className="truncate max-w-[150px]">{asset.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload zone when AI requests habits or materials */}
                {msg.content.includes('Arraste hábitos e materiais') && msg.role === 'assistant' && (
                  <button
                    onClick={onAddAsset}
                    className="mt-4 p-4 w-full border border-dashed border-secondaryCardStroke rounded-lg flex flex-col items-center justify-center text-icons hover:text-hAccent hover:border-hAccent cursor-pointer transition-colors bg-cardStroke/10"
                  >
                    <UploadCloud className="mb-2" size={24} />
                    <p className="text-sm font-medium">Arraste hábitos e materiais aqui</p>
                    <p className="text-xs mt-1 opacity-70">Vale rotina, agenda, checklist, link ou diário</p>
                  </button>
                )}

                {/* Suggested action pills */}
                {msg.suggestedActions?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-secondaryCardStroke/50">
                    {msg.suggestedActions.map((action) => (
                      <button
                        key={action.label}
                        onClick={() => onSendMessage(action.message)}
                        className="px-3 py-1.5 text-sm font-medium border border-secondaryCardStroke rounded-full bg-cardBackground hover:bg-cardBackgroundHover hover:border-hAccent text-title transition-colors"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className={cn(
        "flex flex-col w-full p-4 transition-all duration-700 ease-in-out bg-navBackground flex-none"
      )}>
        <div className={cn("w-full mx-auto transition-all duration-700 ease-in-out", isCentered || isEmpty ? "max-w-3xl" : "max-w-4xl")}>
          <div className={cn(
            "transition-all duration-700 ease-in-out overflow-hidden flex flex-col items-center justify-end",
            isEmpty ? "max-h-32 opacity-100 mb-8" : "max-h-0 opacity-0 mb-0"
          )}>
            <h1 className="text-3xl md:text-4xl font-primary text-title text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
              Qual pequeno movimento vamos destravar hoje?
            </h1>
          </div>

          {/* Attached Assets Display */}
          {attachedAssets.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {attachedAssets.map((asset) => (
                <div key={asset.id} className="flex items-center gap-1.5 px-3 py-1.5 bg-secondaryCardBackground border border-secondaryCardStroke rounded-md text-sm text-title animate-in fade-in zoom-in duration-200">
                  <FileText size={14} className="text-icons" />
                  <span className="truncate max-w-[150px]">{asset.name}</span>
                  <button 
                    onClick={() => handleRemoveAsset(asset.id)}
                    className="p-0.5 hover:bg-cardBackgroundHover rounded-full text-icons hover:text-hAccent transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="relative flex items-center border border-secondaryCardStroke rounded-xl bg-secondaryCardBackground shadow-sm focus-within:ring-1 focus-within:ring-hAccent transition-all w-full pl-4 pr-2 py-2 min-h-[60px]">
            <textarea
              ref={textareaRef}
              className="flex-1 bg-transparent pr-2 text-title placeholder-subtitle/50 resize-none outline-none max-h-32 self-center py-2"
              placeholder="Pergunte sobre hábitos, passos, energia ou próximas atividades..."
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button 
              onClick={handleSend}
              disabled={!inputValue.trim() && attachedAssets.length === 0}
              className="p-2 bg-hAccent text-white-black rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition-opacity flex-shrink-0"
            >
              <Send size={18} />
            </button>
          </div>

          {/* Suggestions + Recommendation Pills */}
          <div className={cn(
            "flex flex-wrap gap-2 justify-center transition-all duration-700 ease-in-out overflow-hidden",
            isEmpty || recommendations.length > 0 ? "mt-6 max-h-32 opacity-100" : "mt-0 max-h-0 opacity-0"
          )}>
            {isEmpty && suggestions.map((s) => (
              <button 
                key={s.id}
                onClick={() => onSendMessage(s.desc)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-secondaryCardStroke rounded-full bg-secondaryCardBackground hover:bg-cardBackgroundHover hover:border-hAccent transition-colors text-subtitle"
              >
                <span className="text-icons">{s.icon}</span>
                <span>{s.title}</span>
              </button>
            ))}
            {recommendations.map((rec) => {
              const Icon = rec.icon ?? AlertTriangle;
              return (
                <button
                  key={`rec-${rec.id}`}
                  onClick={() => onRecommendationClick?.({ recommendationId: rec.id })}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-salmon/40 rounded-full bg-salmon/10 hover:bg-salmon/20 hover:border-salmon/60 text-salmon transition-colors animate-in fade-in slide-in-from-bottom-2 duration-500"
                >
                  <Icon size={16} className="shrink-0" />
                  <span>{rec.pill}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Spacer to keep input centered initially */}
      <div 
        className="transition-all duration-700 ease-in-out"
        style={{ flexGrow: isEmpty ? 1 : 0.00001, flexBasis: 0, minHeight: 0 }}
      />
    </div>
  );
}
