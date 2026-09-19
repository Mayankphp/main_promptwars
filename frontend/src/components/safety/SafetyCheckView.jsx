import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, PhoneCall, Copy, Check, ExternalLink, RefreshCw, Send, Lock } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { checkSafety } from '../../services/api';

const SCAM_SAMPLES = [
  {
    title: "Electricity Disconnection Threat",
    icon: "⚡",
    text: "Dear consumer your electricity power will be disconnected tonight at 9:30 PM from electricity office because your previous month bill was not updated. Please immediately call our billing officer at 98112-33445 to pay immediately."
  },
  {
    title: "Fake Bank KYC Blocked Alert",
    icon: "🏦",
    text: "SBI CUSTOMER ALERT: Your NetBanking and Debit Card has been BLOCKED today due to expired KYC! Click immediately on http://bit.ly/sbi-kyc-update-now to submit your PAN and verify with 6-digit OTP to avoid total account freeze."
  },
  {
    title: "Lottery / Prize Money Fraud",
    icon: "🎉",
    text: "Congratulations! Your mobile number has won 1st prize of Rs. 25,00,000 in Kaun Banega Crorepati WhatsApp Lucky Draw! To claim your cheque today, deposit advance tax processing fee of Rs. 4,500 to our SBI account."
  },
  {
    title: "Fake Police / CBI Arrest Threat",
    icon: "👮",
    text: "This is automated notice from Telecom Regulatory & Cyber Crime Cell. A warrant for digital arrest is issued against your Aadhaar number for money laundering. Press 9 or call 88990-11223 immediately to speak to police investigator."
  }
];

