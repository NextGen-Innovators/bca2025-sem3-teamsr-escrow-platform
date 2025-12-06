// ===================================
// AUTHENTICATION CHECK
// ===================================
const isLoggedIn = sessionStorage.getItem('isLoggedIn');
if (!isLoggedIn) {
  window.location.href = 'login.html';
}

const userEmail = sessionStorage.getItem('userEmail');
if (userEmail) {
  const profileName = document.querySelector('.profile-name');
  if (profileName) {
    profileName.textContent = userEmail.split('@')[0];
  }
}

// ===================================
// IN-MEMORY DATA STORE
// ===================================
let users = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    role: 'Admin',
    joinDate: 'Nov 15, 2024',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    email: 'priya@example.com',
    role: 'Manager',
    joinDate: 'Oct 22, 2024',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Amit Patel',
    email: 'amit@example.com',
    role: 'User',
    joinDate: 'Sep 30, 2024',
    status: 'Inactive'
  },
  {
    id: 4,
    name: 'Neha Singh',
    email: 'neha@example.com',
    role: 'User',
    joinDate: 'Dec 1, 2024',
    status: 'Active'
  }
];

let products = [
  {
    id: 1,
    name: 'Premium Widget',
    category: 'Electronics',
    price: 49.99,
    stock: 156,
    status: 'In Stock'
  },
  {
    id: 2,
    name: 'Smart Device',
    category: 'Technology',
    price: 299.99,
    stock: 45,
    status: 'In Stock'
  },
  {
    id: 3,
    name: 'Pro Kit',
    category: 'Tools',
    price: 79.99,
    stock: 0,
    status: 'Out of Stock'
  },
  {
    id: 4,
    name: 'Ultra Monitor',
    category: 'Electronics',
    price: 399.99,
    stock: 12,
    status: 'Low Stock'
  },
  {
    id: 5,
    name: 'Ergonomic Chair',
    category: 'Furniture',
    price: 249.99,
    stock: 88,
    status: 'In Stock'
  }
];

let nextUserId = 5;
let nextProductId = 6;

// ===================================
// DOM ELEMENTS
// ===================================
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

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', function () {
  initTheme();
  initSidebar();
  initNavigation();
  initUserManagement();
  initProductManagement();
  initModals();
  
  // Initial render
  renderUsers();
  renderProducts();
});

// ===================================
// THEME FUNCTIONALITY
// ===================================
function initTheme() {
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
}

function updateThemeUI() {
  const theme = document.documentElement.getAttribute('data-theme');
  themeToggleButtons.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-theme') === theme);
  });
}

// ===================================
// SIDEBAR FUNCTIONALITY
// ===================================
function initSidebar() {
  menuToggle.addEventListener('click', () => {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('active');
  });

  sidebarClose.addEventListener('click', closeSidebar);
  sidebarOverlay.addEventListener('click', closeSidebar);

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

  // Logout functionality
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Are you sure you want to logout?')) {
        sessionStorage.clear();
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

  // Close sidebar on window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 992) {
      closeSidebar();
    }
  });
}

function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('active');
}

// ===================================
// NAVIGATION FUNCTIONALITY
// ===================================
function initNavigation() {
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = item.getAttribute('data-section');
      switchSection(sectionId);
      closeSidebar();
    });
  });
}

function switchSection(sectionId) {
  // Update active nav item
  navItems.forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-section') === sectionId);
  });

  // Show selected section
  sections.forEach(section => {
    section.classList.toggle('active', section.getAttribute('data-section') === sectionId);
  });

  // Update page title
  const titles = {
    overview: 'Dashboard',
    users: 'User Management',
    products: 'Product Management',
    settings: 'Settings',
    reports: 'Reports & Analytics'
  };
  pageTitle.textContent = titles[sectionId] || 'Dashboard';
}

// ===================================
// USER MANAGEMENT
// ===================================
function initUserManagement() {
  const addUserBtn = document.getElementById('addUserBtn');
  if (addUserBtn) {
    addUserBtn.addEventListener('click', () => openUserModal());
  }
}

