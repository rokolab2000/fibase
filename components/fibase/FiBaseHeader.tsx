"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, RotateCcw } from "lucide-react";
import { FiBaseAvatar } from "./FiBaseAvatar";
import type { AppState } from "./types";

interface FiBaseHeaderProps {
  points: number;
  onReset: () => void;
  appState: AppState;
}

export function FiBaseHeader({ points, onReset, appState }: FiBaseHeaderProps) {
  return (
    <header className="bg-white shadow-sm rounded-b-3xl px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      {/* Left: Avatar + brand name */}
      <div className="flex items-center gap-3">
        <FiBaseAvatar size="sm" animate={appState === "IDLE"} />
        <div>
          <h1 className="text-xl font-bold text-slate-800 leading-none">
            Fi{" "}
            <span className="bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500 bg-clip-text text-transparent">
              Base
            </span>
          </h1>
          <p className="text-xs text-slate-500 leading-tight">Tu guía financiera inteligente</p>
        </div>
      </div>

      {/* Right: Points + reset */}
      <div className="flex items-center gap-3">
        <AnimatePresence>
          {points > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-2xl px-3 py-1.5"
            >
              <Star size={16} className="text-amber-500 fill-amber-400" />
              <span className="text-sm font-bold text-amber-600">{points} pts</span>
            </motion.div>
          )}
        </AnimatePresence>

        {appState !== "IDLE" && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileTap={{ scale: 0.92 }}
            onClick={onReset}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl px-4 py-2 text-sm font-medium transition-colors min-h-[44px]"
            aria-label="Volver al inicio"
          >
            <RotateCcw size={15} />
            <span className="hidden sm:inline">Inicio</span>
          </motion.button>
        )}
      </div>
    </header>
  );
}
