// Session guard
const isLoggedIn = sessionStorage.getItem('isLoggedIn');
if (!isLoggedIn) {
  window.location.href = 'login.html';
}

// Mock data
const user = {
  id: 'RT-2048',
  shopName: 'Sharma Provisions',
  owner: 'Amit Sharma',
  phone: '+91 98765 43210',
  city: 'Jaipur',
  status: 'Active',
  creditLimit: 200000,
  usedCredit: 85000,
  outstanding: 32000,
  lastPaymentDate: '2024-12-02',
  nextDueDate: '2024-12-15',
  availableCredit() { return this.creditLimit - this.usedCredit; }
};

const orders = [
  { id: 'ORD-1009', date: '2024-12-07', items: 12, amount: 18500, payType: 'Credit', payStatus: 'Unpaid', delivery: 'Placed', statusFlow: 'Placed' },
  { id: 'ORD-1008', date: '2024-12-06', items: 8, amount: 9200, payType: 'Online', payStatus: 'Paid', delivery: 'Delivered', statusFlow: 'Delivered' },
  { id: 'ORD-1007', date: '2024-12-05', items: 5, amount: 6400, payType: 'Credit', payStatus: 'Partial', delivery: 'Dispatched', statusFlow: 'Dispatched' },
  { id: 'ORD-1006', date: '2024-12-04', items: 11, amount: 14200, payType: 'Online', payStatus: 'Paid', delivery: 'Delivered', statusFlow: 'Delivered' },
  { id: 'ORD-1005', date: '2024-12-03', items: 6, amount: 7800, payType: 'Credit', payStatus: 'Unpaid', delivery: 'Confirmed', statusFlow: 'Confirmed' },
  { id: 'ORD-1004', date: '2024-12-02', items: 9, amount: 10200, payType: 'Credit', payStatus: 'Paid', delivery: 'Cancelled', statusFlow: 'Cancelled' }
];

const payments = [
  { id: 'PAY-301', date: '2024-12-02', mode: 'UPI', amount: 15000, status: 'Paid' },
  { id: 'PAY-300', date: '2024-11-26', mode: 'Credit Adj.', amount: 12000, status: 'Paid' },
  { id: 'PAY-299', date: '2024-11-18', mode: 'UPI', amount: 8000, status: 'Paid' },
  { id: 'PAY-298', date: '2024-11-10', mode: 'Cash', amount: 6000, status: 'Paid' }
];

const invoices = [
  { id: 'INV-410', due: '2024-12-15', amount: 12000, status: 'Pending' },
  { id: 'INV-409', due: '2024-12-10', amount: 8500, status: 'Pending' },
  { id: 'INV-408', due: '2024-12-05', amount: 11500, status: 'Partial' }
];

const offers = [
  '2% discount on payments before due date.',
  'Free delivery on orders above ₹15,000 this week.',
  'Extra credit review available on request.'
];

// Helpers
const formatCurrency = (n) => `₹${n.toLocaleString('en-IN')}`;
const qs = (sel) => document.querySelector(sel);
const qsa = (sel) => document.querySelectorAll(sel);

document.addEventListener('DOMContentLoaded', () => {
  hydrateUser();
  initTheme();
  bindNav();
  bindActions();
  renderStats();
  renderLists();
  renderProfile();
  renderTables();
  renderOrdersSection();
  renderCharts();
});

// User + theme
function hydrateUser() {
  const email = sessionStorage.getItem('userEmail') || 'retailer@example.com';
  const name = email.split('@')[0];
  qs('#userName').textContent = name;
  const avatar = qs('#userAvatar');
  if (avatar) avatar.textContent = name[0]?.toUpperCase() || 'U';
}

function initTheme() {
  const saved = localStorage.getItem('consumer-theme') || 'light';
  setTheme(saved);
  qsa('.toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === saved);
    btn.addEventListener('click', () => {
      setTheme(btn.dataset.theme);
      qsa('.toggle-btn').forEach(b => b.classList.toggle('active', b === btn));
    });
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('consumer-theme', theme);
}

// Navigation
function bindNav() {
  const navItems = qsa('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const section = item.dataset.section;
      qsa('.section').forEach(sec => sec.classList.toggle('active', sec.id === section));
      qs('#pageTitle').textContent = item.textContent.trim();
      closeSidebar();
    });
  });

  qs('#openSidebar').addEventListener('click', () => {
    qs('#sidebar').classList.add('open');
    qs('#overlay').classList.add('show');
  });
  qs('#closeSidebar').addEventListener('click', closeSidebar);
  qs('#overlay').addEventListener('click', closeSidebar);
}

function closeSidebar() {
  qs('#sidebar').classList.remove('open');
  qs('#overlay').classList.remove('show');
}

// Actions stubs
function bindActions() {
  qsa('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      alert(`Action: ${btn.dataset.action}`);
    });
  });
  qs('#logoutBtn')?.addEventListener('click', () => {
    sessionStorage.clear();
    window.location.href = 'login.html';
  });
}

// Stats & lists
function renderStats() {
  const total = orders.length;
  const pending = orders.filter(o => ['Placed','Confirmed','Dispatched'].includes(o.delivery)).length;
  const delivered = orders.filter(o => o.delivery === 'Delivered').length;
  const outstanding = user.outstanding;
  const lastPayment = payments[0]?.date || '—';
  qs('#statTotalOrders').textContent = total;
  qs('#statPendingOrders').textContent = pending;
  qs('#statDeliveredOrders').textContent = delivered;
  qs('#statOutstanding').textContent = formatCurrency(outstanding);
  qs('#statLastPayment').textContent = lastPayment;
  qs('#statAvailableCredit').textContent = formatCurrency(user.availableCredit());
}

