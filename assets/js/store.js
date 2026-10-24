/* LuksShop — მდგომარეობა: კალათა, ანგარიშები, შეკვეთები (ინახება ბრაუზერში) */

const KEYS = {
  cart: 'luksshop_cart',
  users: 'luksshop_users',
  user: 'luksshop_user',
  orders: 'luksshop_orders'
};

const Store = {
  read(key, fallback) {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch (e) { return fallback; }
  },
  write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (e) { return false; }
  }
};

const State = {
  cart: Store.read(KEYS.cart, []),
  users: Store.read(KEYS.users, []),
  user: Store.read(KEYS.user, null),
  orders: Store.read(KEYS.orders, [])
};

/* ---------- helpers ---------- */
function esc(str) {
  if (str == null) return '';
  return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}
function money(n) {
  const v = Math.round(Number(n) * 100) / 100;
  return (Number.isInteger(v) ? v : v.toFixed(2)) + ' ₾';
}
function catName(id) {
  const c = CATEGORIES.find(c => c.id === id);
  return c ? c.name : id;
}
function catEmoji(id) {
  const c = CATEGORIES.find(c => c.id === id);
  return c ? c.emoji : '📦';
}
function productById(id) { return PRODUCTS.find(p => p.id === id); }
function discountPercent(p) { return p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0; }

function toast(message, type = 'info') {
  const wrap = document.getElementById('toastWrap');
  if (!wrap) return;
  const el = document.createElement('div');
  el.className = 'toast' + (type === 'success' ? ' success' : type === 'error' ? ' error' : '');
  el.textContent = message;
  wrap.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; setTimeout(() => el.remove(), 320); }, 3200);
}

/* ---------- კალათა ---------- */
function saveCart() { Store.write(KEYS.cart, State.cart); }
function cartCount() { return State.cart.reduce((s, i) => s + i.qty, 0); }
function cartSubtotal() {
  return State.cart.reduce((s, i) => { const p = productById(i.id); return p ? s + p.price * i.qty : s; }, 0);
}
function addToCart(id, qty = 1) {
  const p = productById(id);
  if (!p) return;
  const line = State.cart.find(i => i.id === id);
  if (line) line.qty += qty; else State.cart.push({ id, qty });
  saveCart();
  refreshCartBadge();
  toast(`${p.name} დაემატა კალათაში`, 'success');
}
function setCartQty(id, delta) {
  const line = State.cart.find(i => i.id === id);
  if (!line) return;
  line.qty += delta;
  if (line.qty < 1) line.qty = 1;
  saveCart();
  refreshCartBadge();
}
function removeFromCart(id) {
  State.cart = State.cart.filter(i => i.id !== id);
  saveCart();
  refreshCartBadge();
}
function clearCart() { State.cart = []; saveCart(); refreshCartBadge(); }
function deliveryFee(method = 'courier') {
  if (method === 'pickup') return 0;
  return cartSubtotal() >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
}

/* ---------- ანგარიშები (ამ მოწყობილობაზე) ---------- */
function saveUsers() { Store.write(KEYS.users, State.users); }
function currentUser() { return State.user; }
function signupUser({ name, email, phone, password }) {
  const exists = State.users.find(u => u.email === email);
  if (exists) return { ok: false, error: 'ეს ელფოსტა უკვე რეგისტრირებულია' };
  const user = { name, email, phone, password, joined: new Date().toISOString() };
  State.users.push(user);
  saveUsers();
  State.user = { name, email, phone };
  Store.write(KEYS.user, State.user);
  return { ok: true };
}
function loginUser(email, password) {
  const user = State.users.find(u => u.email === email && u.password === password);
  if (!user) return { ok: false, error: 'ელფოსტა ან პაროლი არასწორია' };
  State.user = { name: user.name, email: user.email, phone: user.phone };
  Store.write(KEYS.user, State.user);
  return { ok: true };
}
function logoutUser() {
  State.user = null;
  Store.write(KEYS.user, null);
}

/* ---------- შეკვეთები ---------- */
function saveOrders() { Store.write(KEYS.orders, State.orders); }
function newOrderCode() {
  let code;
  do { code = 'LUKS-' + String(Math.floor(100000 + Math.random() * 900000)); }
  while (State.orders.some(o => o.code === code));
  return code;
}
function createOrder({ customer, deliveryMethod, payment }) {
  const items = State.cart.map(i => {
    const p = productById(i.id);
    return { id: p.id, name: p.name, price: p.price, qty: i.qty, image: p.image };
  });
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const fee = deliveryMethod === 'pickup' ? 0 : (subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE);
  const order = {
    code: newOrderCode(),
    items,
    subtotal,
    delivery: fee,
    total: subtotal + fee,
    customer,
    deliveryMethod,
    payment,
    status: 'received',
    createdAt: new Date().toISOString()
  };
  State.orders.unshift(order);
  saveOrders();
  clearCart();
  return order;
}
function findOrder(code) {
  const clean = String(code || '').trim().toUpperCase().replace(/\s/g, '');
  if (!clean) return null;
  const normalized = clean.startsWith('LUKS-') ? clean : 'LUKS-' + clean.replace(/\D/g, '');
  return State.orders.find(o => o.code === normalized) || null;
}
function myOrders() { return State.orders.slice(); }
function orderStepIndex(status) {
  const i = ORDER_STEPS.findIndex(s => s.key === status);
  return i < 0 ? 0 : i;
}
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('ka-GE', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' +
    d.toLocaleTimeString('ka-GE', { hour: '2-digit', minute: '2-digit' });
}
