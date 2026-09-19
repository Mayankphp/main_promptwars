import React from 'react';
import { X, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

export default function HistoryModal({ isOpen, onClose, onSelectPastItem }) {
  const { language } = useAccessibility();

  if (!isOpen) return null;

  const pastScans = [
    {
      id: 1,
      title: "HDFC KYC Suspension Alert",
      risk: "high_risk",
      date: "Today, 11:20 AM",
      snippet: "Your HDFC bank account has been suspended due to incomplete KYC..."
    },
    {
      id: 2,
      title: "Tata Play DTH Annual Receipt",
      risk: "safe",
      date: "Yesterday, 3:45 PM",
      snippet: "Thank you for your payment of ₹1,199 towards annual subscription..."
    },
    {
      id: 3,
      title: "Electricity Power Disconnection Threat",
      risk: "high_risk",
      date: "18 Sep, 9:15 PM",
      snippet: "Power connection will be disconnected tonight at 9:30 PM..."
    }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#151b24] rounded-2xl max-w-lg w-full p-6 border border-[#252f3e] shadow-2xl text-left">
        <div className="flex items-center justify-between pb-3 border-b border-[#252f3e] mb-4">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Clock className="w-5 h-5 text-amber-500" />
            <span>{language === 'hi' ? 'हाल की सुरक्षा जांच' : 'Recent Safety Deconstructions'}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 mb-4 max-h-80 overflow-y-auto pr-1">
          {pastScans.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-[#10141a] border border-[#263040] hover:border-amber-500/50 transition cursor-pointer"
              onClick={() => {
                onClose();
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-200">
                  {item.title}
                </span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  item.risk === 'high_risk'
                    ? 'bg-red-950/80 text-red-300 border border-red-800'
                    : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                }`}>
                  {item.risk === 'high_risk' ? 'HIGH RISK' : 'SAFE'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1 mb-1">
                {item.snippet}
              </p>
              <span className="text-[10px] text-slate-400 font-semibold">
                {item.date}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-[#252f3e] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1e2634] text-slate-200 hover:bg-[#252f3e] text-xs font-bold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
