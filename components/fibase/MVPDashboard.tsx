'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, AlertTriangle, Shield, Wallet, TrendingUp, Phone } from 'lucide-react';
import { TokenAgentMascot } from './TokenAgentMascot';
import { ChatScreen } from './ChatScreen';
import { QRTransferScreen } from './QRTransferScreen';
import type { Message } from './types';

export default function MVPDashboard() {
  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'chat' | 'qr'>('dashboard');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [points, setPoints] = useState(0);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const handleActionCard = (action: string) => {
    if (action === 'emergency') {
      setEmergencyMode(true);
    } else if (action === 'transfer') {
      setCurrentScreen('qr');
    } else {
      setCurrentScreen('chat');
      setMessages([
        { role: 'assistant', content: `Claro, te ayudaré con: ${action}` },
      ]);
    }
  };

  const handleStartChat = () => {
    setCurrentScreen('chat');
  };

  const handleReset = () => {
    setCurrentScreen('dashboard');
    setMessages([]);
    setInputValue('');
    setEmergencyMode(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence mode="wait">
        {/* Dashboard MVP Screen */}
        {currentScreen === 'dashboard' && !emergencyMode && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen"
          >
            {/* Header */}
            <header className="bg-gradient-to-r from-emerald-50 to-violet-50 px-6 py-6 shadow-sm">
              <div className="max-w-4xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src="/mascot/fibase.png" alt="FiBase" className="w-10 h-10" />
                  <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Montserrat' }}>
                    FiBase
                  </h1>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
                  <span className="text-sm font-semibold text-emerald-600">{points} puntos</span>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 px-6 py-8">
              <div className="max-w-4xl mx-auto">
                {/* Greeting with Mascot */}
                <div className="grid md:grid-cols-2 gap-8 mb-12 items-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center"
                  >
                    <div className="w-48 h-48">
                      <TokenAgentMascot
                        message="Hola, soy FiBase. Te ayudo a entender y actuar sobre tus derechos financieros. 👋"
                        emotion="happy"
                        isSpeaking={false}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Montserrat' }}>
                      Entiende tus finanzas
                    </h2>
                    <p className="text-lg text-gray-600 mb-6" style={{ fontFamily: 'Poppins' }}>
                      Respondo tus dudas sobre deudas, protección de datos, derechos financieros y más. Todo en tiempo real.
                    </p>
                    <button
                      onClick={handleStartChat}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-xl transition-all inline-flex items-center gap-2 min-h-[56px]"
                      style={{ fontFamily: 'Poppins' }}
                    >
                      <Send size={20} />
                      Comenzar
                    </button>
                  </motion.div>
                </div>

                {/* Action Cards */}
                <div className="mb-12">
                  <h3 className="text-xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Montserrat' }}>
                    ¿Qué necesitas?
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Card 1: Deudas */}
                    <motion.button
                      whileHover={{ y: -4 }}
                      onClick={() => handleActionCard('deudas')}
                      className="bg-white border-2 border-emerald-200 rounded-2xl p-6 text-left hover:border-emerald-400 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <Wallet className="text-emerald-600" size={24} />
                        </div>
                        <h4 className="font-bold text-gray-900 text-lg" style={{ fontFamily: 'Montserrat' }}>
                          Deudas
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Poppins' }}>
                        Entiende cómo funcionan y cuáles son tus derechos
                      </p>
                    </motion.button>

                    {/* Card 2: Protección */}
                    <motion.button
                      whileHover={{ y: -4 }}
                      onClick={() => handleActionCard('protección')}
                      className="bg-white border-2 border-violet-200 rounded-2xl p-6 text-left hover:border-violet-400 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
                          <Shield className="text-violet-600" size={24} />
                        </div>
                        <h4 className="font-bold text-gray-900 text-lg" style={{ fontFamily: 'Montserrat' }}>
                          Protección
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Poppins' }}>
                        Datos personales, privacidad y seguridad
                      </p>
                    </motion.button>

                    {/* Card 3: Estafa */}
                    <motion.button
                      whileHover={{ y: -4 }}
                      onClick={() => handleActionCard('estafa')}
                      className="bg-white border-2 border-emerald-200 rounded-2xl p-6 text-left hover:border-emerald-400 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <TrendingUp className="text-emerald-600" size={24} />
                        </div>
                        <h4 className="font-bold text-gray-900 text-lg" style={{ fontFamily: 'Montserrat' }}>
                          Finanzas
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Poppins' }}>
                        Inversión, ahorro y crecimiento patrimonial
                      </p>
                    </motion.button>
                  </div>
                </div>

                {/* Simplicity Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-r from-emerald-50 to-violet-50 rounded-2xl p-8 mb-12 border border-emerald-100"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Montserrat' }}>
                    Simple y transparente
                  </h3>
                  <ul className="space-y-3 text-gray-700" style={{ fontFamily: 'Poppins' }}>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-600 font-bold mt-1">✓</span>
                      <span>Respuestas basadas en leyes chilenas reales</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-600 font-bold mt-1">✓</span>
                      <span>Disponible 24/7 en tótems y celulares</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-600 font-bold mt-1">✓</span>
                      <span>Gana puntos y desbloquea acciones</span>
                    </li>
                  </ul>
                </motion.div>

                {/* Emergency Button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  onClick={() => {
                    setEmergencyMode(true);
                    handleActionCard('emergency');
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-4 rounded-xl flex items-center justify-center gap-2 min-h-[64px] text-lg transition-all"
                  style={{ fontFamily: 'Montserrat' }}
                >
                  <AlertTriangle size={24} />
                  Sospechas fraude o estafa
                </motion.button>
              </div>
            </main>
          </motion.div>
        )}

        {/* Emergency Mode */}
        {emergencyMode && currentScreen === 'dashboard' && (
          <motion.div
            key="emergency"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-red-600 flex flex-col items-center justify-center px-6 z-50"
          >
            <div className="text-center max-w-md">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <AlertTriangle size={80} className="text-white mx-auto mb-6" />
              </motion.div>
              <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Montserrat' }}>
                Modo de Emergencia
              </h1>
              <p className="text-red-100 text-lg mb-8" style={{ fontFamily: 'Poppins' }}>
                Si sospecha fraude o estafa financiera, contacte inmediatamente a las autoridades.
              </p>
              <a
                href="tel:+56228867777"
                className="bg-white text-red-600 font-bold px-8 py-4 rounded-xl inline-flex items-center gap-3 hover:bg-red-50 transition-all min-h-[56px] mb-4 text-lg"
                style={{ fontFamily: 'Montserrat' }}
              >
                <Phone size={24} />
                LLAMAR AL BANCO
              </a>
              <button
                onClick={handleReset}
                className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold px-6 py-3 rounded-lg transition-all mt-4"
                style={{ fontFamily: 'Poppins' }}
              >
                Volver al inicio
              </button>
            </div>
          </motion.div>
        )}

        {/* Chat Screen */}
        {currentScreen === 'chat' && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen"
          >
            <ChatScreen
              messages={messages}
              isLoading={isLoading}
              inputValue={inputValue}
              setInputValue={setInputValue}
              onSend={() => {}}
              onReset={handleReset}
              onShowQR={() => setCurrentScreen('qr')}
              chatEndRef={chatEndRef}
              points={points}
            />
          </motion.div>
        )}

        {/* QR Transfer Screen */}
        {currentScreen === 'qr' && (
          <motion.div
            key="qr"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col min-h-screen"
          >
            <QRTransferScreen
              onContinue={() => setCurrentScreen('chat')}
              onReset={handleReset}
              points={points}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
