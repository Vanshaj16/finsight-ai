import { useState } from "react";
import api from "../api/axios";
import ChatWindow from "../components/chat/ChatWindow";

let messageId = 1;

const initialMessages = [
  {
    id: messageId,
    role: "assistant",
    content: "Ask me about your spending patterns, budget gaps, or where you can save more.",
  },
];

const ChatbotPage = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async (event) => {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    const userMessage = { id: ++messageId, role: "user", content: message.trim() };
    setMessages((current) => [...current, userMessage]);
    setMessage("");
    setSending(true);

    try {
      const { data } = await api.post("/chat", { message: userMessage.content });
      setMessages((current) => [...current, { id: ++messageId, role: "assistant", content: data.reply }]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: ++messageId,
          role: "assistant",
          content: error.response?.data?.message || "The assistant is unavailable right now.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[0.82fr_1.18fr]">
        <article className="card-surface p-6 text-white">
          <p className="kicker">Prompt ideas</p>
          <h2 className="mt-3 text-4xl font-semibold text-white">Talk like a financial strategist</h2>
          <p className="mt-3 text-sm leading-7 text-white/56">
            Use short natural questions and let the assistant map them against your latest transaction context.
          </p>
          <div className="mt-6 space-y-3">
            {[
              "Where did I spend most money?",
              "How can I save more this month?",
              "Which category is over budget?",
              "What should I reduce first?",
            ].map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setMessage(prompt)}
                className="w-full rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-left text-sm font-semibold text-white/84 transition hover:bg-white/10"
              >
                {prompt}
              </button>
            ))}
          </div>
        </article>
        <ChatWindow messages={messages} message={message} setMessage={setMessage} onSend={handleSend} sending={sending} />
      </section>
    </div>
  );
};

export default ChatbotPage;
