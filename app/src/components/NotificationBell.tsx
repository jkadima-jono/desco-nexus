"use client";

import { useEffect, useRef, useState } from "react";

type Notification = {
  id: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  read: boolean;
  createdAt: string;
};

const POLL_MS = 30_000;

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    const res = await fetch("/api/notifications");
    if (!res.ok) return;
    const data = await res.json();
    setNotifications(data.notifications ?? []);
    setUnreadCount(data.unreadCount ?? 0);
  };

  useEffect(() => {
    load();
    const id = setInterval(load, POLL_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (next && unreadCount > 0) {
      setUnreadCount(0);
      await fetch("/api/notifications", { method: "PATCH" });
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-label={unreadCount > 0 ? unreadCount + " unread notifications" : "Notifications"}
        aria-expanded={open}
        className="relative w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white"
      >
        <span aria-hidden="true">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-brandred text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute bottom-full left-0 mb-2 w-80 max-h-96 overflow-y-auto bg-white text-charcoal rounded-2xl shadow-2xl border border-charcoal/10 z-50">
          <div className="px-4 py-3 border-b border-charcoal/10 text-xs font-bold uppercase tracking-wider text-wgray">
            Notifications
          </div>
          {notifications.length === 0 ? (
            <div className="px-4 py-6 text-sm text-wgray text-center">Nothing yet.</div>
          ) : (
            notifications.map((n) => {
              const content = (
                <div className="px-4 py-3 border-b border-charcoal/5 last:border-0 hover:bg-mist">
                  <div className="text-sm font-semibold">{n.title}</div>
                  <div className="text-xs text-wgray mt-0.5">{n.body}</div>
                  <div className="text-[10px] text-wgray/70 mt-1">
                    {new Date(n.createdAt).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              );
              return n.link ? (
                <a key={n.id} href={n.link} onClick={() => setOpen(false)} className="block">
                  {content}
                </a>
              ) : (
                <div key={n.id}>{content}</div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
