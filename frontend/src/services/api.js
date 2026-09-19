const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchSamples() {
  const res = await fetch(`${API_BASE}/samples`);
  return res.json();
}

export async function analyzeContent(content, language = 'en', taskContext = null) {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content,
      language,
      task_context: taskContext
    })
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Server responded with status ${res.status}`);
  }
  return res.json();
}

export async function checkSafety(content, language = 'en') {
  const res = await fetch(`${API_BASE}/safety-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content,
      language
    })
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Server responded with status ${res.status}`);
  }
  return res.json();
}

export async function fetchReminders() {
  const res = await fetch(`${API_BASE}/reminders`);
  if (!res.ok) {
    throw new Error('Failed to fetch reminders');
  }
  return res.json();
}

export async function createReminder(reminderData) {
  const res = await fetch(`${API_BASE}/reminders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reminderData)
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to create reminder');
  }
  return res.json();
}

export async function toggleReminder(reminderId) {
  const res = await fetch(`${API_BASE}/reminders/${reminderId}/toggle`, {
    method: 'PATCH'
  });
  if (!res.ok) {
    throw new Error('Failed to update reminder status');
  }
  return res.json();
}

export async function deleteReminder(reminderId) {
  const res = await fetch(`${API_BASE}/reminders/${reminderId}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    throw new Error('Failed to delete reminder');
  }
  return res.json();
}

export async function uploadDocumentFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'File upload failed');
  }
  return res.json();
}
