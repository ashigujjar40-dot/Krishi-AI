import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Bell,
  Clock,
  Send,
  ExternalLink,
  ChevronRight,
  X,
  AlertTriangle,
  Lock,
  Smartphone,
  CloudSun,
  Package,
  Sprout
} from 'lucide-react';
import { WhatsAppPreferences, WhatsAppNotification, LanguageCode } from '../types.ts';

interface WhatsAppNotificationCenterProps {
  userPhone: string;
  language: LanguageCode;
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppNotificationCenter: React.FC<WhatsAppNotificationCenterProps> = ({
  userPhone,
  language,
  isOpen,
  onClose
}) => {
  const [prefs, setPrefs] = useState<WhatsAppPreferences>({
    enabled: true,
    whatsappPhone: userPhone || '9876543210',
    orderUpdates: true,
    weatherAlerts: true,
    followUpReminders: true,
    consentedAt: new Date().toISOString()
  });

  const [notifications, setNotifications] = useState<WhatsAppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testSending, setTestSending] = useState(false);
  const [testSuccessMessage, setTestSuccessMessage] = useState<string | null>(null);
  const [activeMessageDetail, setActiveMessageDetail] = useState<WhatsAppNotification | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchPreferences();
      fetchNotifications();
    }
  }, [isOpen, userPhone]);

  const fetchPreferences = async () => {
    try {
      const res = await fetch(`/api/whatsapp/preferences?phone=${userPhone}`);
      const data = await res.json();
      if (data) setPrefs(data);
    } catch (err) {
      console.warn('Failed to load WhatsApp preferences:', err);
    }
  };

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/whatsapp/notifications?phone=${userPhone}`);
      const data = await res.json();
      if (Array.isArray(data)) setNotifications(data);
    } catch (err) {
      console.warn('Failed to load notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePreference = async (key: keyof WhatsAppPreferences, value: any) => {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    setIsSaving(true);
    try {
      await fetch('/api/whatsapp/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: userPhone, ...updated })
      });
    } catch (err) {
      console.error('Failed to save preferences:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendTestMessage = async () => {
    setTestSending(true);
    setTestSuccessMessage(null);
    try {
      const res = await fetch('/api/whatsapp/send-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: prefs.whatsappPhone,
          customNote: 'Verified from Krishi Saathi mobile settings.'
        })
      });
      const data = await res.json();
      if (data.success) {
        setTestSuccessMessage(`WhatsApp message dispatched to +91 ${prefs.whatsappPhone}!`);
        fetchNotifications();
      } else {
        setTestSuccessMessage(data.skippedReason || 'Delivery skipped per privacy settings.');
      }
    } catch (err) {
      console.error('Test message error:', err);
      setTestSuccessMessage('Error triggering test alert.');
    } finally {
      setTestSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom">
        {/* Modal Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-emerald-900 text-white rounded-t-3xl">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700/80 flex items-center justify-center text-white shadow-xs">
              <MessageSquare className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-base font-extrabold flex items-center gap-1.5 leading-tight">
                <span>WhatsApp Alerts</span>
                <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded-full font-semibold text-emerald-100">
                  Twilio / MSG91
                </span>
              </h3>
              <p className="text-[11px] text-emerald-200">
                Timely farm advisories & live order tracking
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Privacy & Opt-in Consent Card */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span className="font-bold text-stone-900">WhatsApp Opt-In & Privacy</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefs.enabled}
                  onChange={(e) => handleTogglePreference('enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <p className="text-[11px] text-stone-600 leading-relaxed">
              We respect your privacy. Zero marketing spam. Notifications are strictly encrypted and limited to orders you place and urgent agricultural warnings. You can pause anytime.
            </p>

            {/* WhatsApp Phone Input */}
            <div className="pt-2 border-t border-stone-200">
              <label className="text-[10px] uppercase font-bold text-stone-500 block mb-1">
                WhatsApp Phone Number
              </label>
              <div className="flex items-center bg-white border border-stone-200 rounded-xl px-2.5 py-1.5">
                <span className="font-bold text-stone-500 mr-2">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={prefs.whatsappPhone}
                  onChange={(e) => handleTogglePreference('whatsappPhone', e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-transparent outline-none font-bold text-stone-900 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Granular Notification Channels */}
          <div className="bg-white border border-stone-200 rounded-2xl p-3.5 space-y-3 shadow-xs">
            <span className="text-[11px] font-bold text-stone-800 uppercase tracking-wide block">
              Notification Preferences
            </span>

            {/* Channel 1: Order Updates */}
            <div className="flex items-start justify-between gap-2 pt-1">
              <div className="flex items-start space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-stone-900 leading-snug">Order Status Tracking</h5>
                  <p className="text-[11px] text-stone-500">
                    Get alerted when dealer accepts, packs, and delivers your inputs.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                disabled={!prefs.enabled}
                checked={prefs.orderUpdates && prefs.enabled}
                onChange={(e) => handleTogglePreference('orderUpdates', e.target.checked)}
                className="mt-1 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
            </div>

            {/* Channel 2: Weather & Spray Advisories */}
            <div className="flex items-start justify-between gap-2 pt-2 border-t border-stone-100">
              <div className="flex items-start space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 mt-0.5">
                  <CloudSun className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-stone-900 leading-snug">Weather & Spray Windows</h5>
                  <p className="text-[11px] text-stone-500">
                    Receive safe morning/evening spray alerts based on wind and rain radar.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                disabled={!prefs.enabled}
                checked={prefs.weatherAlerts && prefs.enabled}
                onChange={(e) => handleTogglePreference('weatherAlerts', e.target.checked)}
                className="mt-1 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
            </div>

            {/* Channel 3: Follow-up Reminders */}
            <div className="flex items-start justify-between gap-2 pt-2 border-t border-stone-100">
              <div className="flex items-start space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Sprout className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-stone-900 leading-snug">Crop Health Follow-ups</h5>
                  <p className="text-[11px] text-stone-500">
                    Day 3 and Day 7 check-in reminders after plant problem diagnosis.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                disabled={!prefs.enabled}
                checked={prefs.followUpReminders && prefs.enabled}
                onChange={(e) => handleTogglePreference('followUpReminders', e.target.checked)}
                className="mt-1 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
            </div>
          </div>

          {/* Test & Verification Action */}
          <div className="space-y-2">
            <button
              onClick={handleSendTestMessage}
              disabled={testSending || !prefs.enabled}
              className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-200 disabled:text-stone-400 text-white font-bold py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{testSending ? 'Dispatched WhatsApp Alert...' : 'Send Test WhatsApp Alert'}</span>
            </button>

            {testSuccessMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-2.5 rounded-xl text-[11px] flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{testSuccessMessage}</span>
              </div>
            )}
          </div>

          {/* WhatsApp Sent Messages Log */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-stone-500" />
                <span>WhatsApp Notification History</span>
              </h4>
              <span className="text-[10px] text-stone-400">
                {notifications.length} message(s)
              </span>
            </div>

            {notifications.length === 0 ? (
              <p className="text-center text-stone-400 py-4 text-[11px]">
                No WhatsApp alerts recorded yet. Place an order or click "Send Test WhatsApp Alert".
              </p>
            ) : (
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => setActiveMessageDetail(n)}
                    className="border border-stone-200 bg-white rounded-xl p-3 hover:border-emerald-400 transition-all cursor-pointer space-y-1.5 shadow-2xs"
                  >
                    <div className="flex items-start justify-between">
                      <h5 className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate max-w-[220px]">{n.title}</span>
                      </h5>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        n.status === 'delivered' || n.status === 'sent'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-100 text-stone-600'
                      }`}>
                        {n.status}
                      </span>
                    </div>

                    <p className="text-stone-600 text-[11px] line-clamp-2 font-sans">
                      {n.body.replace(/\*/g, '')}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1 border-t border-stone-100">
                      <span>
                        {new Date(n.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(n.sentAt).toLocaleDateString()}
                      </span>
                      <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                        <span>View message</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message Detail Modal / Drawer */}
        {activeMessageDetail && (
          <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4 backdrop-blur-2xs">
            <div className="bg-white w-full max-w-sm rounded-3xl p-5 space-y-3 shadow-2xl animate-in zoom-in-95 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="font-bold text-stone-900">{activeMessageDetail.title}</h4>
                </div>
                <button
                  onClick={() => setActiveMessageDetail(null)}
                  className="p-1 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Formatted WhatsApp Chat Bubble Preview */}
              <div className="bg-[#EFEAE2] p-3 rounded-2xl border border-stone-200/80 font-sans shadow-inner">
                <div className="bg-white rounded-xl p-3 shadow-xs space-y-2 border border-stone-100">
                  <div className="whitespace-pre-line text-stone-800 text-xs leading-relaxed">
                    {activeMessageDetail.body}
                  </div>
                  <div className="text-right text-[9px] text-stone-400 font-mono">
                    {new Date(activeMessageDetail.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-2">
                {activeMessageDetail.whatsappLink && (
                  <a
                    href={activeMessageDetail.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 text-center text-xs shadow-xs"
                  >
                    <span>Open in WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={() => setActiveMessageDetail(null)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
