// Check if user is logged in
const isLoggedIn = sessionStorage.getItem('isLoggedIn');
if (!isLoggedIn) {
  window.location.href = 'login.html';
}

const userEmail = sessionStorage.getItem('userEmail');
if (userEmail) {
  const profileName = document.querySelector('.profile-name');
  if (profileName) {
    profileName.textContent = userEmail.split('@')[0]; // Show username from email
  }
}

// DOM Elements
const dashboardSidebar = document.getElementById("dashboardSidebar");
const userMenu = document.getElementById("userMenu");
const userMenuTrigger = document.getElementById("user-menu-trigger");
const userMenuDropdown = document.querySelector(".user-menu-dropdown");
const themeToggle = document.getElementById("theme-toggle");
const dashboardViews = document.querySelectorAll(".dashboard-view");
const dashboardNavItems = document.querySelectorAll(".dashboard-nav-item");
const dashboardTitle = document.getElementById("dashboardTitle");
const dashboardSidebarOverlay = document.getElementById("dashboardSidebarOverlay");
const searchContainer = document.getElementById("searchContainer");
const searchInput = document.getElementById("searchInput");
const searchClose = document.getElementById("searchClose");
const mobileSearchBtn = document.getElementById("mobileSearchBtn");

// Elements
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const menuToggle = document.getElementById('menuToggle');
const sidebarClose = document.getElementById('sidebarClose');
const profileBtn = document.getElementById('profileBtn');
const profileMenu = document.getElementById('profileMenu');
const pageTitle = document.getElementById('pageTitle');
const navItems = document.querySelectorAll('.nav-item[data-section]');
const sections = document.querySelectorAll('.section');
const logoutBtns = document.querySelectorAll('#logoutBtn, #logoutDropdown');
const themeToggleButtons = document.querySelectorAll('.theme-option');

// State
let sidebarCollapsed = false;
let currentView = "overview";

// Theme
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeUI();

themeToggleButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const theme = btn.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeUI();
  });
});

function updateThemeUI() {
  const theme = document.documentElement.getAttribute('data-theme');
  themeToggleButtons.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-theme') === theme);
  });
}

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener("DOMContentLoaded", function () {
  initTheme();
  initThemeToggle();
  initSidebar();
  initUserMenu();
  initNavigation();
  initSearch();
  initCharts();
});

// ===================================
// SIDEBAR FUNCTIONALITY
// ===================================

function initSidebar() {
  // Load saved sidebar state
  sidebarCollapsed = localStorage.getItem("dashboard-sidebar-collapsed") === "true";
  dashboardSidebar.classList.toggle("collapsed", sidebarCollapsed);

  // Sidebar toggle functionality
  document.querySelectorAll(".dashboard-sidebar-toggle").forEach((toggle) => {
    toggle.addEventListener("click", toggleSidebar);
  });

  // Sidebar overlay functionality
  dashboardSidebarOverlay?.addEventListener("click", closeSidebar);
}

function toggleSidebar() {
  sidebarCollapsed = !sidebarCollapsed;
  const isMobile = window.innerWidth <= 1024;

  if (isMobile) {
    // Mobile behavior - toggle sidebar and overlay together
    const isOpen = dashboardSidebar.classList.contains("collapsed");
    dashboardSidebar.classList.toggle("collapsed", !isOpen);
    dashboardSidebarOverlay?.classList.toggle("active", !isOpen);
  } else {
    // Desktop behavior
    dashboardSidebar.classList.toggle("collapsed", sidebarCollapsed);
  }

  localStorage.setItem("dashboard-sidebar-collapsed", sidebarCollapsed.toString());
}

function closeSidebar() {
  if (window.innerWidth <= 1024) {
    dashboardSidebar.classList.remove("collapsed");
    dashboardSidebarOverlay?.classList.remove("active");
  }
}

// Toggle Sidebar
menuToggle.addEventListener('click', () => {
  sidebar.classList.add('open');
  sidebarOverlay.classList.add('active');
});

sidebarClose.addEventListener('click', () => {
  closeSidebar();
});

sidebarOverlay.addEventListener('click', () => {
  closeSidebar();
});

function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('active');
}

// ===================================
// USER MENU FUNCTIONALITY
// ===================================

