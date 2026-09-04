import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Trash2, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { Notification } from '../../types';
import { api } from '../../services/api';

export const NotificationsView: React.FC<{
  onSelectAction?: (targetType?: string, targetId?: string) => void;
}> = ({ onSelectAction }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = () => {
    api.getNotifications().then((n) => setNotifications(n));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    await api.markNotificationAsRead(id);
    fetchNotifications();
  };

  const handleMarkAllRead = async () => {
    await api.markAllNotificationsAsRead();
    fetchNotifications();
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-indigo-600" />
          <div>
            <h1 className="text-base font-bold text-slate-900">Notifications &amp; Alerts Dispatch</h1>
            <p className="text-xs text-slate-500">
              Real-time dispatches for assigned field audits, biometric anomalies, and compliance flags.
            </p>
          </div>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 transition"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Mark All Read</span>
        </button>
      </div>

      <div className="space-y-2.5">
        {notifications.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
            No notifications in your inbox.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border transition flex items-start justify-between gap-3 text-xs ${
                n.isRead ? 'bg-white border-slate-200' : 'bg-indigo-50/40 border-indigo-200 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {n.type === 'ALERT' ? (
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                  ) : n.type === 'INSPECTION' ? (
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  ) : (
                    <Info className="w-4 h-4 text-slate-500" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>{n.title}</span>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />
                    )}
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">{n.message}</p>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {n.targetId && onSelectAction && (
                  <button
                    onClick={() => onSelectAction(n.targetType, n.targetId)}
                    className="px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs"
                  >
                    View
                  </button>
                )}
                {!n.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    className="p-1 rounded text-slate-400 hover:text-slate-700"
                    title="Mark Read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
