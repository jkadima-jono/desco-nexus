"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "./I18nProvider";
import { sharedCopy } from "@/lib/translations/shared";

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
  const { locale } = useI18n();
  const copy = sharedCopy(locale);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closeAndRestoreFocus = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

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
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAndRestoreFocus();
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [closeAndRestoreFocus, open]);

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
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-label={unreadCount > 0 ? unreadCount + " " + copy.unreadNotifications : copy.notifications}
        aria-expanded={open}
        aria-controls="notification-panel"
        className="relative flex min-h-11 min-w-11 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
      >
        <span aria-hidden="true">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-brandred text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div
          id="notification-panel"
          role="region"
          aria-label={copy.notifications}
          className="fixed inset-x-4 bottom-20 z-[60] max-h-[60vh] overflow-y-auto rounded-2xl border border-charcoal/10 bg-white text-charcoal shadow-2xl lg:absolute lg:inset-x-auto lg:bottom-full lg:right-0 lg:mb-2 lg:w-80 lg:max-h-96"
        >
          <div className="flex items-center justify-between border-b border-charcoal/10 px-4 py-2">
            <span className="text-xs font-bold uppercase tracking-wider text-wgray">{copy.notifications}</span>
            <button type="button" onClick={closeAndRestoreFocus} className="min-h-11 min-w-11 rounded-lg text-xl" aria-label={copy.closeNotifications}>×</button>
          </div>
          {notifications.length === 0 ? (
            <div className="px-4 py-6 text-sm text-wgray text-center">{copy.nothingYet}</div>
          ) : (
            notifications.map((n) => {
              const content = (
                <div className="px-4 py-3 border-b border-charcoal/5 last:border-0 hover:bg-mist">
                  <div className="text-sm font-semibold">{n.title}</div>
                  <div className="text-xs text-wgray mt-0.5">{n.body}</div>
                  <div className="mt-1 text-xs text-wgray">
                    {new Date(n.createdAt).toLocaleString(locale, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
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
