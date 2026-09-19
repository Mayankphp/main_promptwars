import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Volume2, ShieldCheck, HelpCircle } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

const GUIDES = [
  {
    id: 'pay_bill_safely',
    title: "How to Pay Your Electricity Bill Safely Online",
    icon: "⚡",
    summary: "A calm 4-step guide to paying your utility bill online without falling for phishing scams or fake links.",
    steps: [
      {
        step: 1,
        title: "Locate Your Physical Bill or Official Consumer ID",
        desc: "Find your physical electricity bill paper. Look at the top right for your Consumer Number (Consumer ID). Never trust account numbers sent to you in an unverified SMS.",
        tip: "Keep a pen and paper handy to write down the confirmation receipt number."
      },
      {
        step: 2,
        title: "Use Only Official Apps or Government Portals",
        desc: "Open your trusted payment app (such as Google Pay, PhonePe, Paytm, or your bank's netbanking app) directly. Navigate to 'Electricity' under Utilities, and select your state's electricity board from the official list.",
        tip: "NEVER click on links like 'bit.ly/pay-bill' sent via SMS."
      },
      {
        step: 3,
        title: "Verify the Name and Due Amount Before Paying",
        desc: "When you enter your consumer ID, the app will automatically fetch your name and exact bill amount. Double-check that your family name appears. If the name is different, do NOT proceed.",
        tip: "Legitimate portals always fetch the bill automatically from government servers."
      },
      {
        step: 4,
        title: "Authorize Payment & Save the Receipt",
        desc: "Enter your UPI PIN only inside the official UPI screen. Once the green checkmark appears, take a screenshot or write down the 12-digit transaction UTR number.",
        tip: "Remember: Entering your UPI PIN is ONLY to pay money out, NEVER to receive refunds or cashback!"
      }
    ]
  },
  {
    id: 'doctor_prep',
    title: "How to Prepare for Your Doctor Appointment",
    icon: "🩺",
    summary: "Simple checklist to ensure you have all reports, questions, and medications ready for your doctor visit.",
    steps: [
      {
        step: 1,
        title: "Gather All Current Medicine Strips",
        desc: "Place all your daily tablets, syrups, and eye drops in a small bag. Doctors prefer seeing the exact brand names and milligram (mg) doses on the foil strips.",
        tip: "Do not rely on memory alone for drug names."
      },
      {
        step: 2,
        title: "Check If Fasting is Required for Blood Tests",
        desc: "If your doctor ordered Fasting Blood Sugar or Lipid Profile, do not eat or drink anything except plain water for 10 to 12 hours before your morning appointment.",
        tip: "Take your regular morning BP medication with a small sip of water unless specifically told otherwise."
      },
      {
        step: 3,
        title: "Write Down 2-3 Questions for the Doctor",
        desc: "Write down your key concerns on a notepad (e.g. 'Can I walk in the evening?', 'Why do I feel dizzy in the afternoon?'). Doctors are glad to answer structured questions.",
        tip: "Bring a family member or companion if you need help hearing or noting instructions."
      },
      {
        step: 4,
        title: "Arrive 15 Minutes Early with Reading Glasses",
        desc: "Reach the clinic a little early to check in smoothly. Bring your reading glasses to review prescription slips before leaving the consultation room.",
        tip: "Ask the chemist/pharmacist to write the morning/night doses clearly in large letters on each medicine box."
      }
    ]
  },
  {
    id: 'suspicious_caller',
    title: "What to Do If You Receive a Suspicious Bank Call",
    icon: "🛡️",
    summary: "Clear rules on what to say and do when an unknown caller claims your account or card is blocked.",
    steps: [
      {
        step: 1,
        title: "Stay Calm: Urgent Threats are Always Fake",
        desc: "Scammers use panic (e.g. 'Your account will freeze in 10 minutes') so you cannot think clearly. A real bank will NEVER suspend your account without official postal/branch procedures.",
        tip: "Take a deep breath and tell yourself: 'My money is safe in the bank. Nobody can touch it without my OTP.'"
      },
      {
        step: 2,
        title: "Never Share OTP, Password, or PIN",
        desc: "No matter what reason the caller gives ('We need to reverse a wrong fee', 'We are updating your Aadhaar'), NEVER reveal the 6 numbers on your screen.",
        tip: "The word OTP literally stands for One Time Password. Giving your OTP is like giving away your house keys."
      },
      {
        step: 3,
        title: "Politely Hang Up the Call",
        desc: "Say firmly: 'I will visit my local branch manager in person.' Then disconnect the call immediately. You do not owe an unknown caller any explanations.",
        tip: "Do not call back the number displayed on your caller ID."
      },
      {
        step: 4,
        title: "Check with Your Family or Official Bank Branch",
        desc: "Show the phone number to your son, daughter, or visit your branch. If money was ever deducted, immediately dial 1930 (National Cyber Crime Helpline).",
        tip: "1930 is the official toll-free government cyber fraud helpline in India."
      }
    ]
  }
];

