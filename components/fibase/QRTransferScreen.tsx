"use client";

import { motion } from "framer-motion";
import { QrCode, Smartphone, Sparkles, Monitor } from "lucide-react";
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
    <div className="flex-1 flex flex-col items-center justify-start px-4 py-6 gap-4 overflow-y-auto">
      <div className="max-w-lg w-full flex flex-col items-center gap-5">
        {/* Avatar with success state */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FiBaseAvatar size="md" animate />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex flex-col items-center gap-1 text-center"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 leading-snug text-balance">
            Lleva tu progreso contigo
          </h2>
          <p className="text-slate-500 text-base">
            Elige como quieres continuar
          </p>
        </motion.div>

        {/* Points badge */}
        {points > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-2 text-amber-600 text-sm font-semibold"
          >
            <Sparkles size={14} className="fill-amber-300 text-amber-400" />
            {points} puntos se transferiran
          </motion.div>
        )}

        {/* Two options side by side */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Option 1: QR Code for Totem */}
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 flex flex-col items-center gap-4">
            {/* Header */}
            <div className="flex items-center gap-2 text-slate-600">
              <Monitor size={18} />
              <span className="text-sm font-medium">Desde el totem</span>
            </div>

            {/* QR Code */}
            <div className="relative">
              {/* Pulsing rings */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-emerald-400/40"
                animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ margin: -6 }}
              />

              <div className="relative w-36 h-36 bg-white rounded-xl flex items-center justify-center border-2 border-slate-200 shadow-inner">
                <motion.div
                  animate={{ rotate: [0, 1, -1, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <QrCode 
                    size={100} 
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
                  <div className="w-10 h-10 bg-[#25D366] rounded-lg flex items-center justify-center shadow-md">
                    <WhatsAppIcon size={22} className="text-white" />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Instructions */}
            <p className="text-slate-500 text-sm text-center leading-relaxed">
              Escanea con tu celular para continuar en{" "}
              <span className="text-[#25D366] font-semibold">WhatsApp</span>
            </p>
          </div>

          {/* Option 2: Direct WhatsApp Button for Mobile */}
          <div className="bg-gradient-to-br from-[#25D366]/10 to-[#128C7E]/10 rounded-3xl shadow-lg border border-[#25D366]/20 p-6 flex flex-col items-center gap-4">
            {/* Header */}
            <div className="flex items-center gap-2 text-[#128C7E]">
              <Smartphone size={18} />
              <span className="text-sm font-medium">Desde tu celular</span>
            </div>

            {/* WhatsApp icon large */}
            <motion.div
              className="relative"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-36 h-36 bg-[#25D366] rounded-2xl flex items-center justify-center shadow-lg">
                <WhatsAppIcon size={72} className="text-white" />
              </div>

              {/* Sparkle decoration */}
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 15, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Sparkles size={20} className="text-amber-400 fill-amber-200" />
              </motion.div>
            </motion.div>

            {/* Direct WhatsApp button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-base rounded-xl px-5 py-4 min-h-[56px] shadow-md transition-all flex items-center justify-center gap-2"
              aria-label="Abrir WhatsApp directamente"
            >
              <WhatsAppIcon size={20} />
              Abrir WhatsApp
            </a>

            <p className="text-[#128C7E] text-sm text-center">
              Toca para continuar directo
            </p>
          </div>
        </motion.div>

        {/* WhatsApp benefits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {["Historial guardado", "Notificaciones", "Respuestas 24/7"].map((benefit) => (
            <span
              key={benefit}
              className="text-xs bg-[#25D366]/10 text-[#128C7E] px-3 py-1.5 rounded-full font-medium"
            >
              {benefit}
            </span>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="w-full flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-slate-400 text-sm">o</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Secondary action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="flex gap-3 w-full"
        >
          <button
            onClick={onContinue}
            className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base rounded-2xl px-5 py-4 min-h-[64px] border-2 border-slate-200 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
            aria-label="Continuar en el totem"
          >
            <Monitor size={20} />
            Seguir en el totem
          </button>
          <button
            onClick={onReset}
            className="flex-1 bg-white hover:bg-slate-50 text-slate-500 font-semibold text-base rounded-2xl px-5 py-4 min-h-[64px] border-2 border-slate-200 hover:border-slate-300 transition-all flex items-center justify-center"
            aria-label="Terminar sesion"
          >
            Nueva consulta
          </button>
        </motion.div>

        {/* Privacy note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-slate-400 text-xs text-center max-w-xs"
        >
          Tu conversacion continuara de forma privada en tu WhatsApp personal.
        </motion.p>
      </div>
    </div>
  );
}
