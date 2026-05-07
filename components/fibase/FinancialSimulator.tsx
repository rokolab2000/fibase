"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Phone, X, MessageCircle } from "lucide-react";

// Type definitions
interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  isEmergency?: boolean;
  actionButton?: string;
  timestamp: Date;
}

interface UserStory {
  text: string;
  response: string;
  points: number;
  triggersLevelUp: boolean;
  isEmergency?: boolean;
  actionButton?: string;
}

interface LevelData {
  stories: UserStory[];
}

// Mock database: Historias de Usuario por nivel
const USER_STORIES_BY_LEVEL: Record<number, LevelData> = {
  0: {
    stories: [
      {
        text: "💵 No tengo cuenta bancaria, puro efectivo",
        response:
          "Andar con efectivo es riesgoso. Te recomiendo una Cuenta Vista Institucional sin costo de mantención. ¿Te ayudo a abrir una?",
        points: 50,
        triggersLevelUp: true,
        isEmergency: false,
      },
      {
        text: "📊 Tarjeta con 30% interés",
        response:
          "Ese 30% es rotativo. Es ALTO. Paga siempre el monto facturado.",
        points: 50,
        triggersLevelUp: true,
      },
      {
        text: "📉 Pago mínimo y deuda no baja",
        response:
          "Casi todo se va a intereses. Paga el Monto Facturado o evalúa repactar.",
        points: 50,
        triggersLevelUp: true,
      },
      {
        text: "🚨 Me clonaron la tarjeta",
        response:
          "Paso 1: Bloquea tu tarjeta. La Ley de Fraudes (21.673) te protege.",
        points: 10,
        triggersLevelUp: false,
        isEmergency: true,
        actionButton: "📞 LLAMAR AL BANCO",
      },
      {
        text: "🏪 Uso tarjeta personal para mi local",
        response: "Paso 1: Ordena boletas. Paso 2: Abre cuenta empresa.",
        points: 50,
        triggersLevelUp: true,
      },
    ],
  },
  1: {
    stories: [
      {
        text: "💰 Tengo ahorros pequeños, ¿dónde guardarlos?",
        response:
          "Con hasta $200k, usa Cuenta Vista con bonificación. Arriba de eso, DPF o Ahorro a Plazo.",
        points: 60,
        triggersLevelUp: true,
      },
      {
        text: "🔄 Cambié de trabajo, ¿cómo tramito mi AFP?",
        response:
          "Tu AFP sigue contigo. Cambias de administradora solo si quieres y sin costo.",
        points: 60,
        triggersLevelUp: true,
      },
      {
        text: "📋 ¿Debo pedir Seguro de Desempleo?",
        response:
          "Si estás en el 1-3 años: SÍ. Cubre hasta 5 meses. Tramita en tu caja de compensación.",
        points: 60,
        triggersLevelUp: true,
      },
      {
        text: "🚨 Crédito con ISAPRE rechazada",
        response:
          "ISAPRE no es avalista. Tramita por urgencia médica o espera mejores ingresos.",
        points: 20,
        triggersLevelUp: false,
        isEmergency: true,
        actionButton: "📞 ASESORÍA GRATUITA",
      },
      {
        text: "🏠 Quiero ahorrar para casa, plan de ahorro?",
        response:
          "Ahorro Programado + DPF. Meta: 15-20% del valor como pie.",
        points: 60,
        triggersLevelUp: true,
      },
    ],
  },
  2: {
    stories: [
      {
        text: "📈 Quiero optimizar mis impuestos",
        response:
          "Con ingresos >$2M: Renta 2 o Renta 4. Consulta contador. Puedes ahorrar 10-15%.",
        points: 70,
        triggersLevelUp: true,
      },
      {
        text: "💳 Aplicar a tarjeta sin garantía",
        response:
          "Historial de 6 meses en banco + score >600. Empieza con $50k límite.",
        points: 70,
        triggersLevelUp: true,
      },
      {
        text: "🚗 Crédito para auto, tasa baja?",
        response: "Compara: leasing vs. crédito. Leasing = menor cuota, auto nuevo.",
        points: 70,
        triggersLevelUp: true,
      },
      {
        text: "🚨 Deuda en cobranza, me demandan",
        response:
          "URGENTE: Negocia dentro de 10 días o vence plazo. Ofrece 50-70% del total.",
        points: 15,
        triggersLevelUp: false,
        isEmergency: true,
        actionButton: "📞 ASISTENCIA LEGAL URGENTE",
      },
      {
        text: "📊 Comisiones bancarias me cobran mucho",
        response:
          "Cambia a banco con combo sin comisiones. Ahorras $20-30k/año fácil.",
        points: 70,
        triggersLevelUp: true,
      },
    ],
  },
  3: {
    stories: [
      {
        text: "💼 Inversión en acciones, inicio?",
        response:
          "Broker chileno: Buda, Fintual, Fonasa. Start $10k. Diversifica: 60/40 renta fija-variable.",
        points: 80,
        triggersLevelUp: true,
      },
      {
        text: "🏢 Arrendar depto, impuestos?",
        response:
          "Arriendo: Renta 2. Gastos deducibles: mantención, servicios. Declara contadormente.",
        points: 80,
        triggersLevelUp: true,
      },
      {
        text: "🌍 Fondos Mutuos vs ETF para jubilación",
        response:
          "ETF = más bajos costos. Fondos Mutuos = asesoría. A largo plazo: ETF gana.",
        points: 80,
        triggersLevelUp: true,
      },
      {
        text: "🚨 Hacker me robó cuenta y dinero",
        response:
          "INMEDIATO: Denuncia a PDI Cibercrimen. Bank cubre por garantía de cuentas.",
        points: 5,
        triggersLevelUp: false,
        isEmergency: true,
        actionButton: "🚨 DENUNCIA CIBERCRIMEN",
      },
      {
        text: "📱 Startup, incorporar sociedad?",
        response:
          "EIRL simple para micro. LTDA complejo pero protege patrimonio. Elige Abogado.",
        points: 80,
        triggersLevelUp: true,
      },
    ],
  },
  4: {
    stories: [
      {
        text: "🏦 Estrategia de diversificación global",
        response:
          "Portafolio: 40% Chile, 30% USA, 20% Europa, 10% Emergentes. Rebalancea anual.",
        points: 100,
        triggersLevelUp: false,
      },
      {
        text: "🏪 Franquicia o negocio propio",
        response:
          "Franquicia = riesgo bajo, royalties altos. Propio = riesgo alto, libertad total.",
        points: 100,
        triggersLevelUp: false,
      },
      {
        text: "💎 REIT y bienes raíces pasivos",
        response:
          "REIT = acceso sin dinero. Rentabilidad 5-8%. Liquida fácil vs. propiedad física.",
        points: 100,
        triggersLevelUp: false,
      },
      {
        text: "🚨 Auditoría y fraude corporativo",
        response:
          "Contrata auditor externo. Detecta desfalcos tempranos. Requiere reportería trimestral.",
        points: 20,
        triggersLevelUp: false,
        isEmergency: true,
        actionButton: "🔍 AUDITORÍA FORENSE",
      },
      {
        text: "🌐 Estrategia fiscal internacional",
        response:
          "Doble tributación, convenios bilaterales. Consulta especialista en tributación global.",
        points: 100,
        triggersLevelUp: false,
      },
    ],
  },
};

