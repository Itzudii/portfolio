// Nav active link
const navSections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const pos = window.scrollY + 80;
  navSections.forEach(s => {
    const link = document.querySelector('.nav-link[href="#' + s.id + '"]');
    if (link) link.classList.toggle('active', pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight);
  });
});