function renderUsers() {
  const tbody = document.getElementById('usersTableBody');
  if (!tbody) return;

  tbody.innerHTML = users.map(user => `
    <tr>
      <td>${escapeHtml(user.name)}</td>
      <td>${escapeHtml(user.email)}</td>
      <td>${escapeHtml(user.role)}</td>
      <td>${escapeHtml(user.joinDate)}</td>
      <td><span class="badge ${user.status.toLowerCase()}">${escapeHtml(user.status)}</span></td>
      <td>
        <div class="action-buttons">
          <button class="action-btn view" data-action="view" data-id="${user.id}" title="View">
            <span class="material-symbols-rounded">visibility</span>
          </button>
          <button class="action-btn edit" data-action="edit" data-id="${user.id}" title="Edit">
            <span class="material-symbols-rounded">edit</span>
          </button>
          <button class="action-btn delete" data-action="delete" data-id="${user.id}" title="Delete">
            <span class="material-symbols-rounded">delete</span>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
  
  // Add event delegation for user actions
  tbody.removeEventListener('click', handleUserAction);
  tbody.addEventListener('click', handleUserAction);
}

function handleUserAction(e) {
  const button = e.target.closest('.action-btn');
  if (!button) return;
  
  const action = button.getAttribute('data-action');
  const id = parseInt(button.getAttribute('data-id'));
  
  if (action === 'view') viewUser(id);
  else if (action === 'edit') editUser(id);
  else if (action === 'delete') deleteUser(id);
}

function openUserModal(userId = null) {
  const modal = document.getElementById('userModal');
  const title = document.getElementById('userModalTitle');
  const form = document.getElementById('userForm');
  
  form.reset();
  clearErrors();
  
  if (userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
      title.textContent = 'Edit User';
      document.getElementById('userId').value = user.id;
      document.getElementById('userName').value = user.name;
      document.getElementById('userEmail').value = user.email;
      document.getElementById('userRole').value = user.role;
      document.getElementById('userStatus').value = user.status;
    }
  } else {
    title.textContent = 'Add User';
    document.getElementById('userId').value = '';
  }
  
  modal.classList.add('active');
}

function saveUser() {
  const userId = document.getElementById('userId').value;
  const name = document.getElementById('userName').value.trim();
  const email = document.getElementById('userEmail').value.trim();
  const role = document.getElementById('userRole').value;
  const status = document.getElementById('userStatus').value;

  // Validation
  let isValid = true;
  clearErrors();

  if (!name) {
    showError('userNameError', 'Name is required');
    isValid = false;
  }

  if (!email) {
    showError('userEmailError', 'Email is required');
    isValid = false;
  } else if (!isValidEmail(email)) {
    showError('userEmailError', 'Invalid email format');
    isValid = false;
  }

  if (!role) {
    showError('userRoleError', 'Role is required');
    isValid = false;
  }

  if (!isValid) return;

  const userData = {
    name,
    email,
    role,
    status,
    joinDate: userId ? users.find(u => u.id == userId).joinDate : formatDate(new Date())
  };

  if (userId) {
    // Update existing user
    const index = users.findIndex(u => u.id == userId);
    users[index] = { ...users[index], ...userData };
    showNotification('User updated successfully', 'success');
  } else {
    // Add new user
    users.push({
      id: nextUserId++,
      ...userData
    });
    showNotification('User added successfully', 'success');
  }

  closeUserModal();
  renderUsers();
}

function viewUser(id) {
  const user = users.find(u => u.id === id);
  if (!user) return;

  const content = `
    <div class="detail-row">
      <span class="detail-label">Name:</span>
      <span class="detail-value">${escapeHtml(user.name)}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Email:</span>
      <span class="detail-value">${escapeHtml(user.email)}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Role:</span>
      <span class="detail-value">${escapeHtml(user.role)}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Join Date:</span>
      <span class="detail-value">${escapeHtml(user.joinDate)}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Status:</span>
      <span class="detail-value"><span class="badge ${user.status.toLowerCase()}">${escapeHtml(user.status)}</span></span>
    </div>
  `;

  openViewModal('User Details', content);
}

function editUser(id) {
  openUserModal(id);
}

function deleteUser(id) {
  const user = users.find(u => u.id === id);
  if (!user) return;

  openConfirmModal(
    'Delete User',
    `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
    () => {
      users = users.filter(u => u.id !== id);
      renderUsers();
      showNotification('User deleted successfully', 'success');
    }
  );
}

