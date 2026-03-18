/**
 * portfolio.js
 * Loads info.json, populates all portfolio content,
 * and fetches GitHub repos for the projects section.
// ─── Helpers ────────────────────────────────────────────────────────────────

/** Parse *italic* markers in a string and return HTML with <strong> wrapping */
function parseMarkers(str) {
  return str.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
}

/** Build dot-proficiency HTML (5 dots, `pro` filled) */
function buildDots(pro) {
  let html = '<div class="skill-dots">';
  for (let i = 1; i <= 5; i++) {
    html += `<div class="dot${i <= pro ? ' on' : ''}"></div>`;
  }
  return html + '</div>';
}

// ─── Section renderers ──────────────────────────────────────────────────────

function populateNav(data) {
  const navName = document.getElementById('nav-name');
  if (navName) navName.textContent = data.name;
}

function populateHero(data) {
  // Name split (first / last)
  const parts = data.name.trim().split(' ');
  const first = parts[0];
  const rest  = parts.slice(1).join(' ');
  document.getElementById('hero-first').textContent = first;
  document.getElementById('hero-last').textContent  = rest;

  // Role
  document.getElementById('hero-role').textContent = data.position;

  // Description lines
  const bodyEl = document.getElementById('hero-body');
  bodyEl.innerHTML = data.des.map(line => parseMarkers(line)).join('<br/>');

  // Stats
  document.getElementById('stat-experience').textContent   = data.experience + '+';
  document.getElementById('stat-projects').textContent     = data['projects-shipped'];

  // Skill tags
  const tagList = document.getElementById('hero-tags');
  tagList.innerHTML = data.skills.map(s => `<span class="hero-tag">${s}</span>`).join('');

  // ASCII box location
  const loc = (data.location[0] || '—').toUpperCase().padEnd(21);
  const asciiBox = document.getElementById('ascii-box');
  if (asciiBox) {
    asciiBox.textContent =
` ┌─────────────────────────────────────┐
 │  SYSTEM STATUS: OPERATIONAL     │
 │  MODE: OPEN TO OPPORTUNITIES    │
 │  LOCATION: ${loc}│
 └─────────────────────────────────────┘`;
  }

  // Footer
  document.getElementById('footer-name').textContent = data.name;
}

function populateAbout(data) {
  // Sidebar
  document.getElementById('sidebar-location').innerHTML =
    data.location.map(l => l).join('<br/>');

  document.getElementById('sidebar-education').innerHTML =
    data.education.join('<br/>');

  document.getElementById('sidebar-languages').innerHTML =
    data.languages.join('<br/>');

  // Contact links in sidebar
  const email = data.contact.email;
  const li    = data.contact.linkedin;
  const gh    = data.contact.github;
  document.getElementById('sidebar-email-link').href        = `mailto:${email}`;
  // document.getElementById('sidebar-email-text').textContent = "Email";
  document.getElementById('sidebar-linkedin-link').href     = li.startsWith('http') ? li : `https://${li}`;
  document.getElementById('sidebar-github-link').href       = gh.startsWith('http') ? gh : `https://github.com/${gh}`;

  // About section heading tags
  const headTags = document.getElementById('about-head-tags');
  if (headTags) {
    headTags.innerHTML = data.tags.map(t => `<strong>${t}</strong>`).join(' &amp; ');
  }

  // Article text
  document.getElementById('about-para1').innerHTML = parseMarkers(data.article.para1);
  document.getElementById('about-para2').innerHTML = parseMarkers(data.article.para2);

  // Skills deep table
  const tbody = document.getElementById('skills-tbody');
  tbody.innerHTML = data['skill-deep'].map(s => `
    <tr>
      <td>${s.skill}</td>
      <td>${s.lvl}</td>
      <td>${buildDots(s.pro)}</td>
      <td style="color:var(--dim)">${s.years}</td>
    </tr>
  `).join('');
}

