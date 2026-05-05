"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, TrendingDown, Scale, Send } from "lucide-react";
import { FiBaseAvatar } from "./FiBaseAvatar";

interface IdleScreenProps {
  onQuery: (query: string) => void;
}

const QUICK_TOPICS = [
  {
    icon: "🚨",
    lucideIcon: AlertTriangle,
    title: "Me hicieron un cargo que no reconozco",
    subtitle: "Fraude y seguridad",
    color: "border-red-200 hover:border-red-400 hover:bg-red-50",
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
    query: "Me hicieron un cargo que no reconozco en mi tarjeta",
  },
  {
    icon: "📉",
    lucideIcon: TrendingDown,
    title: "Pago el mínimo de la tarjeta y mi deuda no baja",
    subtitle: "Pago mínimo",
    color: "border-blue-200 hover:border-blue-400 hover:bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
    query: "Pago el mínimo de mi tarjeta pero la deuda no baja",
  },
  {
    icon: "⚖️",
    lucideIcon: Scale,
    title: "Tengo dudas con la Carga Anual Equivalente (CAE)",
    subtitle: "Créditos y tasas",
    color: "border-violet-200 hover:border-violet-400 hover:bg-violet-50",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-500",
    query: "¿Qué es la Carga Anual Equivalente CAE?",
  },
];

export function IdleScreen({ onQuery }: IdleScreenProps) {
  const [customInput, setCustomInput] = useState("");

  const handleCustomSend = () => {
    if (customInput.trim()) {
      onQuery(customInput.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleCustomSend();
  };

  return (
    <div className="flex flex-col items-center px-4 py-8 gap-8 max-w-2xl mx-auto w-full">
      {/* Hero section */}
      <div className="flex flex-col items-center gap-4 text-center">
        <FiBaseAvatar size="lg" animate />

        {/* Floating speech bubble */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative bg-white rounded-3xl shadow-md px-6 py-4 border border-slate-100 max-w-xs"
        >
          {/* Tail */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[12px] border-l-transparent border-r-transparent border-b-white drop-shadow-sm" />
          <p className="text-slate-700 text-lg font-medium leading-snug">
            ¡Hola! Estoy aquí para ayudarte a entender y actuar. 👋
          </p>
        </motion.div>
      </div>

      {/* Section label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-slate-500 text-base font-medium"
      >
        ¿En qué te puedo ayudar hoy?
      </motion.p>

      {/* Quick topic cards */}
      <div className="grid grid-cols-1 gap-4 w-full">
        {QUICK_TOPICS.map((topic, i) => (
          <motion.button
            key={topic.query}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 + i * 0.1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onQuery(topic.query)}
            className={`flex items-center gap-4 bg-white border-2 ${topic.color} rounded-3xl p-5 shadow-sm text-left transition-all duration-200 group min-h-[80px] cursor-pointer`}
            aria-label={topic.title}
          >
            <div className={`${topic.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl shadow-sm`}>
              {topic.icon}
            </div>
            <div className="flex-1">
              <p className="text-slate-800 text-lg font-semibold leading-snug group-hover:text-slate-900">
                {topic.title}
              </p>
              <p className={`text-sm font-medium mt-0.5 ${topic.iconColor}`}>{topic.subtitle}</p>
            </div>
            <div className="text-slate-300 group-hover:text-slate-500 transition-colors">
              <Send size={20} />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Custom input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85 }}
        className="w-full"
      >
        <p className="text-slate-400 text-sm text-center mb-3">O escribe tu propia pregunta</p>
        <div className="flex gap-3 bg-white rounded-3xl border-2 border-slate-200 shadow-sm p-2 focus-within:border-emerald-400 transition-colors">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ej: ¿Cómo funciona el CAE?"
            className="flex-1 px-3 py-2 text-slate-700 text-lg bg-transparent outline-none placeholder:text-slate-300"
            aria-label="Escribe tu consulta financiera"
          />
          <button
            onClick={handleCustomSend}
            disabled={!customInput.trim()}
            className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl px-5 py-3 font-semibold text-base transition-all min-h-[52px] flex items-center gap-2"
            aria-label="Enviar pregunta"
          >
            <Send size={18} />
            <span>Enviar</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
