import React from 'react';
import { Compass } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

export default function ScenarioBar({ scenarios, onSelectScenario, selectedId }) {
  const { language } = useAccessibility();

  return (
    <div className="bg-[#151b24] rounded-2xl p-4 sm:p-5 border border-[#252f3e] mb-8 text-left shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>{language === 'hi' ? 'सामान्य धोखेबाज़ी के उदाहरण परखें:' : 'Explore Common Scam Scenarios:'}</span>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">
          {language === 'hi' ? 'तुरंत जांचने के लिए किसी भी स्थिति पर क्लिक करें' : 'Select any scenario to evaluate instantly'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {scenarios.map((sc) => {
          const isSelected = selectedId === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => onSelectScenario(sc)}
              className={`tactile-btn text-left p-3.5 rounded-xl border transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#1e2634] border-amber-500/70 shadow-sm ring-1 ring-amber-500/30'
                  : 'bg-[#12161f] border-[#222a36] hover:border-[#333f52] hover:bg-[#161c26]'
              }`}
            >
              <div>
                <h4 className="text-xs font-bold text-slate-200 line-clamp-1 mb-1">
                  {sc.title}
                </h4>
                <p className="text-[11px] text-slate-400 font-medium">
                  {sc.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
