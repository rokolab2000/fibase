"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";

interface FiBaseAvatarProps {
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

const sizeMap = {
  sm: { container: "w-12 h-12", icon: 22, aura: "w-14 h-14" },
  md: { container: "w-20 h-20", icon: 36, aura: "w-24 h-24" },
  lg: { container: "w-32 h-32", icon: 60, aura: "w-40 h-40" },
};

export function FiBaseAvatar({ size = "md", animate = true }: FiBaseAvatarProps) {
  const s = sizeMap[size];

  return (
    <div className="relative flex items-center justify-center">
      {/* Aura glow */}
      <motion.div
        className={`absolute ${s.aura} rounded-full bg-gradient-to-br from-emerald-300/40 via-blue-300/30 to-violet-300/40 blur-md`}
        animate={animate ? { scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Avatar circle */}
      <motion.div
        className={`relative ${s.container} rounded-full bg-gradient-to-br from-emerald-400 via-blue-400 to-violet-500 flex items-center justify-center shadow-lg`}
        animate={animate ? { y: [0, -6, 0] } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Inner highlight */}
        <div className="absolute inset-1 rounded-full bg-white/10" />
        {/* Eyes */}
        {size === "lg" ? (
          <div className="flex flex-col items-center gap-1">
            <div className="flex gap-4 mb-1">
              <motion.div
                className="w-3 h-3 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                animate={{ scaleY: [1, 0.15, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              />
              <motion.div
                className="w-3 h-3 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                animate={{ scaleY: [1, 0.15, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              />
            </div>
            {/* Smile */}
            <div className="w-8 h-3 border-b-2 border-white/80 rounded-b-full" />
          </div>
        ) : size === "md" ? (
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex gap-2.5 mb-0.5">
              <motion.div
                className="w-2 h-2 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]"
                animate={{ scaleY: [1, 0.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              />
              <motion.div
                className="w-2 h-2 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]"
                animate={{ scaleY: [1, 0.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              />
            </div>
            <div className="w-5 h-2 border-b-2 border-white/70 rounded-b-full" />
          </div>
        ) : (
          <Bot size={s.icon} className="text-white drop-shadow" />
        )}
      </motion.div>
    </div>
  );
}
