// <!-- ── PROJECT SECTION — reads project.json + tree.json ──────────────────── -->
(async function loadProjects() {
  try {
    const [projectRes, treeRes] = await Promise.all([
      fetch('./json/project.json'),
      fetch('./json/tree.json')
    ]);
    const projects = await projectRes.json();
    const treeData = await treeRes.json();

    const selected = projects.filter(p => p.selected !== false);

    // Language colour palette (extend as needed)
    const langColor = {
      'Python':         '#3572A5',
      'JavaScript':     '#f1e05a',
      'TypeScript':     '#2b7489',
      'HTML':           '#e34c26',
      'CSS':            '#563d7c',
      'Jupyter Notebook':'#DA5B0B',
      'Batchfile':      '#C1F12E',
      'Shell':          '#89e051',
      'Java':           '#b07219',
      'C++':            '#f34b7d',
      'C':              '#555555',
      'Go':             '#00ADD8',
      'Rust':           '#dea584',
      'Ruby':           '#701516',
      'PHP':            '#4F5D95',
      'Swift':          '#ffac45',
      'Kotlin':         '#F18E33',
    };

    function getLanguages(repoName) {
      const entry = treeData[repoName];
      if (!entry || !entry.language) return {};
      return entry.language; // { "Python": 111950, "JavaScript": 64705, ... }
    }

    function buildLangBadges(langObj) {
      const total = Object.values(langObj).reduce((a, b) => a + b, 0);
      if (total === 0) return '';
      // Sort by bytes desc, take top 4
      const sorted = Object.entries(langObj).sort((a, b) => b[1] - a[1]).slice(0, 4);
      return sorted.map(([lang, bytes]) => {
        const pct = ((bytes / total) * 100).toFixed(0);
        const color = langColor[lang] || '#888';
        return `<span class="work-tag" style="border-color:${color};color:${color}">
          <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${color};margin-right:4px;vertical-align:middle"></span>${lang} ${pct}%
        </span>`;
      }).join('');
    }

    function formatDate(iso) {
      if (!iso) return '—';
      const d = new Date(iso);
      return d.getFullYear();
    }

    const list = document.getElementById('work-list');
    list.innerHTML = '';  // clear loader

    selected.forEach((repo, i) => {
      const num   = String(i + 1).padStart(2, '0');
      const year  = formatDate(repo.pushed_at || repo.updated_at);
      const langs = getLanguages(repo.name);
      const badges = buildLangBadges(langs);
      const desc  = repo.description || 'No description provided.';
      const liveLink = repo.homepage
        ? `<a href="${repo.homepage}" target="_blank" rel="noopener" class="work-link">Live Demo</a>`
        : '';

      const item = document.createElement('div');
      item.className = 'work-item rv';
      item.innerHTML = `
        <div class="work-num">${num}</div>
        <div class="work-body">
          <a href="project.html#${repo.name}" style="text-decoration: none;">
          <div class="work-title">${repo.name.replace(/-/g, ' ').replace(/_/g, ' ')}</div>
          </a><div class="work-desc">${desc}</div>
          <div class="work-stack">${badges}</div>
          <div class="work-img"><div class="work-img-bar"></div></div>
        </div>
        <div class="work-meta">
          <span class="work-year">${year}</span>
          <div class="work-links">
            <a href="${repo.html_url}" target="_blank" rel="noopener" class="work-link">View Source</a>
            ${liveLink}
          </div>
        </div>`;

      list.appendChild(item);

      // Observe for scroll reveal
      if (window._revealObs) window._revealObs.observe(item);
    });

    // Update project count
    const countEl = document.getElementById('work-count');
    if (countEl) countEl.textContent = selected.length + ' PROJECTS';

    // Re-attach cursor hover on new elements
    if (typeof refreshCursorTargets === 'function') refreshCursorTargets();

    // Re-observe newly added .rv elements
    document.querySelectorAll('.rv:not(.in)').forEach(el => {
      if (window._revealObsInstance) window._revealObsInstance.observe(el);
    });

  } catch (err) {
    const list = document.getElementById('work-list');
    if (list) list.innerHTML =
      '<div style="padding:60px;color:var(--dim)">Could not load projects — make sure project.json and tree.json are served alongside this file.</div>';
    console.error('Project loader error:', err);
  }
})();