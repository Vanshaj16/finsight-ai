import { Bell, LogOut, Menu } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import NotificationsPanel from "../notifications/NotificationsPanel";
import ProfileModal from "../profile/ProfileModal";

const titles = {
  "/dashboard": "Overview",
  "/transactions": "Transactions",
  "/budget": "Budget Planner",
  "/insights": "AI Insights",
  "/chatbot": "Chat Assistant",
};

const Topbar = ({ onToggleMobileMenu }) => {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationsRef = useRef(null);

  const initial = useMemo(() => {
    const source = user?.name || user?.email || "U";
    return source.trim().charAt(0).toUpperCase();
  }, [user]);

  const loadNotifications = async () => {
    if (!user) {
      return;
    }

    try {
      setLoadingNotifications(true);
      const { data } = await api.get("/notifications");
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (_error) {
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user, pathname]);

  useEffect(() => {
    if (!user) {
      return undefined;
    }

    const intervalId = setInterval(loadNotifications, 15000);
    const handleRefresh = () => {
      loadNotifications();
    };

    window.addEventListener("notifications:refresh", handleRefresh);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("notifications:refresh", handleRefresh);
    };
  }, [user]);

  useEffect(() => {
    if (!notificationsOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!notificationsRef.current?.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [notificationsOpen]);

  const handleBellToggle = async () => {
    const nextOpen = !notificationsOpen;
    setNotificationsOpen(nextOpen);

    if (nextOpen) {
      await loadNotifications();
    }
  };

  const handleMarkAllRead = async () => {
    await api.patch("/notifications/read-all");
    setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
    setUnreadCount(0);
  };

  const handleMarkRead = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    setNotifications((current) => current.map((item) => (item._id === id ? { ...item, isRead: true } : item)));
    setUnreadCount((current) => Math.max(current - 1, 0));
  };

  return (
    <>
      <header className="card-surface sticky top-4 z-20 mb-6 flex items-center justify-between gap-4 px-5 py-4 text-white">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="rounded-full border border-white/12 bg-white/6 p-3 text-white lg:hidden"
          >
            <Menu size={18} />
          </button>
          <div>
            <p className="kicker">Workspace</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{titles[pathname] || "FinSight AI"}</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div ref={notificationsRef} className="relative">
            <button
              type="button"
              onClick={handleBellToggle}
              className="relative inline-flex rounded-full border border-white/10 bg-white/4 p-3 text-white/70 transition hover:bg-white/8"
            >
              <Bell size={16} />
              {unreadCount ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#6C63FF] px-1 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              ) : null}
            </button>

            {notificationsOpen ? (
              <NotificationsPanel
                notifications={notifications}
                unreadCount={unreadCount}
                loading={loadingNotifications}
                onMarkAllRead={handleMarkAllRead}
                onMarkRead={handleMarkRead}
              />
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            className="hidden items-center gap-3 rounded-full border border-white/10 bg-white/4 pl-2 pr-4 py-2 text-left transition hover:bg-white/8 sm:inline-flex"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#6C63FF] to-[#4F9CFF] text-sm font-semibold text-white shadow-[0_14px_32px_rgba(79,156,255,0.22)]">
              {user?.profilePic ? (
                <img src={user.profilePic} alt={user.name} className="h-full w-full rounded-full object-cover" />
              ) : (
                initial
              )}
            </span>
            <span className="text-right">
              <span className="block text-sm font-semibold text-white">{user?.name}</span>
              <span className="block text-xs text-white/45">{user?.email}</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#6C63FF] to-[#4F9CFF] text-sm font-semibold text-white shadow-[0_14px_32px_rgba(79,156,255,0.22)] sm:hidden"
          >
            {initial}
          </button>

          <button type="button" onClick={logout} className="secondary-button inline-flex items-center gap-2 !py-3 !text-white">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
};

export default Topbar;
