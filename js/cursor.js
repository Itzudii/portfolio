// Custom cursor
const cur = document.getElementById('cur');
document.addEventListener('mousemove', e => {
  cur.style.left = e.clientX + 'px';
  cur.style.top  = e.clientY + 'px';
});
document.addEventListener('click', () => {
  cur.style.transform = 'translate(-50%,-50%) scale(0.7)';
  setTimeout(() => cur.style.transform = 'translate(-50%,-50%) scale(1)', 150);
});
function refreshCursorTargets() {
  document.querySelectorAll('a,button,.work-item,.contact-row').forEach(el => {
    el.addEventListener('mouseenter', () => cur.classList.add('big'));
    el.addEventListener('mouseleave', () => cur.classList.remove('big'));
  });
}
refreshCursorTargets();