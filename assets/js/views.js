/* LuksShop — გვერდების შაბლონები */

function productCard(p) {
  const off = discountPercent(p);
  return '<article class="product-card">' +
    '<a class="pc-media" href="#/product/' + p.id + '">' +
      '<img src="' + p.image + '" alt="' + esc(p.name) + '" loading="lazy" ' +
        'onerror="this.replaceWith(Object.assign(document.createElement(\'div\'),{className:\'pc-fallback\',textContent:\'' + catEmoji(p.category) + '\'}))">' +
      (off ? '<span class="badge-off">-' + off + '%</span>' : '') +
    '</a>' +
    '<div class="pc-body">' +
      '<span class="pc-cat">' + esc(catName(p.category)) + '</span>' +
      '<a class="pc-name" href="#/product/' + p.id + '">' + esc(p.name) + '</a>' +
      '<div class="pc-foot">' +
        '<span class="price">' + money(p.price) + (p.oldPrice ? '<old>' + money(p.oldPrice) + '</old>' : '') + '</span>' +
        '<button class="add-btn" data-action="add" data-id="' + p.id + '" aria-label="კალათაში დამატება: ' + esc(p.name) + '">+</button>' +
      '</div>' +
    '</div>' +
  '</article>';
}

function imageBox(p, cls) {
  return '<div class="' + cls + '">' +
    '<img src="' + p.image + '" alt="' + esc(p.name) + '" ' +
    'onerror="this.replaceWith(Object.assign(document.createElement(\'div\'),{className:\'pc-fallback\',textContent:\'' + catEmoji(p.category) + '\'}))">' +
  '</div>';
}

function gridHtml(list) {
  if (!list.length) {
    return '<div class="empty card"><span class="emoji">🔍</span><h3>პროდუქტი ვერ მოიძებნა</h3>' +
      '<p>შეცვალე ძებნა ან აირჩიე სხვა კატეგორია.</p></div>';
  }
  return list.map(productCard).join('');
}

function filterProducts({ q = '', cat = '', sort = 'new' }) {
  let list = PRODUCTS.slice();
  if (cat) list = list.filter(p => p.category === cat);
  if (q) {
    const s = q.trim().toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(s) ||
      p.desc.toLowerCase().includes(s) ||
      catName(p.category).toLowerCase().includes(s));
  }
  if (sort === 'price') list.sort((a, b) => a.price - b.price);
  else if (sort === '-price') list.sort((a, b) => b.price - a.price);
  else if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name, 'ka'));
  return list;
}

const CATEGORY_CARDS = [
  { id: 'phone', emoji: '📱', name: 'ტელეფონის აქსესუარები', note: 'დამტენები, კეისები, Power Bank' },
  { id: 'audio', emoji: '🎧', name: 'აუდიო და ხმა', note: 'ყურსაცმელები, სპიკერები' },
  { id: 'watch', emoji: '⌚', name: 'საათები და ბრასლეტები', note: 'სმარტ და მექანიკური საათები' },
  { id: 'gadget', emoji: '🔌', name: 'სმარტ გაჯეტები', note: 'პროექტორები, LED, აქსესუარები' }
];

const FEATURES = [
  { icon: '🚚', title: 'სწრაფი მიწოდება', note: 'მიწოდება მთელი საქართველოს მასშტაბით' },
  { icon: '🛡️', title: 'ხარისხის გარანტია', note: 'მხოლოდ სანდო და გამოცდილი ბრენდები' },
  { icon: '🎧', title: 'მხარდაჭერა', note: 'ქართულენოვანი მომსახურება და ჩატი' },
  { icon: '✨', title: 'დამხმარე ჩატი', note: 'პასუხები პროდუქტებზე რეალურ დროში' }
];

