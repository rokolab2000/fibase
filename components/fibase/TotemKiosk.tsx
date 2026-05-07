"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, Phone, QrCode, ChevronRight, Send, X } from "lucide-react";

// Mock database: Historias de Usuario por Nivel
const USER_STORIES_DB = {
  0: [ // Supervivencia y Acceso
    {
      id: "0.0",
      text: "💵 No tengo cuenta bancaria, manejo puro efectivo",
      response:
        "¡Bienvenido! Andar con efectivo es riesgoso. Te recomiendo abrir una Cuenta Vista Institucional sin costo de mantención hoy mismo en esta sucursal. ¿Te anoto para abrir una?",
      points: 50,
      triggersLevelUp: true,
      isEmergency: false,
    },
    {
      id: "0.1",
      text: "📊 Tarjeta con 30% de interés",
      response:
        "Ese 30% es rotativo. Es ALTO. Paga siempre el monto facturado para no regalarle plata al banco.",
      points: 50,
      triggersLevelUp: false,
      isEmergency: false,
    },
    {
      id: "0.2",
      text: "🚨 Me robaron la tarjeta",
      response:
        "Llama al banco AHORA. Bloquea la tarjeta inmediatamente. No esperes. Los primeros minutos son críticos.",
      points: 100,
      triggersLevelUp: true,
      isEmergency: true,
    },
    {
      id: "0.3",
      text: "💳 ¿Cuál es la diferencia entre Débito y Crédito?",
      response:
        "Débito: Gastas tu plata. Crédito: El banco te presta. Con crédito pagas interés si no pagas completo en 30 días.",
      points: 40,
      triggersLevelUp: false,
      isEmergency: false,
    },
  ],
  1: [ // Primeros Pasos en Bancarización
    {
      id: "1.0",
      text: "📈 Mi sueldo es variables, ¿cómo ahorro?",
      response:
        "Abre una cuenta de ahorro separada. Cada mes, traspasa lo que puedas. Aunque sea $10k, la disciplina importa más que el monto.",
      points: 60,
      triggersLevelUp: false,
      isEmergency: false,
    },
    {
      id: "1.1",
      text: "🏦 ¿Qué es una Cuenta Corriente?",
      response:
        "Es para quien tiene flujo regular (empresario o empleado). Tiene chequera, permite sobregiro. Más costosa que Cuenta Vista.",
      points: 50,
      triggersLevelUp: false,
      isEmergency: false,
    },
    {
      id: "1.2",
      text: "💰 Me ofrecen un crédito fácil",
      response:
        "¡Cuidado! Fácil = alto interés. Antes de aceptar, simula el crédito aquí en el tótem o pregunta al ejecutivo.",
      points: 70,
      triggersLevelUp: true,
      isEmergency: false,
    },
  ],
  2: [ // Derechos del Consumidor
    {
      id: "2.0",
      text: "⚖️ El banco me cobró comisión injusta",
      response:
        "Tienes derecho. Reclama en la sucursal o en SERNAC (Servicio Nacional del Consumidor). El banco debe justificar toda comisión.",
      points: 80,
      triggersLevelUp: false,
      isEmergency: false,
    },
    {
      id: "2.1",
      text: "📋 ¿Qué es una Tasación Regulada?",
      response:
        "Es un techo de interés que cobra cada banco. Por ley, no puede excederlo. Compara tasas entre bancos antes de solicitar crédito.",
      points: 60,
      triggersLevelUp: false,
      isEmergency: false,
    },
  ],
  3: [ // Ahorro e Inversión
    {
      id: "3.0",
      text: "💎 Quiero invertir en fondos mutuos",
      response:
        "Buena idea. Comienza pequeño. Un fondo conservador es menos riesgo. Platica con un asesor en la sucursal.",
      points: 100,
      triggersLevelUp: true,
      isEmergency: false,
    },
  ],
  4: [ // Independencia Financiera
    {
      id: "4.0",
      text: "🚀 Quiero optimizar mis finanzas personales",
      response:
        "Excelente. Ya tienes la base. Ahora enfócate en diversificación, ahorros a largo plazo y seguros. ¡Vas por buen camino!",
      points: 150,
      triggersLevelUp: false,
      isEmergency: false,
    },
  ],
};

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  isEmergency: boolean;
  storyId?: string;
}

