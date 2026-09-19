import React, { useState } from 'react';
import { Volume2, VolumeX, CheckCircle, AlertTriangle, ShieldCheck, Copy, Check, BookOpen, Clock, Calendar, ArrowRight, Share2 } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import ProactivePrompt from './ProactivePrompt';

export default function ExplainerResult({
  result,
  onAcceptReminder,
  onShowConsequences,
  onShareCaregiver
}) {
  const { t, language, speakText, stopSpeaking, isSpeaking } = useAccessibility();
  const [copied, setCopied] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState({});

  if (!result) return null;

  const toggleStep = (stepNumber) => {
    setCheckedSteps(prev => ({
      ...prev,
      [stepNumber]: !prev[stepNumber]
    }));
  };

  const handleCopyCaregiver = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(result.caregiver_summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleListen = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const readContent = language === 'hi' && result.hindi_explanation
        ? `${result.summary}. ${result.hindi_explanation}`
        : `${result.summary}. ${result.simple_explanation}`;
      speakText(readContent);
    }
  };

  // Determine risk badge styling
  const isHighRisk = result.risk_level === 'high_risk' || result.risk_level === 'suspicious';
  const isCaution = result.risk_level === 'caution';

  return (
    <div className="space-y-8 animate-fade-in text-left">
      
      {/* Top Banner: Risk Level + Voice Listen Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border-2 border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          {isHighRisk ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-100 text-red-800 border-2 border-red-400 font-extrabold text-sm">
              <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" />
              <span>{t('highRiskTag')}</span>
            </div>
          ) : isCaution ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 text-amber-900 border-2 border-amber-400 font-extrabold text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
              <span>{t('cautionTag')}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-100 text-emerald-900 border-2 border-emerald-400 font-extrabold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>{t('safeTag')}</span>
            </div>
          )}

          {result.is_fallback && (
            <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-bold">
              Protected Local Mode
            </span>
          )}
        </div>

        {/* Read Aloud Button */}
        <button
          onClick={handleListen}
          className={`tactile-btn flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-extrabold text-base transition shadow-sm ${
            isSpeaking
              ? 'bg-red-600 text-white'
              : 'bg-sky-100 text-sky-900 hover:bg-sky-200 border border-sky-300'
          }`}
          aria-label={isSpeaking ? t('stopAudio') : t('readAloud')}
        >
          {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-sky-700" />}
          <span>{isSpeaking ? t('stopAudio') : t('readAloud')}</span>
        </button>
      </div>

      {/* Proactive Suggestion Widget (Anticipates user need) */}
      {result.proactive_prompt && (
        <ProactivePrompt
          suggestion={result.proactive_prompt}
          onAcceptReminder={onAcceptReminder}
          onShowConsequences={onShowConsequences}
          onShareCaregiver={onShareCaregiver}
        />
      )}

      {/* Main Plain-Language Explanation Card */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-sky-800 uppercase tracking-wider mb-2">
          {language === 'hi' ? 'सरल सारांश' : 'In Simple Words'}
        </h3>
        
        <p className="text-2xl font-extrabold text-slate-900 mb-4 leading-snug">
          {result.summary}
        </p>

        <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200 mb-6 text-slate-800 text-lg sm:text-xl leading-relaxed">
          {language === 'hi' && result.hindi_explanation ? (
            <p className="font-medium text-slate-900">
              {result.hindi_explanation}
            </p>
          ) : (
            <p className="font-medium">
              {result.simple_explanation}
            </p>
          )}
        </div>

        {/* Extracted Details Pill Grid (Dates, Amounts) */}
        {(result.dates?.length > 0 || result.amounts?.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            {result.dates?.map((d, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">
                    {d.title || "Important Date"}
                  </p>
                  <p className="text-lg font-black text-slate-900">
                    {d.date_str}
                  </p>
                  {d.days_remaining !== undefined && (
                    <span className="text-xs font-bold text-sky-700">
                      ({t('dueIn')} {d.days_remaining} {language === 'hi' ? 'दिन' : 'days'})
                    </span>
                  )}
                </div>
              </div>
            ))}

            {result.amounts?.map((amt, i) => (
              <div key={i} className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 text-xl font-bold">
                  ₹
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-700 uppercase">
                    {language === 'hi' ? 'कुल राशि' : 'Amount Specified'}
                  </p>
                  <p className="text-xl font-black text-emerald-950">
                    {amt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Action Checklist: What to do step by step */}
      {result.actions?.length > 0 && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm">
          <h3 className="text-2xl font-extrabold text-slate-900 mb-2 flex items-center gap-2">
            <span>✅</span>
            <span>{t('actionChecklistTitle')}</span>
          </h3>
          <p className="text-slate-600 text-base font-medium mb-6">
            {language === 'hi'
              ? 'इन सरल चरणों का एक-एक करके पालन करें। पूरा होने पर टिक लगाएं।'
              : 'Follow these steps one by one. Check them off as you complete each task.'}
          </p>

          <div className="space-y-4">
            {result.actions.map((act) => {
              const isChecked = checkedSteps[act.step_number];
              return (
                <div
                  key={act.step_number}
                  onClick={() => toggleStep(act.step_number)}
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition cursor-pointer flex items-start gap-4 ${
                    isChecked
                      ? 'bg-emerald-50/70 border-emerald-400 opacity-80'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                  role="checkbox"
                  aria-checked={isChecked}
                  tabIndex={0}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-base flex-shrink-0 mt-0.5 ${
                    isChecked
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {isChecked ? '✓' : act.step_number}
                  </div>

                  <div className="flex-1">
                    <p className={`text-lg font-bold ${isChecked ? 'line-through text-slate-600' : 'text-slate-900'}`}>
                      {act.instruction}
                    </p>
                    {act.caution && (
                      <p className="text-sm font-semibold text-amber-800 bg-amber-100/70 px-3 py-1.5 rounded-xl mt-2 border border-amber-200 inline-block">
                        ⚠️ {act.caution}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Difficult Words Explained Simply */}
      {result.difficult_words?.length > 0 && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {t('difficultWordsTitle')}
              </h3>
              <p className="text-sm text-slate-600">
                {language === 'hi' ? 'बिना किसी उलझन के आसान परिभाषाएं' : 'Plain explanations with no technical jargon'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.difficult_words.map((w, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200">
                <h4 className="text-lg font-black text-amber-950 mb-1">
                  📌 {w.word}
                </h4>
                <p className="text-base text-slate-800 font-medium">
                  {language === 'hi' && w.hindi_meaning ? w.hindi_meaning : w.simple_meaning}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Safety Warning Box (if warning signs detected) */}
      {result.warnings?.length > 0 && (
        <section className="bg-red-50 rounded-3xl p-6 sm:p-8 border-2 border-red-300 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-red-950">
                {t('safetyWarningTitle')}
              </h3>
              <p className="text-sm text-red-800 font-medium">
                {language === 'hi' ? 'सावधानी बरतें और इन बातों का ध्यान रखें' : 'Why this message requires your careful attention'}
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {result.warnings.map((w, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white border border-red-200">
                <p className="font-extrabold text-red-900 text-lg mb-1">
                  ⚠️ {w.flag}
                </p>
                <p className="text-base text-slate-700 font-medium">
                  {w.why_risky}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-white border-2 border-emerald-300">
            <h4 className="text-base font-extrabold text-emerald-900 mb-2">
              🛡️ {t('safeStepsTitle')}
            </h4>
            <ul className="list-disc list-inside space-y-1.5 text-slate-800 text-base font-medium">
              {result.safe_next_steps.map((st, i) => (
                <li key={i}>{st}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Caregiver Share Summary Card */}
      <section className="bg-slate-100 rounded-3xl p-6 sm:p-7 border border-slate-300 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xl font-extrabold text-slate-900">
                {language === 'hi' ? 'बेटे या बेटी से सलाह लें' : 'Show to a Family Member / Caregiver'}
              </h4>
              <p className="text-xs text-slate-600 font-medium">
                {language === 'hi'
                  ? 'यह तैयार संदेश अपने परिवार को व्हाट्सएप पर भेजकर सलाह ले सकते हैं'
                  : 'Copy this ready summary to WhatsApp your son, daughter, or trusted friend'}
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyCaregiver}
            className="tactile-btn flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? (language === 'hi' ? 'कॉपी हो गया!' : 'Copied!') : (language === 'hi' ? 'संदेश कॉपी करें' : 'Copy Message')}</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-800 text-base font-medium italic">
          "{result.caregiver_summary}"
        </div>
      </section>

    </div>
  );
}