const Views = {
  home() {
    const featured = PRODUCTS.filter(p => p.oldPrice).concat(PRODUCTS.filter(p => !p.oldPrice)).slice(0, 8);
    return '' +
    '<div class="hero"><div class="wrap">' +
      '<span class="hero-badge">✨ ორიგინალი პროდუქტები საქართველოში</span>' +
      '<h1>LUKSSHOP</h1>' +
      '<p class="lead">ნებისმიერი ორიგინალი პროდუქტი — ჩამოგვაქვს შეკვეთით</p>' +
      '<div class="hero-cta">' +
        '<a class="btn btn-primary btn-lg" href="#/catalog">კატალოგის ნახვა →</a>' +
        '<a class="btn btn-ghost btn-lg" href="https://www.tiktok.com/@luksshop_official" target="_blank" rel="noopener">🎵 შესაკვეთად მოგვწერე TikTok-ზე</a>' +
      '</div>' +
      '<div class="float-cards">' +
        '<div class="card float-card"><span class="fc-ico">📱</span><span><strong>ტექნიკა და გაჯეტები</strong><span>ორიგინალი პროდუქტები</span></span></div>' +
        '<div class="card float-card"><span class="fc-ico">⌚</span><span><strong>საათები და აქსესუარები</strong><span>ტრენდული კოლექციები</span></span></div>' +
      '</div>' +
    '</div></div>' +

    '<section class="section"><div class="wrap">' +
      '<div class="feature-grid">' + FEATURES.map(f =>
        '<div class="card feature"><span class="fc-ico">' + f.icon + '</span><h3>' + f.title + '</h3><p>' + f.note + '</p></div>').join('') +
      '</div>' +
    '</div></section>' +

    '<section class="section"><div class="wrap">' +
      '<div class="section-head"><div><p class="eyebrow">კატეგორიები</p><h2 class="h2">აირჩიე კატეგორია</h2></div>' +
      '<a class="link-arrow" href="#/catalog">ყველა კატეგორია →</a></div>' +
      '<div class="cat-grid">' + CATEGORY_CARDS.map(c =>
        '<a class="cat-card" href="#/catalog?cat=' + c.id + '"><span class="cat-emoji">' + c.emoji + '</span>' +
        '<strong>' + c.name + '</strong><span class="go">' + c.note + ' →</span></a>').join('') +
      '</div>' +
    '</div></section>' +

    '<section class="section"><div class="wrap">' +
      '<div class="section-head"><div><p class="eyebrow">პროდუქცია</p><h2 class="h2">რჩეული პროდუქტები</h2></div>' +
      '<a class="link-arrow" href="#/catalog">ყველას ნახვა →</a></div>' +
      '<div class="product-grid">' + featured.map(productCard).join('') + '</div>' +
    '</div></section>' +

    '<section class="section"><div class="wrap"><div class="card" style="padding:32px;text-align:center">' +
      '<p class="eyebrow">მზად ხარ?</p>' +
      '<h2 class="h2">ყველაფერი, რაც გჭირდება — ჩამოგვაქვს შეკვეთით</h2>' +
      '<p class="sub" style="margin:12px auto 22px">შეათვალიერე კატალოგი და შეკვეთე რამდენიმე კლიკით — შეკვეთის სტატუსს თვალს ადევნებ ყველა ეტაპზე.</p>' +
      '<a class="btn btn-primary btn-lg" href="#/catalog">შესყიდვის დაწყება</a>' +
    '</div></div></section>';
  },

  catalog(params) {
    const cat = params.cat || '';
    const q = params.q || '';
    const sort = params.sort || 'new';
    const list = filterProducts({ q, cat, sort });
    return '<div class="wrap" style="padding-top:40px">' +
      '<div class="section-head" style="margin-bottom:26px"><div>' +
        '<p class="eyebrow">მაღაზია</p><h1 class="h1">კატალოგი</h1>' +
        '<p class="sub" style="margin-top:10px">ორიგინალი პროდუქტები საუკეთესო ფასად — ჩამოგვაქვს ნებისმიერი ნივთი შეკვეთით</p>' +
      '</div></div>' +

      '<div class="toolbar">' +
        '<div class="field"><span class="icon-inside">🔍</span>' +
          '<input class="input input-icon" id="catalogSearch" type="search" placeholder="მოძებნე პროდუქტი სახელით…" value="' + esc(q) + '" aria-label="პროდუქტის ძებნა"></div>' +
        '<div><select class="input" id="catalogSort" aria-label="სორტირება">' +
          '<option value="new"' + (sort === 'new' ? ' selected' : '') + '>ახალი პირველად</option>' +
          '<option value="price"' + (sort === 'price' ? ' selected' : '') + '>ფასი: დაბალი → მაღალი</option>' +
          '<option value="-price"' + (sort === '-price' ? ' selected' : '') + '>ფასი: მაღალი → დაბალი</option>' +
          '<option value="name"' + (sort === 'name' ? ' selected' : '') + '>სახელი A-ზ</option>' +
        '</select></div>' +
      '</div>' +

      '<div class="chips">' +
        '<a class="chip' + (cat ? '' : ' active') + '" href="#/catalog">ყველა</a>' +
        CATEGORIES.map(c => '<a class="chip' + (cat === c.id ? ' active' : '') + '" href="#/catalog?cat=' + c.id + '">' + c.emoji + ' ' + c.name + '</a>').join('') +
      '</div>' +

      '<p class="count-line" id="catalogCount">📦 ნაპოვნია ' + list.length + ' პროდუქტი</p>' +
      '<div class="product-grid" id="catalogGrid">' + gridHtml(list) + '</div>' +
    '</div>';
  },

  product(params) {
    const p = productById(params.id);
    if (!p) return Views.notFound();
    const off = discountPercent(p);
    const related = PRODUCTS.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
    return '<div class="wrap" style="padding:36px 0">' +
      '<p class="crumbs"><a href="#/">მთავარი</a> / <a href="#/catalog?cat=' + p.category + '">' + esc(catName(p.category)) + '</a> / ' + esc(p.name) + '</p>' +
      '<div class="pd">' +
        '<div>' + imageBox(p, 'pd-media') + '</div>' +
        '<div>' +
          '<p class="eyebrow">' + catEmoji(p.category) + ' ' + esc(catName(p.category)) + '</p>' +
          '<h1 class="h1" style="font-size:clamp(24px,4vw,34px)">' + esc(p.name) + '</h1>' +
          '<p class="rating">★ ' + p.rating.toFixed(1) + ' <span class="muted">· მარაგშია ' + p.stock + ' ცალი</span></p>' +
          '<div class="pd-price"><span class="now">' + money(p.price) + '</span>' +
            (p.oldPrice ? '<span class="was">' + money(p.oldPrice) + '</span><span class="pill">-' + off + '%</span>' : '') + '</div>' +
          '<p class="pd-desc">' + esc(p.desc) + '</p>' +
          '<div class="pd-actions">' +
            '<div class="qty"><button data-action="pd-qty" data-delta="-1" aria-label="რაოდენობის შემცირება">−</button>' +
            '<span id="pdQty">1</span>' +
            '<button data-action="pd-qty" data-delta="1" aria-label="რაოდენობის გაზრდა">+</button></div>' +
            '<button class="btn btn-primary btn-lg" data-action="add-qty" data-id="' + p.id + '">🛍️ კალათაში დამატება</button>' +
            '<button class="btn btn-ghost btn-lg" data-action="buy-now" data-id="' + p.id + '">სწრაფი შეკვეთა</button>' +
          '</div>' +
          '<div class="meta-list">' +
            '<div class="card meta-item">🚚 <span><b>მიწოდება:</b> მთელ საქართველოში, 1–3 სამუშაო დღე. ' + money(FREE_DELIVERY_FROM) + '-ზე მეტი შეკვეთა — უფასო.</span></div>' +
            '<div class="card meta-item">🛡️ <span><b>გარანტია:</b> ორიგინალი პროდუქტი და 12 თვის გარანტია.</span></div>' +
            '<div class="card meta-item">💳 <span><b>გადახდა:</b> ნაღდი კურიერთან ან საბანკო გადარიცხვა.</span></div>' +
            (p.specs && p.specs.length ? '<div class="card meta-item">⚙️ <span><b>მახასიათებლები:</b> ' + p.specs.map(esc).join(' · ') + '</span></div>' : '') +
          '</div>' +
        '</div>' +
      '</div>' +
      (related.length ? '<section class="section"><div class="section-head"><h2 class="h2">მსგავსი პროდუქტები</h2></div>' +
        '<div class="product-grid">' + related.map(productCard).join('') + '</div></section>' : '') +
    '</div>';
  },

  cart() {
    if (!State.cart.length) {
      return '<div class="wrap"><div class="empty"><span class="emoji">🛍️</span><h2 class="h2">კალათა ცარიელია</h2>' +
        '<p class="sub" style="margin:10px auto 20px">აირჩიე პროდუქტი კატალოგიდან და დაემატე კალათაში.</p>' +
        '<a class="btn btn-primary" href="#/catalog">კატალოგში გადასვლა</a></div></div>';
    }
    const rows = State.cart.map(i => {
      const p = productById(i.id);
      if (!p) return '';
      return '<div class="cart-row">' +
        '<div class="cart-thumb">' + '<img src="' + p.image + '" alt="' + esc(p.name) + '" ' +
          'onerror="this.replaceWith(Object.assign(document.createElement(\'div\'),{className:\'pc-fallback\',textContent:\'' + catEmoji(p.category) + '\'}))">' + '</div>' +
        '<div class="cart-info"><strong>' + esc(p.name) + '</strong><span>' + esc(catName(p.category)) + ' · ' + money(p.price) + '</span></div>' +
        '<div class="qty"><button data-action="cart-qty" data-id="' + p.id + '" data-delta="-1" aria-label="შემცირება">−</button>' +
        '<span>' + i.qty + '</span>' +
        '<button data-action="cart-qty" data-id="' + p.id + '" data-delta="1" aria-label="გაზრდა">+</button></div>' +
        '<span class="price">' + money(p.price * i.qty) + '</span>' +
        '<button class="icon-x" data-action="cart-remove" data-id="' + p.id + '" aria-label="კალათიდან წაშლა">✕</button>' +
      '</div>';
    }).join('');
    const subtotal = cartSubtotal();
    const fee = deliveryFee('courier');
    return '<div class="wrap" style="padding:36px 0">' +
      '<div class="section-head" style="margin-bottom:22px"><div><p class="eyebrow">შეკვეთა</p><h1 class="h1">კალათა</h1></div>' +
      '<a class="link-arrow" href="#/catalog">← კატალოგში დაბრუნება</a></div>' +
      '<div class="two-col">' +
        '<div class="card">' + rows + '</div>' +
        '<div class="card summary">' +
          '<h3 class="h2" style="font-size:18px;margin-bottom:16px">ჯამი</h3>' +
          '<div class="sum-line"><span>პროდუქტები</span><span>' + money(subtotal) + '</span></div>' +
          '<div class="sum-line"><span>მიწოდება (კურიერი)</span><span>' + (fee ? money(fee) : 'უფასო') + '</span></div>' +
          '<div class="sum-line total"><span>სულ</span><span>' + money(subtotal + fee) + '</span></div>' +
          '<a class="btn btn-primary btn-block btn-lg" style="margin-top:18px" href="#/checkout">შეკვეთის გაფორმება</a>' +
          '<p class="muted" style="font-size:11px;margin-top:12px">გადახდა ხდება შეკვეთის დადასტურების შემდეგ — ნაღდი კურიერთან ან გადარიცხვით.</p>' +
        '</div>' +
      '</div>' +
    '</div>';
  },

  checkout() {
    if (!State.cart.length) {
      return '<div class="wrap"><div class="empty"><span class="emoji">🛍️</span><h2 class="h2">კალათა ცარიელია</h2>' +
        '<p class="sub" style="margin:10px auto 20px">შეკვეთის გასაფორმებლად ჯერ პროდუქტი დაამატე.</p>' +
        '<a class="btn btn-primary" href="#/catalog">კატალოგში გადასვლა</a></div></div>';
    }
    const u = currentUser();
    const subtotal = cartSubtotal();
    const fee = deliveryFee('courier');
    const items = State.cart.map(i => {
      const p = productById(i.id);
      return '<div class="sum-line"><span>' + esc(p.name) + ' × ' + i.qty + '</span><span>' + money(p.price * i.qty) + '</span></div>';
    }).join('');
    return '<div class="wrap" style="padding:36px 0">' +
      '<div class="section-head" style="margin-bottom:22px"><div><p class="eyebrow">გაფორმება</p><h1 class="h1">შეკვეთის გაფორმება</h1></div>' +
      '<a class="link-arrow" href="#/cart">← კალათა</a></div>' +
      '<div class="two-col">' +
        '<form class="card" style="padding:22px" id="checkoutForm" novalidate>' +
          '<h3 style="font-size:16px;font-weight:800;margin-bottom:16px">მიმღების მონაცემები</h3>' +
          '<div class="form-grid">' +
            '<div><label class="lbl" for="ckName">სახელი და გვარი</label><input class="input" id="ckName" value="' + esc(u ? u.name : '') + '" autocomplete="name"><div class="field-err" id="errName"></div></div>' +
            '<div><label class="lbl" for="ckPhone">ტელეფონი</label><input class="input" id="ckPhone" value="' + esc(u && u.phone ? u.phone : '') + '" inputmode="tel" autocomplete="tel" placeholder="5XX XXX XXX"></div>' +
            '<div class="full"><div class="field-err" id="errPhone" style="margin-top:-8px;margin-bottom:8px"></div></div>' +
            '<div><label class="lbl" for="ckEmail">ელფოსტა (არასავალდებულო)</label><input class="input" id="ckEmail" value="' + esc(u ? u.email : '') + '" inputmode="email" autocomplete="email"></div>' +
            '<div><label class="lbl" for="ckCity">ქალაქი</label><input class="input" id="ckCity" placeholder="თბილისი"><div class="field-err" id="errCity"></div></div>' +
            '<div class="full"><label class="lbl" for="ckAddress">მისამართი</label><input class="input" id="ckAddress" placeholder="ქუჩა, კორპუსი, ბინა"><div class="field-err" id="errAddress"></div></div>' +
            '<div class="full"><label class="lbl" for="ckNote">შენიშვნა (არასავალდებულო)</label><input class="input" id="ckNote" placeholder="მაგ. დარეკეთ მისვლამდე"></div>' +
          '</div>' +
          '<h3 style="font-size:16px;font-weight:800;margin:22px 0 12px">მიწოდება</h3>' +
          '<label class="pay-option"><input type="radio" name="delivery" value="courier" checked> კურიერი — მისამართზე მიტანა (' + money(DELIVERY_FEE) + ', ' + money(FREE_DELIVERY_FROM) + '-ზე მეტზე უფასო)</label>' +
          '<label class="pay-option"><input type="radio" name="delivery" value="pickup"> თვითგატანა პუნქტიდან — უფასო</label>' +
          '<h3 style="font-size:16px;font-weight:800;margin:22px 0 12px">გადახდა</h3>' +
          '<label class="pay-option"><input type="radio" name="payment" value="cash" checked> ნაღდი ანგარიშსწორება კურიერთან</label>' +
          '<label class="pay-option"><input type="radio" name="payment" value="transfer"> საბანკო გადარიცხვა</label>' +
          '<div class="field-err" id="errForm"></div>' +
          '<button class="btn btn-primary btn-block btn-lg" type="submit" style="margin-top:18px">შეკვეთის დადასტურება</button>' +
        '</form>' +
        '<div class="card summary">' +
          '<h3 style="font-size:18px;font-weight:800;margin-bottom:16px">შეკვეთის შეჯამება</h3>' +
          items +
          '<div class="sum-line"><span>მიწოდება</span><span>' + (fee ? money(fee) : 'უფასო') + '</span></div>' +
          '<div class="sum-line total"><span>სულ</span><span>' + money(subtotal + fee) + '</span></div>' +
        '</div>' +
      '</div>' +
    '</div>';
  },

  order(params) {
    const order = findOrder(params.code);
    if (!order) {
      return '<div class="wrap"><div class="empty"><span class="emoji">🔎</span><h2 class="h2">შეკვეთა ვერ მოიძებნა</h2>' +
        '<p class="sub" style="margin:10px auto 20px">შეამოწმე კოდი. შეკვეთები ინახება იმ მოწყობილობაზე, საიდანაც გაფორმდა.</p>' +
        '<a class="btn btn-primary" href="#/status">სტატუსის შემოწმება</a></div></div>';
    }
    const idx = orderStepIndex(order.status);
    const steps = ORDER_STEPS.map((s, i) =>
      '<div class="step' + (i <= idx ? ' done' : '') + '"><span class="step-dot">' + (i <= idx ? '✓' : i + 1) + '</span>' +
      '<span><strong>' + s.label + '</strong><small>' + s.note + '</small></span></div>').join('');
    const rows = order.items.map(i =>
      '<div class="cart-row"><div class="cart-thumb"><img src="' + i.image + '" alt="' + esc(i.name) + '" ' +
        'onerror="this.replaceWith(Object.assign(document.createElement(\'div\'),{className:\'pc-fallback\',textContent:\'📦\'}))"></div>' +
      '<div class="cart-info"><strong>' + esc(i.name) + '</strong><span>' + money(i.price) + ' × ' + i.qty + '</span></div>' +
      '<span class="price">' + money(i.price * i.qty) + '</span></div>').join('');
    return '<div class="wrap" style="padding:36px 0">' +
      '<div class="card" style="padding:28px;text-align:center">' +
        '<span class="hero-badge">✅ შეკვეთა მიღებულია</span>' +
        '<h1 class="h1" style="font-size:clamp(22px,4vw,32px);margin-bottom:14px">მადლობა, ' + esc(order.customer.name) + '!</h1>' +
        '<p class="sub" style="margin:0 auto 18px">შეკვეთის კოდი — შეინახე სტატუსის შესამოწმებლად:</p>' +
        '<div class="code-box">' + order.code + '</div>' +
        '<p class="muted" style="font-size:12px;margin-top:14px">გაფორმების დრო: ' + formatDate(order.createdAt) + '</p>' +
      '</div>' +
      '<div class="two-col" style="margin-top:24px">' +
        '<div>' +
          '<div class="card" style="padding:22px"><h3 style="font-size:16px;font-weight:800">შეკვეთის სტატუსი</h3>' +
            '<span class="pill">' + ORDER_STEPS[idx].label + '</span>' +
            '<div class="steps">' + steps + '</div>' +
            '<p class="muted" style="font-size:12px;margin-top:12px">სტატუსს განაახლებს ოპერატორი. შენახული მდგომარეობა: ' + ORDER_STEPS[idx].label + '.</p>' +
          '</div>' +
          '<div class="card" style="padding:22px;margin-top:16px"><h3 style="font-size:16px;font-weight:800;margin-bottom:10px">შეკვეთილი პროდუქტები</h3>' + rows + '</div>' +
        '</div>' +
        '<div class="card summary">' +
          '<h3 style="font-size:18px;font-weight:800;margin-bottom:16px">დეტალები</h3>' +
          '<div class="sum-line"><span>პროდუქტები</span><span>' + money(order.subtotal) + '</span></div>' +
          '<div class="sum-line"><span>მიწოდება</span><span>' + (order.delivery ? money(order.delivery) : 'უფასო') + '</span></div>' +
          '<div class="sum-line total"><span>სულ</span><span>' + money(order.total) + '</span></div>' +
          '<div class="meta-list">' +
            '<div class="card meta-item">📍 <span>' + esc(order.customer.city) + ', ' + esc(order.customer.address) + '</span></div>' +
            '<div class="card meta-item">📞 <span>' + esc(order.customer.phone) + '</span></div>' +
            '<div class="card meta-item">🚚 <span>' + (order.deliveryMethod === 'pickup' ? 'თვითგატანა პუნქტიდან' : 'კურიერი მისამართზე') + '</span></div>' +
            '<div class="card meta-item">💳 <span>' + (order.payment === 'transfer' ? 'საბანკო გადარიცხვა' : 'ნაღდი კურიერთან') + '</span></div>' +
          '</div>' +
          '<a class="btn btn-ghost btn-block" style="margin-top:16px" href="#/catalog">კიდევ ვიყიდო</a>' +
          '<a class="btn btn-ghost btn-block" style="margin-top:10px" href="#/account">ჩემი შეკვეთები</a>' +
        '</div>' +
      '</div>' +
    '</div>';
  },

  status(params) {
    const code = params.code || '';
    const order = code ? findOrder(code) : null;
    if (code && order) return Views.order({ code: order.code });
    return '<div class="wrap" style="padding:36px 0">' +
      '<div class="section-head" style="margin-bottom:22px"><div><p class="eyebrow">მომსახურება</p>' +
      '<h1 class="h1">შეკვეთის სტატუსი</h1></div></div>' +
      '<div class="card" style="padding:24px;max-width:560px">' +
        '<p class="sub" style="margin-bottom:16px">შეიყვანე შეკვეთის კოდი (მაგ. LUKS-123456) და ნახე მიმდინარე ეტაპი.</p>' +
        (code && !order ? '<div class="field-err show" style="margin-bottom:12px">ასეთი კოდით შეკვეთა ვერ მოიძებნა.</div>' : '') +
        '<form id="statusForm">' +
          '<div class="field" style="margin-bottom:12px"><input class="input" id="statusCode" placeholder="LUKS-XXXXXX" value="' + esc(code) + '" aria-label="შეკვეთის კოდი"></div>' +
          '<button class="btn btn-primary btn-block" type="submit">სტატუსის შემოწმება</button>' +
        '</form>' +
        '<p class="muted" style="font-size:12px;margin-top:14px">შეკვეთები ინახება იმ მოწყობილობაზე, საიდანაც გაფორმდა. დახმარებისთვის მოგვწერე TikTok-ზე (@luksshop_official).</p>' +
      '</div>' +
    '</div>';
  },

  contact() {
    const FAQ = [
      { q: 'როგორ ხდება მიწოდება?', a: 'კურიერით მთელი საქართველოს მასშტაბით, 1–3 სამუშაო დღეში. ' + money(FREE_DELIVERY_FROM) + '-ზე მეტი შეკვეთა — უფასო მიწოდება.' },
      { q: 'როგორ ვიხდი?', a: 'ნაღდი ანგარიშსწორება კურიერთან ან საბანკო გადარიცხვა შეკვეთის დადასტურების შემდეგ.' },
      { q: 'პროდუქტი ორიგინალია?', a: 'დიახ, ვმუშაობთ მხოლოდ სანდო მომწოდებლებთან და ვიძლევით 12 თვის გარანტიას.' },
      { q: 'შემიძლია შეკვეთის გაუქმება?', a: 'დიახ, სანამ შეკვეთა გზაში გავა — მოგვწერე TikTok-ზე (@luksshop_official) ან დაგვირეკე.' }
    ];
    return '<div class="wrap" style="padding:36px 0">' +
      '<div class="section-head" style="margin-bottom:22px"><div><p class="eyebrow">კონტაქტი</p>' +
      '<h1 class="h1">დაგვიკავშირდი</h1>' +
      '<p class="sub" style="margin-top:10px">გაქვს შეკითხვა პროდუქტზე ან შეკვეთაზე? ჩვენ ვპასუხობთ ყოველდღე.</p></div></div>' +
      '<div class="contact-grid">' +
        '<a class="card feature" href="https://www.tiktok.com/@luksshop_official" target="_blank" rel="noopener"><span class="fc-ico">🎵</span><h3>TikTok</h3><p>@luksshop_official — შესაკვეთად მოგვწერე</p></a>' +
        '<a class="card feature" href="tel:+995555000000"><span class="fc-ico">📞</span><h3>ტელეფონი</h3><p>+995 555 00 00 00</p></a>' +
        '<a class="card feature" href="mailto:info@luksshop.ge"><span class="fc-ico">✉️</span><h3>ელფოსტა</h3><p>info@luksshop.ge</p></a>' +
        '<div class="card feature"><span class="fc-ico">🕘</span><h3>სამუშაო საათები</h3><p>ორშ–შაბ 10:00–20:00</p></div>' +
      '</div>' +
      '<h2 class="h2" style="margin:36px 0 16px">ხშირი კითხვები</h2>' +
      FAQ.map(f => '<details class="card faq-item"><summary>' + f.q + '</summary><p>' + f.a + '</p></details>').join('') +
    '</div>';
  },

  login() {
    return '<div class="wrap"><div class="auth-wrap"><div class="card auth-card">' +
      '<p class="eyebrow">ანგარიში</p><h2 class="h2" style="margin-bottom:18px">შესვლა</h2>' +
      '<form id="loginForm" novalidate>' +
        '<div style="margin-bottom:14px"><label class="lbl" for="liEmail">ელფოსტა</label><input class="input" id="liEmail" inputmode="email" autocomplete="email"><div class="field-err" id="errLiEmail"></div></div>' +
        '<div style="margin-bottom:18px"><label class="lbl" for="liPass">პაროლი</label><input class="input" id="liPass" type="password" autocomplete="current-password"><div class="field-err" id="errLiPass"></div></div>' +
        '<button class="btn btn-primary btn-block btn-lg" type="submit">შესვლა</button>' +
      '</form>' +
      '<p class="auth-switch">არ გაქვს ანგარიში? <a href="#/signup">რეგისტრაცია</a></p>' +
      '<p class="muted" style="font-size:11px;margin-top:14px">ანგარიში ინახება ამ მოწყობილობაზე.</p>' +
    '</div></div></div>';
  },

  signup() {
    return '<div class="wrap"><div class="auth-wrap"><div class="card auth-card">' +
      '<p class="eyebrow">ანგარიში</p><h2 class="h2" style="margin-bottom:18px">რეგისტრაცია</h2>' +
      '<form id="signupForm" novalidate>' +
        '<div style="margin-bottom:14px"><label class="lbl" for="suName">სახელი და გვარი</label><input class="input" id="suName" autocomplete="name"><div class="field-err" id="errSuName"></div></div>' +
        '<div style="margin-bottom:14px"><label class="lbl" for="suEmail">ელფოსტა</label><input class="input" id="suEmail" inputmode="email" autocomplete="email"><div class="field-err" id="errSuEmail"></div></div>' +
        '<div style="margin-bottom:14px"><label class="lbl" for="suPhone">ტელეფონი</label><input class="input" id="suPhone" inputmode="tel" autocomplete="tel"><div class="field-err" id="errSuPhone"></div></div>' +
        '<div style="margin-bottom:18px"><label class="lbl" for="suPass">პაროლი (მინ. 6 სიმბოლო)</label><input class="input" id="suPass" type="password" autocomplete="new-password"><div class="field-err" id="errSuPass"></div></div>' +
        '<button class="btn btn-primary btn-block btn-lg" type="submit">ანგარიშის შექმნა</button>' +
      '</form>' +
      '<p class="auth-switch">უკვე გაქვს ანგარიში? <a href="#/login">შესვლა</a></p>' +
    '</div></div></div>';
  },

  account() {
    const u = currentUser();
    if (!u) {
      return '<div class="wrap"><div class="empty"><span class="emoji">🔐</span><h2 class="h2">შესვლა საჭიროა</h2>' +
        '<p class="sub" style="margin:10px auto 20px">შეკვეთების ისტორიის სანახავად გაიარე ავტორიზაცია.</p>' +
        '<a class="btn btn-primary" href="#/login">შესვლა</a></div></div>';
    }
    const orders = myOrders();
    const list = orders.length ? orders.map(o =>
      '<a class="cart-row" href="#/order/' + o.code + '">' +
        '<div class="cart-info"><strong>' + o.code + '</strong><span>' + formatDate(o.createdAt) + ' · ' + o.items.length + ' პროდუქტი</span></div>' +
        '<span class="pill">' + ORDER_STEPS[orderStepIndex(o.status)].label + '</span>' +
        '<span class="price">' + money(o.total) + '</span>' +
      '</a>').join('') : '<div class="empty"><span class="emoji">📦</span><p>ჯერ არ გაქვს შეკვეთები.</p></div>';
    return '<div class="wrap" style="padding:36px 0">' +
      '<div class="section-head" style="margin-bottom:22px"><div><p class="eyebrow">ანგარიში</p><h1 class="h1">' + esc(u.name) + '</h1>' +
      '<p class="sub" style="margin-top:8px">' + esc(u.email) + (u.phone ? ' · ' + esc(u.phone) : '') + '</p></div>' +
      '<button class="btn btn-ghost" data-action="logout">გასვლა</button></div>' +
      '<h2 class="h2" style="font-size:20px;margin-bottom:14px">ჩემი შეკვეთები</h2>' +
      '<div class="card">' + list + '</div>' +
      '<p class="muted" style="font-size:12px;margin-top:14px">შეკვეთები ინახება ამ მოწყობილობაზე.</p>' +
    '</div>';
  },

  notFound() {
    return '<div class="wrap"><div class="empty"><span class="emoji">🧭</span><h2 class="h2">გვერდი ვერ მოიძებნა</h2>' +
      '<p class="sub" style="margin:10px auto 20px">შესაძლოა ბმული შეიცვალა.</p>' +
      '<a class="btn btn-primary" href="#/">მთავარზე დაბრუნება</a></div></div>';
  }
};
