"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  QrCode,
  Phone,
  X,
  Delete,
  CheckCircle,
  Smartphone,
  Shield,
  TrendingUp,
  Wallet,
  PiggyBank,
  LineChart,
} from "lucide-react";

// ===========================================
// TYPES
// ===========================================
interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
  isEmergency?: boolean;
  actionButton?: string;
}

interface Story {
  text: string;
  response: string;
  points: number;
  triggersLevelUp: boolean;
  isEmergency?: boolean;
  actionButton?: string;
}

// ===========================================
// MOCK DATABASE - HISTORIAS DE USUARIO
// ===========================================
const STORIES: Record<number, Story[]> = {
  0: [
    {
      text: "No tengo cuenta bancaria, puro efectivo",
      response:
        "Andar con efectivo es riesgoso. Te recomiendo una Cuenta Vista Institucional sin costo de mantencion. Te ayudo a abrir una?",
      points: 50,
      triggersLevelUp: true,
    },
    {
      text: "Tarjeta con 30% interes",
      response:
        "Ese 30% es rotativo. Es ALTO. Paga siempre el monto facturado.",
      points: 50,
      triggersLevelUp: true,
    },
    {
      text: "Pago minimo y deuda no baja",
      response:
        "Casi todo se va a intereses. Paga el Monto Facturado o evalua repactar.",
      points: 50,
      triggersLevelUp: true,
    },
    {
      text: "Me clonaron la tarjeta",
      response:
        "Paso 1: Bloquea tu tarjeta AHORA. La Ley de Fraudes (21.673) te protege. Tienes 120 horas para reclamar.",
      points: 10,
      triggersLevelUp: false,
      isEmergency: true,
      actionButton: "LLAMAR AL BANCO",
    },
    {
      text: "Uso tarjeta personal para mi local",
      response:
        "Paso 1: Ordena boletas. Paso 2: Abre cuenta empresa. Esto te protege legalmente.",
      points: 50,
      triggersLevelUp: true,
    },
  ],
  1: [
    {
      text: "Diagnosticar gastos hormiga",
      response:
        "Te sobran $40.000. Si cortas 2 cafes semanales, ahorras $15.000 extra al mes.",
      points: 50,
      triggersLevelUp: true,
    },
  ],
  2: [
    {
      text: "Comparar 2 creditos",
      response:
        "El Banco A es mejor. Ahorraras $225.000. Fijate en el CTC y CAE, no en la cuota.",
      points: 50,
      triggersLevelUp: true,
    },
  ],
  3: [
    {
      text: "Tengo $100k, como invierto?",
      response:
        "Un Deposito a Plazo (DAP) es ideal para empezar. Ganaras aprox $500 en 30 dias, sin riesgo.",
      points: 50,
      triggersLevelUp: true,
    },
  ],
  4: [
    {
      text: "Simular baja de tasas TPM",
      response:
        "Alerta: El Banco Central bajo las tasas. Es momento de solicitar refinanciamiento de tus creditos.",
      points: 100,
      triggersLevelUp: false,
    },
  ],
};

const LEVEL_NAMES = [
  "No Bancarizado",
  "Bancarizado Basico",
  "Consumidor Informado",
  "Ahorrador Activo",
  "Inversionista",
];

const LEVEL_REWARDS = [
  "Cuenta Vista Desbloqueada",
  "Alerta de Gastos Activada",
  "Comparador de Creditos",
  "Simulador de Inversiones",
  "Acceso Premium Completo",
];

const LEVEL_ICONS = [Wallet, Shield, TrendingUp, PiggyBank, LineChart];

