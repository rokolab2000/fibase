import type { Message } from "./types";

type ApiResponse = Omit<Message, "id" | "sender">;

export async function simulateApiCall(query: string): Promise<ApiResponse> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 1500));

  const q = query.toLowerCase();

  // FRAUD / EMERGENCY
  if (q.includes("cargo") || q.includes("clonaron") || q.includes("robo") || q.includes("fraude") || q.includes("no reconozco")) {
    return {
      text: "🚨 Detecté una posible situación de fraude. Actúa de inmediato siguiendo estos pasos:",
      isEmergency: true,
      actionRequired: "CALL_BANK",
      steps: [
        "Llama AHORA al número de emergencias de tu banco (reverso de tu tarjeta).",
        "Pide el bloqueo inmediato de tu tarjeta.",
        "Solicita el formulario de disputa o desconocimiento de cargo.",
        "Guarda el número de caso que te entreguen.",
        "Revisa tu correo: el banco te enviará confirmación.",
      ],
    };
  }

  // MINIMUM PAYMENT
  if (q.includes("mínimo") || q.includes("minimo") || q.includes("pago mínimo") || q.includes("pago minimo")) {
    return {
      text: "📉 El pago mínimo es la trampa más común de las tarjetas. Acá te explico por qué tu deuda no baja:",
      isEmergency: false,
      actionRequired: "NONE",
      steps: [
        "El banco cobra intereses sobre el total de tu deuda cada mes.",
        "El pago mínimo suele cubrir solo los intereses... no el capital.",
        "Resultado: pagas mes a mes pero la deuda no baja, o incluso sube.",
        "Consejo FiBase: intenta pagar al menos el doble del mínimo para empezar a reducir tu deuda de verdad.",
        "Usa el simulador de tu banco para ver cuánto ahorras pagando más.",
      ],
    };
  }

  // CAE
  if (q.includes("cae") || q.includes("carga anual") || q.includes("tasa") || q.includes("interés")) {
    return {
      text: "⚖️ La CAE (Carga Anual Equivalente) es el costo real de tu crédito. Incluye todo lo que pagas en un año:",
      isEmergency: false,
      actionRequired: "NONE",
      steps: [
        "Incluye la tasa de interés + comisiones + seguros + gastos operacionales.",
        "Es el número que debes comparar entre bancos, no solo la tasa.",
        "Ejemplo: un crédito con tasa 1% mensual puede tener una CAE de 25% anual.",
        "En Chile, la CMF regula que los bancos siempre deben informar la CAE.",
        "Regla de oro: siempre elige el crédito con menor CAE, no el de cuota más baja.",
      ],
    };
  }

  // GENERIC FALLBACK
  return {
    text: "Entendí tu consulta. Acá tienes información útil para tu situación financiera:",
    isEmergency: false,
    actionRequired: "NONE",
    steps: [
      "Revisa siempre el estado de cuenta mensual de tu tarjeta.",
      "Compara tasas y CAE antes de contratar cualquier crédito.",
      "Ante cualquier duda, consulta directamente con tu banco o la CMF (cmfchile.cl).",
      "Recuerda: en Chile tienes derecho a pedir toda la información de tu crédito por escrito.",
    ],
  };
}
