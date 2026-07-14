const API_BASE = 'http://127.0.0.1:8000/api';

let heroProduct = null;
let wishlistIds = new Set();

// ── API helpers ──────────────────────────────────────────────

async function api(path, options = {}) {
  const token = localStorage.getItem('access_token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data.detail || data.message || Object.values(data).flat().join(' ') || 'Request failed';
    throw new Error(typeof msg === 'string' ? msg : 'Request failed');
  }
  return data;
}

function formatPrice(value) {
  return `$${parseFloat(value).toFixed(0)}`;
}

function badgeLabel(badge) {
  return badge ? badge.toUpperCase() : '';
}

function renderStars(rating) {
  const full = Math.floor(parseFloat(rating));
  const half = parseFloat(rating) - full >= 0.5;
  let html = '';
  for (let i = 0; i < 5; i++) {
    if (i < full) html += '<i class="fa-solid fa-star"></i>';
    else if (i === full && half) html += '<i class="fa-solid fa-star-half-stroke"></i>';
    else html += '<i class="fa-regular fa-star"></i>';
  }
  return html;
}

function colorDotStyle(hex) {
  const border = hex.toLowerCase() === '#ffffff' ? 'border:1px solid #ddd;' : '';
  return `background:${hex};${border}`;
}

// ── Auth ─────────────────────────────────────────────────────

function isLoggedIn() {
  return !!localStorage.getItem('access_token');
}

function updateAuthUI() {
  const btn = document.getElementById('authBtn');
  if (!btn) return;
  if (isLoggedIn()) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    btn.innerHTML = `<i class="fa-solid fa-user-check"></i>`;
    btn.title = user.username ? `Signed in as ${user.username}` : 'Signed in';
  } else {
    btn.innerHTML = `<i class="fa-solid fa-user"></i>`;
    btn.title = 'Sign in';
  }
}

function openAuthModal(tab = 'login') {
  document.getElementById('authModal').classList.add('open');
  switchAuthTab(tab);
}

function closeAuthModal() {
  document.getElementById('authModal').classList.remove('open');
  document.getElementById('authError').textContent = '';
}

function switchAuthTab(tab) {
  document.getElementById('loginForm').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('registerForm').style.display = tab === 'register' ? 'block' : 'none';
  document.getElementById('authTabLogin').classList.toggle('active', tab === 'login');
  document.getElementById('authTabRegister').classList.toggle('active', tab === 'register');
  document.getElementById('authError').textContent = '';
}

async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  try {
    const tokens = await api('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    const profile = await api('/auth/me/');
    localStorage.setItem('user', JSON.stringify(profile));
    closeAuthModal();
    updateAuthUI();
    await syncWishlistFromServer();
    await updateCartCount();
    showToast('Welcome back!');
  } catch (err) {
    document.getElementById('authError').textContent = err.message;
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const username = document.getElementById('regUsername').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const password_confirm = document.getElementById('regPasswordConfirm').value;
  try {
    await api('/auth/register/', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, password_confirm }),
    });
    switchAuthTab('login');
    document.getElementById('loginUsername').value = username;
    document.getElementById('authError').textContent = 'Account created — please sign in.';
    document.getElementById('authError').style.color = 'var(--gold)';
  } catch (err) {
    document.getElementById('authError').style.color = '#ef4444';
    document.getElementById('authError').textContent = err.message;
  }
}

function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  updateAuthUI();
  loadWishlistState();
  updateCartCount();
  showToast('Signed out');
}

// ── Cart ─────────────────────────────────────────────────────

function getLocalCart() {
  return JSON.parse(localStorage.getItem('guest_cart') || '[]');
}

function saveLocalCart(items) {
  localStorage.setItem('guest_cart', JSON.stringify(items));
}

async function updateCartCount() {
  const el = document.getElementById('cartCount');
  let count = 0;

  if (isLoggedIn()) {
    try {
      const cart = await api('/cart/');
      count = cart.total_items;
    } catch {
      count = getLocalCart().reduce((s, i) => s + i.quantity, 0);
    }
  } else {
    count = getLocalCart().reduce((s, i) => s + i.quantity, 0);
  }

  if (count > 0) {
    el.style.display = 'flex';
    el.textContent = count;
  } else {
    el.style.display = 'none';
    el.textContent = '0';
  }
}