export default function TaskGuideView() {
  const { language, speakText } = useAccessibility();
  const [selectedGuide, setSelectedGuide] = useState(GUIDES[0]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const currentStep = selectedGuide.steps[currentStepIdx];

  const handleNext = () => {
    if (currentStepIdx < selectedGuide.steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
    }
  };

  const handleListen = () => {
    speakText(`Step ${currentStep.step}: ${currentStep.title}. ${currentStep.desc}. Important Tip: ${currentStep.tip}`);
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto animate-fade-in">
      
      {/* Header */}
      <section className="bg-[#151b24] rounded-2xl p-5 border border-[#252f3e] shadow-sm">
        <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
          <span>🤝</span>
          <span>{language === 'hi' ? 'कदम-दर-कदम डिजिटल गाइड' : 'Step-by-Step Task Guides'}</span>
        </h2>
        <p className="text-xs text-slate-400 font-normal">
          {language === 'hi'
            ? 'कदम-दर-कदम आसान निर्देश—ताकि आप हर रोज़ के डिजिटल काम पूरे विश्वास से कर सकें।'
            : 'Calm step-by-step guidance to navigate common tasks with zero anxiety.'}
        </p>

        {/* Guide Selector Tabs */}
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-[#252f3e]">
          {GUIDES.map((g) => (
            <button
              key={g.id}
              onClick={() => {
                setSelectedGuide(g);
                setCurrentStepIdx(0);
              }}
              className={`tactile-btn px-3 py-1.5 rounded-xl font-bold text-xs border transition flex items-center gap-1.5 ${
                selectedGuide.id === g.id
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'bg-[#10141a] hover:bg-[#1a212d] text-slate-300 border-[#263040]'
              }`}
            >
              <span>{g.icon}</span>
              <span>{g.title}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Step Navigator */}
      <section className="bg-[#151b24] rounded-2xl p-6 sm:p-8 border border-[#252f3e] shadow-sm">
        
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
              Step {currentStep.step} of {selectedGuide.steps.length}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-1.5 font-sans">
              {currentStep.title}
            </h3>
          </div>

          <button
            onClick={handleListen}
            className="tactile-btn flex items-center gap-1 px-3 py-1 rounded-lg bg-[#1e2634] text-amber-400 border border-[#333f52] hover:text-amber-300 text-xs font-bold"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Listen</span>
          </button>
        </div>

        {/* Content Box */}
        <div className="p-5 rounded-xl bg-[#10141a] border border-[#252f3e] mb-6">
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed mb-4">
            {currentStep.desc}
          </p>

          <div className="p-3.5 rounded-lg bg-[#1f1a14] border border-amber-700/50 flex items-start gap-2.5">
            <span className="text-lg">💡</span>
            <div>
              <p className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                Helpful Safety Tip
              </p>
              <p className="text-xs text-amber-200 font-semibold mt-0.5">
                {currentStep.tip}
              </p>
            </div>
          </div>
        </div>

        {/* Nav Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-[#252f3e]">
          <button
            onClick={handlePrev}
            disabled={currentStepIdx === 0}
            className="tactile-btn px-4 py-2 rounded-xl text-xs font-bold border border-[#333f52] bg-[#10141a] text-slate-300 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-1.5">
            {selectedGuide.steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStepIdx(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentStepIdx ? 'w-5 bg-amber-500' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentStepIdx === selectedGuide.steps.length - 1}
            className="tactile-btn px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5"
          >
            <span>Next Step</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </section>

    </div>
  );
}
