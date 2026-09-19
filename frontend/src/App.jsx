import React, { useState, useEffect } from 'react';
import Header from './components/common/Header';
import HeroSection from './components/analyzer/HeroSection';
import ScenarioBar from './components/analyzer/ScenarioBar';
import MainSplitView from './components/analyzer/MainSplitView';
import RemindersView from './components/reminders/RemindersView';
import TaskGuideView from './components/tasks/TaskGuideView';
import HistoryModal from './components/common/HistoryModal';
import { useAccessibility } from './context/AccessibilityContext';
import { fetchSamples, fetchReminders, toggleReminder, deleteReminder } from './services/api';
import { Shield, Lock } from 'lucide-react';

export default function App() {
  const { language } = useAccessibility();
  const [activeView, setActiveView] = useState('analyzer'); // 'analyzer', 'reminders', 'tasks'
  const [scenarios, setScenarios] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const loadInitialData = async () => {
    try {
      const [sampleRes, reminderRes] = await Promise.all([
        fetchSamples().catch(() => ({ success: false, data: [] })),
        fetchReminders().catch(() => ({ success: false, data: [] }))
      ]);

      if (sampleRes.success && sampleRes.data) {
        setScenarios(sampleRes.data);
      }
      if (reminderRes.success && reminderRes.data) {
        setReminders(reminderRes.data);
      }
    } catch (err) {
      console.error("Initial load error:", err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleToggleReminder = async (id) => {
    try {
      const res = await toggleReminder(id);
      if (res.success && res.data) {
        setReminders(prev => prev.map(item => item.id === id ? res.data : item));
      }
    } catch (err) {
      console.error("Reminder toggle error:", err);
    }
  };

  const handleDeleteReminder = async (id) => {
    try {
      const res = await deleteReminder(id);
      if (res.success) {
        setReminders(prev => prev.filter(item => item.id !== id));
      }
    } catch (err) {
      console.error("Reminder delete error:", err);
    }
  };

  const activeRemindersCount = reminders.filter(r => !r.is_completed).length;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0e1217] text-slate-100 transition-colors duration-200">
      
      {/* Top Navigation Bar */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenHistory={() => setIsHistoryOpen(true)}
        reminderCount={activeRemindersCount}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6">
        
        {/* View 1: Main Analyzer Studio (Exact layout from user screenshot) */}
        {activeView === 'analyzer' && (
          <div>
            {/* Hero Section */}
            <HeroSection />

            {/* Horizontal Scenario Cards */}
            <ScenarioBar
              scenarios={scenarios}
              onSelectScenario={(sc) => setSelectedScenario(sc)}
              selectedId={selectedScenario?.id}
            />

            {/* Split Input & Results Studio */}
            <MainSplitView
              selectedScenario={selectedScenario}
              onReminderSaved={loadInitialData}
              onNavigateToReminders={() => setActiveView('reminders')}
            />
          </div>
        )}

        {/* View 2: Important Dates & Reminders (Connected Workflow) */}
        {activeView === 'reminders' && (
          <div className="py-8">
            <RemindersView
              reminders={reminders}
              onToggleReminder={handleToggleReminder}
              onDeleteReminder={handleDeleteReminder}
              onRefreshReminders={loadInitialData}
            />
          </div>
        )}

        {/* View 3: Step-by-Step Task Guides */}
        {activeView === 'tasks' && (
          <div className="py-8">
            <TaskGuideView />
          </div>
        )}

      </main>

      {/* History Drawer Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectPastItem={(item) => {
          setIsHistoryOpen(false);
          setActiveView('analyzer');
        }}
      />

      {/* Footer */}
      <footer className="border-t border-[#1e2634] py-6 px-4 bg-[#0a0d11] text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400 font-semibold">
            <Shield className="w-4 h-4 text-amber-500" />
            <span>Sahayak (सहायक) • Senior Life Companion</span>
          </div>
          <p className="text-slate-500 text-[11px]">
            {language === 'hi'
              ? 'आपकी जानकारी केवल सुरक्षा विश्लेषण के लिए संसाधित की जाती है। कभी भी पासवर्ड, OTP या PIN साझा न करें।'
              : 'Your information is processed safely to provide this assistance. Avoid sharing passwords, OTPs, PINs, or sensitive credentials.'}
          </p>
          <div className="text-slate-400 text-[11px] font-medium">
            Powered by Google Gemini 3.5 Flash
          </div>
        </div>
      </footer>

    </div>
  );
}
