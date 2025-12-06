// ==================== SCROLL ANIMATIONS ==================== 

// Initialize Intersection Observer for scroll animations
const initScrollAnimations = () => {
  // Get all elements with data-animate attribute
  const animatedElements = document.querySelectorAll('[data-animate]');

  // Create Intersection Observer options
  const observerOptions = {
    threshold: 0.15, // Trigger when 15% of element is visible
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is fully visible
  };

  // Create the observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // When element enters viewport
      if (entry.isIntersecting) {
        // Add show class to trigger animation
        entry.target.classList.add('show');
        // Optional: Stop observing after animation (for performance)
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all animated elements
  animatedElements.forEach((element) => {
    observer.observe(element);
  });
};

// Run animations when DOM is ready
document.addEventListener('DOMContentLoaded', initScrollAnimations);

// ==================== HAMBURGER MENU ==================== 

// Hamburger Menu Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle menu on button click
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// Close menu when a link is clicked
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.navbar')) {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
  }
});