function renderLists() {
  fillList('#recentOrders', orders.slice(0, 5).map(o => `${o.id} • ${o.date}`), 'amount');
  fillList('#pendingPayments', invoices.map(i => `${i.id} due ${i.due}`), 'amt', invoices.map(i => formatCurrency(i.amount)));
  fillList('#lastPayments', payments.slice(0,3).map(p => `${p.id} • ${p.date}`), 'amt', payments.slice(0,3).map(p => formatCurrency(p.amount)));
  fillList('#offers', offers);
  const soonest = invoices[0];
  if (soonest) qs('#dueReminder').textContent = `${soonest.due} • ${formatCurrency(soonest.amount)} due`;
}

function fillList(selector, labels, altKey, amounts=[]) {
  const el = qs(selector);
  el.innerHTML = '';
  labels.forEach((label, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${label}</span>${amounts[idx] ? `<strong>${amounts[idx]}</strong>` : ''}`;
    el.appendChild(li);
  });
}

// Profile
function renderProfile() {
  const map = [
    ['Retailer ID', user.id],
    ['Shop Name', user.shopName],
    ['Owner Name', user.owner],
    ['Phone Number', user.phone],
    ['City / Area', user.city],
    ['Account Status', user.status],
  ];
  const container = qs('#profileInfo');
  container.innerHTML = '';
  map.forEach(([label, value]) => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `<p class="label">${label}</p><strong>${value}</strong>`;
    container.appendChild(div);
  });
  qs('#creditLimit').textContent = formatCurrency(user.creditLimit);
  qs('#usedCredit').textContent = formatCurrency(user.usedCredit);
  qs('#availCredit').textContent = formatCurrency(user.availableCredit());
  qs('#outBalance').textContent = formatCurrency(user.outstanding);
  qs('#lastPayDate').textContent = user.lastPaymentDate;
  qs('#nextDueDate').textContent = user.nextDueDate;
}

// Tables
function renderTables() {
  table('#profileOrdersTable', ['Order ID','Date','Items','Amount','Status'], orders.map(o => [
    o.id, o.date, o.items, formatCurrency(o.amount), badge(o.delivery)
  ]));
  table('#profilePaymentsTable', ['Payment ID','Date','Mode','Amount','Status'], payments.map(p => [
    p.id, p.date, p.mode, formatCurrency(p.amount), badge(p.status === 'Paid' ? 'Paid' : 'Partial')
  ]));
  table('#profileInvoicesTable', ['Invoice ID','Due Date','Amount','Status'], invoices.map(inv => [
    inv.id, inv.due, formatCurrency(inv.amount), badge(inv.status)
  ]));

  const tabs = qs('#profileTabs');
  tabs.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      qsa('.tab-panel').forEach(p => p.classList.toggle('active', p.id === target));
    });
  });
}

function table(selector, headers, rows) {
  const el = qs(selector);
  const head = `<thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>`;
  const body = rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('');
  el.innerHTML = `${head}<tbody>${body}</tbody>`;
}

function badge(label) {
  const klass = /Delivered|Paid|Active/.test(label) ? 'success' :
                /Pending|Partial|Placed|Confirmed|Dispatched/.test(label) ? 'warning' :
                /Cancelled|Returned|Blocked/.test(label) ? 'danger' : 'info';
  return `<span class="badge ${klass}">${label}</span>`;
}

// Orders section
function renderOrdersSection() {
  const today = new Date().toISOString().slice(0,10);
  qs('#ordersToday').textContent = orders.filter(o => o.date === today).length;
  qs('#ordersPending').textContent = orders.filter(o => ['Placed','Confirmed','Dispatched'].includes(o.delivery)).length;
  qs('#ordersDelivered').textContent = orders.filter(o => o.delivery === 'Delivered').length;
  qs('#ordersCancelled').textContent = orders.filter(o => o.delivery === 'Cancelled').length;

  table('#ordersTable', [
    'Order ID','Order Date','Total Items','Order Amount (₹)','Payment Type','Payment Status','Delivery Status','Actions'
  ], orders.map(o => [
    o.id, o.date, o.items, formatCurrency(o.amount), o.payType, badge(o.payStatus), badge(o.delivery),
    `<button class="btn ghost" data-action="details-${o.id}">View</button>
     <button class="btn ghost" data-action="invoice-${o.id}">Invoice</button>
     <button class="btn ghost" data-action="track-${o.id}">Track</button>
     <button class="btn ghost" data-action="return-${o.id}">Return</button>`
  ]));
}

// Charts
function renderCharts() {
  if (!window.Chart) return;
  const ordersCtx = document.getElementById('ordersChart');
  const payCtx = document.getElementById('paymentsChart');
  const catCtx = document.getElementById('categoriesChart');

  const months = ['Jul','Aug','Sep','Oct','Nov','Dec'];
  new Chart(ordersCtx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: 'Orders',
        data: [14,16,18,20,22,26],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139,92,246,0.12)',
        tension: 0.35,
        fill: true,
        pointRadius: 4
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
  });

  new Chart(payCtx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        { label: 'Payments', data: [42,36,38,45,50,54], backgroundColor: 'rgba(16,185,129,0.7)' },
        { label: 'Outstanding', data: [24,28,26,22,20,18], backgroundColor: 'rgba(139,92,246,0.6)' }
      ]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true } } }
  });

  new Chart(catCtx, {
    type: 'doughnut',
    data: {
      labels: ['Groceries','Beverages','Personal Care','Snacks'],
      datasets: [{ data: [35,25,20,20], backgroundColor: ['#8b5cf6','#10b981','#f59e0b','#3b82f6'] }]
    },
    options: { plugins: { legend: { position: 'bottom' } } }
  });
}