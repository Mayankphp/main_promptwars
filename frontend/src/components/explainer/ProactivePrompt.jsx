import React from 'react';
import { Bell, AlertCircle, HelpCircle, Share2, Check } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

export default function ProactivePrompt({
  suggestion,
  onAcceptReminder,
  onShowConsequences,
  onShareCaregiver
}) {
  const { t, language } = useAccessibility();

  if (!suggestion) return null;

  return (
    <div className="bg-gradient-to-r from-sky-50 to-indigo-50 rounded-3xl p-6 sm:p-7 border-2 border-sky-300 shadow-md text-left mb-8 animate-fade-in">
      
      {/* Header with glowing badge */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
          <Bell className="w-7 h-7 animate-bounce" />
        </div>
        <div>
          <span className="px-3 py-0.5 rounded-full bg-sky-200 text-sky-900 text-xs font-black uppercase tracking-wider">
            {language === 'hi' ? 'महत्वपूर्ण सुझाव' : 'Proactive Suggestion'}
          </span>
          <h4 className="text-2xl font-extrabold text-slate-900 mt-0.5">
            {suggestion.title}
          </h4>
        </div>
      </div>

      <p className="text-lg text-slate-700 font-medium mb-6 leading-relaxed">
        {suggestion.description}
      </p>

      {/* Proactive Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {suggestion.suggested_action === 'set_reminder' && (
          <button
            onClick={() => onAcceptReminder(suggestion.action_payload)}
            className="tactile-btn py-3.5 px-6 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-base shadow-md shadow-sky-600/30 flex items-center gap-2"
          >
            <Bell className="w-5 h-5" />
            <span>{t('setReminderBtn')}</span>
          </button>
        )}

        <button
          onClick={onShowConsequences}
          className="tactile-btn py-3.5 px-5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-base border-2 border-slate-300 shadow-sm flex items-center gap-2"
        >
          <HelpCircle className="w-5 h-5 text-amber-600" />
          <span>{t('consequencesBtn')}</span>
        </button>

        <button
          onClick={onShareCaregiver}
          className="tactile-btn py-3.5 px-5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-base border-2 border-slate-300 shadow-sm flex items-center gap-2"
        >
          <Share2 className="w-5 h-5 text-indigo-600" />
          <span>{t('shareCaregiverBtn')}</span>
        </button>
      </div>

    </div>
  );
}
