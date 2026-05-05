"use client";

import { motion } from "framer-motion";
import { QrCode, Smartphone, ArrowRight, CheckCircle2, Sparkles, MessageCircle } from "lucide-react";
import { FiBaseAvatar } from "./FiBaseAvatar";

interface QRTransferScreenProps {
  onContinue: () => void;
  onReset: () => void;
  points: number;
}

// WhatsApp icon component
function WhatsAppIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

export function QRTransferScreen({ onContinue, onReset, points }: QRTransferScreenProps) {
  // Generate WhatsApp deep link with session context
  const whatsappNumber = "56912345678"; // Chilean format, would be configured
  const sessionMessage = encodeURIComponent(
    `Hola Fi Base! Quiero continuar mi consulta desde el totem. Mis puntos: ${points}`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${sessionMessage}`;

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
            Continua en WhatsApp
          </h2>
        </motion.div>

        {/* QR Card with WhatsApp branding */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="relative w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 flex flex-col items-center gap-6"
        >
          {/* WhatsApp green gradient glow */}
          <div 
            className="absolute inset-0 rounded-3xl opacity-40 pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgba(37,211,102,0.2), rgba(18,140,126,0.15))",
            }}
          />

          {/* QR Icon with WhatsApp animated rings */}
          <div className="relative">
            {/* Pulsing rings in WhatsApp green */}
            <motion.div
              className="absolute inset-0 rounded-3xl border-2 border-[#25D366]/40"
              animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ margin: -8 }}
            />
            <motion.div
              className="absolute inset-0 rounded-3xl border-2 border-[#128C7E]/30"
              animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              style={{ margin: -16 }}
            />

            {/* QR Code with WhatsApp icon overlay */}
            <div className="relative w-52 h-52 bg-white rounded-2xl flex items-center justify-center border-2 border-[#25D366]/30 shadow-inner">
              <motion.div
                animate={{ rotate: [0, 2, -2, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <QrCode 
                  size={140} 
                  className="text-slate-800" 
                  strokeWidth={1.2}
                />
              </motion.div>

              {/* WhatsApp logo in center */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              >
                <div className="w-14 h-14 bg-[#25D366] rounded-xl flex items-center justify-center shadow-lg">
                  <WhatsAppIcon size={32} className="text-white" />
                </div>
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
              Escanea para llevar tu progreso y chat a tu celular via{" "}
              <span className="text-[#25D366] font-semibold">WhatsApp</span>
            </p>

            {/* Transfer visual: Totem -> WhatsApp */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-3 mt-2"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">
                <MessageCircle size={22} className="text-slate-500" />
              </div>
              <motion.div
                animate={{ x: [0, 6, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="text-slate-400"
              >
                <ArrowRight size={22} />
              </motion.div>
              <div className="w-12 h-12 rounded-xl bg-[#25D366] flex items-center justify-center shadow-md">
                <WhatsAppIcon size={24} className="text-white" />
              </div>
            </motion.div>

            {/* WhatsApp benefits */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap justify-center gap-2 mt-2"
            >
              {["Historial guardado", "Notificaciones", "Respuestas 24/7"].map((benefit, i) => (
                <span
                  key={benefit}
                  className="text-xs bg-[#25D366]/10 text-[#128C7E] px-3 py-1.5 rounded-full font-medium"
                >
                  {benefit}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Points earned */}
          {points > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-2 text-amber-600 text-sm font-semibold"
            >
              <Sparkles size={14} className="fill-amber-300 text-amber-400" />
              {points} puntos se transferiran
            </motion.div>
          )}
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex flex-col gap-3 w-full"
        >
          {/* Primary: Open WhatsApp directly (for mobile users viewing this) */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-lg rounded-2xl px-6 py-5 min-h-[80px] shadow-lg transition-all flex items-center justify-center gap-3"
            aria-label="Abrir WhatsApp directamente"
          >
            <WhatsAppIcon size={26} />
            Abrir WhatsApp
          </a>

          <div className="flex gap-3">
            <button
              onClick={onContinue}
              className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base rounded-2xl px-5 py-4 min-h-[64px] border-2 border-slate-200 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
              aria-label="Continuar en el totem"
            >
              <Smartphone size={20} />
              Seguir aqui
            </button>
            <button
              onClick={onReset}
              className="flex-1 bg-white hover:bg-slate-50 text-slate-500 font-semibold text-base rounded-2xl px-5 py-4 min-h-[64px] border-2 border-slate-200 hover:border-slate-300 transition-all flex items-center justify-center"
              aria-label="Terminar sesion"
            >
              Nueva consulta
            </button>
          </div>
        </motion.div>

        {/* Privacy note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-slate-400 text-sm text-center max-w-xs"
        >
          Al escanear, tu conversacion continuara de forma privada en tu WhatsApp personal.
        </motion.p>
      </div>
    </div>
  );
}
