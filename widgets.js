// Utility Widget Functions
const ImpactWidgets = {
  updateMeters(stressIndex) {
    const fill = document.getElementById('meterFill');
    const levelText = document.getElementById('riskLevel');

    if (!fill || !levelText) return;

    fill.style.width = stressIndex + '%';

    if (stressIndex > 70) {
      fill.style.background = '#ef4444';
      levelText.textContent = 'HIGH RISK (CRITICAL)';
      levelText.style.color = '#ef4444';
    } else if (stressIndex > 40) {
      fill.style.background = '#f59e0b';
      levelText.textContent = 'MODERATE';
      levelText.style.color = '#f59e0b';
    } else {
      fill.style.background = '#10b981';
      levelText.textContent = 'OPTIMAL / BALANCED';
      levelText.style.color = '#10b981';
    }
  },

  renderTasks(tasks, container, toggleCallback) {
    container.innerHTML = '';
    if (tasks.length === 0) {
      container.innerHTML = '<li class="task-item">No active impact tasks registered.</li>';
      return;
    }

    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;
      
      li.innerHTML = `
        <div>
          <span>${task.title}</span>
          <span class="task-tag">${task.category}</span>
          <span class="task-tag">+${task.impactScore} pts</span>
        </div>
        <button class="btn-primary" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;">
          ${task.completed ? 'Undo' : 'Complete'}
        </button>
      `;

      li.querySelector('button').addEventListener('click', () => toggleCallback(task.id));
      container.appendChild(li);
    });
  },

  renderPeers(peers, container) {
    container.innerHTML = '';
    peers.forEach(peer => {
      const card = document.createElement('div');
      card.className = 'peer-card';
      card.innerHTML = `
        <h3>${peer.name}</h3>
        <p style="font-size:0.85rem; color: var(--text-muted);">${peer.course}</p>
        <p style="margin-top:0.5rem; font-size:0.9rem;"><strong>Focus:</strong> ${peer.strength}</p>
        <div class="peer-status">● ${peer.status}</div>
      `;
      container.appendChild(card);
    });
  }
};