"use client";

import { RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Phone, Star, MessageCircle, AlertCircle, QrCode } from "lucide-react";
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
          {/* Transfer to phone button */}
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={onShowQR}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white font-semibold text-base rounded-2xl px-5 py-4 min-h-[60px] shadow-md transition-all"
            aria-label="Transferir sesion al celular"
          >
            <QrCode size={20} />
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
