import React, { useState } from 'react';
import { Bell, Plus, CheckCircle, Clock, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { createReminder } from '../../services/api';

export default function RemindersView({
  reminders,
  onToggleReminder,
  onDeleteReminder,
  onRefreshReminders
}) {
  const { language } = useAccessibility();
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState('all');

  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newCategory, setNewCategory] = useState('bill');
  const [newAmount, setNewAmount] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [formError, setFormError] = useState('');

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate) {
      setFormError(language === 'hi' ? 'कृपया नाम और तारीख दोनों भरें।' : 'Please provide both a title and date.');
      return;
    }

    try {
      await createReminder({
        title: newTitle,
        due_date: newDate,
        due_date_formatted: newDate,
        category: newCategory,
        amount: newAmount || null,
        notes: newNotes || null
      });

      setNewTitle('');
      setNewDate('');
      setNewAmount('');
      setNewNotes('');
      setShowAddForm(false);
      setFormError('');
      if (onRefreshReminders) onRefreshReminders();
    } catch (err) {
      setFormError(err.message || "Failed to create reminder");
    }
  };

  const filtered = reminders.filter(r => {
    if (filter === 'active') return !r.is_completed;
    if (filter === 'completed') return r.is_completed;
    return true;
  });

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto animate-fade-in">
      
      {/* Header */}
      <section className="bg-[#151b24] rounded-2xl p-5 sm:p-6 border border-[#252f3e] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Bell className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-white">
              {language === 'hi' ? 'महत्वपूर्ण तारीखें और याददाश्त' : 'Important Deadlines & Reminders'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-normal">
            {language === 'hi'
              ? 'यहाँ आपके सभी बिलों, डॉक्टर की तारीखों और सरकारी नवीनीकरण की सुरक्षित सूची है।'
              : 'Keep track of all your upcoming bill deadlines, medical appointments, and renewal dates.'}
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(prev => !prev)}
          className="tactile-btn py-2 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Close Form' : 'Add Reminder'}</span>
        </button>
      </section>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="bg-[#151b24] rounded-2xl p-5 border border-[#252f3e] shadow-sm animate-fade-in">
          <h3 className="text-sm font-bold text-white mb-3">
            {language === 'hi' ? 'नई याददाश्त जोड़ें' : 'Create New Reminder'}
          </h3>

          {formError && (
            <div className="mb-3 p-2.5 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs font-semibold">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Electricity Bill, Heart Checkup"
                className="w-full px-3.5 py-2 rounded-xl border border-[#263040] text-xs font-normal text-slate-100 bg-[#10141a] focus:border-amber-500/80 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Due Date *
              </label>
              <input
                type="date"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#263040] text-xs font-normal text-slate-100 bg-[#10141a] focus:border-amber-500/80 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#263040] text-xs font-bold text-slate-100 bg-[#10141a] focus:border-amber-500/80 focus:outline-none"
              >
                <option value="bill">⚡ Utility / Bill</option>
                <option value="medical">🩺 Medical Consultation</option>
                <option value="pension">📜 Pension / KYC</option>
                <option value="renewal">🔄 Subscription Renewal</option>
                <option value="general">📌 General Task</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Amount (Optional)
              </label>
              <input
                type="text"
                value={newAmount}
                onChange={e => setNewAmount(e.target.value)}
                placeholder="e.g. ₹2,840"
                className="w-full px-3.5 py-2 rounded-xl border border-[#263040] text-xs font-normal text-slate-100 bg-[#10141a] focus:border-amber-500/80 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Notes
            </label>
            <input
              type="text"
              value={newNotes}
              onChange={e => setNewNotes(e.target.value)}
              placeholder="e.g. Bring previous test records"
              className="w-full px-3.5 py-2 rounded-xl border border-[#263040] text-xs font-normal text-slate-100 bg-[#10141a] focus:border-amber-500/80 focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="tactile-btn py-2 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
            >
              ✓ Save Reminder
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="tactile-btn py-2 px-3 rounded-xl bg-[#1e2634] text-slate-300 hover:text-white text-xs font-bold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#252f3e] pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`tactile-btn px-3 py-1 rounded-lg text-xs font-bold transition ${
            filter === 'all'
              ? 'bg-amber-600 text-white'
              : 'bg-[#151b24] text-slate-400 hover:text-slate-200'
          }`}
        >
          All ({reminders.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`tactile-btn px-3 py-1 rounded-lg text-xs font-bold transition ${
            filter === 'active'
              ? 'bg-amber-600 text-white'
              : 'bg-[#151b24] text-slate-400 hover:text-slate-200'
          }`}
        >
          Pending ({reminders.filter(r => !r.is_completed).length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`tactile-btn px-3 py-1 rounded-lg text-xs font-bold transition ${
            filter === 'completed'
              ? 'bg-amber-600 text-white'
              : 'bg-[#151b24] text-slate-400 hover:text-slate-200'
          }`}
        >
          Completed ({reminders.filter(r => r.is_completed).length})
        </button>
      </div>

      {/* Reminder Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#151b24] border border-dashed border-[#252f3e] text-center text-slate-400 text-xs font-medium">
            No reminders found in this category.
          </div>
        ) : (
          filtered.map((r) => {
            const isUrgent = r.is_urgent && !r.is_completed;
            return (
              <div
                key={r.id}
                className={`p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  r.is_completed
                    ? 'bg-[#12161f] border-[#222a36] opacity-60'
                    : isUrgent
                    ? 'bg-[#1e1713] border-amber-600/50'
                    : 'bg-[#151b24] border-[#252f3e]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">
                    {r.category === 'bill' ? '⚡' : r.category === 'medical' ? '🩺' : r.category === 'pension' ? '📜' : '📌'}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className={`text-sm font-bold ${r.is_completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                        {r.title}
                      </h3>
                      {r.amount && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-400 text-[10px] font-bold border border-emerald-800">
                          {r.amount}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-slate-300 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                        {r.due_date_formatted}
                      </span>
                      <span>•</span>
                      <span className={isUrgent ? 'font-bold text-amber-400' : 'text-slate-500'}>
                        {r.is_completed
                          ? 'Completed'
                          : r.days_remaining === 0
                          ? 'Due Today!'
                          : r.days_remaining === 1
                          ? 'Tomorrow'
                          : `Due in ${r.days_remaining} days`}
                      </span>
                    </div>

                    {r.notes && (
                      <p className="text-[11px] text-slate-400 mt-1">
                        {r.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => onToggleReminder(r.id)}
                    className={`tactile-btn flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                      r.is_completed
                        ? 'bg-[#12161f] text-slate-400 border-[#263040]'
                        : 'bg-emerald-950/60 text-emerald-300 border-emerald-700 hover:bg-emerald-900/60'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{r.is_completed ? 'Reopen' : 'Mark Done'}</span>
                  </button>

                  <button
                    onClick={() => onDeleteReminder(r.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 transition"
                    title="Delete reminder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
