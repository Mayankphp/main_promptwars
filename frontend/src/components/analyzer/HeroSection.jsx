import React from 'react';
import { Sparkles } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

export default function HeroSection() {
  const { language } = useAccessibility();

  return (
    <section className="text-center pt-8 pb-10 max-w-4xl mx-auto px-4 animate-fade-in">
      
      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#201913] border border-amber-600/40 text-amber-400 text-xs font-semibold mb-6 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Powered by Gemini Multi-Language Intelligence</span>
      </div>

      {/* Headline with Serif Italic 'before' */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-5">
        {language === 'hi' ? (
          <>
            क्लिक करने से <span className="font-serif italic text-amber-500 font-normal">पहले</span> संदेश को समझें।
          </>
        ) : (
          <>
            Understand the message <span className="font-serif italic text-amber-500 font-normal">before</span> you click.
          </>
        )}
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed">
        {language === 'hi' ? (
          <>
            कोई भी संदिग्ध एसएमएस, व्हाट्सएप संदेश या बिल चिपकाएं। सहायक (Sahayak) मनोवैज्ञानिक चालों को डिकोड करता है, छिपे खतरों को उजागर करता है, और सरल हिंदी और अंग्रेजी में आपका मार्गदर्शन करता है।
          </>
        ) : (
          <>
            Paste any suspicious text, WhatsApp message, email, or upload a screenshot. Sahayak deconstructs the psychological tricks, flags hidden traps, and guides you in simple English and हिंदी.
          </>
        )}
      </p>

    </section>
  );
}
