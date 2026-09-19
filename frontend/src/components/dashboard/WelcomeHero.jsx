import React from 'react';
import { ShieldCheck, HeartHandshake, PhoneCall } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

export default function WelcomeHero({ onSelectAction }) {
  const { t, language } = useAccessibility();

  return (
    <section className="bg-gradient-to-b from-sky-50 to-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm text-left mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold mb-3 border border-emerald-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>{language === 'hi' ? 'सुरक्षित और सक्रिय' : 'Protected & Active'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            {t('greeting')}
          </h1>
          <p className="text-xl text-slate-700 font-medium max-w-2xl leading-relaxed">
            {t('greetingSub')}
          </p>
        </div>

        {/* Reassurance helpline chip */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm max-w-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {language === 'hi' ? 'सहायता हेल्पलाइन' : 'Official Helplines'}
              </p>
              <p className="text-sm font-extrabold text-slate-900">
                1930 (Cyber Fraud) • 1912 (Power)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
