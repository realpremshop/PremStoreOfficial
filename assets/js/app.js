/* LuksShop — როუტერი, ინტერაქციები, დამხმარე ჩატი */

const NAV = [
  { label: 'მთავარი', route: '#/', key: 'home' },
  { label: 'კატალოგი', route: '#/catalog', key: 'catalog' },
  { label: 'შეკვეთის სტატუსი', route: '#/status', key: 'status' },
  { label: 'კონტაქტი', route: '#/contact', key: 'contact' }
];

function parseHash() {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [path, query] = raw.split('?');
  const params = {};
  if (query) query.split('&').forEach(pair => {
    const [k, v] = pair.split('=');
    if (k) params[decodeURIComponent(k)] = decodeURIComponent((v || '').replace(/\+/g, ' '));
  });
  const seg = path.split('/').filter(Boolean);
  return { name: seg[0] || 'home', params, seg };
}

function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}
function setErr(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.classList.toggle('show', !!msg); }
}
function refreshCartBadge() {
  const el = document.getElementById('cartCount');
  if (!el) return;
  const n = cartCount();
  el.textContent = n;
  el.hidden = n === 0;
}

function updateHeader(r) {
  const u = currentUser();
  const nav = document.getElementById('mainNav');
  if (nav) {
    nav.innerHTML = NAV.map(n =>
      '<a class="nav-link' + (r.name === n.key ? ' active' : '') + '" href="' + n.route + '">' + n.label + '</a>').join('');
  }
  const drawerNav = document.getElementById('drawerNav');
  if (drawerNav) {
    drawerNav.innerHTML = NAV.map(n => '<a class="drawer-link" href="' + n.route + '">' + n.label + '</a>').join('') +
      (u
        ? '<a class="drawer-link" href="#/account">👤 ჩემი შეკვეთები</a><button class="drawer-link" data-action="logout">გასვლა</button>'
        : '<a class="drawer-link" href="#/login">შესვლა</a><a class="drawer-link" href="#/signup">რეგისტრაცია</a>');
  }
  const slot = document.getElementById('authSlot');
  if (slot) {
    slot.innerHTML = u
      ? '<a class="user-chip" href="#/account"><span class="avatar">' + esc(u.name.charAt(0).toUpperCase()) + '</span>' + esc(u.name.split(' ')[0]) + '</a>'
      : '<a class="btn btn-primary btn-sm" href="#/login">შესვლა</a>';
  }
  refreshCartBadge();
}

/* ---------- კატალოგის ფილტრები ---------- */
let catalogState = null;

function bindCatalog(r) {
  catalogState = { cat: r.params.cat || '', q: r.params.q || '', sort: r.params.sort || 'new' };
  const search = document.getElementById('catalogSearch');
  const sort = document.getElementById('catalogSort');
  if (search) search.addEventListener('input', () => { catalogState.q = search.value; refreshCatalog(); });
  if (sort) sort.addEventListener('change', () => { catalogState.sort = sort.value; refreshCatalog(); });
}
function refreshCatalog() {
  const list = filterProducts(catalogState);
  const grid = document.getElementById('catalogGrid');
  const count = document.getElementById('catalogCount');
  if (grid) grid.innerHTML = gridHtml(list);
  if (count) count.textContent = '📦 ნაპოვნია ' + list.length + ' პროდუქტი';
  const q = new URLSearchParams();
  if (catalogState.cat) q.set('cat', catalogState.cat);
  if (catalogState.q) q.set('q', catalogState.q);
  if (catalogState.sort !== 'new') q.set('sort', catalogState.sort);
  const s = q.toString();
  history.replaceState(null, '', '#/catalog' + (s ? '?' + s : ''));
}

/* ---------- გვერდის რენდერი ---------- */
function render() {
  const r = parseHash();
  const view = document.getElementById('view');
  let html;
  switch (r.name) {
    case 'home': html = Views.home(); break;
    case 'catalog': html = Views.catalog(r.params); break;
    case 'product': html = Views.product({ id: r.seg[1] }); break;
    case 'cart': html = Views.cart(); break;
    case 'checkout': html = Views.checkout(); break;
    case 'order': html = Views.order({ code: r.seg[1] }); break;
    case 'status': html = Views.status(r.params); break;
    case 'contact': html = Views.contact(); break;
    case 'login': html = Views.login(); break;
    case 'signup': html = Views.signup(); break;
    case 'account': html = Views.account(); break;
    default: html = Views.notFound();
  }
  if (view) view.innerHTML = html;
  updateHeader(r);
  if (r.name === 'catalog') bindCatalog(r);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- მენიუ ---------- */
function toggleMenu(force) {
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawerOverlay');
  if (!drawer) return;
  const open = force === undefined ? !drawer.classList.contains('open') : force;
  drawer.classList.toggle('open', open);
  if (overlay) overlay.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

/* ---------- კალათის/პროდუქტის ღილაკები ---------- */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const action = el.dataset.action;
  const id = el.dataset.id;
  const delta = Number(el.dataset.delta || 0);
  const qtyEl = document.getElementById('pdQty');
  const qtyNow = qtyEl ? Number(qtyEl.textContent) || 1 : 1;

  switch (action) {
    case 'add': addToCart(id, 1); break;
    case 'add-qty': addToCart(id, qtyNow); break;
    case 'buy-now': addToCart(id, qtyNow); location.hash = '#/checkout'; break;
    case 'pd-qty':
      if (qtyEl) qtyEl.textContent = Math.min(99, Math.max(1, qtyNow + delta));
      break;
    case 'cart-qty': setCartQty(id, delta); render(); break;
    case 'cart-remove': removeFromCart(id); render(); break;
    case 'go-cart': location.hash = '#/cart'; break;
    case 'toggle-menu': toggleMenu(); break;
    case 'close-menu': toggleMenu(false); break;
    case 'logout':
      logoutUser();
      toast('გამოხვედი ანგარიშიდან', 'success');
      location.hash = '#/';
      updateHeader(parseHash());
      break;
    case 'toggle-chat': toggleChat(); break;
  }
});

