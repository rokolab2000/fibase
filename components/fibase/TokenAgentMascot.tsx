'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface TokenAgentMascotProps {
  message: string;
  emotion?: 'normal' | 'happy' | 'thinking' | 'alert';
  isSpeaking?: boolean;
}

export function TokenAgentMascot({
  message,
  emotion = 'normal',
  isSpeaking = false,
}: TokenAgentMascotProps) {
  // Floating animation
  const floatingVariants = {
    animate: {
      y: [0, -12, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  // Speaking animation - jaw movement via scale
  const speakingVariants = {
    speaking: {
      scaleY: [1, 0.95, 1],
      transition: {
        duration: 0.4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    idle: {
      scaleY: 1,
    },
  };

  // Eye animation - subtle blinking and movement
  const eyeVariants = {
    normal: {
      y: [0, 2, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
      },
    },
  };

  // Blink animation
  const blinkVariants = {
    blink: {
      scaleY: [1, 0.1, 1],
      transition: {
        duration: 0.3,
        times: [0, 0.5, 1],
      },
    },
  };

  // Message bubble animation
  const bubbleVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 10,
      transition: { duration: 0.2 },
    },
  };

  // Pulse animation for speaking indicator
  const pulseVariants = {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
      },
    },
  };

  return (
    <div className="relative flex flex-col items-center gap-4">
      {/* Message Bubble */}
      {message && (
        <motion.div
          variants={bubbleVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative bg-white rounded-3xl px-5 py-3 shadow-lg border-2 border-blue-100 max-w-xs"
        >
          {/* Bubble pointer */}
          <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white border-2 border-blue-100 border-t-0 border-l-0 rounded-br transform rotate-45"></div>

          {/* Message text */}
          <p className="text-slate-700 text-sm font-medium leading-relaxed">
            {message}
          </p>

          {/* Speaking indicator dots */}
          {isSpeaking && (
            <div className="flex gap-1.5 mt-2">
              <motion.div
                variants={pulseVariants}
                animate="animate"
                className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full"
              />
              <motion.div
                variants={pulseVariants}
                animate="animate"
                transition={{ delay: 0.2 }}
                className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full"
              />
              <motion.div
                variants={pulseVariants}
                animate="animate"
                transition={{ delay: 0.4 }}
                className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full"
              />
            </div>
          )}
        </motion.div>
      )}

      {/* Mascot Container */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="relative"
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-200 to-blue-200 blur-2xl opacity-30 scale-110"></div>

        {/* Mascot Image with speaking animation */}
        <motion.div
          variants={speakingVariants}
          animate={isSpeaking ? 'speaking' : 'idle'}
          className="relative w-32 h-32 flex items-center justify-center origin-bottom"
        >
          <img
            src="/mascot/fibase.png"
            alt="Fi Base Agent Mascot"
            className="w-full h-full object-contain drop-shadow-lg"
          />

          {/* Emotion indicator - subtle accent */}
          {emotion === 'thinking' && (
            <motion.div
              className="absolute -top-6 -right-4 w-5 h-5 border-2 border-violet-400 rounded-full"
              animate={{
                opacity: [0.5, 1, 0.5],
                y: [-2, 2, -2],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}

          {emotion === 'alert' && (
            <motion.div
              className="absolute -top-4 left-1/2 transform -translate-x-1/2"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              <div className="text-lg">⚠️</div>
            </motion.div>
          )}
        </motion.div>

        {/* Speaking indicator ring */}
        {isSpeaking && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-blue-400"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [1, 0, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
        )}
      </motion.div>

      {/* Emotion label for context */}
      {emotion !== 'normal' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          className="text-xs text-slate-500 capitalize tracking-wide"
        >
          {emotion === 'thinking' && '💭 Analizando...'}
          {emotion === 'happy' && '✨ Feliz de ayudarte'}
          {emotion === 'alert' && '🔔 Alerta importante'}
        </motion.p>
      )}
    </div>
  );
}