async function addToCart(productId, size = 'M', color = '') {
  if (isLoggedIn()) {
    try {
      await api('/cart/add/', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId, size, color, quantity: 1 }),
      });
      await updateCartCount();
      showToast('Added to cart');
      return;
    } catch (err) {
      showToast(err.message, true);
      return;
    }
  }

  const cart = getLocalCart();
  const existing = cart.find(i => i.product_id === productId && i.size === size && i.color === color);
  if (existing) existing.quantity += 1;
  else cart.push({ product_id: productId, size, color, quantity: 1 });
  saveLocalCart(cart);
  await updateCartCount();
  showToast('Added to cart');
}

function getHeroSelection() {
  const sizeBtn = document.querySelector('.size-btn.active');
  const colorBtn = document.querySelector('.color-btn.active');
  return {
    size: sizeBtn?.dataset.size || 'M',
    color: colorBtn?.dataset.name || '',
  };
}

// ── Wishlist ─────────────────────────────────────────────────

function loadWishlistState() {
  if (isLoggedIn()) return;
  wishlistIds = new Set(JSON.parse(localStorage.getItem('guest_wishlist') || '[]'));
}

async function syncWishlistFromServer() {
  if (!isLoggedIn()) return;
  try {
    const items = await api('/wishlist/');
    wishlistIds = new Set(items.map(i => i.product.id));
    document.querySelectorAll('.wish-btn').forEach(btn => {
      const id = parseInt(btn.dataset.productId, 10);
      setWishBtnState(btn, wishlistIds.has(id));
    });
  } catch { /* ignore */ }
}

function setWishBtnState(btn, active) {
  btn.classList.toggle('active', active);
  const icon = btn.querySelector('i');
  icon.classList.toggle('fa-solid', active);
  icon.classList.toggle('fa-regular', !active);
}

async function toggleWishlist(productId, btn) {
  const active = wishlistIds.has(productId);

  if (isLoggedIn()) {
    try {
      if (active) {
        await api(`/wishlist/${productId}/`, { method: 'DELETE' });
        wishlistIds.delete(productId);
      } else {
        await api('/wishlist/', {
          method: 'POST',
          body: JSON.stringify({ product_id: productId }),
        });
        wishlistIds.add(productId);
      }
      setWishBtnState(btn, !active);
      return;
    } catch (err) {
      showToast(err.message, true);
      return;
    }
  }

  if (active) wishlistIds.delete(productId);
  else wishlistIds.add(productId);
  localStorage.setItem('guest_wishlist', JSON.stringify([...wishlistIds]));
  setWishBtnState(btn, !active);
}

// ── Renderers ────────────────────────────────────────────────

function renderHero(product, featuredProducts) {
  heroProduct = product;
  const discount = product.discount_percent;
  const priceRow = product.original_price
    ? `<span class="price-now">${formatPrice(product.price)}</span>
       <span class="price-was">${formatPrice(product.original_price)}</span>
       ${discount ? `<span class="save-badge">SAVE ${discount}%</span>` : ''}`
    : `<span class="price-now">${formatPrice(product.price)}</span>`;

  const sizes = (product.sizes || ['S', 'M', 'L', 'XL']).map((s, i) =>
    `<button class="size-btn${i === 1 ? ' active' : ''}" data-size="${s}">${s}</button>`
  ).join('');

  const colors = (product.colors || []).map((c, i) => {
    const whiteShadow = c.hex_code.toLowerCase() === '#ffffff' ? ' box-shadow: 0 0 0 1px rgba(0,0,0,0.3);' : '';
    return `<button class="color-btn${i === 0 ? ' active' : ''}" style="background:${c.hex_code};${whiteShadow}"
      data-color="${c.hex_code}" data-name="${c.name}"></button>`;
  }).join('');

  const thumbs = featuredProducts.slice(0, 3).map(p =>
    `<img src="${p.image_url}" alt="${p.name}">`
  ).join('');

  document.getElementById('heroGrid').innerHTML = `
    <div>
      <div class="pill">⚽ Season 2026 — Now Available</div>
      <h1 class="hero-title display">NEW<br><span class="gold">SEASON</span><br>COLLECTION</h1>
      <p class="hero-sub">${product.name} — ${product.team}. Engineered for champions, worn by legends.</p>
      <div class="price-row">${priceRow}</div>
      <div class="selector-block">
        <p class="selector-label">Select Size</p>
        <div class="size-row" id="sizeRow">${sizes}</div>
      </div>
      <div class="selector-block">
        <p class="selector-label">Color — <span id="colorName">${product.colors?.[0]?.name || ''}</span></p>
        <div class="color-row" id="colorRow">${colors}</div>
      </div>
      <div class="hero-actions">
        <button class="btn-gold add-to-cart" id="heroAddBtn"><i class="fa-solid fa-cart-shopping"></i> Shop Now</button>
        <button class="btn-outline" onclick="document.getElementById('featuredGrid').scrollIntoView({behavior:'smooth'})">
          View Collection <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
    <div class="hero-visual">
      <div style="position:relative;">
        <div class="hero-img-frame">
          <img src="${product.image_url}" alt="${product.name}">
        </div>
        <div class="float-badge">
          <p class="t1">PRO FIT</p>
          <p class="t2">Match Ready</p>
        </div>
        <div class="thumb-col">${thumbs}</div>
      </div>
    </div>`;

  bindHeroEvents();
}

