import { useState, useEffect } from 'react';
import { Bell, CheckCircle2, Trash2 } from 'lucide-react';
import api from '../../lib/axios';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications?limit=50');
      setNotifications(data.data);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Failed to mark read', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all read', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (error) {
      console.error('Failed to delete', error);
    }
  };

  if (loading) {
    return <div className="p-8">Loading notifications...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-charcoal)]" style={{ fontFamily: 'var(--font-display)' }}>
            Notifications
          </h1>
          <p className="text-[var(--color-stone)]">Stay updated on your properties and payments.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={markAllAsRead}
            className="px-4 py-2 bg-white border border-[var(--color-mist)] rounded-lg text-sm font-medium hover:bg-[var(--color-warm-white)] transition-colors flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-[var(--color-stone)]" />
            Mark all as read
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-[var(--color-mist)] overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-[var(--color-warm-white)] rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-[var(--color-stone-light)]" />
            </div>
            <h3 className="text-lg font-bold text-[var(--color-charcoal)]">You're all caught up!</h3>
            <p className="text-[var(--color-stone)]">No new notifications at this time.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-mist)]">
            {notifications.map((notif) => (
              <div 
                key={notif._id} 
                className={`p-6 flex items-start gap-4 transition-colors ${notif.read ? 'bg-white' : 'bg-[var(--color-champagne)]/5'}`}
              >
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${notif.read ? 'bg-transparent' : 'bg-[var(--color-champagne-dark)]'}`} />
                
                <div className="w-10 h-10 rounded-full bg-[var(--color-warm-white)] border border-[var(--color-mist)] flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4 text-[var(--color-charcoal)]" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h4 className={`text-[15px] truncate ${notif.read ? 'font-medium text-[var(--color-charcoal)]' : 'font-bold text-[var(--color-charcoal)]'}`}>
                      {notif.title}
                    </h4>
                    <span className="text-[11px] text-[var(--color-stone)] whitespace-nowrap">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[13px] text-[var(--color-stone)] mb-3 leading-relaxed">
                    {notif.message}
                  </p>
                  
                  {notif.link && (
                    <a href={notif.link} className="text-[12px] font-bold text-[var(--color-charcoal)] hover:text-[var(--color-champagne-dark)] transition-colors uppercase tracking-widest">
                      View Details →
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2 opacity-0 hover:opacity-100 transition-opacity">
                  {!notif.read && (
                    <button 
                      onClick={() => markAsRead(notif._id)}
                      className="p-2 text-[var(--color-stone)] hover:text-[var(--color-charcoal)] hover:bg-[var(--color-warm-white)] rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={() => deleteNotification(notif._id)}
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
