import React from 'react';
import { FileText, ShieldAlert, Bell, HelpCircle, ArrowRight } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

export default function QuickActionCards({ onSelectTab }) {
  const { t } = useAccessibility();

  const cards = [
    {
      id: 'explain',
      title: t('explainCardTitle'),
      subtitle: t('explainCardSub'),
      icon: FileText,
      color: 'bg-sky-600',
      lightBg: 'bg-sky-50',
      borderColor: 'border-sky-200',
      textColor: 'text-sky-900',
      buttonText: 'Explain Simply'
    },
    {
      id: 'safety',
      title: t('safetyCardTitle'),
      subtitle: t('safetyCardSub'),
      icon: ShieldAlert,
      color: 'bg-amber-600',
      lightBg: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-950',
      buttonText: 'Check Safety'
    },
    {
      id: 'reminders',
      title: t('remindersCardTitle'),
      subtitle: t('remindersCardSub'),
      icon: Bell,
      color: 'bg-emerald-600',
      lightBg: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-950',
      buttonText: 'View Dates'
    },
    {
      id: 'tasks',
      title: t('tasksCardTitle'),
      subtitle: t('tasksCardSub'),
      icon: HelpCircle,
      color: 'bg-indigo-600',
      lightBg: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      textColor: 'text-indigo-950',
      buttonText: 'Open Guide'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10 text-left">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <button
            key={card.id}
            onClick={() => onSelectTab(card.id)}
            className={`tactile-btn group text-left p-6 sm:p-7 rounded-3xl bg-white border-2 ${card.borderColor} shadow-sm hover:shadow-md hover:border-sky-400 transition flex flex-col justify-between`}
            aria-label={card.title}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl ${card.color} text-white flex items-center justify-center shadow-md`}>
                  <IconComponent className="w-8 h-8" />
                </div>
                <span className="p-2 rounded-xl bg-slate-100 group-hover:bg-sky-100 text-slate-600 group-hover:text-sky-700 transition">
                  <ArrowRight className="w-5 h-5" />
                </span>
              </div>
              <h3 className={`text-2xl font-extrabold ${card.textColor} mb-2`}>
                {card.title}
              </h3>
              <p className="text-slate-600 font-medium text-base leading-relaxed">
                {card.subtitle}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-sky-700 font-bold text-base">
              <span>{card.buttonText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        );
      })}
    </div>
  );
}