// ===========================================
// MAIN COMPONENT
// ===========================================
export default function UserFlowSimulator() {
  // State
  const [level, setLevel] = useState(0);
  const [points, setPoints] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: "Hola! Soy Fibot, tu copiloto financiero. Selecciona una situacion y te ayudo a resolverla.",
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState<"reward" | "rut" | "qr">("reward");
  const [rut, setRut] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(2);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Progress ring calculation
  const progressPercent = ((points % 50) / 50) * 100;
  const circumference = 2 * Math.PI * 18;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  // Handle story selection
  const handleStorySelect = async (story: Story) => {
    if (isProcessing) return;

    // Add user message
    const userMsg: Message = {
      id: messageIdRef.current++,
      sender: "user",
      text: story.text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    // Simulate processing
    await new Promise((r) => setTimeout(r, 1500));

    // Add bot response
    const botMsg: Message = {
      id: messageIdRef.current++,
      sender: "bot",
      text: story.response,
      isEmergency: story.isEmergency,
      actionButton: story.actionButton,
    };
    setMessages((prev) => [...prev, botMsg]);
    setPoints((prev) => prev + story.points);
    setIsProcessing(false);

    // Level up logic
    if (story.triggersLevelUp && level < 4) {
      await new Promise((r) => setTimeout(r, 800));
      setLevel((prev) => prev + 1);
      setModalStep("reward");
      setShowModal(true);
    }
  };

  // RUT formatting
  const formatRut = (value: string) => {
    const clean = value.replace(/[^0-9kK]/g, "").toUpperCase();
    if (clean.length <= 1) return clean;
    const body = clean.slice(0, -1);
    const dv = clean.slice(-1);
    return `${body}-${dv}`;
  };

  const handleNumpadClick = (key: string) => {
    if (key === "del") {
      setRut((prev) => prev.slice(0, -1));
    } else if (rut.length < 10) {
      setRut((prev) => prev + key);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setRut("");
    setModalStep("reward");
  };

  const currentStories = STORIES[level] || [];
  const LevelIcon = LEVEL_ICONS[level] || Wallet;

  return (
    <div className="min-h-screen bg-white flex flex-col font-body">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          {/* Left: Brand + Level */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2ECC71] to-[#9B59B6] flex items-center justify-center">
              <span className="text-white font-heading font-bold text-lg">Fi</span>
            </div>
            <div>
              <h1 className="font-heading font-bold text-gray-900 text-lg">Fi Base</h1>
              <p className="text-xs text-gray-500">
                Nivel {level}: {LEVEL_NAMES[level]}
              </p>
            </div>
          </div>

          {/* Right: Points + Progress Ring */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full">
              <Star size={16} fill="currentColor" />
              <span className="font-semibold text-sm">{points}</span>
            </div>
            <div className="relative w-10 h-10">
              <svg className="w-10 h-10 -rotate-90">
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  stroke="#E5E7EB"
                  strokeWidth="3"
                  fill="none"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  stroke="#2ECC71"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-700">{level}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.sender === "user"
                      ? "bg-[#2ECC71] text-white rounded-br-md"
                      : msg.isEmergency
                        ? "bg-red-50 border-2 border-red-300 text-red-900 rounded-bl-md"
                        : "bg-gray-50 border border-gray-200 text-gray-800 rounded-bl-md"
                  }`}
                >
                  <p className="text-[15px] leading-relaxed">{msg.text}</p>
                  {msg.isEmergency && msg.actionButton && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      onClick={() => window.open("tel:+566002700700")}
                      className="mt-3 w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                    >
                      <Phone size={18} />
                      {msg.actionButton}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-gray-50 border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>
      </main>

      {/* Action Buttons */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          {!isProcessing && currentStories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2"
            >
              {currentStories.map((story, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStorySelect(story)}
                  className={`flex-1 min-w-[calc(50%-0.5rem)] px-4 py-3 rounded-xl text-sm font-medium text-left transition-all ${
                    story.isEmergency
                      ? "bg-red-50 border-2 border-red-200 text-red-700 hover:bg-red-100"
                      : "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-[#2ECC71]"
                  }`}
                >
                  {story.text}
                </motion.button>
              ))}
            </motion.div>
          )}
          {currentStories.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              Has completado todas las historias disponibles.
            </p>
          )}
        </div>
      </div>

      {/* Modal Multi-Step */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeModal}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl ${
                modalStep === "qr" ? "bg-gray-900 text-white" : "bg-white"
              }`}
            >
              {/* Close button */}
              <button
                onClick={closeModal}
                className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                  modalStep === "qr"
                    ? "text-gray-400 hover:bg-gray-800"
                    : "text-gray-400 hover:bg-gray-100"
                }`}
              >
                <X size={20} />
              </button>

              {/* Step 1: Reward */}
              {modalStep === "reward" && (
                <div className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#2ECC71] to-[#27AE60] flex items-center justify-center"
                  >
                    <LevelIcon size={40} className="text-white" />
                  </motion.div>

                  <h2 className="font-heading font-bold text-2xl text-gray-900 mb-2">
                    Nivel {level} Alcanzado!
                  </h2>
                  <p className="text-gray-600 mb-6">{LEVEL_NAMES[level]}</p>

                  <div className="bg-[#2ECC71]/10 border border-[#2ECC71]/30 rounded-2xl p-4 mb-6">
                    <div className="flex items-center justify-center gap-2 text-[#2ECC71]">
                      <CheckCircle size={20} />
                      <span className="font-semibold">{LEVEL_REWARDS[level]}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setModalStep("rut")}
                    className="w-full bg-[#2ECC71] hover:bg-[#27AE60] text-white font-semibold py-4 px-6 rounded-xl transition-colors"
                  >
                    Guardar Progreso
                  </button>
                </div>
              )}

              {/* Step 2: RUT Input */}
              {modalStep === "rut" && (
                <div className="p-8">
                  <h2 className="font-heading font-bold text-xl text-gray-900 text-center mb-2">
                    Ingresa tu RUT
                  </h2>
                  <p className="text-gray-500 text-center text-sm mb-6">
                    Para guardar tus puntos y progreso
                  </p>

                  {/* RUT Display */}
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-4 mb-6 text-center">
                    <span className="font-mono text-2xl text-gray-800 tracking-wider">
                      {formatRut(rut) || "--------"}
                    </span>
                  </div>

                  {/* Custom Numpad */}
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9", "K", "0", "del"].map(
                      (key) => (
                        <button
                          key={key}
                          onClick={() => handleNumpadClick(key)}
                          className={`h-14 rounded-xl font-semibold text-lg transition-all ${
                            key === "del"
                              ? "bg-gray-200 text-gray-600 hover:bg-gray-300"
                              : "bg-gray-100 text-gray-800 hover:bg-[#2ECC71]/20 hover:text-[#2ECC71]"
                          }`}
                        >
                          {key === "del" ? <Delete size={20} className="mx-auto" /> : key}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() => setModalStep("qr")}
                    disabled={rut.length < 8}
                    className="w-full bg-[#2ECC71] hover:bg-[#27AE60] disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
                  >
                    Confirmar
                  </button>
                </div>
              )}

              {/* Step 3: QR Handoff */}
              {modalStep === "qr" && (
                <div className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-40 h-40 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center"
                  >
                    <QrCode size={100} className="text-gray-900" />
                  </motion.div>

                  <h2 className="font-heading font-bold text-xl mb-2">
                    Cuenta Vinculada!
                  </h2>
                  <p className="text-gray-400 text-sm mb-6">
                    Escanea para llevar tu sesion a WhatsApp
                  </p>

                  <div className="flex items-center justify-center gap-2 text-[#25D366] mb-8">
                    <Smartphone size={20} />
                    <span className="text-sm">Continua desde tu celular</span>
                  </div>

                  <button
                    onClick={closeModal}
                    className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
                  >
                    Seguir en el Totem
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
