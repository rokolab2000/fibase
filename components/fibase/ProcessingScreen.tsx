"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Brain, PenLine, CheckCircle2 } from "lucide-react";
import { TokenAgentMascot } from "./TokenAgentMascot";

interface ProcessingScreenProps {
  lastQuery: string;
}

const STEPS = [
  { icon: Search, label: "Buscando información oficial...", color: "text-emerald-500", bg: "bg-emerald-50 border-emerald-200", delay: 0 },
  { icon: Brain, label: "Analizando tu caso...", color: "text-blue-500", bg: "bg-blue-50 border-blue-200", delay: 800 },
  { icon: PenLine, label: "Preparando una solución fácil...", color: "text-violet-500", bg: "bg-violet-50 border-violet-200", delay: 1600 },
];

export function ProcessingScreen({ lastQuery }: ProcessingScreenProps) {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);

  useEffect(() => {
    setVisibleSteps([]);
    STEPS.forEach((step, i) => {
      const timer = setTimeout(() => {
        setVisibleSteps((prev) => [...prev, i]);
      }, step.delay);
      return () => clearTimeout(timer);
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 gap-8">
      {/* Avatar pulsing with mascot */}
      <div className="relative">
        <div className="w-32 h-32">
          <TokenAgentMascot
            message="Analizando tu caso..."
            emotion="thinking"
            isSpeaking={true}
          />
        </div>
        {/* Scanning rings */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-emerald-400/50"
          animate={{ scale: [1, 1.5, 1.5], opacity: [0.8, 0, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-blue-400/40"
          animate={{ scale: [1, 1.8, 1.8], opacity: [0.6, 0, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
        />
      </div>

      {/* User query preview */}
      {lastQuery && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-3 max-w-sm text-center"
        >
          <p className="text-xs text-slate-400 mb-1 font-medium uppercase tracking-wide">Tu consulta</p>
          <p className="text-slate-600 text-base font-medium line-clamp-2">&ldquo;{lastQuery}&rdquo;</p>
        </motion.div>
      )}

      {/* Processing steps */}
      <div className="w-full max-w-sm flex flex-col gap-3">
        <AnimatePresence>
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isVisible = visibleSteps.includes(i);
            const isDone = visibleSteps.includes(i + 1);

            if (!isVisible) return null;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className={`flex items-center gap-4 rounded-2xl border p-4 ${step.bg}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDone ? "bg-white/80" : "bg-white/60"}`}>
                  {isDone ? (
                    <CheckCircle2 size={22} className="text-emerald-500" />
                  ) : (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    >
                      <Icon size={22} className={step.color} />
                    </motion.div>
                  )}
                </div>
                <p className={`text-base font-semibold ${isDone ? "text-slate-400 line-through" : "text-slate-700"}`}>
                  {step.label}
                </p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Loading dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-blue-400"
            animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}
