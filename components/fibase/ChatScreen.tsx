"use client";

import { RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Phone, Star, MessageCircle, AlertCircle } from "lucide-react";
import { FiBaseAvatar } from "./FiBaseAvatar";
import type { Message } from "./types";

interface ChatScreenProps {
  messages: Message[];
  isLoading: boolean;
  inputValue: string;
  setInputValue: (v: string) => void;
  onSend: (query: string) => void;
  onReset: () => void;
  onShowQR: () => void;
  chatEndRef: RefObject<HTMLDivElement | null>;
  points: number;
}

function UserBubble({ message }: { message: Message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, x: 12 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.35 }}
      className="flex justify-end"
    >
      <div className="bg-blue-500 text-white rounded-3xl rounded-br-lg px-5 py-4 max-w-[80%] shadow-md">
        <p className="text-lg leading-relaxed">{message.text}</p>
      </div>
    </motion.div>
  );
}

function BotBubble({ message }: { message: Message }) {
  const isEmergency = message.isEmergency;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, x: -12 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.4 }}
      className="flex gap-3 items-start"
    >
      <div className="flex-shrink-0 mt-1">
        <FiBaseAvatar size="sm" animate={false} />
      </div>

      <div
        className={`flex-1 rounded-3xl rounded-bl-lg px-5 py-4 shadow-sm border max-w-[85%] ${
          isEmergency
            ? "bg-red-50 border-red-200"
            : "bg-white border-slate-100"
        }`}
      >
        {/* Emergency badge */}
        {isEmergency && (
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center gap-1.5 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
              <AlertCircle size={14} />
              ALERTA DE FRAUDE
            </span>
          </div>
        )}

        <p className={`font-semibold leading-snug mb-3 ${isEmergency ? "text-red-700 text-xl" : "text-slate-700 text-lg"}`}>
          {message.text}
        </p>

        {/* Steps */}
        {message.steps && message.steps.length > 0 && (
          <ol className="flex flex-col gap-2 mt-2">
            {message.steps.map((step, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.12 }}
                className={`flex gap-3 items-start rounded-2xl p-3 ${
                  isEmergency ? "bg-red-100/60" : "bg-slate-50"
                }`}
              >
                <span
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                    isEmergency
                      ? "bg-red-500 text-white"
                      : "bg-gradient-to-br from-emerald-400 to-blue-400 text-white"
                  }`}
                >
                  {i + 1}
                </span>
                <p className={`text-base leading-relaxed ${isEmergency ? "text-red-800" : "text-slate-700"}`}>
                  {step}
                </p>
              </motion.li>
            ))}
          </ol>
        )}

        {/* Emergency CTA */}
        {isEmergency && message.actionRequired === "CALL_BANK" && (
          <motion.a
            href="tel:600"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileTap={{ scale: 0.96 }}
            className="mt-4 flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl p-5 shadow-lg font-bold text-xl transition-colors cursor-pointer min-h-[80px]"
            aria-label="Llamar al banco ahora"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1.5 }}
            >
              <Phone size={28} fill="white" />
            </motion.div>
            LLAMAR AL BANCO AHORA
          </motion.a>
        )}
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="flex gap-3 items-center"
    >
      <div className="flex-shrink-0">
        <FiBaseAvatar size="sm" animate />
      </div>
      <div className="bg-white border border-slate-100 rounded-3xl rounded-bl-lg px-5 py-4 shadow-sm">
        <div className="flex gap-1.5 items-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-slate-300"
              animate={{ y: [0, -6, 0], backgroundColor: ["#cbd5e1", "#6ee7b7", "#93c5fd", "#cbd5e1"] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function PointsBadge({ points }: { points: number }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-center justify-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2 text-amber-600 font-semibold text-base"
    >
      <Star size={16} className="fill-amber-400 text-amber-400" />
      +10 puntos ganados
    </motion.div>
  );
}

export function ChatScreen({
  messages,
  isLoading,
  inputValue,
  setInputValue,
  onSend,
  onShowQR,
  chatEndRef,
  points,
}: ChatScreenProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend(inputValue);
    }
  };

  const lastBotMsg = [...messages].reverse().find((m) => m.sender === "bot");
  const showPoints = !isLoading && points > 0 && lastBotMsg && !lastBotMsg.isEmergency;

  // Suggested follow-up chips
  const suggestions = lastBotMsg?.isEmergency
    ? []
    : ["¿Cómo evito pagar intereses?", "¿Qué es la TMC?", "¿Cómo negocio mi deuda?"];

  return (
    <div className="flex flex-col h-[calc(100vh-88px)]">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        <div className="max-w-2xl mx-auto w-full flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) =>
              msg.sender === "user" ? (
                <UserBubble key={msg.id} message={msg} />
              ) : (
                <BotBubble key={msg.id} message={msg} />
              )
            )}

            {isLoading && <TypingIndicator key="typing" />}

            {showPoints && (
              <motion.div
                key="points"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center"
              >
                <PointsBadge points={points} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Follow-up suggestions */}
          <AnimatePresence>
            {!isLoading && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-wrap gap-2 mt-1"
              >
                <p className="w-full text-slate-400 text-sm flex items-center gap-1.5">
                  <MessageCircle size={14} /> Preguntas frecuentes:
                </p>
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => onSend(s)}
                    className="text-sm bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-2xl px-4 py-2 transition-colors font-medium"
                  >
                    {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-slate-100 bg-white px-4 py-4 rounded-t-3xl shadow-lg">
        <div className="max-w-2xl mx-auto flex flex-col gap-3">
          {/* Transfer session button */}
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={onShowQR}
            className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold text-base rounded-2xl px-5 py-4 min-h-[60px] shadow-md transition-all"
            aria-label="Llevar al celular via WhatsApp"
          >
            <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Llevar al celular
          </motion.button>

          <div className="flex gap-3 bg-slate-50 rounded-3xl border-2 border-slate-200 p-2 focus-within:border-blue-400 transition-colors">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu pregunta..."
              disabled={isLoading}
              className="flex-1 px-3 py-2 text-slate-700 text-lg bg-transparent outline-none placeholder:text-slate-300 disabled:opacity-50"
              aria-label="Escribe tu consulta financiera"
            />
            <button
              onClick={() => onSend(inputValue)}
              disabled={!inputValue.trim() || isLoading}
              className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl px-5 py-3 font-semibold text-base transition-all min-h-[52px] flex items-center gap-2"
              aria-label="Enviar mensaje"
            >
              <Send size={18} />
              <span className="hidden sm:inline">Enviar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