function initUserMenu() {
  if (!userMenuTrigger || !userMenu) return;

  userMenuTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    userMenu.classList.toggle("active");
  });

  // Close menu when clicking outside or pressing escape
  document.addEventListener("click", (e) => {
    if (!userMenu.contains(e.target)) {
      userMenu.classList.remove("active");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && userMenu.classList.contains("active")) {
      userMenu.classList.remove("active");
    }
  });
}

// Toggle Profile Menu
profileBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  profileMenu.classList.toggle('open');
});

document.addEventListener('click', () => {
  profileMenu.classList.remove('open');
});

profileMenu.addEventListener('click', (e) => {
  e.stopPropagation();
});

// ===================================
// NAVIGATION FUNCTIONALITY
// ===================================

function initNavigation() {
  dashboardNavItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const viewId = item.getAttribute("data-view");
      if (viewId) switchView(viewId);
    });
  });
}

function switchView(viewId) {
  // Update active nav item
  dashboardNavItems.forEach((item) => {
    item.classList.toggle("active", item.getAttribute("data-view") === viewId);
  });

  // Hide all views and show selected one
  dashboardViews.forEach((view) => view.classList.remove("active"));

  const targetView = document.getElementById(viewId);
  if (targetView) {
    targetView.classList.add("active");
    currentView = viewId;
    updatePageTitle(viewId);
  }

  // Close sidebar on mobile after navigation
  if (window.innerWidth <= 1024) closeSidebar();
}

function updatePageTitle(viewId) {
  const titles = {
    overview: "Overview",
    projects: "Projects",
    tasks: "Tasks",
    reports: "Reports",
    settings: "Settings",
  };

  if (dashboardTitle) {
    dashboardTitle.textContent = titles[viewId] || "Dashboard";
  }
}

// ===================================
// THEME FUNCTIONALITY
// ===================================

function initTheme() {
  // Load saved theme
  const savedTheme = localStorage.getItem("dashboard-theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);

  // Update theme toggle UI
  updateThemeToggleUI(savedTheme);
}

function initThemeToggle() {
  if (!themeToggle) return;

  themeToggle.querySelectorAll(".theme-option").forEach((option) => {
    option.addEventListener("click", (e) => {
      e.stopPropagation();
      setTheme(option.getAttribute("data-theme"));
    });
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("dashboard-theme", theme);
  updateThemeToggleUI(theme);
}

function updateThemeToggleUI(theme) {
  if (!themeToggle) return;

  themeToggle.querySelectorAll(".theme-option").forEach((option) => {
    option.classList.toggle("active", option.getAttribute("data-theme") === theme);
  });
}

// ===================================
// SEARCH FUNCTIONALITY
// ===================================

function initSearch() {
  mobileSearchBtn?.addEventListener("click", () => {
    searchContainer.classList.add("mobile-active");
    searchInput.focus();
  });

  searchClose?.addEventListener("click", () => {
    searchContainer.classList.remove("mobile-active");
    searchInput.value = "";
  });
}

// ===================================
// CHART INITIALIZATION
// ===================================

function initCharts() {
  initProgressChart();
  initCategoryChart();
}

function initProgressChart() {
  const ctx = document.getElementById("progressChart");
  if (!ctx) return;

  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Project Progress",
          data: [20, 35, 45, 60, 70, 85],
          borderColor: "#8b5cf6",
          backgroundColor: "rgba(139, 92, 246, 0.1)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { callback: (value) => value + "%" },
        },
      },
    },
  });
}

function initCategoryChart() {
  const ctx = document.getElementById("categoryChart");
  if (!ctx) return;

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Frontend", "Backend", "Mobile", "DevOps"],
      datasets: [
        {
          data: [35, 25, 20, 20],
          backgroundColor: ["#8b5cf6", "#10b981", "#f59e0b", "#ef4444"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 20,
            usePointStyle: true,
          },
        },
      },
    },
  });
}

// Logout
logoutBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
      // Redirect to login or home
      window.location.href = 'index.html';
    }
  });
});

// Close sidebar on escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeSidebar();
  }
});

// Close sidebar on window resize (tablet to desktop)
window.addEventListener('resize', () => {
  if (window.innerWidth > 992) {
    closeSidebar();
  }
});
