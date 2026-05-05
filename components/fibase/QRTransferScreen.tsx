"use client";

import { motion } from "framer-motion";
import { QrCode, Smartphone, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { FiBaseAvatar } from "./FiBaseAvatar";

interface QRTransferScreenProps {
  onContinue: () => void;
  onReset: () => void;
  points: number;
}

export function QRTransferScreen({ onContinue, onReset, points }: QRTransferScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-6">
      <div className="max-w-md w-full flex flex-col items-center gap-6">
        {/* Avatar with success state */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FiBaseAvatar size="lg" animate />
        </motion.div>

        {/* Success message */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex flex-col items-center gap-2 text-center"
        >
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 size={24} className="fill-emerald-100" />
            <span className="font-semibold text-lg">Sesion lista</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-snug text-balance">
            Lleva tu progreso contigo
          </h2>
        </motion.div>

        {/* QR Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="relative w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 flex flex-col items-center gap-6"
        >
          {/* Decorative gradient border glow */}
          <div 
            className="absolute inset-0 rounded-3xl opacity-50 pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(59,130,246,0.15), rgba(139,92,246,0.15))",
            }}
          />

          {/* QR Icon with animated rings */}
          <div className="relative">
            {/* Pulsing rings */}
            <motion.div
              className="absolute inset-0 rounded-3xl border-2 border-emerald-400/30"
              animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ margin: -8 }}
            />
            <motion.div
              className="absolute inset-0 rounded-3xl border-2 border-blue-400/30"
              animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              style={{ margin: -16 }}
            />

            {/* QR Code placeholder */}
            <div className="relative w-48 h-48 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <QrCode 
                  size={120} 
                  className="text-slate-700" 
                  strokeWidth={1.5}
                />
              </motion.div>

              {/* Sparkle decorations */}
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 15, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Sparkles size={20} className="text-amber-400 fill-amber-200" />
              </motion.div>
            </div>
          </div>

          {/* Instruction text */}
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-slate-600 text-lg leading-relaxed max-w-xs">
              Escanea para llevar tu progreso y chat a tu celular
            </p>

            {/* Transfer visual */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-3 mt-2 text-slate-400"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <QrCode size={20} className="text-slate-500" />
              </div>
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <ArrowRight size={20} />
              </motion.div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-blue-400 flex items-center justify-center">
                <Smartphone size={20} className="text-white" />
              </div>
            </motion.div>
          </div>

          {/* Points earned */}
          {points > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-2 text-amber-600 text-sm font-semibold"
            >
              <Sparkles size={14} className="fill-amber-300 text-amber-400" />
              {points} puntos acumulados
            </motion.div>
          )}
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 w-full"
        >
          <button
            onClick={onContinue}
            className="flex-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500 hover:from-emerald-600 hover:via-blue-600 hover:to-violet-600 text-white font-bold text-lg rounded-2xl px-6 py-5 min-h-[80px] shadow-lg transition-all flex items-center justify-center gap-3"
            aria-label="Continuar en el totem"
          >
            <Smartphone size={22} />
            Continuar aqui
          </button>
          <button
            onClick={onReset}
            className="flex-1 bg-white hover:bg-slate-50 text-slate-600 font-semibold text-lg rounded-2xl px-6 py-5 min-h-[80px] border-2 border-slate-200 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
            aria-label="Terminar sesion"
          >
            Nueva consulta
          </button>
        </motion.div>

        {/* Privacy note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-slate-400 text-sm text-center max-w-xs"
        >
          Tu sesion se mantendra privada y segura en tu dispositivo personal.
        </motion.p>
      </div>
    </div>
  );
}