export default function SafetyCheckView() {
  const { t, language, speakText, stopSpeaking, isSpeaking } = useAccessibility();
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copiedReply, setCopiedReply] = useState(false);
  const [copiedCaregiver, setCopiedCaregiver] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleCheck = async (overrideText = null) => {
    const textToAnalyze = overrideText || inputText;
    if (!textToAnalyze || textToAnalyze.trim().length < 3) {
      setErrorMsg(language === 'hi' ? 'कृपया जांच के लिए कोई संदेश लिखें।' : 'Please enter a message to check.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await checkSafety(textToAnalyze, language);
      if (response.success && response.data) {
        setResult(response.data);
      } else {
        throw new Error(response.error || "Safety check failed.");
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to check safety.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (s) => {
    setInputText(s.text);
    setErrorMsg(null);
    handleCheck(s.text);
  };

  const safeReplyTemplate = language === 'hi'
    ? "मैं किसी भी संदेश के लिंक पर क्लिक नहीं करता। मैं सीधे बैंक शाखा या बिजली कार्यालय जाकर ही सत्यापन करूंगा।"
    : "I do not click links sent via SMS. I will verify directly with the official office or branch in person.";

  const handleCopyReply = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(safeReplyTemplate);
      setCopiedReply(true);
      setTimeout(() => setCopiedReply(false), 2500);
    }
  };

  const handleCopyCaregiver = () => {
    if (navigator.clipboard && result?.caregiver_summary) {
      navigator.clipboard.writeText(result.caregiver_summary);
      setCopiedCaregiver(true);
      setTimeout(() => setCopiedCaregiver(false), 2500);
    }
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* Top Reassurance Hero */}
      <section className="bg-gradient-to-br from-amber-500/10 via-white to-sky-50 rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase mb-3 border border-amber-300">
              <Lock className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'सुरक्षा और धोखाधड़ी रोकथाम केंद्र' : 'Trust & Fraud Prevention Center'}</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
              {t('safetyCardTitle')}
            </h2>
            <p className="text-lg text-slate-700 font-medium max-w-2xl leading-relaxed">
              {language === 'hi'
                ? 'ज्यादातर धोखेबाज़ जल्दबाज़ी, डर, या लालच दिखाकर पैसे ऐंठते हैं। कोई भी फैसला लेने से पहले यहाँ शांत मन से जांचें।'
                : 'Scammers rely on panic, urgency, and secrecy to rush seniors. Paste any suspicious message or caller claim here to check safely.'}
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border-2 border-red-200 shadow-sm max-w-xs text-left">
            <p className="text-xs font-bold text-red-700 uppercase tracking-wide">
              {language === 'hi' ? 'गोल्डन सुरक्षा नियम' : 'Golden Rule for Seniors'}
            </p>
            <p className="text-base font-extrabold text-slate-900 mt-1">
              {language === 'hi'
                ? 'कोई भी बैंक या पुलिस कभी OTP या गुप्त पिन नहीं मांगती।'
                : 'NO bank or police officer will EVER ask for your 6-digit OTP.'}
            </p>
          </div>
        </div>
      </section>

      {/* Input Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm">
        
        {/* Sample chips */}
        <div className="mb-6">
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
            {language === 'hi' ? 'सामान्य धोखेबाज़ी के उदाहरण परखें:' : 'Test common suspicious scenarios:'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SCAM_SAMPLES.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSample(s)}
                className="tactile-btn text-left p-3 rounded-2xl bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 transition flex items-center gap-3"
              >
                <span className="text-2xl">{s.icon}</span>
                <span className="text-sm font-bold text-slate-800">{s.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text Area */}
        <div className="mb-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              language === 'hi'
                ? 'यहाँ कोई भी संदिग्ध एसएमएस, व्हाट्सएप संदेश या फोन करने वाले की बात लिखें...'
                : 'Paste the suspicious SMS, WhatsApp message, email, or caller script here...'
            }
            rows={4}
            className="w-full p-4 sm:p-5 rounded-2xl border-2 border-slate-300 focus:border-amber-500 text-lg font-medium text-slate-900 bg-slate-50 focus:bg-white transition resize-y"
          />
        </div>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <p className="text-xs text-slate-500 font-medium">
            💡 {language === 'hi' ? 'हम आपकी जानकारी किसी के साथ साझा नहीं करते।' : 'Your information is processed safely and never shared.'}
          </p>

          <button
            onClick={() => handleCheck()}
            disabled={isLoading || !inputText.trim()}
            className="tactile-btn w-full sm:w-auto py-4 px-8 rounded-2xl bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white font-extrabold text-lg shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span>{t('checkingSafety')}</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-6 h-6" />
                <span>{language === 'hi' ? 'सुरक्षा की जांच करें' : 'Check This Message'}</span>
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 font-bold">
            {errorMsg}
          </div>
        )}
      </section>

      {/* Safety Analysis Report */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Main Risk Status Box */}
          <section className={`rounded-3xl p-6 sm:p-8 border-4 shadow-md ${
            result.risk_level === 'high_risk' || result.risk_level === 'suspicious'
              ? 'bg-red-50 border-red-500 text-red-950'
              : result.risk_level === 'caution'
              ? 'bg-amber-50 border-amber-500 text-amber-950'
              : 'bg-emerald-50 border-emerald-500 text-emerald-950'
          }`}>
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-14 h-14 rounded-2xl text-white flex items-center justify-center shadow-md flex-shrink-0 ${
                result.risk_level === 'high_risk' || result.risk_level === 'suspicious'
                  ? 'bg-red-600'
                  : result.risk_level === 'caution'
                  ? 'bg-amber-600'
                  : 'bg-emerald-600'
              }`}>
                {result.risk_level === 'high_risk' || result.risk_level === 'suspicious' ? (
                  <AlertTriangle className="w-8 h-8 animate-bounce" />
                ) : (
                  <ShieldCheck className="w-8 h-8" />
                )}
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/80 border border-current">
                  {result.risk_level === 'high_risk' || result.risk_level === 'suspicious'
                    ? t('highRiskTag')
                    : result.risk_level === 'caution'
                    ? t('cautionTag')
                    : t('safeTag')}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black mt-1">
                  {result.risk_level === 'high_risk' || result.risk_level === 'suspicious'
                    ? (language === 'hi' ? 'सावधान! यह धोखाधड़ी का संदेश प्रतीत होता है' : 'High Warning: Potential Scam Detected')
                    : (language === 'hi' ? 'यह संदेश सामान्य प्रतीत होता है' : 'No Immediate High-Risk Signs Detected')}
                </h3>
              </div>
            </div>

            <p className="text-xl font-bold mb-4 leading-relaxed">
              {result.summary}
            </p>

            <div className="p-4 rounded-2xl bg-white/90 border border-current text-lg leading-relaxed mb-6 font-medium">
              {language === 'hi' && result.hindi_explanation ? result.hindi_explanation : result.simple_explanation}
            </div>

            {/* Red Flags List */}
            {result.warnings?.length > 0 && (
              <div className="mb-6 space-y-3">
                <h4 className="text-lg font-black uppercase tracking-wider">
                  ⚠️ {t('safetyWarningTitle')}:
                </h4>
                {result.warnings.map((w, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white border border-red-300">
                    <p className="font-extrabold text-red-900 text-lg">
                      {w.flag}
                    </p>
                    <p className="text-slate-800 text-base font-medium mt-1">
                      {w.why_risky}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Safe Next Steps */}
            <div className="p-5 rounded-2xl bg-white border-2 border-emerald-400">
              <h4 className="text-xl font-extrabold text-emerald-950 mb-3 flex items-center gap-2">
                <span>🛡️</span>
                <span>{language === 'hi' ? 'अब आपको क्या करना चाहिए:' : 'What You Should Do Now:'}</span>
              </h4>
              <ul className="list-disc list-inside space-y-2 text-slate-900 text-lg font-bold">
                {result.safe_next_steps?.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* Safe Actions Toolbox */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Safe Reply Card */}
            <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-sm text-left">
              <h4 className="text-xl font-extrabold text-slate-900 mb-2">
                💬 {language === 'hi' ? 'संदिग्ध संदेश का सुरक्षित जवाब' : 'Safe Reply to Sender'}
              </h4>
              <p className="text-sm text-slate-600 mb-4 font-medium">
                {language === 'hi'
                  ? 'यदि कोई आपको बार-बार फोन या संदेश भेज रहा है, तो यह संदेश कॉपी करके भेज दें:'
                  : 'If someone is pressuring you, copy this safe standard reply:'}
              </p>
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-300 text-slate-800 font-medium italic mb-4">
                "{safeReplyTemplate}"
              </div>
              <button
                onClick={handleCopyReply}
                className="tactile-btn w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center justify-center gap-2 text-base"
              >
                {copiedReply ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                <span>{copiedReply ? (language === 'hi' ? 'कॉपी हो गया!' : 'Copied!') : (language === 'hi' ? 'जवाब कॉपी करें' : 'Copy Safe Reply')}</span>
              </button>
            </div>

            {/* Forward to Caregiver */}
            <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-sm text-left">
              <h4 className="text-xl font-extrabold text-slate-900 mb-2">
                👨‍👩‍👧 {language === 'hi' ? 'परिवार को संदेश भेजें' : 'Consult Family Member'}
              </h4>
              <p className="text-sm text-slate-600 mb-4 font-medium">
                {language === 'hi'
                  ? 'अपने बेटे, बेटी या रिश्तेदार को व्हाट्सएप पर यह विवरण भेजकर उनकी राय लें:'
                  : 'Forward this prepared note to your son, daughter, or caregiver:'}
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-slate-800 font-medium italic mb-4 text-sm">
                "{result.caregiver_summary}"
              </div>
              <button
                onClick={handleCopyCaregiver}
                className="tactile-btn w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-2 text-base"
              >
                {copiedCaregiver ? <Check className="w-5 h-5 text-emerald-300" /> : <Copy className="w-5 h-5" />}
                <span>{copiedCaregiver ? (language === 'hi' ? 'संदेश कॉपी हो गया!' : 'Message Copied!') : (language === 'hi' ? 'व्हाट्सएप संदेश कॉपी करें' : 'Copy Family Note')}</span>
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
