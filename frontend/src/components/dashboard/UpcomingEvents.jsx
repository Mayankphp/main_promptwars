import React from 'react';
import { Calendar, CheckCircle, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

export default function UpcomingEvents({
  reminders,
  onToggleReminder,
  onViewRemindersTab,
  onOpenExplainTab
}) {
  const { t, language } = useAccessibility();

  // Active (uncompleted) reminders
  const activeReminders = reminders.filter(r => !r.is_completed);

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm text-left">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>🔔</span>
            <span>{language === 'hi' ? 'आपके लिए ज़रूरी सूचनाएं' : 'Important for You'}</span>
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            {language === 'hi'
              ? 'आगामी अंतिम तिथियां और डॉक्टर से मिलने का समय'
              : 'Upcoming deadlines and scheduled appointments'}
          </p>
        </div>

        <button
          onClick={onViewRemindersTab}
          className="tactile-btn text-sm font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1"
        >
          <span>{language === 'hi' ? 'सभी देखें' : 'View All'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {activeReminders.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-50 text-center border border-dashed border-slate-300">
          <p className="text-lg font-bold text-slate-700">
            {language === 'hi' ? 'सब कुछ ठीक है! कोई लंबित कार्य नहीं है।' : 'All caught up! No pending deadlines right now.'}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {language === 'hi'
              ? 'जब आप किसी बिल या पत्र को समझेंगे, तो वह यहाँ अपने आप जुड़ सकता है।'
              : 'When you explain a bill or notice, deadlines can be added here with 1-click.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeReminders.slice(0, 4).map((item) => {
            const isUrgent = item.is_urgent || item.days_remaining <= 2;
            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-2xl border-2 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isUrgent
                    ? 'bg-amber-50/70 border-amber-300'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">
                    {item.category === 'bill' ? '⚡' : item.category === 'medical' ? '🩺' : '📅'}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="text-lg font-extrabold text-slate-900">
                        {item.title}
                      </h4>
                      {item.amount && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-300">
                          {item.amount}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                      <span className="flex items-center gap-1 font-bold text-sky-800">
                        <Clock className="w-4 h-4" />
                        {item.due_date_formatted}
                      </span>
                      <span>•</span>
                      <span className={isUrgent ? 'font-black text-amber-700' : 'text-slate-500'}>
                        {item.days_remaining === 0
                          ? (language === 'hi' ? 'आज अंतिम दिन' : 'Due Today!')
                          : item.days_remaining === 1
                          ? (language === 'hi' ? 'कल' : 'Tomorrow')
                          : `${language === 'hi' ? 'बचे हैं' : 'Due in'} ${item.days_remaining} ${language === 'hi' ? 'दिन' : 'days'}`}
                      </span>
                    </div>
                    {item.notes && (
                      <p className="text-xs text-slate-500 mt-1 max-w-xl">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => onToggleReminder(item.id)}
                    className="tactile-btn flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 font-bold border-2 border-emerald-300 shadow-sm text-sm"
                    aria-label={`Mark ${item.title} as completed`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{language === 'hi' ? 'हो गया' : 'Mark Done'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
