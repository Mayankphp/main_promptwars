import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Upload, FileText, Send, Sparkles, AlertCircle, RefreshCw, X } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { analyzeContent, uploadDocumentFile, createReminder } from '../../services/api';
import ExplainerResult from './ExplainerResult';
import ConfirmationModal from '../common/ConfirmationModal';

export default function ExplainerView({
  samples,
  preloadedText,
  onReminderCreated,
  onNavigateToReminders
}) {
  const { t, language } = useAccessibility();
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingReminderPayload, setPendingReminderPayload] = useState(null);
  const [showConsequencesModal, setShowConsequencesModal] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition if supported in browser
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  // Load preloaded text if passed from outside
  useEffect(() => {
    if (preloadedText) {
      setInputText(preloadedText);
      handleAnalyze(preloadedText);
    }
  }, [preloadedText]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser. Please use keyboard or sample buttons.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setErrorMessage(null);
      const res = await uploadDocumentFile(file);
      if (res.success && res.data.text) {
        setInputText(res.data.text);
        // Automatically analyze uploaded document
        await handleAnalyze(res.data.text);
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to read file.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async (overrideText = null) => {
    const textToProcess = overrideText || inputText;
    if (!textToProcess || textToProcess.trim().length < 3) {
      setErrorMessage(language === 'hi' ? 'कृपया पहले कुछ शब्द या संदेश लिखें।' : 'Please enter or paste a message first.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await analyzeContent(textToProcess, language, 'Explainer & Simplification');
      if (response.success && response.data) {
        setAnalysisResult(response.data);
      } else {
        throw new Error(response.error || "Analysis failed.");
      }
    } catch (err) {
      setErrorMessage(
        err.message || (language === 'hi' ? 'विश्लेषण में समस्या आई। पुनः प्रयास करें।' : 'An error occurred while analyzing. Please try again.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (sample) => {
    setInputText(sample.content);
    setErrorMessage(null);
    handleAnalyze(sample.content);
  };

  const handleClear = () => {
    setInputText('');
    setAnalysisResult(null);
    setErrorMessage(null);
  };

  // Reminder creation workflow with explicit confirmation
  const handleInitiateReminder = (payload) => {
    if (!payload) return;
    setPendingReminderPayload(payload);
    setShowConfirmModal(true);
  };

  const handleConfirmReminder = async () => {
    if (!pendingReminderPayload) return;
    try {
      await createReminder({
        title: pendingReminderPayload.title || "Bill or Event Reminder",
        due_date: pendingReminderPayload.due_date || "2026-09-25",
        due_date_formatted: pendingReminderPayload.due_date_formatted || "25 September 2026",
        category: pendingReminderPayload.category || "bill",
        amount: pendingReminderPayload.amount || null,
        notes: `Extracted from Sahayak analysis.`
      });

      setShowConfirmModal(false);
      setPendingReminderPayload(null);
      if (onReminderCreated) onReminderCreated();
      // Navigate to reminders or show toast
      alert(language === 'hi' ? "✓ याददाश्त (Reminder) सफलतापूर्वक सुरक्षित हो गई!" : "✓ Reminder successfully set! You can see it on your home dashboard.");
    } catch (err) {
      alert("Could not save reminder: " + err.message);
    }
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* Top Introduction */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <span>📄</span>
              <span>{t('explainCardTitle')}</span>
            </h2>
            <p className="text-lg text-slate-600 font-medium mt-1">
              {language === 'hi'
                ? 'कोई भी कठिन संदेश, बिजली का बिल, या बैंक सूचना यहाँ चिपकाएं या बोलें।'
                : 'Paste, speak, or upload any confusing letter, utility bill, or bank alert.'}
            </p>
          </div>

          {/* 1-Click Clear Button */}
          {inputText && (
            <button
              onClick={handleClear}
              className="tactile-btn self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center gap-1.5"
            >
              <X className="w-4 h-4" />
              <span>{t('clear')}</span>
            </button>
          )}
        </div>

        {/* 1-Click Realistic Samples Selector */}
        {samples && samples.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
              {t('sampleChipsTitle')}
            </p>
            <div className="flex flex-wrap gap-2">
              {samples.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className="tactile-btn text-left px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-sky-100 hover:text-sky-900 text-slate-800 text-sm font-bold border border-slate-300 transition flex items-center gap-2"
                >
                  <span>{sample.icon === 'zap' ? '⚡' : sample.icon === 'shield-alert' ? '🚨' : sample.icon === 'heart-pulse' ? '🩺' : '📜'}</span>
                  <span>{sample.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Text Area with Large Readable Font */}
        <div className="relative mb-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              language === 'hi'
                ? 'यहाँ संदेश चिपकाएं... उदाहरण: "बिजली का बिल ₹2,840 भरने की अंतिम तिथि 25 सितंबर है..."'
                : 'Paste notice text here... (e.g. "Dear customer, your electricity bill of ₹2,840 is due on 25 September...")'
            }
            rows={5}
            className="w-full p-4 sm:p-5 rounded-2xl border-2 border-slate-300 focus:border-sky-500 text-lg font-medium text-slate-900 bg-slate-50 focus:bg-white transition resize-y"
            aria-label="Content to explain"
          />

          {/* Character counter */}
          <div className="flex justify-between items-center px-1 text-xs text-slate-600 font-semibold mt-1">
            <span>{inputText.length} / 15,000 characters</span>
            <span className="text-emerald-700 font-bold">🔒 Private & Secure (No passwords stored)</span>
          </div>
        </div>

        {/* Action Toolbar: Voice Mic, File Upload, Big Submit CTA */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            {/* Mic Dictation */}
            <button
              onClick={toggleVoiceInput}
              className={`tactile-btn flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm sm:text-base border-2 transition ${
                isListening
                  ? 'bg-red-500 text-white border-red-600 mic-listening'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              }`}
              title="Speak your question or message"
            >
              {isListening ? <MicOff className="w-5 h-5 animate-spin" /> : <Mic className="w-5 h-5 text-sky-700" />}
              <span>{isListening ? t('listening') : t('speakMic')}</span>
            </button>

            {/* Document Upload */}
            <label className="tactile-btn cursor-pointer flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm sm:text-base bg-slate-100 hover:bg-slate-200 text-slate-800 border-2 border-slate-300 transition">
              <Upload className="w-5 h-5 text-indigo-700" />
              <span>{language === 'hi' ? 'फ़ाइल अपलोड' : 'Upload File'}</span>
              <input
                type="file"
                accept=".txt,.pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Big Primary CTA */}
          <button
            onClick={() => handleAnalyze()}
            disabled={isLoading || !inputText.trim()}
            className="tactile-btn py-4 px-8 rounded-2xl bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white font-extrabold text-lg shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2.5 transition"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span>{t('analyzing')}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                <span>{t('analyzeBtn')}</span>
              </>
            )}
          </button>
        </div>

        {/* Error Alert if any */}
        {errorMessage && (
          <div className="mt-4 p-4 rounded-2xl bg-red-50 border-2 border-red-300 text-red-900 font-bold flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </section>

      {/* Analysis Result Output */}
      {analysisResult && (
        <ExplainerResult
          result={analysisResult}
          onAcceptReminder={handleInitiateReminder}
          onShowConsequences={() => setShowConsequencesModal(true)}
          onShareCaregiver={() => {
            if (analysisResult.caregiver_summary) {
              navigator.clipboard?.writeText(analysisResult.caregiver_summary);
              alert(language === 'hi' ? "संदेश कॉपी हो गया! अब आप इसे व्हाट्सएप पर भेज सकते हैं।" : "Summary copied! You can now paste it into WhatsApp to send to your family.");
            }
          }}
        />
      )}

      {/* Confirmation Modal for Creating Reminders */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        title={language === 'hi' ? 'क्या आप यह याददाश्त (Reminder) जोड़ना चाहते हैं?' : 'Would you like to save this reminder?'}
        message={
          pendingReminderPayload
            ? `${pendingReminderPayload.title} - ${language === 'hi' ? 'अंतिम तिथि' : 'Due on'}: ${pendingReminderPayload.due_date_formatted || pendingReminderPayload.due_date} ${pendingReminderPayload.amount ? `(${pendingReminderPayload.amount})` : ''}. ${language === 'hi' ? 'यह आपकी होम स्क्रीन पर दिखाई देगा।' : 'This will appear on your home screen so you never miss it.'}`
            : ''
        }
        confirmLabel={language === 'hi' ? 'हाँ, याददाश्त जोड़ें' : 'Yes, Set Reminder'}
        cancelLabel={language === 'hi' ? 'नहीं, अभी नहीं' : 'Cancel'}
        onConfirm={handleConfirmReminder}
        onCancel={() => setShowConfirmModal(false)}
      />

      {/* Educational Consequences Modal */}
      {showConsequencesModal && (
        <ConfirmationModal
          isOpen={showConsequencesModal}
          title={language === 'hi' ? 'देर से भुगतान करने पर क्या होता है?' : 'What happens if you miss this deadline?'}
          message={
            language === 'hi'
              ? 'आमतौर पर अंतिम तिथि के बाद थोड़ा विलंब शुल्क (Late fee, जैसे ₹100-150) जुड़ता है। तुरंत बिजली नहीं काटी जाती—कंपनियां पहले लिखित नोटिस देती हैं। यदि आप 15-30 दिन तक बिल नहीं भरते, तभी सेवा अस्थायी रूप से बंद हो सकती है।'
              : 'Typically, a late fee (surcharge, e.g. ₹100–150) is added to your next bill. Utility companies do not disconnect immediately on the due date—they are legally required to issue written warning notices first. However, paying on time avoids penalties and protects your credit peace of mind.'
          }
          confirmLabel={language === 'hi' ? 'समझ गया, धन्यवाद' : 'Understood, Thank You'}
          cancelLabel=""
          onConfirm={() => setShowConsequencesModal(false)}
          onCancel={() => setShowConsequencesModal(false)}
        />
      )}

    </div>
  );
}
