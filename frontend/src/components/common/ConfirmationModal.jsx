import React from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel
}) {
  const { language } = useAccessibility();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-[#151b24] rounded-2xl max-w-lg w-full p-6 sm:p-7 border border-[#2e3a4d] shadow-2xl text-left">
        
        {/* Modal Header Icon */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-500 border border-amber-600/40 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 id="modal-title" className="text-xl font-bold text-white font-sans">
              {title}
            </h3>
            <p className="text-xs font-semibold text-amber-400">
              Please confirm before we save this for you
            </p>
          </div>
        </div>

        {/* Modal Explanation */}
        <div className="bg-[#10141a] p-4 rounded-xl border border-[#252f3e] mb-5 text-slate-300 text-sm leading-relaxed">
          {message}
        </div>

        {/* Tactile CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={onConfirm}
            className="tactile-btn flex-1 py-3 px-5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md shadow-amber-600/20 flex items-center justify-center gap-2"
          >
            ✓ {confirmLabel || (language === 'hi' ? 'हाँ, याददाश्त जोड़ें' : 'Yes, Save Reminder')}
          </button>
          <button
            onClick={onCancel}
            className="tactile-btn py-3 px-5 rounded-xl bg-[#1e2634] hover:bg-[#273244] text-slate-300 font-bold text-sm border border-[#333f52]"
          >
            {cancelLabel || (language === 'hi' ? 'रद्द करें' : 'Cancel')}
          </button>
        </div>

      </div>
    </div>
  );
}
