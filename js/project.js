/* ════════════════════════════════════════════════════════════
       REPO DETAIL PAGE — dynamic loader
       URL format:  repo-detail.html#RepoName
                    repo-detail.html#Repo%20Name   (spaces → %20)
       Reads: project.json  (meta, stats, description, links)
              tree.json      (language breakdown + file tree + commits)
       ════════════════════════════════════════════════════════════ */

    /* ── LOADER dismiss ── */
    window.addEventListener('load', () => {
      setTimeout(() => document.getElementById('loader').classList.add('gone'), 1800);
    });

    /* ── CURSOR ── */
    const cur = document.getElementById('cur');
    document.addEventListener('mousemove', e => {
      cur.style.left = e.clientX + 'px';
      cur.style.top = e.clientY + 'px';
    });
    function bindCursor() {
      document.querySelectorAll('a,button,.tab,.commit-row,.branch-head,.tree-item').forEach(el => {
        el.addEventListener('mouseenter', () => cur.classList.add('big'));
        el.addEventListener('mouseleave', () => cur.classList.remove('big'));
      });
    }
    bindCursor();

    /* ── TABS ── */
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'));
        document.getElementById('panel-' + tab.dataset.tab).classList.remove('hidden');
      });
    });

    /* ── HELPERS ── */
    const extIcon = {
      py: '◈', ipynb: '◈', js: '◉', ts: '◉', html: '◇', htm: '◇',
      css: '◆', json: '◻', md: '▣', txt: '◻', sh: '▷', bat: '▷',
      jpg: '◌', jpeg: '◌', png: '◌', gif: '◌', webp: '◌', svg: '◌',
      woff: '◫', woff2: '◫', ttf: '◫', pdf: '▤', csv: '▦',
      lock: '◫', cfg: '◻', toml: '◻', yaml: '◻', yml: '◻',
      pyc: '◎', env: '◻'
    };

    function getIcon(name) {
      const ext = name.includes('.') ? name.split('.').pop().toLowerCase() : '';
      return extIcon[ext] || '◻';
    }

    function buildTree(obj) {
      const ul = document.createElement('ul');
      ul.className = 'tree-ul';
      for (const key in obj) {
        const li = document.createElement('li');
        if (obj[key] === null) {
          const ext = key.includes('.') ? key.split('.').pop().toLowerCase() : '';
          li.innerHTML = `<div class="tree-item is-file">
        <span class="t-icon">${getIcon(key)}</span>
        <span>${key}</span>
        <span class="t-ext">${ext ? '.' + ext : ''}</span>
      </div>`;
        } else {
          const item = document.createElement('div');
          item.className = 'tree-item is-folder';
          item.innerHTML = `<span class="t-icon">▸</span><span>${key}/</span>`;
          const sub = buildTree(obj[key]);
          sub.style.display = 'none';
          item.addEventListener('click', e => {
            e.stopPropagation();
            const open = sub.style.display !== 'none';
            sub.style.display = open ? 'none' : 'block';
            item.querySelector('.t-icon').textContent = open ? '▸' : '▾';
          });
          li.appendChild(item);
          li.appendChild(sub);
        }
        ul.appendChild(li);
      }
      return ul;
    }

    function fmtDate(iso) {
      if (!iso) return '—';
      return new Date(iso).toISOString().slice(0, 10);
    }

    function fmtYear(iso) {
      return iso ? new Date(iso).getFullYear() : '—';
    }

    const langColor = {
      'Python': '#3572A5', 'JavaScript': '#f1e05a', 'TypeScript': '#2b7489',
      'HTML': '#e34c26', 'CSS': '#563d7c', 'Jupyter Notebook': '#DA5B0B',
      'Batchfile': '#C1F12E', 'Shell': '#89e051', 'Java': '#b07219',
      'C++': '#f34b7d', 'C': '#555555', 'Go': '#00ADD8', 'Rust': '#dea584',
      'Ruby': '#701516', 'PHP': '#4F5D95', 'Swift': '#ffac45', 'Kotlin': '#F18E33',
    };

    /* ── SHOW NOT-FOUND ── */
    function showNotFound(msg) {
      document.getElementById('main-wrapper').style.display = 'none';
      document.getElementById('footer-el').style.display = 'none';
      const nf = document.getElementById('not-found');
      nf.style.display = 'block';
      document.getElementById('not-found-msg').textContent = msg;
      document.title = 'Itzudii — Repository Not Found';
    }
    // ── TOPICS — reads topics from the same project.json entry ───────────────
  
    // project.js fetches project.json and sets window._repoData or similar;
    // we poll briefly then also independently load if needed.
    function renderTopics(topics) {
      const row = document.getElementById('topics-row');
      if (!row) return;
      if (!topics || !topics.length) {
        row.innerHTML = '<span style="color:var(--dim);font-size:11px">No topics</span>';
        return;
      }
      row.innerHTML = topics.map(t =>
        `<span class="topic-badge"># ${t}</span>`
      ).join('');
    }

    // Strategy 1: if project.js exposes the repo object, use it
    // function tryFromGlobal() {
    //   // common patterns project.js might use
    //   const repo = window._currentRepo || window._repoData || window._repo;
    //   if (repo && Array.isArray(repo.topics)) {
    //     renderTopics(repo.topics);
    //     return true;
    //   }
    //   return false;
    // }

    // Strategy 2: fetch project.json ourselves using the same hash logic
    async function fetchTopics(resData) {
      // if (tryFromGlobal()) return;
      try {
        const hash = (location.hash || '').replace('#', '').trim();
        // const res  = await fetch('./project.json');
        const list = resData;
        const entry = Array.isArray(list)
          ? list.find(p => p.name === hash || p.full_name === hash)
          : list;
        if (entry) renderTopics(entry.topics || []);
      } catch (e) {
        console.warn('Topics loader:', e);
      }
    

    // Wait for project.js to finish (it's async), then render
    // if (document.readyState === 'loading') {
    //   document.addEventListener('DOMContentLoaded', () => setTimeout(fetchTopics, 300));
    // } else {
    //   setTimeout(fetchTopics, 300);
    // }

    // Also expose so project.js can call window.renderTopics(arr) directly
    // window.renderTopics = renderTopics;
  }

    /* ── BRANCHES RENDERER ── */
    let activeCommitRow = null;

    function renderBranches(commitsObj) {
      const ct = document.getElementById('branchTree');
      ct.innerHTML = '';
      if (!commitsObj || !Object.keys(commitsObj).length) {
        ct.innerHTML = '<div style="color:var(--dim);font-size:12px;letter-spacing:1px">No branch data available.</div>';
        return;
      }
      for (const branch in commitsObj) {
        const commits = commitsObj[branch];
        const block = document.createElement('div');
        block.className = 'branch-block';

        const head = document.createElement('div');
        head.className = 'branch-head';
        head.innerHTML = `
      <span class="b-name">${branch}</span>
      <span class="b-pill">${commits.length} commit${commits.length !== 1 ? 's' : ''}</span>
      <span class="chev">▶</span>`;

        const list = document.createElement('div');
        list.className = 'commits-list';

        commits.forEach(c => {
          const row = document.createElement('div');
          row.className = 'commit-row';
          const shortSha = c.sha ? c.sha.slice(0, 7) : '—';
          row.innerHTML = `<span class="c-sha">${shortSha}</span><span class="c-msg">${c.message || '—'}</span>`;
          row.addEventListener('click', () => {
            if (activeCommitRow) activeCommitRow.classList.remove('active');
            row.classList.add('active');
            activeCommitRow = row;
            showCommit({ sha: shortSha, msg: c.message || '—', date: c.date });
          });
          list.appendChild(row);
        });

        head.addEventListener('click', () => {
          const isOpen = list.classList.contains('open');
          list.classList.toggle('open', !isOpen);
          head.querySelector('.chev').classList.toggle('open', !isOpen);
        });

        block.appendChild(head);
        block.appendChild(list);
        ct.appendChild(block);
      }
      bindCursor();
    }

    function showCommit(c) {
      document.getElementById('cdEmpty').style.display = 'none';
      const inner = document.getElementById('cdInner');
      inner.classList.add('show');
      document.getElementById('cdSha').textContent = c.sha;
      document.getElementById('cdMsg').textContent = c.msg;
      document.getElementById('cdDate').textContent = c.date ? fmtDate(c.date) : '';
    }

    /* ════════════════════════════
       MAIN DATA LOADER
       ════════════════════════════ */
    async function loadRepo() {
      /* 1 — read repo name from hash, decode %20 → space */
      const rawHash = window.location.hash.slice(1);   // strip leading #
      if (!rawHash) {
        showNotFound('No repository specified in URL hash.  Use  #RepoName  or  #Repo%20Name');
        return;
      }
      const repoName = decodeURIComponent(rawHash);   // "Car Rental Website..." or exact name

      try {
        /* 2 — fetch both JSON files in parallel */
        const [projRes, treeRes] = await Promise.all([
          fetch('./json/project.json'),
          fetch('./json/tree.json')
        ]);
        const projects = await projRes.json();   // array
        const treeData = await treeRes.json();   // object keyed by repo name

        /* 3 — find matching project: 4-tier priority so dashes in real repo names are preserved
           Tier 1: exact match            →  #Car-Rental-Website-Flask-python
           Tier 2: case-insensitive       →  #car-rental-website-flask-python
           Tier 3: %20 spaces → dashes   →  #Car%20Rental%20Website%20Flask%20python
           Tier 4: strip all separators  →  #CarRentalWebsiteFlaskpython  (last resort only)
        */
        const ci = s => s.toLowerCase();
        const slug = s => s.toLowerCase().replace(/\s+/g, '-');      // spaces → dashes only
        const bare = s => s.toLowerCase().replace(/[\s\-_]+/g, ''); // strip all separators

        const proj =
          projects.find(p => p.name === repoName)                     // T1 exact
          || projects.find(p => ci(p.name) === ci(repoName))          // T2 case-insensitive
          || projects.find(p => ci(p.name) === slug(repoName))        // T3 space→dash
          || projects.find(p => bare(p.name) === bare(repoName));     // T4 fuzzy (last resort)

        if (!proj) {
          showNotFound(`"${repoName}" was not found in project.json.`);
          return;
        }

        /* 4 — get tree entry: same priority chain keyed by repo name */
        const treeEntry = treeData[proj.name]
          || Object.entries(treeData).find(([k]) => ci(k) === ci(proj.name))?.[1]
          || Object.entries(treeData).find(([k]) => bare(k) === bare(proj.name))?.[1]
          || null;

        const langs = treeEntry?.language || {};
        const tree = treeEntry?.tree || null;
        const commits = treeEntry?.commits || {};

        /* 5 — compute language breakdown */
        const totalBytes = Object.values(langs).reduce((a, b) => a + b, 0);
        const topLangs = Object.entries(langs)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([lang, bytes]) => ({ lang, pct: ((bytes / totalBytes) * 100).toFixed(0) }));

        /* 6 — count commits across all branches */
        const totalCommits = Object.values(commits).reduce((a, b) => a + b.length, 0);

        /* ── PAGE TITLE ── */
        document.title = `Itzudii — ${proj.name}`;

        /* ── NAV ── */
        document.getElementById('nav-owner').textContent =
          proj.full_name ? proj.full_name.split('/')[0] : 'Itzudii';

        /* ── AVATAR ── */
        const avatarEl = document.getElementById('owner-avatar');
        if (proj.avatar_url) avatarEl.src = proj.avatar_url;
        else avatarEl.src = 'https://avatars.githubusercontent.com/u/145835542?v=4';

        /* ── REPO TITLE (split on first dash/underscore/space for serif effect) ── */
        const titleEl = document.getElementById('repo-title-el');
        const words = proj.name.replace(/[-_]/g, ' ').split(' ').filter(Boolean);
        const half = Math.ceil(words.length / 2);
        const line1 = words.slice(0, half).join(' ');
        const line2 = words.slice(half).join(' ');
        titleEl.innerHTML = line2
          ? `${line1}<strong>${line2}</strong>`
          : `<strong>${line1}</strong>`;

        /* ── REPO SUB (top languages) ── */
        document.getElementById('repo-sub-el').textContent =
          topLangs.length ? topLangs.map(l => l.lang).join(' · ') : proj.language || '—';

        /* ── BADGES ── */
        const badgesEl = document.getElementById('badges-el');
        badgesEl.innerHTML = `
      <span class="badge badge-g">⭐ ${proj.stargazers_count} Star${proj.stargazers_count !== 1 ? 's' : ''}</span>
      <span class="badge">🍴 ${proj.forks_count} Fork${proj.forks_count !== 1 ? 's' : ''}</span>
      <span class="badge">👀 ${proj.watchers_count} Watcher${proj.watchers_count !== 1 ? 's' : ''}</span>
      <span class="badge">main branch</span>`;

        /* ── HEADER LINKS ── */
        const linksEl = document.getElementById('header-links-el');
        let linkHTML = `<a href="${proj.html_url}" target="_blank" rel="noopener" class="btn btn-primary">GitHub →</a>`;
        if (proj.homepage) {
          linkHTML += `<a href="${proj.homepage}" target="_blank" rel="noopener" class="btn btn-ghost">Live Demo ↗</a>`;
        }
        linksEl.innerHTML = linkHTML;

        /* ── OVERVIEW: description ── */
        const descEl = document.getElementById('proj-desc');
        if (proj.description) {
          descEl.textContent = proj.description;
        } else {
          descEl.innerHTML = `A repository by <em>${proj.full_name?.split('/')[0] || 'Itzudii'}</em>. No description provided.`;
        }

        /* ── OVERVIEW: meta table ── */
        const metaRows = [
          ['Created', fmtDate(proj.created_at)],
          ['Updated', fmtDate(proj.updated_at)],
          ['Pushed', fmtDate(proj.pushed_at)],
          ['Language', topLangs.map(l => `${l.lang} (${l.pct}%)`).join(', ') || proj.language || '—'],
          ['Branch', 'main'],
          ...(proj.homepage ? [['Deployment', proj.homepage]] : []),
        ];
        document.getElementById('meta-tbl').innerHTML =
          metaRows.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('');

        /* ── OVERVIEW: stats grid ── */
        const statEl = document.getElementById('stat-grid');
        statEl.innerHTML = [
          [proj.stargazers_count, 'Stars'],
          [proj.forks_count, 'Forks'],
          [totalCommits || '—', 'Commits'],
          [proj.size ? (proj.size > 1024 ? (proj.size / 1024).toFixed(1) + 'MB' : proj.size + 'KB') : '—', 'Size'],
        ].map(([v, l]) => `
      <div class="stat-cell">
        <div class="stat-val">${v}</div>
        <div class="stat-lbl">${l}</div>
      </div>`).join('');

        /* ── OVERVIEW: stack tags (from language keys) ── */
        const stackEl = document.getElementById('stack-row');
        const stackLangs = Object.keys(langs).length ? Object.keys(langs) : [proj.language || '—'];
        stackEl.innerHTML = stackLangs
          .map(l => {
            const c = langColor[l] || 'var(--dim)';
            return `<span class="stack-tag" style="color:${c};border-color:${c}22">
          <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${c};margin-right:5px;vertical-align:middle"></span>${l}
        </span>`;
          }).join('');

        /* ── STRUCTURE: file tree ── */
        const fileTreeEl = document.getElementById('fileTree');
        fileTreeEl.innerHTML = '';
        if (tree) {
          fileTreeEl.appendChild(buildTree(tree));
        } else {
          fileTreeEl.innerHTML = '<li style="color:var(--dim);font-size:12px;padding:10px">No file tree data in tree.json for this repo.</li>';
        }

        /* ── BRANCHES: commits ── */
        renderBranches(commits);

        await fetchTopics(projects);

        /* ── FOOTER ── */
        const ownerName = proj.full_name || proj.name;
        const firstYear = fmtYear(proj.created_at);
        const lastYear = fmtYear(proj.updated_at);
        const yearRange = firstYear === lastYear ? firstYear : `${firstYear}–${lastYear}`;
        document.getElementById('footer-name-el').textContent = ownerName;
        document.getElementById('footer-branch-el').innerHTML =
          `[ <span>main</span> · ${yearRange} ]`;

        /* ── bind cursor to freshly rendered elements ── */
        bindCursor();

      } catch (err) {
        showNotFound(`Failed to load project data: ${err.message}`);
        console.error(err);
      }
    }

    /* ── RUN + re-run on hash change ── */
    loadRepo();
    window.addEventListener('hashchange', () => {
      // Reset panels to default state before reloading
      document.querySelectorAll('.panel').forEach((p, i) => p.classList.toggle('hidden', i !== 0));
      document.querySelectorAll('.tab').forEach((t, i) => t.classList.toggle('active', i === 0));
      document.getElementById('main-wrapper').style.display = '';
      document.getElementById('footer-el').style.display = '';
      document.getElementById('not-found').style.display = 'none';
      loadRepo();
    });