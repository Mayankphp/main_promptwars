import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [seniorMode, setSeniorModeState] = useState(() => {
    return localStorage.getItem('verishield_senior_mode') === 'true';
  });
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('verishield_lang') || 'en';
  });
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Apply Senior Mode class to <html> for readable typography & high contrast
  useEffect(() => {
    const root = document.documentElement;
    if (seniorMode) {
      root.classList.add('senior-mode');
    } else {
      root.classList.remove('senior-mode');
    }
    localStorage.setItem('verishield_senior_mode', String(seniorMode));
  }, [seniorMode]);

  useEffect(() => {
    localStorage.setItem('verishield_lang', language);
  }, [language]);

  const toggleSeniorMode = () => {
    setSeniorModeState(prev => !prev);
  };

  const setLanguage = (lang) => {
    setLanguageState(lang);
  };

  const speakText = (text, langOverride) => {
    if (!('speechSynthesis' in window)) {
      alert("Text to speech is not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langOverride || (language === 'hi' ? 'hi-IN' : 'en-IN');
    utterance.rate = seniorMode ? 0.82 : 0.90; // Calmer pace for senior mode
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        seniorMode,
        toggleSeniorMode,
        language,
        setLanguage,
        isSpeaking,
        speakText,
        stopSpeaking,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
