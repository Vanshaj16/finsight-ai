import { BellDot, CheckCheck, ReceiptIndianRupee, Target, TriangleAlert, UserPen } from "lucide-react";

const formatTime = (value) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const iconMap = {
  transaction_created: ReceiptIndianRupee,
  transaction_updated: ReceiptIndianRupee,
  transaction_deleted: ReceiptIndianRupee,
  budget_updated: Target,
  budget_exceeded: TriangleAlert,
  profile_updated: UserPen,
};

const NotificationsPanel = ({ notifications, unreadCount, loading, onMarkAllRead, onMarkRead }) => (
  <div className="card-surface absolute right-0 top-[calc(100%+12px)] z-40 w-[360px] max-w-[calc(100vw-2rem)] p-4 text-white shadow-[0_30px_90px_rgba(0,0,0,0.48)]">
    <div className="mb-4 flex items-center justify-between gap-3">
      <div>
        <p className="kicker">Notifications</p>
        <h3 className="mt-2 text-xl font-semibold text-white">Recent activity</h3>
      </div>
      <button
        type="button"
        onClick={onMarkAllRead}
        disabled={!unreadCount}
        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/65 disabled:opacity-40"
      >
        Mark all read
      </button>
    </div>

    <div className="mb-4 rounded-[18px] border border-white/8 bg-white/4 px-4 py-3 text-sm text-white/68">
      {unreadCount ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up"}
    </div>

    <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
      {loading ? <p className="rounded-[18px] border border-white/8 bg-white/4 px-4 py-5 text-sm text-white/55">Loading notifications...</p> : null}
      {!loading && notifications.length === 0 ? (
        <div className="rounded-[18px] border border-white/8 bg-white/4 px-4 py-5 text-sm text-white/55">
          No notifications yet. Add a transaction or update a budget to see activity here.
        </div>
      ) : null}

      {!loading
        ? notifications.map((notification) => {
            const Icon = iconMap[notification.type] || BellDot;

            return (
              <button
                key={notification._id}
                type="button"
                onClick={() => onMarkRead(notification._id)}
                className={`w-full rounded-[20px] border px-4 py-4 text-left transition ${
                  notification.isRead
                    ? "border-white/8 bg-white/4 text-white/60"
                    : "border-[#6C63FF]/30 bg-[#6C63FF]/10 text-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 rounded-full bg-white/10 p-2 text-white">
                    <Icon size={15} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-white">{notification.title}</p>
                      {!notification.isRead ? <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#6EF4D8]" /> : null}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/62">{notification.message}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.16em] text-white/35">{formatTime(notification.createdAt)}</p>
                  </div>
                </div>
              </button>
            );
          })
        : null}
    </div>
  </div>
);

export default NotificationsPanel;
