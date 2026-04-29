const ChatWindow = ({ messages, message, setMessage, onSend, sending }) => (
  <div className="card-surface flex h-[72vh] flex-col overflow-hidden text-white">
    <div className="border-b border-white/8 px-5 py-5">
      <p className="kicker">Smart Assistant</p>
      <div className="mt-3 flex items-center gap-4">
        <div className="orb-ring h-12 w-12" />
        <div>
          <h3 className="text-2xl font-semibold text-white">Ask FinSight AI anything</h3>
          <p className="text-sm text-white/50">Context-aware answers using your live transaction history.</p>
        </div>
      </div>
    </div>

    <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
      {messages.map((item) => (
        <div key={item.id} className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}>
          <div
            className={`max-w-[88%] rounded-[26px] px-4 py-3 text-sm leading-7 shadow-lg ${
              item.role === "user"
                ? "bg-gradient-to-r from-[#6C63FF] to-[#4F9CFF] text-white"
                : "border border-white/8 bg-white/6 text-white/86"
            }`}
          >
            {item.content}
          </div>
        </div>
      ))}
    </div>

    <form onSubmit={onSend} className="border-t border-white/8 p-4">
      <div className="flex gap-3">
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Where did I spend the most this month?"
          className="field-input flex-1"
        />
        <button type="submit" disabled={sending} className="primary-button disabled:opacity-70">
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </form>
  </div>
);

export default ChatWindow;