/* ---------- ფორმები ---------- */
document.addEventListener('submit', e => {
  const form = e.target;
  if (form.id === 'checkoutForm') { e.preventDefault(); submitCheckout(form); }
  else if (form.id === 'loginForm') { e.preventDefault(); submitLogin(form); }
  else if (form.id === 'signupForm') { e.preventDefault(); submitSignup(form); }
  else if (form.id === 'statusForm') { e.preventDefault(); submitStatus(form); }
  else if (form.id === 'chatForm') { e.preventDefault(); submitChat(form); }
});

function submitCheckout(form) {
  const name = val('ckName'), phone = val('ckPhone'), city = val('ckCity'), address = val('ckAddress');
  const email = val('ckEmail'), note = val('ckNote');
  const delivery = (form.querySelector('input[name="delivery"]:checked') || {}).value || 'courier';
  const payment = (form.querySelector('input[name="payment"]:checked') || {}).value || 'cash';
  ['errName', 'errPhone', 'errCity', 'errAddress', 'errForm'].forEach(id => setErr(id, ''));

  let bad = false;
  if (name.length < 2) { setErr('errName', 'შეიყვანე სახელი და გვარი'); bad = true; }
  if (phone.replace(/\D/g, '').length < 9) { setErr('errPhone', 'შეიყვანე ტელეფონის ნომერი (მინ. 9 ციფრი)'); bad = true; }
  if (city.length < 2) { setErr('errCity', 'შეიყვანე ქალაქი'); bad = true; }
  if (delivery === 'courier' && address.length < 4) { setErr('errAddress', 'შეიყვანე მისამართი'); bad = true; }
  if (bad) { setErr('errForm', 'შეავსე მონიშნული ველები'); return; }

  const order = createOrder({
    customer: { name, phone, email, city, address: delivery === 'pickup' ? 'თვითგატანა' : address, note },
    deliveryMethod: delivery,
    payment
  });
  toast('შეკვეთა გაფორმდა — კოდი ' + order.code, 'success');
  location.hash = '#/order/' + order.code;
}

function submitLogin(form) {
  const email = val('liEmail').toLowerCase(), pass = val('liPass');
  setErr('errLiEmail', ''); setErr('errLiPass', '');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setErr('errLiEmail', 'შეიყვანე სწორი ელფოსტა');
  if (pass.length < 6) return setErr('errLiPass', 'პაროლი მინ. 6 სიმბოლო');
  const res = loginUser(email, pass);
  if (!res.ok) return setErr('errLiPass', res.error);
  toast('კეთილი იყოს შენი დაბრუნება!', 'success');
  location.hash = '#/account';
}

function submitSignup(form) {
  const name = val('suName'), email = val('suEmail').toLowerCase(), phone = val('suPhone'), pass = val('suPass');
  ['errSuName', 'errSuEmail', 'errSuPhone', 'errSuPass'].forEach(id => setErr(id, ''));
  if (name.length < 2) return setErr('errSuName', 'შეიყვანე სახელი და გვარი');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setErr('errSuEmail', 'შეიყვანე სწორი ელფოსტა');
  if (phone.replace(/\D/g, '').length < 9) return setErr('errSuPhone', 'შეიყვანე ტელეფონის ნომერი');
  if (pass.length < 6) return setErr('errSuPass', 'პაროლი მინ. 6 სიმბოლო');
  const res = signupUser({ name, email, phone, password: pass });
  if (!res.ok) return setErr('errSuEmail', res.error);
  toast('ანგარიში შეიქმნა 🎉', 'success');
  location.hash = '#/account';
}

function submitStatus(form) {
  const code = val('statusCode');
  if (!code) return toast('შეიყვანე შეკვეთის კოდი', 'error');
  location.hash = '#/status?code=' + encodeURIComponent(code);
}

