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
  <div className="card-surface notification-surface fixed left-3 right-3 top-[5.75rem] z-40 max-h-[calc(100vh-8.5rem)] overflow-hidden p-3 text-white shadow-[0_30px_90px_rgba(0,0,0,0.48)] sm:absolute sm:left-auto sm:right-0 sm:top-[calc(100%+12px)] sm:w-[360px] sm:max-w-[calc(100vw-2rem)] sm:p-4">
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="kicker">Notifications</p>
        <h3 className="mt-2 text-lg font-semibold text-white sm:text-xl">Recent activity</h3>
      </div>
      <button
        type="button"
        onClick={onMarkAllRead}
        disabled={!unreadCount}
        className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-white/65 disabled:opacity-40 sm:w-auto sm:text-xs sm:tracking-[0.18em]"
      >
        Mark all read
      </button>
    </div>

    <div className="mb-4 rounded-[18px] border border-white/10 bg-white/8 px-4 py-3 text-sm text-white/72">
      {unreadCount ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up"}
    </div>

    <div className="max-h-[calc(100vh-14rem)] space-y-3 overflow-y-auto pr-1 sm:max-h-[420px]">
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
                className={`w-full rounded-[20px] border px-3 py-3 text-left transition sm:px-4 sm:py-4 ${
                  notification.isRead
                    ? "border-white/10 bg-white/8 text-white/70"
                    : "border-[#6C63FF]/35 bg-[rgba(108,99,255,0.18)] text-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 rounded-full bg-white/10 p-2 text-white">
                    <Icon size={15} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="break-words text-sm font-semibold text-white">{notification.title}</p>
                      {!notification.isRead ? <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#6EF4D8]" /> : null}
                    </div>
                    <p className="mt-2 break-words text-sm leading-6 text-white/62">{notification.message}</p>
                    <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-white/35 sm:text-xs sm:tracking-[0.16em]">
                      {formatTime(notification.createdAt)}
                    </p>
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