function populateExperience(data) {
  const list = document.getElementById('career-list');
  list.innerHTML = data['career-history'].map((job, i) => `
    <div class="exp-item">
      <div class="exp-period">—</div>
      <div>
        <div class="exp-role">${job.position}</div>
        <div class="exp-company">${job.compony}</div>
        <p class="exp-desc">${job.des}</p>
        <ul class="exp-achievements">
          ${job.work.map(w => `<li>${w}</li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('');
}

function populateTerminal(data) {
  const t = data.terminal;

  document.getElementById('t-whoami').textContent = t.whoami;

  const skillLines = document.getElementById('t-skills');
  skillLines.innerHTML = t.skill.map(s =>
    `<div class="t-output">[ ${s.split(', ').map(k => `<span class="t-highlight">${k.trim()}</span>`).join(', ')} ]</div>`
  ).join('');

  const statLines = document.getElementById('t-stat');
  statLines.innerHTML = t.stat.map(s => `<div class="t-output">${s}</div>`).join('');

  const hireLines = document.getElementById('t-hireme');
  hireLines.innerHTML = t['hire-me'].map(s => {
    // highlight *text*
    return `<div class="t-output">${s.replace(/\*(.*?)\*/g, '<span class="t-highlight">$1</span>')}</div>`;
  }).join('');

  // Typing animation commands
  if (t['animation-tag'] && t['animation-tag'].length) {
    window._terminalCmds = t['animation-tag'];
  }
}

function populateContact(data) {
  const lw = data['let-work'];
  document.getElementById('contact-desc').textContent = lw.des;
  document.getElementById('contact-cta').href         = `mailto:${lw.email}`;
  document.getElementById('contact-email-row').href   = `mailto:${lw.email}`;
  document.getElementById('contact-email-text').textContent = lw.email;

  const li = data.contact.linkedin;
  const gh = data.contact.github;
  const liHref = li.startsWith('http') ? li : `https://${li}`;
  const ghHref = gh.startsWith('http') ? gh : `https://github.com/${gh}`;
  document.getElementById('contact-linkedin-link').href = liHref;
  document.getElementById('contact-github-link').href   = ghHref;

  const liText = document.getElementById('contact-linkedin-text');
  const ghText = document.getElementById('contact-github-text');
  if (liText) liText.textContent = li.replace(/^https?:\/\//, '');
  if (ghText) ghText.textContent = gh.replace(/^https?:\/\//, '');

  // Resume link
  if (data.resume) {
    document.getElementById('contact-resume-link').href = data.resume;
  }
}

// // ─── GitHub Projects ─────────────────────────────────────────────────────────

// async function populateProjects(data) {
//   const workList  = document.getElementById('work-list');
//   const workCount = document.getElementById('work-count');

//   // Derive username – try contact.github, else fall back to placeholder
//   let username = githubUsername(data.contact);

//   // If we can't derive a real username, show a graceful fallback message
//   if (!username || username.includes('@')) {
//     workList.innerHTML = `<div style="padding:60px;color:var(--dim);font-size:13px;">
//       Configure a GitHub username in <code>info.json → contact.github</code> to load live projects.
//     </div>`;
//     return;
//   }

//   try {
//     let repos = JSON.parse(sessionStorage.getItem("repos"));
//     if (!repos){
//       const res  = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=20`);
//       if (!res.ok) throw new Error(`GitHub API ${res.status}`);
//       repos = await res.json();
//       sessionStorage.setItem("repos",JSON.stringify(repos));
//     }
//     console.log(repos);

//     // Filter out forks, sort by stars desc, take top 6
//     const picked = repos
//       .filter(r => !r.fork)
//       .sort((a, b) => b.stargazers_count - a.stargazers_count)
//       .slice(0, 6);

//     if (!picked.length) {
//       workList.innerHTML = `<div style="padding:60px;color:var(--dim)">No public repositories found.</div>`;
//       return;
//     }

//     workCount.textContent = `${String(picked.length).padStart(2, '0')} PROJECTS`;

//     workList.innerHTML = picked.map((repo, i) => {
//       const num       = String(i + 1).padStart(2, '0') + '.';
//       const year      = new Date(repo.updated_at).getFullYear();
//       const desc      = repo.description || 'No description provided.';
//       const topics    = (repo.topics || []).slice(0, 6);
//       const lang      = repo.language;
//       const tags      = [...(lang ? [lang] : []), ...topics].slice(0, 6);
//       const delay     = i > 0 ? ` style="transition-delay:${i * 0.1}s"` : '';

//       return `
//         <div class="work-item rv"${delay}>
//           <div class="work-num">${num}</div>
//           <div class="work-body">
//             <a href="repo-detail (1).html#${repo.name}" style="text-decoration: none;">
//               <div class="work-title">${repo.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</div>
//             </a>
//             <p class="work-desc">${desc}</p>
//             <div class="work-stack">
//               ${tags.map(t => `<span class="work-tag">${t}</span>`).join('')}
//               ${repo.stargazers_count > 0 ? `<span class="work-tag">★ ${repo.stargazers_count}</span>` : ''}
//             </div>
//             <div class="work-img"><div class="work-img-bar"></div></div>
//           </div>
//           <div class="work-meta">
//             <span class="work-year">${year}</span>
//             <div class="work-links">
//               ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" rel="noopener" class="work-link">Live Demo</a>` : ''}
//               <a href="${repo.html_url}" target="_blank" rel="noopener" class="work-link">GitHub</a>
//             </div>
//           </div>
//         </div>`;
//     }).join('');

//     // Re-observe new .rv elements for scroll animation
//     const observer = new IntersectionObserver(entries => {
//       entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
//     }, { threshold: 0.08 });
//     workList.querySelectorAll('.rv').forEach(el => observer.observe(el));

//   } catch (err) {
//     console.warn('GitHub API error:', err);
//     workList.innerHTML = `<div style="padding:60px;color:var(--dim)">
//       Could not load projects from GitHub. Check your network connection or API rate limit.
//     </div>`;
//   }
// }

// ─── Terminal typing animation ────────────────────────────────────────────────

function startTyping() {
  const cmds   = window._terminalCmds || ['contact --email', 'open resume.pdf', 'start --interview'];
  const el     = document.getElementById('typing-cmd');
  if (!el) return;

  let ci = 0, ci2 = 0, deleting = false;

  function tick() {
    const cmd = cmds[ci % cmds.length];
    if (!deleting) {
      el.textContent = cmd.slice(0, ++ci2);
      if (ci2 === cmd.length) { deleting = true; setTimeout(tick, 1800); return; }
    } else {
      el.textContent = cmd.slice(0, --ci2);
      if (ci2 === 0) { deleting = false; ci++; setTimeout(tick, 400); return; }
    }
    setTimeout(tick, deleting ? 40 : 80);
  }
  tick();
}

// ─── Boot ────────────────────────────────────────────────────────────────────

async function boot() {
  try {
    // Strip JSON comments (the info.json has // comments which are invalid JSON)
    let raw = sessionStorage.getItem("info");
    if (!raw){
      raw  = await fetch('./json/info.json').then(r => r.text());
      sessionStorage.setItem("info",raw);
    }
    const clean = raw.replace(/\/\/[^\n]*/g, '');   // strip // comments
    const data  = JSON.parse(clean);
    
    populateNav(data);
    populateHero(data);
    populateAbout(data);
    populateExperience(data);
    populateTerminal(data);
    populateContact(data);

    startTyping();

  } catch (err) {
    console.error('Portfolio boot error:', err);
  }
}

document.addEventListener('DOMContentLoaded', boot);
