import React from 'react';
import { Shield, Clock, Volume2, VolumeX } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

export default function Header({ activeView, setActiveView, onOpenHistory, reminderCount }) {
  const {
    seniorMode,
    toggleSeniorMode,
    language,
    setLanguage,
    isSpeaking,
    stopSpeaking
  } = useAccessibility();

  return (
    <header className="sticky top-0 z-30 bg-[#0e1217]/95 backdrop-blur border-b border-[#222a36] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left: Shield Emblem + Brand */}
          <button
            onClick={() => setActiveView('analyzer')}
            className="flex items-center gap-3 text-left group focus:outline-none"
            aria-label="Sahayak Home"
          >
            <div className="w-10 h-10 rounded-xl bg-[#1a212d] border border-amber-600/50 flex items-center justify-center text-amber-500 shadow-sm group-hover:border-amber-500 transition">
              <Shield className="w-5 h-5 fill-amber-500/20" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white font-sans">
                Sahayak <span className="text-amber-500 text-lg font-normal">(सहायक)</span>
              </span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                SENIOR LIFE COMPANION
              </span>
            </div>
          </button>

          {/* Center Navigation for connected senior workflows */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setActiveView('analyzer')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeView === 'analyzer'
                  ? 'bg-[#1e2634] text-white border border-[#333f52]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {language === 'hi' ? '🛡️ संदेश सुरक्षा जांच' : '🛡️ Safety Deconstruction'}
            </button>
            <button
              onClick={() => setActiveView('reminders')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeView === 'reminders'
                  ? 'bg-[#1e2634] text-white border border-[#333f52]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{language === 'hi' ? '🔔 ज़रूरी तारीखें' : '🔔 Important Dates'}</span>
              {reminderCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px]">
                  {reminderCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveView('tasks')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeView === 'tasks'
                  ? 'bg-[#1e2634] text-white border border-[#333f52]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {language === 'hi' ? '🤝 चरण-दर-चरण गाइड' : '🤝 Task Guide'}
            </button>
          </nav>

          {/* Right: Language, Senior Mode Toggle, Audio Stop, History */}
          <div className="flex items-center gap-3">
            
            {/* Audio Stop Button (if playing) */}
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-900/40 text-red-300 border border-red-700/60 text-xs font-bold animate-pulse"
                title="Stop Audio Readout"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Stop Audio</span>
              </button>
            )}

            {/* Language Switcher Pill */}
            <div className="flex items-center rounded-full bg-[#161c24] p-0.5 border border-[#263040]">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                  language === 'en'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                  language === 'hi'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* Senior Mode Switch Toggle */}
            <div className="flex items-center gap-2 pl-1">
              <button
                onClick={toggleSeniorMode}
                className="flex items-center gap-2 group cursor-pointer focus:outline-none"
                role="switch"
                aria-checked={seniorMode}
                title="Toggle Large Readable Fonts and Spacing for Seniors"
              >
                <div className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 flex items-center ${
                  seniorMode ? 'bg-amber-600 justify-end' : 'bg-slate-700 justify-start'
                }`}>
                  <div className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform" />
                </div>
                <span className="text-xs font-medium text-slate-300 group-hover:text-white transition">
                  Senior Mode
                </span>
              </button>
            </div>

            {/* History Button */}
            <button
              onClick={onOpenHistory}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#1e2634] transition"
              title="Recent Analysis History"
              aria-label="Recent Analysis History"
            >
              <Clock className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
