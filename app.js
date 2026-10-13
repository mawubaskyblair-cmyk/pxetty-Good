document.addEventListener('DOMContentLoaded', () => {
  // Navigation Handler
  const navButtons = document.querySelectorAll('.nav-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      
      navButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(targetTab).classList.add('active');
    });
  });

  // Range slider sync
  const loadScoreInput = document.getElementById('loadScore');
  const loadValDisplay = document.getElementById('loadVal');
  if (loadScoreInput) {
    loadScoreInput.addEventListener('input', (e) => {
      loadValDisplay.textContent = e.target.value;
    });
  }

  // Load Initial Data
  fetchTasks();
  fetchPeers();

  // Task Creation Form
  const quickTaskForm = document.getElementById('quickTaskForm');
  quickTaskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('taskTitle').value;
    const category = document.getElementById('taskCategory').value;
    const impactScore = document.getElementById('impactScore').value;

    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, impactScore })
    });

    const data = await res.json();
    if (data.success) {
      document.getElementById('taskTitle').value = '';
      fetchTasks();
    }
  });

  // Stress Diagnostic Form
  const stressForm = document.getElementById('stressForm');
  stressForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const loadScore = Number(document.getElementById('loadScore').value);
    const sleepHours = Number(document.getElementById('sleepHours').value);
    const examProximity = Number(document.getElementById('examProximity').value);

    const res = await fetch('/api/stress-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loadScore, sleepHours, examProximity })
    });

    const result = await res.json();
    if (result.success) {
      const box = document.getElementById('stressResult');
      box.classList.remove('hidden');
      document.getElementById('riskAdvice').textContent = result.recommendation;
      ImpactWidgets.updateMeters(result.stressIndex);
      
      const statusVal = document.getElementById('burnoutStatusVal');
      statusVal.textContent = result.status;
      statusVal.className = `stat-value ${result.status === 'CRITICAL' ? 'text-danger' : 'status-good'}`;
    }
  });

  // Emergency trigger
  document.getElementById('triggerEmergencyBtn').addEventListener('click', () => {
    alert('SOS Alert Dispatched. Campus student support desk has been notified for prioritized check-in.');
  });
});

async function fetchTasks() {
  const res = await fetch('/api/tasks');
  const data = await res.json();
  if (data.success) {
    const listContainer = document.getElementById('taskList');
    ImpactWidgets.renderTasks(data.data, listContainer, toggleTask);
  }
}

async function toggleTask(id) {
  const res = await fetch(`/api/tasks/${id}/toggle`, { method: 'PATCH' });
  const data = await res.json();
  if (data.success) {
    fetchTasks();
  }
}

async function fetchPeers() {
  const res = await fetch('/api/peers');
  const data = await res.json();
  if (data.success) {
    const peerGrid = document.getElementById('peerGrid');
    ImpactWidgets.renderPeers(data.data, peerGrid);
  }
}