function bindHeroEvents() {
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  const colorNameEl = document.getElementById('colorName');
  document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      colorNameEl.textContent = btn.dataset.name;
    });
  });

  document.getElementById('heroAddBtn').addEventListener('click', () => {
    const { size, color } = getHeroSelection();
    addToCart(heroProduct.id, size, color);
  });
}

function renderProductCard(product) {
  const badge = product.badge
    ? `<span class="badge-tag ${product.badge}">${badgeLabel(product.badge)}</span>` : '';
  const dots = (product.colors || []).map(c =>
    `<span style="${colorDotStyle(c.hex_code)}"></span>`
  ).join('');

  return `
    <div class="jersey-card" data-product-id="${product.id}">
      <div class="jersey-img-wrap">
        <img src="${product.image_url}" alt="${product.name}">
        ${badge}
        <button class="wish-btn${wishlistIds.has(product.id) ? ' active' : ''}" data-product-id="${product.id}">
          <i class="fa-${wishlistIds.has(product.id) ? 'solid' : 'regular'} fa-heart"></i>
        </button>
        <div class="quick-add"><button class="add-to-cart" data-product-id="${product.id}">Quick Add to Cart</button></div>
      </div>
      <div class="jersey-info">
        <div class="color-dots">${dots}</div>
        <p class="jersey-name">${product.name}</p>
        <p class="jersey-team">${product.team}</p>
        <div class="jersey-bottom">
          <span class="jersey-price">${formatPrice(product.price)}</span>
          <button class="add-round add-to-cart" data-product-id="${product.id}">
            <i class="fa-solid fa-cart-shopping" style="font-size:0.8rem;"></i>
          </button>
        </div>
      </div>
    </div>`;
}

function renderBestSellerCard(product) {
  const discount = product.discount_percent;
  const was = product.original_price
    ? `<span class="was">${formatPrice(product.original_price)}</span>` : '';

  return `
    <div class="best-card" data-product-id="${product.id}">
      <div class="best-img-wrap">
        <img src="${product.image_url}" alt="${product.name}">
        ${discount ? `<span class="discount-badge">-${discount}%</span>` : ''}
        <div class="quick-view-overlay">
          <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
        </div>
      </div>
      <div class="best-info">
        <div class="stars">${renderStars(product.rating)}<span>(${product.review_count})</span></div>
        <p class="best-name">${product.name}</p>
        <div class="price-line"><span class="now">${formatPrice(product.price)}</span>${was}</div>
      </div>
    </div>`;
}

function renderCategoryCard(cat) {
  return `
    <div class="cat-card" data-category="${cat.slug}">
      <img src="${cat.image_url}" alt="${cat.name}">
      <div class="cat-text"><p>${cat.name}</p><p>${cat.style_count} styles</p></div>
      <div class="cat-arrow"><i class="fa-solid fa-arrow-right"></i></div>
    </div>`;
}