// Level configuration
const LEVEL_NAMES = [
  "No Bancarizado",
  "Bancarizado Básico",
  "Consumidor Informado",
  "Ahorrador Activo",
  "Inversionista",
];

const LEVEL_THRESHOLDS = [0, 250, 550, 950, 1450];

export default function FinancialSimulator() {
  // State management
  const [level, setLevel] = useState(0);
  const [points, setPoints] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "¡Hola! Soy FiBase, tu asesor financiero. Cuéntame un desafío financiero que estés enfrentando y te ayudaré con estrategias prácticas.",
      timestamp: new Date(),
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState<"reward" | "rut" | "qr">("reward");
  const [rut, setRut] = useState("");
  const [selectedStory, setSelectedStory] = useState<UserStory | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check level progression
  useEffect(() => {
    const currentLevelThreshold = LEVEL_THRESHOLDS[level] || 0;
    const nextLevelThreshold = LEVEL_THRESHOLDS[level + 1] || Infinity;

    if (points >= nextLevelThreshold && level < LEVEL_NAMES.length - 1) {
      setLevel(level + 1);
      setShowModal(true);
      setModalStep("reward");
    }
  }, [points, level]);

  // Handle user story selection
  const handleSelectStory = async (story: UserStory) => {
    setSelectedStory(story);
    setIsProcessing(true);

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: story.text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Add bot response
    const botMessage: Message = {
      id: `msg-${Date.now() + 1}`,
      sender: "bot",
      text: story.response,
      isEmergency: story.isEmergency,
      actionButton: story.actionButton,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);

    // Update points and check if level up
    const newPoints = points + story.points;
    setPoints(newPoints);

    if (story.triggersLevelUp && newPoints >= LEVEL_THRESHOLDS[level + 1]) {
      // Level up will be handled by useEffect
    }

    setIsProcessing(false);
  };

  // Handle RUT input (numeric only, max 12 chars)
  const handleRutInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 12);
    setRut(value);
  };

  // Get available stories based on current level
  const getAvailableStories = () => {
    const levelStories = USER_STORIES_BY_LEVEL[level]?.stories || [];
    return levelStories;
  };

  // Modal flow navigation
  const handleModalNext = () => {
    if (modalStep === "reward") {
      setModalStep("rut");
    } else if (modalStep === "rut" && rut.length >= 8) {
      setModalStep("qr");
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setModalStep("reward");
    setRut("");
  };

  const handleEmergencyCall = () => {
    alert("Llamando a servicio de emergencia...\n\n📞 +56 2 2 690 0000");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fi Base</h1>
            <p className="text-sm text-gray-600">
              Nivel {level}: {LEVEL_NAMES[level]}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-emerald-600">{points}</div>
            <p className="text-xs text-gray-600">puntos</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="max-w-4xl mx-auto mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(
                  100,
                  ((points - LEVEL_THRESHOLDS[level]) /
                    (LEVEL_THRESHOLDS[level + 1] - LEVEL_THRESHOLDS[level])) *
                    100
                )}%`,
              }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {points} / {LEVEL_THRESHOLDS[level + 1] || "∞"} puntos para siguiente nivel
          </p>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Chat messages */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-emerald-600 text-white"
                      : msg.isEmergency
                        ? "bg-red-100 text-red-900 border-2 border-red-500"
                        : "bg-gray-200 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  {msg.actionButton && (
                    <button
                      onClick={handleEmergencyCall}
                      className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded text-sm"
                    >
                      {msg.actionButton}
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Available stories */}
          <div className="border-t border-gray-200 bg-white p-4 max-h-32 overflow-y-auto">
            <p className="text-xs font-semibold text-gray-600 mb-2">
              Selecciona un tema:
            </p>
            <div className="space-y-2">
              {getAvailableStories().map((story, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectStory(story)}
                  disabled={isProcessing}
                  className="w-full text-left px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-sm text-gray-700 transition-colors"
                >
                  {story.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Reward, RUT, QR */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            {/* Close button */}
            <button
              onClick={handleModalClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            {modalStep === "reward" && (
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-emerald-600">
                  ¡Felicidades!
                </h2>
                <p className="text-lg font-semibold text-gray-900">
                  Has alcanzado Nivel {level}
                </p>
                <p className="text-gray-600">
                  Desbloqueaste: <span className="font-bold">{LEVEL_NAMES[level]}</span>
                </p>
                <button
                  onClick={handleModalNext}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded"
                >
                  Continuar
                </button>
              </div>
            )}

            {modalStep === "rut" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Ingresa tu RUT
                </h2>
                <p className="text-sm text-gray-600">
                  Para personalizar tu experiencia
                </p>
                <input
                  type="text"
                  value={rut}
                  onChange={handleRutInput}
                  placeholder="12345678-9"
                  maxLength="13"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:border-emerald-600 outline-none"
                />
                <button
                  onClick={handleModalNext}
                  disabled={rut.length < 8}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded"
                >
                  Siguiente
                </button>
              </div>
            )}

            {modalStep === "qr" && (
              <div className="text-center space-y-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Escanea este código
                </h2>
                <p className="text-sm text-gray-600">
                  Para llevar tu progreso a WhatsApp
                </p>
                <div className="bg-gray-200 aspect-square rounded flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle size={48} className="mx-auto text-emerald-600 mb-2" />
                    <p className="text-xs text-gray-600">Código QR</p>
                  </div>
                </div>
                <button
                  onClick={handleModalClose}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded"
                >
                  Hecho
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
