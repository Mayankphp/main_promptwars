import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Image as ImageIcon,
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Copy,
  Check,
  Bell,
  RefreshCw,
  Sparkles,
  Info,
  Calendar,
  Lock,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { analyzeContent, uploadDocumentFile, createReminder } from '../../services/api';
import ConfirmationModal from '../common/ConfirmationModal';

export default function MainSplitView({
  selectedScenario,
  onReminderSaved,
  onNavigateToReminders
}) {
  const { seniorMode, language, speakText, stopSpeaking, isSpeaking } = useAccessibility();
  const [activeInputTab, setActiveInputTab] = useState('text'); // 'text' or 'upload'
  const [messageText, setMessageText] = useState('');
  const [contextText, setContextText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [copiedSafeReply, setCopiedSafeReply] = useState(false);
  const [copiedCaregiver, setCopiedCaregiver] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingReminder, setPendingReminder] = useState(null);

  const recognitionRef = useRef(null);

  // Sync with selected scenario from top bar
  useEffect(() => {
    if (selectedScenario) {
      setMessageText(selectedScenario.content);
      setContextText(selectedScenario.context || '');
      setErrorMessage(null);
      // Automatically run analysis on sample select
      runAnalysis(selectedScenario.content, selectedScenario.context);
    }
  }, [selectedScenario]);

  // Speech-to-text initialization
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessageText(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser. Please use keyboard or sample chips.");
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
        setMessageText(res.data.text);
        setContextText(`Uploaded file: ${file.name}`);
        await runAnalysis(res.data.text, `Uploaded file: ${file.name}`);
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to read file.");
    } finally {
      setIsLoading(false);
    }
  };

  const runAnalysis = async (overrideContent = null, overrideContext = null) => {
    const textToProcess = overrideContent || messageText;
    const ctx = overrideContext !== null ? overrideContext : contextText;

    if (!textToProcess || textToProcess.trim().length < 3) {
      setErrorMessage(language === 'hi' ? 'कृपया पहले कोई संदेश लिखें या चिपकाएं।' : 'Please enter or paste a message first.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await analyzeContent(textToProcess, language, ctx);
      if (response.success && response.data) {
        setAnalysisResult(response.data);
      } else {
        throw new Error(response.error || "Analysis failed.");
      }
    } catch (err) {
      setErrorMessage(err.message || "An error occurred while analyzing. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessageText('');
    setContextText('');
    setAnalysisResult(null);
    setErrorMessage(null);
  };

  const handleListenResult = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else if (analysisResult) {
      const speech = language === 'hi' && analysisResult.hindi_explanation
        ? `${analysisResult.summary}. ${analysisResult.hindi_explanation}`
        : `${analysisResult.summary}. ${analysisResult.simple_explanation}`;
      speakText(speech);
    }
  };

  const handlePromptReminder = (payload) => {
    if (!payload) return;
    setPendingReminder(payload);
    setShowConfirmModal(true);
  };

  const handleConfirmReminder = async () => {
    if (!pendingReminder) return;
    try {
      await createReminder({
        title: pendingReminder.title || "Bill or Event Reminder",
        due_date: pendingReminder.due_date || "2026-09-25",
        due_date_formatted: pendingReminder.due_date_formatted || "25 September 2026",
        category: pendingReminder.category || "bill",
        amount: pendingReminder.amount || null,
        notes: `Scheduled via Sahayak analysis.`
      });

      setShowConfirmModal(false);
      setPendingReminder(null);
      if (onReminderSaved) onReminderSaved();
      alert(language === 'hi' ? "✓ याददाश्त सफलतापूर्वक जुड़ गई!" : "✓ Reminder successfully added to your dashboard!");
    } catch (err) {
      alert("Failed to save reminder: " + err.message);
    }
  };

  const safeReplyText = language === 'hi'
    ? "मैं किसी भी लिंक पर क्लिक नहीं करता। मैं केवल अपनी अधिकृत बैंक शाखा या कार्यालय जाकर ही जांच करूंगा।"
    : "I do not click SMS links. I will only verify in person at the official branch or office.";

  const handleCopySafeReply = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(safeReplyText);
      setCopiedSafeReply(true);
      setTimeout(() => setCopiedSafeReply(false), 2500);
    }
  };

  const handleCopyCaregiverNote = () => {
    if (navigator.clipboard && analysisResult?.caregiver_summary) {
      navigator.clipboard.writeText(analysisResult.caregiver_summary);
      setCopiedCaregiver(true);
      setTimeout(() => setCopiedCaregiver(false), 2500);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left mb-16">
      
      {/* ========================================================
          LEFT COLUMN: INPUT STUDIO (Matching Screenshot)
      ======================================================== */}
      <div className="bg-[#151b24] rounded-2xl p-5 sm:p-6 border border-[#252f3e] shadow-sm flex flex-col justify-between">
        
        <div>
          {/* Input Type Tabs */}
          <div className="flex items-center gap-6 border-b border-[#252f3e] pb-3 mb-5">
            <button
              onClick={() => setActiveInputTab('text')}
              className={`flex items-center gap-2 text-xs font-bold transition pb-1 -mb-3.5 border-b-2 ${
                activeInputTab === 'text'
                  ? 'border-amber-500 text-amber-500'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Text / Message / URL</span>
            </button>
            <button
              onClick={() => setActiveInputTab('upload')}
              className={`flex items-center gap-2 text-xs font-bold transition pb-1 -mb-3.5 border-b-2 ${
                activeInputTab === 'upload'
                  ? 'border-amber-500 text-amber-500'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Screenshot Upload</span>
            </button>
          </div>

          {/* Text Input Tab */}
          {activeInputTab === 'text' ? (
            <div>
              {/* Header Label + Char Counter */}
              <div className="flex items-center justify-between mb-2 text-xs font-semibold text-slate-400">
                <label htmlFor="message-textarea" className="font-bold text-slate-300">
                  Message Content
                </label>
                <span>{messageText.length} characters</span>
              </div>

              {/* Textarea */}
              <textarea
                id="message-textarea"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Paste the suspicious SMS, WhatsApp message, email body, or payment request link here..."
                rows={8}
                className="w-full p-4 rounded-xl border border-[#263040] focus:border-amber-500/80 bg-[#10141a] text-slate-100 placeholder-slate-500 text-sm font-normal focus:outline-none transition resize-y"
              />

              {/* Context Input */}
              <div className="mt-4">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-300 mb-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  <span>Context (Where did this come from?)</span>
                </label>
                <input
                  type="text"
                  value={contextText}
                  onChange={(e) => setContextText(e.target.value)}
                  placeholder="e.g. Received at 6 AM from an unknown mobile number"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#263040] focus:border-amber-500/80 bg-[#10141a] text-slate-200 placeholder-slate-500 text-xs font-normal focus:outline-none transition"
                />
              </div>
            </div>
          ) : (
            /* Screenshot Upload Tab */
            <div className="p-8 rounded-xl border-2 border-dashed border-[#2b3648] bg-[#10141a] text-center mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#1e2634] text-amber-500 mx-auto flex items-center justify-center mb-3">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-200 mb-1">
                Upload a Screenshot or Notice Document
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                PNG, JPG, PDF or TXT up to 5MB. We automatically extract and deconstruct the content.
              </p>
              <label className="tactile-btn inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer shadow-sm">
                <span>Select File</span>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* Action Controls Toolbar */}
        <div className="pt-5 mt-5 border-t border-[#252f3e] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Voice Dictation */}
            <button
              onClick={toggleVoiceInput}
              className={`tactile-btn flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition ${
                isListening
                  ? 'bg-red-900/50 text-red-300 border-red-600 mic-listening'
                  : 'bg-[#12161f] text-slate-300 border-[#263040] hover:text-white'
              }`}
              title="Speak message"
            >
              {isListening ? <MicOff className="w-4 h-4 text-red-400" /> : <Mic className="w-4 h-4 text-amber-500" />}
              <span>{isListening ? 'Listening...' : 'Voice Input'}</span>
            </button>

            {messageText && (
              <button
                onClick={handleClear}
                className="tactile-btn px-3 py-2 rounded-xl text-xs font-bold bg-[#12161f] text-slate-400 hover:text-slate-200 border border-[#263040]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Big Deconstruct Button */}
          <button
            onClick={() => runAnalysis()}
            disabled={isLoading || !messageText.trim()}
            className="tactile-btn px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-xs shadow-md shadow-amber-600/20 flex items-center gap-2 transition"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Deconstructing...</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>Analyze Message</span>
              </>
            )}
          </button>
        </div>

        {errorMessage && (
          <div className="mt-3 p-3 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

      </div>

      {/* ========================================================
          RIGHT COLUMN: RESULTS / READY STATE (Matching Screenshot)
      ======================================================== */}
      <div className="bg-[#151b24] rounded-2xl p-5 sm:p-6 border border-[#252f3e] shadow-sm flex flex-col justify-center min-h-[460px]">
        
        {/* State A: Nothing analyzed yet (Ready State from screenshot) */}
        {!analysisResult && !isLoading && (
          <div className="text-center py-12 px-4 max-w-md mx-auto my-auto animate-fade-in">
            {/* Shield Icon Box */}
            <div className="w-14 h-14 rounded-2xl bg-[#1a212d] border border-amber-600/40 text-amber-500 mx-auto flex items-center justify-center mb-5 shadow-sm">
              <Shield className="w-7 h-7 fill-amber-500/10" />
            </div>

            {/* Heading */}
            <h3 className="text-xl font-bold text-white mb-2.5 font-sans">
              Ready to Analyze Suspicious Communications
            </h3>

            {/* Subtext */}
            <p className="text-xs text-slate-400 leading-relaxed mb-6 font-normal">
              Enter a message on the left or select any sample case study above. You will receive an immediate safety deconstruction in English and हिंदी.
            </p>

            {/* Verification Pill */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#12161f] border border-[#263040] text-slate-300 text-[11px] font-semibold">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Native Hindi Language & Senior Audio Support</span>
            </div>
          </div>
        )}

        {/* State B: Loading state */}
        {isLoading && (
          <div className="text-center py-16 px-4 my-auto animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 mx-auto flex items-center justify-center mb-4 animate-spin">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">
              Deconstructing Content with Gemini 3.5 Flash...
            </h4>
            <p className="text-xs text-slate-400">
              Evaluating psychological tricks, scam signatures, and extracting dates safely.
            </p>
          </div>
        )}

        {/* State C: Analysis Result Studio */}
        {analysisResult && !isLoading && (
          <div className="space-y-5 animate-fade-in text-left">
            
            {/* Verdict Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#252f3e]">
              <div className="flex items-center gap-2.5">
                {analysisResult.risk_level === 'high_risk' || analysisResult.risk_level === 'suspicious' ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-950/60 text-red-300 border border-red-800 text-xs font-black">
                    <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                    <span>HIGH RISK: POTENTIAL SCAM</span>
                  </div>
                ) : analysisResult.risk_level === 'caution' ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-950/60 text-amber-300 border border-amber-700 text-xs font-black">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>CAUTION: VERIFY CAREFULLY</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-700 text-xs font-black">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>OFFICIAL / SAFE COMMUNICATION</span>
                  </div>
                )}
              </div>

              {/* Audio Listen */}
              <button
                onClick={handleListenResult}
                className="tactile-btn flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1e2634] text-amber-400 hover:text-amber-300 border border-[#333f52] text-xs font-bold"
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isSpeaking ? 'Stop Audio' : 'Listen'}</span>
              </button>
            </div>

            {/* Summary Box */}
            <div className="p-4 rounded-xl bg-[#10141a] border border-[#252f3e]">
              <h4 className="text-xs font-black uppercase text-amber-500 tracking-wider mb-1">
                Executive Safety Summary
              </h4>
              <p className="text-sm font-bold text-white mb-2">
                {analysisResult.summary}
              </p>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {language === 'hi' && analysisResult.hindi_explanation
                  ? analysisResult.hindi_explanation
                  : analysisResult.simple_explanation}
              </p>
            </div>

            {/* Proactive Anticipation Card (If dates or proactive actions found) */}
            {analysisResult.proactive_prompt && (
              <div className="p-4 rounded-xl bg-[#1a212d] border border-amber-600/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-extrabold mb-0.5">
                    <Bell className="w-3.5 h-3.5" />
                    <span>Proactive Suggestion</span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">
                    {analysisResult.proactive_prompt.description}
                  </p>
                </div>

                {analysisResult.proactive_prompt.suggested_action === 'set_reminder' && (
                  <button
                    onClick={() => handlePromptReminder(analysisResult.proactive_prompt.action_payload)}
                    className="tactile-btn flex-shrink-0 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Set Reminder</span>
                  </button>
                )}
              </div>
            )}

            {/* Psychological Tricks & Warning Signals */}
            {analysisResult.warnings?.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider">
                  ⚠️ Deconstructed Traps & Warning Signals:
                </h4>
                {analysisResult.warnings.map((w, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#1f1418] border border-red-900/60 text-left">
                    <p className="text-xs font-bold text-red-300">
                      {w.flag}
                    </p>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      {w.why_risky}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Action Steps */}
            {analysisResult.actions?.length > 0 && (
              <div className="p-3.5 rounded-xl bg-[#10141a] border border-[#252f3e]">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  What You Should Do:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300 font-medium">
                  {analysisResult.actions.map((act) => (
                    <li key={act.step_number} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-[#1e2634] text-amber-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                        {act.step_number}
                      </span>
                      <span>{act.instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick Actions Footer: Safe Reply + Caregiver Forward */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopySafeReply}
                className="tactile-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e2634] hover:bg-[#252f3e] text-slate-200 border border-[#333f52] text-xs font-bold"
              >
                {copiedSafeReply ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSafeReply ? 'Copied Reply!' : 'Copy Safe Reply'}</span>
              </button>

              <button
                onClick={handleCopyCaregiverNote}
                className="tactile-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e2634] hover:bg-[#252f3e] text-slate-200 border border-[#333f52] text-xs font-bold"
              >
                {copiedCaregiver ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCaregiver ? 'Copied Note!' : 'Copy Family Note'}</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        title={language === 'hi' ? 'क्या आप यह याददाश्त जोड़ना चाहते हैं?' : 'Would you like to set this reminder?'}
        message={
          pendingReminder
            ? `${pendingReminder.title} - Due on: ${pendingReminder.due_date_formatted || pendingReminder.due_date} ${pendingReminder.amount ? `(${pendingReminder.amount})` : ''}. This will be added to your synchronized calendar.`
            : ''
        }
        confirmLabel={language === 'hi' ? 'हाँ, याददाश्त जोड़ें' : 'Yes, Save Reminder'}
        cancelLabel={language === 'hi' ? 'रद्द करें' : 'Cancel'}
        onConfirm={handleConfirmReminder}
        onCancel={() => setShowConfirmModal(false)}
      />

    </div>
  );
}