export default function TotemKiosk() {
  // ========== ESTADO PRINCIPAL ==========
  const [totemState, setTotemState] = useState<"idle" | "active">("idle");
  const [level, setLevel] = useState(0);
  const [points, setPoints] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState<"reward" | "rut" | "qr">("reward");
  const [rut, setRut] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al final del chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ========== HANDLERS ==========
  const handleStartChat = () => {
    setTotemState("active");
    setMessages([
      {
        id: "welcome-" + Date.now(),
        sender: "bot",
        text: `Hola, soy Fi Base. Estoy aquí para guiarte en tus finanzas. ¿Cuál es tu situación hoy?`,
        isEmergency: false,
      },
    ]);
  };

  const handleSelectStory = (storyId: string) => {
    const allStories = Object.values(USER_STORIES_DB).flat();
    const selected = allStories.find((s) => s.id === storyId);
    if (!selected) return;

    // Agregar mensaje del usuario
    const userMsg: Message = {
      id: "user-" + Date.now(),
      sender: "user",
      text: selected.text,
      isEmergency: selected.isEmergency,
      storyId: selected.id,
    };
    setMessages((prev) => [...prev, userMsg]);

    // Simular delay de la IA
    setIsProcessing(true);
    setTimeout(() => {
      const botMsg: Message = {
        id: "bot-" + Date.now(),
        sender: "bot",
        text: selected.response,
        isEmergency: selected.isEmergency,
      };
      setMessages((prev) => [...prev, botMsg]);
      setPoints((prev) => prev + selected.points);

      // Si sube de nivel, mostrar modal de reward
      if (selected.triggersLevelUp && level < 4) {
        setLevel((prev) => prev + 1);
        setShowModal(true);
        setModalStep("reward");
      }

      setIsProcessing(false);
    }, 1200);
  };

  const handleContinueFromReward = () => {
    setModalStep("rut");
  };

  const handleRutInput = (digit: string) => {
    if (rut.length < 9) {
      setRut(rut + digit);
    }
  };

  const handleRutDelete = () => {
    setRut(rut.slice(0, -1));
  };

  const handleRutConfirm = () => {
    if (rut.length >= 8) {
      setModalStep("qr");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setRut("");
    setModalStep("reward");
  };

  const handleReset = () => {
    setTotemState("idle");
    setLevel(0);
    setPoints(0);
    setMessages([]);
    setRut("");
    setShowModal(false);
    setModalStep("reward");
  };

  // ========== RENDER: IDLE SCREEN ==========
  if (totemState === "idle") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-2xl">
          {/* Logo + Brand */}
          <div className="mb-12">
            <div className="w-40 h-40 mx-auto bg-gradient-to-br from-emerald-500 to-violet-600 rounded-full flex items-center justify-center shadow-lg mb-6">
              <MessageCircle size={100} className="text-white" />
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-2 tracking-tight" style={{ fontFamily: 'Montserrat' }}>
              FIBASE
            </h1>
            <p className="text-2xl text-gray-600 mb-6" style={{ fontFamily: 'Poppins' }}>
              Tu guía financiera inteligente
            </p>
          </div>

          <p className="text-xl text-gray-500 mb-16 leading-relaxed" style={{ fontFamily: 'Poppins' }}>
            Descubre cómo mejorar tus finanzas en minutos. Sin necesidad de login.
          </p>

          <button
            onClick={handleStartChat}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-2xl px-8 py-6 rounded-xl shadow-lg transition-all min-h-[90px] flex items-center justify-center"
            style={{ fontFamily: 'Poppins' }}
            aria-label="Comenzar conversación"
          >
            Tocar para comenzar
          </button>

          <p className="text-sm text-gray-400 mt-8" style={{ fontFamily: 'Poppins' }}>
            Disponible en tótems públicos
          </p>
        </div>
      </div>
    );
  }

  // ========== RENDER: ACTIVE SCREEN (CHAT) ==========
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-6 flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-bold text-gray-900" style={{ fontFamily: 'Montserrat' }}>FIBASE</h2>
          <p className="text-lg text-gray-600" style={{ fontFamily: 'Poppins' }}>Nivel {level} • {points} puntos</p>
        </div>
        <button
          onClick={handleReset}
          className="bg-red-500 hover:bg-red-600 text-white font-bold text-lg px-8 py-4 rounded-lg min-h-[60px] transition-all"
          style={{ fontFamily: 'Poppins' }}
          aria-label="Reiniciar"
        >
          Reiniciar
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-white">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-2xl p-6 rounded-lg text-lg ${
                msg.sender === "user"
                  ? "bg-emerald-500 text-white shadow-md"
                  : msg.isEmergency
                    ? "bg-red-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-900 shadow-sm border border-gray-200"
              }`}
              style={{ fontFamily: 'Poppins' }}
            >
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Story Options */}
      {!isProcessing && messages.length > 0 && messages[messages.length - 1].sender === "bot" && (
        <div className="p-8 bg-gray-50 border-t border-gray-200 space-y-4">
          <p className="text-gray-800 font-semibold text-lg" style={{ fontFamily: 'Poppins' }}>¿Cuál es tu situación?</p>
          <div className="grid grid-cols-1 gap-4">
            {Object.values(USER_STORIES_DB)
              .flat()
              .slice(0, 4)
              .map((story) => (
                <button
                  key={story.id}
                  onClick={() => handleSelectStory(story.id)}
                  className="bg-white border-2 border-violet-300 hover:bg-violet-50 hover:border-violet-500 text-gray-900 font-semibold text-lg px-6 py-5 rounded-lg transition-all min-h-[70px] flex items-center justify-between shadow-sm"
                  style={{ fontFamily: 'Poppins' }}
                >
                  <span>{story.text}</span>
                  <ChevronRight size={24} className="text-violet-600" />
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Modal: Reward / RUT / QR */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-12 shadow-2xl">
            {modalStep === "reward" && (
              <div className="text-center">
                <div className="text-8xl mb-8">🎉</div>
                <h3 className="text-4xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Montserrat' }}>
                  ¡Felicidades!
                </h3>
                <p className="text-2xl text-gray-600 mb-12" style={{ fontFamily: 'Poppins' }}>
                  Subiste a Nivel {level}. Has ganado {points} puntos.
                </p>
                <button
                  onClick={handleContinueFromReward}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xl px-8 py-6 rounded-lg min-h-[70px] transition-all shadow-md"
                  style={{ fontFamily: 'Poppins' }}
                >
                  Continuar
                </button>
              </div>
            )}

            {modalStep === "rut" && (
              <div className="text-center">
                <h3 className="text-4xl font-bold text-gray-900 mb-8" style={{ fontFamily: 'Montserrat' }}>
                  Ingresa tu RUT
                </h3>
                <div className="bg-gray-100 p-8 rounded-lg mb-8 text-center border border-gray-300">
                  <p className="text-5xl font-mono font-bold text-gray-900 tracking-widest">
                    {rut || "_ _ _ _ _ _ _ _"}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleRutInput(num.toString())}
                      className="bg-violet-500 hover:bg-violet-600 text-white font-bold text-2xl py-5 rounded-lg transition-all shadow-sm"
                      style={{ fontFamily: 'Poppins' }}
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    onClick={() => handleRutInput("0")}
                    className="col-span-3 bg-violet-500 hover:bg-violet-600 text-white font-bold text-2xl py-5 rounded-lg transition-all shadow-sm"
                    style={{ fontFamily: 'Poppins' }}
                  >
                    0
                  </button>
                </div>
                <button
                  onClick={handleRutDelete}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-bold text-lg px-6 py-4 rounded-lg mb-4 transition-all"
                  style={{ fontFamily: 'Poppins' }}
                >
                  Eliminar
                </button>
                <button
                  onClick={handleRutConfirm}
                  disabled={rut.length < 8}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white font-bold text-lg px-6 py-4 rounded-lg transition-all"
                  style={{ fontFamily: 'Poppins' }}
                >
                  Confirmar RUT
                </button>
              </div>
            )}

            {modalStep === "qr" && (
              <div className="text-center">
                <h3 className="text-4xl font-bold text-gray-900 mb-8" style={{ fontFamily: 'Montserrat' }}>
                  Escanea con WhatsApp
                </h3>
                <div className="bg-violet-100 w-56 h-56 mx-auto rounded-lg mb-8 flex items-center justify-center border-4 border-violet-300">
                  <QrCode size={140} className="text-violet-600" />
                </div>
                <p className="text-xl text-gray-600 mb-12" style={{ fontFamily: 'Poppins' }}>
                  Abre WhatsApp en tu celular y escanea este código para continuar tu progreso.
                </p>
                <button
                  onClick={handleCloseModal}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg px-6 py-5 rounded-lg transition-all shadow-md"
                  style={{ fontFamily: 'Poppins' }}
                >
                  Listo, cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
