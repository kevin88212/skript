const TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

export async function sendTelegramMessage(text: string, chatId = CHAT_ID) {
  if (!TOKEN || TOKEN === "DEIN_TOKEN_HIER") {
    console.log("[Telegram] Kein Token konfiguriert. Nachricht:", text);
    return { ok: false, reason: "no_token" };
  }

  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
    }),
  });

  return res.json();
}