function renderTestimonial(t) {
  const stars = Array.from({ length: t.rating }, () => '<i class="fa-solid fa-star"></i>').join('');
  return `
    <div class="testi-card">
      <div class="testi-stars">${stars}</div>
      <p class="testi-text">"${t.text}"</p>
      <div class="testi-person">
        <div class="testi-avatar"><img src="${t.avatar_url}" alt="${t.name}"></div>
        <div>
          <p class="testi-name">${t.name}</p>
          <p class="testi-role">${t.role}</p>
        </div>
      </div>
      <div class="testi-quote-mark">"</div>
    </div>`;
}

function bindProductEvents(container) {
  container.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.productId, 10);
      if (id) addToCart(id);
    });
  });

  container.querySelectorAll('.wish-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWishlist(parseInt(btn.dataset.productId, 10), btn);
    });
  });

  container.querySelectorAll('.cat-card').forEach(card => {
    card.addEventListener('click', async () => {
      const slug = card.dataset.category;
      try {
        const data = await api(`/products/?category=${slug}`);
        document.getElementById('featuredGrid').innerHTML = data.results.map(renderProductCard).join('');
        bindProductEvents(document.getElementById('featuredGrid'));
        document.getElementById('featuredGrid').scrollIntoView({ behavior: 'smooth' });
      } catch (err) {
        showToast(err.message, true);
      }
    });
  });
}

// ── Toast ────────────────────────────────────────────────────

function showToast(message, isError = false) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = isError ? 'toast error show' : 'toast show';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ── Load page data ───────────────────────────────────────────

async function loadPage() {
  try {
    const [hero, featured, categories, bestSellers, testimonials] = await Promise.all([
      api('/products/hero/'),
      api('/products/?featured=true'),
      api('/categories/'),
      api('/products/?best_seller=true'),
      api('/testimonials/'),
    ]);

    renderHero(hero, featured.results);
    document.getElementById('featuredGrid').innerHTML = featured.results.map(renderProductCard).join('');
    document.getElementById('categoriesGrid').innerHTML = categories.results.map(renderCategoryCard).join('');
    document.getElementById('bestSellersRow').innerHTML = bestSellers.results.map(renderBestSellerCard).join('');
    document.getElementById('testimonialsGrid').innerHTML = testimonials.results.map(renderTestimonial).join('');

    bindProductEvents(document.getElementById('featuredGrid'));
    bindProductEvents(document.getElementById('categoriesGrid'));
    bindProductEvents(document.getElementById('bestSellersRow'));
  } catch (err) {
    showToast(`Could not load store data: ${err.message}`, true);
    console.error(err);
  }
}

// ── Init ─────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  loadWishlistState();

  // Mobile menu
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    menuToggle.innerHTML = mobileMenu.classList.contains('open')
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });

  // Auth
  document.getElementById('authBtn').addEventListener('click', () => {
    if (isLoggedIn()) {
      if (confirm('Sign out?')) logout();
    } else {
      openAuthModal('login');
    }
  });
  document.getElementById('authModalClose').addEventListener('click', closeAuthModal);
  document.getElementById('authModal').addEventListener('click', (e) => {
    if (e.target.id === 'authModal') closeAuthModal();
  });
  document.getElementById('authTabLogin').addEventListener('click', () => switchAuthTab('login'));
  document.getElementById('authTabRegister').addEventListener('click', () => switchAuthTab('register'));
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
  document.getElementById('registerForm').addEventListener('submit', handleRegister);

  // Cart button shows count (not add on click)
  document.getElementById('cartBtn').addEventListener('click', () => {
    const count = document.getElementById('cartCount').textContent;
    showToast(count === '0' || !count ? 'Your cart is empty' : `${count} item(s) in cart`);
  });

  // Newsletter
  document.getElementById('subscribeBtn').addEventListener('click', async () => {
    const email = document.getElementById('emailInput').value.trim();
    if (!email) return;
    const btn = document.getElementById('subscribeBtn');
    btn.disabled = true;
    try {
      const res = await api('/newsletter/', { method: 'POST', body: JSON.stringify({ email }) });
      document.getElementById('newsletterForm').style.display = 'none';
      document.getElementById('newsletterSuccess').style.display = 'block';
      document.getElementById('newsletterSuccess').textContent = res.message;
    } catch (err) {
      showToast(err.message, true);
      btn.disabled = false;
    }
  });

  updateAuthUI();
  updateCartCount();
  if (isLoggedIn()) syncWishlistFromServer();
  loadPage();
});