/* ---------- დამხმარე ჩატი ---------- */
const PRODUCT_KEYWORDS = [
  ['კეის', 'p1'], ['magsafe', 'p1'], ['დამტენ', 'p2'], ['gan', 'p2'],
  ['power bank', 'p3'], ['პაუერ', 'p3'], ['tws', 'p4'], ['ყურსაცმელ', 'p4'],
  ['სტუდიურ', 'p5'], ['სპიკერ', 'p6'], ['საათ', 'p7'], ['მექანიკურ', 'p8'],
  ['ბრასლეტ', 'p9'], ['პროექტორ', 'p10'], ['led', 'p11'], ['ლენტ', 'p11'], ['ვენტილატორ', 'p12']
];

function chatAnswer(text) {
  const t = text.toLowerCase();

  const codeMatch = t.match(/luks[-\s]?(\d{6})/) || t.match(/\b(\d{6})\b/);
  if (/შეკვეთ|სტატუს|სად არის/.test(t)) {
    if (codeMatch) {
      const order = findOrder('LUKS-' + codeMatch[1]);
      if (order) {
        return 'შეკვეთა ' + order.code + ' — სტატუსი: ' + ORDER_STEPS[orderStepIndex(order.status)].label +
          '. ჯამი ' + money(order.total) + ', გაფორმდა ' + formatDate(order.createdAt) + '.';
      }
      return 'ამ კოდით შეკვეთა ვერ მოიძებნა. კოდი ასე გამოიყურება: LUKS-123456.';
    }
    return 'მომწერე შეკვეთის კოდი (მაგ. LUKS-123456) და სტატუსს გეტყვი.';
  }

  const hit = PRODUCT_KEYWORDS.find(([kw]) => t.includes(kw));
  if (hit) {
    const p = productById(hit[1]);
    return p.name + ' — ' + money(p.price) + (p.oldPrice ? ' (ძველი ფასი ' + money(p.oldPrice) + ')' : '') +
      '. მარაგშია ' + p.stock + ' ცალი. დეტალები: #/product/' + p.id;
  }

  if (/მიწოდ|კურიერ|ჩამოტან/.test(t)) {
    return 'მიწოდება მთელ საქართველოში 1–3 სამუშაო დღეში, ' + money(DELIVERY_FEE) +
      '. ' + money(FREE_DELIVERY_FROM) + '-ზე მეტი შეკვეთა — უფასო. შესაძლებელია თვითგატანაც.';
  }
  if (/გადახდ|ფას|ფასი/.test(t)) {
    return 'გადახდა შესაძლებელია ნაღდი ანგარიშსწორებით კურიერთან ან საბანკო გადარიცხვით. ფასები კატალოგშია მითითებული.';
  }
  if (/გარანტ|ორიგინალ|ხარისხ/.test(t)) {
    return 'ყველა პროდუქტი ორიგინალია და მოყვება 12 თვის გარანტია.';
  }
  if (/კონტაქტ|ტელეფონ|ელფოსტ|მისამართ/.test(t)) {
    return 'შესაკვეთად მოგვწერე TikTok-ზე @luksshop_official, ტელეფონი +995 555 00 00 00, ელფოსტა info@luksshop.ge.';
  }
  if (/კატეგორ|კატალოგ|რა გაქვთ|პროდუქტ/.test(t)) {
    return 'კატეგორიები: ' + CATEGORIES.map(c => c.emoji + ' ' + c.name).join(', ') + '. სრული სია — #/catalog.';
  }
  if (/გამარჯობ|სალამ|ჰეი|hi|hello/.test(t)) {
    return 'გამარჯობა! 👋 რით შემიძლია დაგეხმარო — პროდუქტის ფასი, მიწოდება თუ შეკვეთის სტატუსი?';
  }
  return 'მითხარი უფრო კონკრეტულად: რომელი პროდუქტი გაინტერესებს, როგორ მუშაობს მიწოდება, ან რა არის შენი შეკვეთის კოდი.';
}

function toggleChat(force) {
  const panel = document.getElementById('chatPanel');
  const body = document.getElementById('chatBody');
  if (!panel) return;
  const open = force === undefined ? !panel.classList.contains('open') : force;
  panel.classList.toggle('open', open);
  if (open && body && !body.dataset.greeted) {
    body.dataset.greeted = '1';
    appendChat('გამარჯობა! მე ვარ LuksShop-ის დამხმარე 🤖 დაწერე რომელი პროდუქტი გაინტერესებს ან რა არის შენი შეკვეთის კოდი.', 'bot');
  }
}
function appendChat(text, who) {
  const body = document.getElementById('chatBody');
  if (!body) return;
  const el = document.createElement('div');
  el.className = 'msg ' + (who === 'me' ? 'me' : 'bot');
  el.textContent = text;
  body.appendChild(el);
  body.scrollTop = body.scrollHeight;
}
function submitChat(form) {
  const input = document.getElementById('chatInput');
  const text = input ? input.value.trim() : '';
  if (!text) return;
  appendChat(text, 'me');
  if (input) input.value = '';
  setTimeout(() => appendChat(chatAnswer(text), 'bot'), 250);
}

/* ---------- გაშვება ---------- */
window.addEventListener('hashchange', render);
window.addEventListener('keydown', e => { if (e.key === 'Escape') { toggleChat(false); toggleMenu(false); } });
render();
