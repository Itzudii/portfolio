(async function loadAchievements() {
  try {
    const res = await fetch('./json/achievement.json');
    const items = await res.json();

    const typeLabel = { patent: 'Patent', copyright: 'Copyright', research: 'Research Paper' };
    const typeCls   = { patent: 'ach-type-patent', copyright: 'ach-type-copyright', research: 'ach-type-research' };

    function renderItems(filter) {
      const filtered = filter === 'all' ? items : items.filter(a => a.type === filter);
      const list = document.getElementById('ach-list');
      list.innerHTML = '';

      if (!filtered.length) {
        list.innerHTML = `<div style="padding:60px;color:var(--dim)">No entries in this category.</div>`;
        return;
      }

      filtered.forEach((a, i) => {
        const num   = String(i + 1).padStart(2, '0');
        const badge = `<span class="ach-type-badge ${typeCls[a.type] || ''}">${typeLabel[a.type] || a.type}</span>`;
        const link  = a.url ? `<a href="${a.url}" target="_blank" rel="noopener" class="ach-link">View Document</a>` : '';
        const authors = a.authors ? `<div class="ach-authors">${a.authors}</div>` : '';

        const el = document.createElement('div');
        el.className = 'ach-item rv';
        el.innerHTML = `
          <div class="ach-num">${num}</div>
          <div class="ach-content">
            ${badge}
            <div class="ach-title">${a.title}</div>
            ${authors}
            <div class="ach-desc">${a.description || ''}</div>
          </div>
          <div class="ach-meta">
            <div>
              <div class="ach-year">${a.year || '—'}</div>
              <div class="ach-id">${a.id || ''}</div>
            </div>
            ${link}
          </div>`;
        list.appendChild(el);
        if (window._revealObsInstance) window._revealObsInstance.observe(el);
      });
      if (typeof refreshCursorTargets === 'function') refreshCursorTargets();
    }

    // Tab switching
    document.getElementById('ach-tabs').addEventListener('click', e => {
      const btn = e.target.closest('.ach-tab');
      if (!btn) return;
      document.querySelectorAll('.ach-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      renderItems(btn.dataset.type);
    });

    renderItems('all');
  } catch (err) {
    const list = document.getElementById('ach-list');
    if (list) list.innerHTML =
      '<div style="padding:60px;color:var(--dim)">Could not load achievement.json — make sure it is served alongside this file.</div>';
    console.error('Achievements loader error:', err);
  }
})();