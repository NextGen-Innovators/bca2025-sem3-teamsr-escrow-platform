const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

function closeMenu() {
  navToggle.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navMenu.classList.remove('open');
}

navToggle.addEventListener('click', () => {
  const isOpen = navToggle.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
  navMenu.classList.toggle('open', isOpen);
});

navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});