"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiBaseHeader } from "./FiBaseHeader";
import { IdleScreen } from "./IdleScreen";
import { ProcessingScreen } from "./ProcessingScreen";
import { ChatScreen } from "./ChatScreen";
import { QRTransferScreen } from "./QRTransferScreen";
import { simulateApiCall } from "./api";
import type { AppState, Message } from "./types";

export default function FiBaseApp() {
  const [appState, setAppState] = useState<AppState>("IDLE");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [points, setPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (appState === "CHAT" && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, appState]);

  const handleQuery = async (query: string) => {
    if (!query.trim()) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      sender: "user",
      text: query.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setAppState("PROCESSING");
    setIsLoading(true);

    // Simulate processing delay then show chat
    await new Promise((r) => setTimeout(r, 2400));
    setAppState("CHAT");

    const response = await simulateApiCall(query);
    const botMsg: Message = {
      id: crypto.randomUUID(),
      sender: "bot",
      ...response,
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsLoading(false);
    setPoints((p) => p + 10);
  };

  const handleReset = () => {
    setAppState("IDLE");
    setMessages([]);
    setInputValue("");
    setIsLoading(false);
  };

  const handleShowQR = () => {
    setAppState("QR_TRANSFER");
  };

  const handleContinueFromQR = () => {
    setAppState("CHAT");
  };

  const handleChatQuery = async (query: string) => {
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      sender: "user",
      text: query.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    const response = await simulateApiCall(query);
    const botMsg: Message = {
      id: crypto.randomUUID(),
      sender: "bot",
      ...response,
    };
    setMessages((prev) => [...prev, botMsg]);
    setIsLoading(false);
    setPoints((p) => p + 10);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <FiBaseHeader points={points} onReset={handleReset} appState={appState} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {appState === "IDLE" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex-1"
            >
              <IdleScreen onQuery={handleQuery} />
            </motion.div>
          )}

          {appState === "PROCESSING" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <ProcessingScreen lastQuery={messages[messages.length - 1]?.text ?? ""} />
            </motion.div>
          )}

          {appState === "CHAT" && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col"
            >
              <ChatScreen
                messages={messages}
                isLoading={isLoading}
                inputValue={inputValue}
                setInputValue={setInputValue}
                onSend={handleChatQuery}
                onReset={handleReset}
                onShowQR={handleShowQR}
                chatEndRef={chatEndRef}
                points={points}
              />
            </motion.div>
          )}

          {appState === "QR_TRANSFER" && (
            <motion.div
              key="qr"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col"
            >
              <QRTransferScreen
                onContinue={handleContinueFromQR}
                onReset={handleReset}
                points={points}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