function closeUserModal() {
  document.getElementById('userModal').classList.remove('active');
}

// ===================================
// PRODUCT MANAGEMENT
// ===================================
function initProductManagement() {
  const addProductBtn = document.getElementById('addProductBtn');
  if (addProductBtn) {
    addProductBtn.addEventListener('click', () => openProductModal());
  }
}

function renderProducts() {
  const tbody = document.getElementById('productsTableBody');
  if (!tbody) return;

  tbody.innerHTML = products.map(product => `
    <tr>
      <td>${escapeHtml(product.name)}</td>
      <td>${escapeHtml(product.category)}</td>
      <td>$${product.price.toFixed(2)}</td>
      <td>${product.stock}</td>
      <td><span class="badge ${getProductStatusClass(product.status)}">${escapeHtml(product.status)}</span></td>
      <td>
        <div class="action-buttons">
          <button class="action-btn view" data-action="view" data-id="${product.id}" title="View">
            <span class="material-symbols-rounded">visibility</span>
          </button>
          <button class="action-btn edit" data-action="edit" data-id="${product.id}" title="Edit">
            <span class="material-symbols-rounded">edit</span>
          </button>
          <button class="action-btn delete" data-action="delete" data-id="${product.id}" title="Delete">
            <span class="material-symbols-rounded">delete</span>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
  
  // Add event delegation for product actions
  tbody.removeEventListener('click', handleProductAction);
  tbody.addEventListener('click', handleProductAction);
}

function handleProductAction(e) {
  const button = e.target.closest('.action-btn');
  if (!button) return;
  
  const action = button.getAttribute('data-action');
  const id = parseInt(button.getAttribute('data-id'));
  
  if (action === 'view') viewProduct(id);
  else if (action === 'edit') editProduct(id);
  else if (action === 'delete') deleteProduct(id);
}

function getProductStatusClass(status) {
  const statusMap = {
    'In Stock': 'success',
    'Out of Stock': 'inactive',
    'Low Stock': 'warning'
  };
  return statusMap[status] || '';
}

function openProductModal(productId = null) {
  const modal = document.getElementById('productModal');
  const title = document.getElementById('productModalTitle');
  const form = document.getElementById('productForm');
  
  form.reset();
  clearErrors();
  
  if (productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
      title.textContent = 'Edit Product';
      document.getElementById('productId').value = product.id;
      document.getElementById('productName').value = product.name;
      document.getElementById('productCategory').value = product.category;
      document.getElementById('productPrice').value = product.price;
      document.getElementById('productStock').value = product.stock;
      document.getElementById('productStatus').value = product.status;
    }
  } else {
    title.textContent = 'Add Product';
    document.getElementById('productId').value = '';
  }
  
  modal.classList.add('active');
}

function saveProduct() {
  const productId = document.getElementById('productId').value;
  const name = document.getElementById('productName').value.trim();
  const category = document.getElementById('productCategory').value;
  const price = parseFloat(document.getElementById('productPrice').value);
  const stock = parseInt(document.getElementById('productStock').value);
  const status = document.getElementById('productStatus').value;

  // Validation
  let isValid = true;
  clearErrors();

  if (!name) {
    showError('productNameError', 'Product name is required');
    isValid = false;
  }

  if (!category) {
    showError('productCategoryError', 'Category is required');
    isValid = false;
  }

  if (isNaN(price) || price < 0) {
    showError('productPriceError', 'Valid price is required');
    isValid = false;
  }

  if (isNaN(stock) || stock < 0) {
    showError('productStockError', 'Valid stock quantity is required');
    isValid = false;
  }

  if (!isValid) return;

  const productData = {
    name,
    category,
    price,
    stock,
    status
  };

  if (productId) {
    // Update existing product
    const index = products.findIndex(p => p.id == productId);
    products[index] = { ...products[index], ...productData };
    showNotification('Product updated successfully', 'success');
  } else {
    // Add new product
    products.push({
      id: nextProductId++,
      ...productData
    });
    showNotification('Product added successfully', 'success');
  }

  closeProductModal();
  renderProducts();
}

function viewProduct(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const content = `
    <div class="detail-row">
      <span class="detail-label">Product Name:</span>
      <span class="detail-value">${escapeHtml(product.name)}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Category:</span>
      <span class="detail-value">${escapeHtml(product.category)}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Price:</span>
      <span class="detail-value">$${product.price.toFixed(2)}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Stock:</span>
      <span class="detail-value">${product.stock} units</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Status:</span>
      <span class="detail-value"><span class="badge ${getProductStatusClass(product.status)}">${escapeHtml(product.status)}</span></span>
    </div>
  `;

  openViewModal('Product Details', content);
}

function editProduct(id) {
  openProductModal(id);
}

function deleteProduct(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  openConfirmModal(
    'Delete Product',
    `Are you sure you want to delete ${product.name}? This action cannot be undone.`,
    () => {
      products = products.filter(p => p.id !== id);
      renderProducts();
      showNotification('Product deleted successfully', 'success');
    }
  );
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('active');
}

// ===================================
// MODAL MANAGEMENT
// ===================================
function initModals() {
  // User Modal
  document.getElementById('closeUserModal')?.addEventListener('click', closeUserModal);
  document.getElementById('cancelUserModal')?.addEventListener('click', closeUserModal);
  document.getElementById('userModalOverlay')?.addEventListener('click', closeUserModal);
  document.getElementById('saveUserBtn')?.addEventListener('click', saveUser);

  // Product Modal
  document.getElementById('closeProductModal')?.addEventListener('click', closeProductModal);
  document.getElementById('cancelProductModal')?.addEventListener('click', closeProductModal);
  document.getElementById('productModalOverlay')?.addEventListener('click', closeProductModal);
  document.getElementById('saveProductBtn')?.addEventListener('click', saveProduct);

  // View Modal
  document.getElementById('closeViewModal')?.addEventListener('click', closeViewModal);
  document.getElementById('closeViewModalBtn')?.addEventListener('click', closeViewModal);
  document.getElementById('viewModalOverlay')?.addEventListener('click', closeViewModal);

  // Confirm Modal
  document.getElementById('closeConfirmModal')?.addEventListener('click', closeConfirmModal);
  document.getElementById('cancelConfirmModal')?.addEventListener('click', closeConfirmModal);
  document.getElementById('confirmModalOverlay')?.addEventListener('click', closeConfirmModal);

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });
}

function openViewModal(title, content) {
  document.getElementById('viewModalTitle').textContent = title;
  document.getElementById('viewModalContent').innerHTML = content;
  document.getElementById('viewModal').classList.add('active');
}

function closeViewModal() {
  document.getElementById('viewModal').classList.remove('active');
}

let confirmCallback = null;

function openConfirmModal(title, message, callback) {
  document.getElementById('confirmModalTitle').textContent = title;
  document.getElementById('confirmModalMessage').textContent = message;
  confirmCallback = callback;
  document.getElementById('confirmModal').classList.add('active');

  // Set up confirm button listener (remove old listeners first)
  const confirmBtn = document.getElementById('confirmActionBtn');
  const newConfirmBtn = confirmBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
  
  newConfirmBtn.addEventListener('click', () => {
    if (confirmCallback) {
      confirmCallback();
      confirmCallback = null;
    }
    closeConfirmModal();
  });
}

function closeConfirmModal() {
  document.getElementById('confirmModal').classList.remove('active');
  confirmCallback = null;
}

function closeAllModals() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.classList.remove('active');
  });
}

// ===================================
// UTILITY FUNCTIONS
// ===================================
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  const inputId = elementId.replace('Error', '');
  const inputElement = document.getElementById(inputId);
  
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add('show');
  }
  
  if (inputElement) {
    inputElement.classList.add('error');
  }
}

function clearErrors() {
  document.querySelectorAll('.error-message').forEach(el => {
    el.classList.remove('show');
    el.textContent = '';
  });
  
  document.querySelectorAll('.form-input').forEach(el => {
    el.classList.remove('error');
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatDate(date) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showNotification(message, type = 'info') {
  // Simple notification - you can enhance this with a toast library
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: ${type === 'success' ? 'var(--success)' : 'var(--info)'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: var(--shadow-lg);
    z-index: 10001;
    animation: slideInRight 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
