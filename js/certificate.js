(async function loadCertificates() {
  try {
    const res   = await fetch('./json/certificate.json');
    const certs = await res.json();

    const grid  = document.getElementById('cert-grid');
    const count = document.getElementById('cert-count');
    grid.innerHTML = '';
    if (count) count.textContent = certs.length + ' CERTIFICATES';

    certs.forEach(c => {
      const card = document.createElement('div');
      card.className = 'cert-card rv';
      card.innerHTML = `
        <div class="cert-card-top">
          <div class="cert-card-icon">🎓</div>
          <div class="cert-card-title">${c.title}</div>
          <div class="cert-card-issuer">${c.issuer || ''}</div>
          <div class="cert-card-date">${c.date || ''}</div>
        </div>
        <div class="cert-card-footer">
          <span class="cert-card-pdf">PDF Certificate</span>
          <span class="cert-card-arrow">→</span>
        </div>
        <div class="cert-card-bar"></div>`;

      card.addEventListener('click', () => openPDF(c.src, c.title));
      grid.appendChild(card);
      if (window._revealObsInstance) window._revealObsInstance.observe(card);
    });

    if (typeof refreshCursorTargets === 'function') refreshCursorTargets();
  } catch (err) {
    const grid = document.getElementById('cert-grid');
    if (grid) grid.innerHTML =
      '<div style="padding:60px;color:var(--dim);grid-column:1/-1">Could not load certificate.json — make sure it is served alongside this file.</div>';
    console.error('Certificates loader error:', err);
  }
})();

// PDF modal logic
function openPDF(src, title) {
  const modal    = document.getElementById('pdf-modal');
  const frame    = document.getElementById('pdf-frame');
  const dlLink   = document.getElementById('pdf-download');
  const modalTitle = document.getElementById('pdf-modal-title');
  frame.src      = src;
  dlLink.href    = src;
  modalTitle.textContent = title || 'Certificate';
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closePDF() {
  const modal = document.getElementById('pdf-modal');
  modal.classList.remove('open');
  document.getElementById('pdf-frame').src = '';
  document.body.style.overflow = '';
}
document.getElementById('pdf-close').addEventListener('click', closePDF);
document.getElementById('pdf-backdrop').addEventListener('click', closePDF);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePDF(); });