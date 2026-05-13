
const BACKEND_URL = "https://api.kavistore.online";

let PRODUCTS = [];
let cart = JSON.parse(localStorage.getItem("cart_v1") || "[]");

const productsGrid = document.getElementById("productsGrid");

const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

const checkoutModal = document.getElementById("checkoutModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const checkoutForm = document.getElementById("checkoutForm");
const orderResult = document.getElementById("orderResult");

const phoneInput = document.getElementById("phoneInput");
const trackBtn = document.getElementById("trackBtn");
const trackResult = document.getElementById("trackResult");

const quickViewModal = document.getElementById("quickViewModal");
const closeQuickViewBtn = document.getElementById("closeQuickViewBtn");

const qvTitle = document.getElementById("qvTitle");
const qvImage = document.getElementById("qvImage");
const qvPrev = document.getElementById("qvPrev");
const qvNext = document.getElementById("qvNext");
const qvCount = document.getElementById("qvCount");
const qvCode = document.getElementById("qvCode");
const qvPrice = document.getElementById("qvPrice");
const qvSizes = document.getElementById("qvSizes");
const qvAddBtn = document.getElementById("qvAddBtn");



function formatPrice(num, prices) {
  const data = prices || {};
  const kzt = Number(data.kzt || num || 0);
  const byn = Number(data.byn || 0);
  const kgs = Number(data.kgs || 0);
  const uzs = Number(data.uzs || 0);

  const parts = [];

  if (kzt) {
    parts.push(`${new Intl.NumberFormat("ru-RU").format(kzt)} ₸ (🇰🇿)`);
  }

  if (byn) {
    parts.push(`${new Intl.NumberFormat("ru-RU").format(byn)} Br (🇧🇾)`);
  }

  if (kgs) {
    parts.push(`${new Intl.NumberFormat("ru-RU").format(kgs)} COM (🇰🇬)`);
  }

  if (uzs) {
    parts.push(`${new Intl.NumberFormat("ru-RU").format(uzs)} СУМ (🇺🇿)`);
  }

  if (parts.length) return parts.join("  ");

  return "Цена уточняется";
}

function formatPriceHTML(num, prices) {
  const data = prices || {};
  const kzt = Number(data.kzt || num || 0);
  const byn = Number(data.byn || 0);
  const kgs = Number(data.kgs || 0);
  const uzs = Number(data.uzs || 0);

  const main = kzt || Number(num || 0);
  const mainHTML = main
    ? `<div class="price-premium__main">${new Intl.NumberFormat("ru-RU").format(main)} ₸ <span>🇰🇿</span></div>`
    : `<div class="price-premium__main">Цена уточняется</div>`;

  const chips = [];

  if (byn) chips.push(`<span>🇧🇾 ${new Intl.NumberFormat("ru-RU").format(byn)} Br</span>`);
  if (kgs) chips.push(`<span>🇰🇬 ${new Intl.NumberFormat("ru-RU").format(kgs)} COM</span>`);
  if (uzs) chips.push(`<span>🇺🇿 ${new Intl.NumberFormat("ru-RU").format(uzs)} СУМ</span>`);

  return `
    <div class="price-premium">
      ${mainHTML}
      ${chips.length ? `<div class="price-premium__chips">${chips.join("")}</div>` : ""}
    </div>
  `;
}

function formatCartPrice(num) {
  return new Intl.NumberFormat("ru-RU").format(Number(num || 0)) + " ₸";
}

function getMainPrice(product) {
  return Number(product?.prices?.kzt || product?.price || 0);
}

function formatUSD(num) {
  return formatCartPrice(num);
}


function saveCart() {
  localStorage.setItem("cart_v1", JSON.stringify(cart));
}

function getCartCount() {
  return cart.reduce((acc, item) => acc + item.qty, 0);
}

function getCartTotal() {
  return cart.reduce((acc, item) => acc + item.qty * item.price, 0);
}

function findProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}

function addToCart(productId) {
  const p = findProduct(productId);
  if (!p) return;

  const exists = cart.find((i) => i.id === productId);
  if (exists) exists.qty += 1;
  else cart.push({
  id: p.id,
  name: p.name,
  productCode: p.productCode || "—",
  price: getMainPrice(p),
  qty: 1,
});


  saveCart();
  renderCart();
}

function changeQty(productId, delta) {
  const item = cart.find((i) => i.id === productId);
  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    cart = cart.filter((i) => i.id !== productId);
  }

  saveCart();
  renderCart();
}

function safeText(v) {
  return (v ?? "").toString();
}

async function loadProducts() {
  try {
    const res = await fetch(`${BACKEND_URL}/catalog.json?t=${Date.now()}`, {
      cache: "no-store"
    });

    if (!res.ok) {
      throw new Error("HTTP " + res.status);
    }

    const data = await res.json();

    console.log("✅ PRODUCTS LOADED:", data);

    PRODUCTS = Array.isArray(data) ? data : [];

    renderProducts(PRODUCTS);
  } catch (e) {
    console.log("Ошибка загрузки товаров:", e);
    productsGrid.innerHTML = `
      <div class="muted">
        ❌ Не удалось загрузить товары.<br/>
        Открой: <b>https://api.kavistore.online/catalog.json</b>
      </div>
    `;
  }
}


function renderProducts(list) {
  productsGrid.innerHTML = "";

  if (!list || list.length === 0) {
    productsGrid.innerHTML = `<div class="muted">Ничего не найдено 😕</div>`;
    return;
  }

  list.forEach((p) => {
    const card = document.createElement("div");
    card.className = "card";

    const images = Array.isArray(p.images)
      ? p.images
      : p.image
      ? [p.image]
      : [];

    let activeIndex = 0;

   
    const getFullUrl = (imgPath) => new URL(imgPath, BACKEND_URL).href;

    const codeLabel = p.productCode ? `Код: ${p.productCode}` : "Telegram";
    const priceLabel = formatPriceHTML(p.price, p.prices);

    card.innerHTML = `
      <div class="card__img">
        ${
          images.length > 0
            ? `
              <img id="img_${p.id}" src="${getFullUrl(images[0])}" alt="${safeText(p.name)}">

              ${
                images.length > 1
                  ? `
                    <button class="icon-btn" data-prev="${p.id}" style="position:absolute;left:10px;top:10px;">◀</button>
                    <button class="icon-btn" data-next="${p.id}" style="position:absolute;right:10px;top:10px;">▶</button>
                    <div style="position:absolute;left:10px;bottom:10px;font-size:12px;color:rgba(255,255,255,.75);">
                      ${images.length} фото
                    </div>
                  `
                  : ``
              }
            `
            : `<div class="muted">Нет фото</div>`
        }
      </div>

      <div class="card__body">
        <div class="card__title">${safeText(p.name) || "Товар"}</div>

        <div class="card__meta">
          <div class="tag">${codeLabel}</div>
          <div class="price price--premium">${priceLabel}</div>
        </div>

        <button class="btn" data-add="${p.id}">Добавить в корзину</button>
      </div>
    `;

    productsGrid.appendChild(card);
    const imgEl = card.querySelector(".card__img img");
if (imgEl) {
  imgEl.style.cursor = "zoom-in";
  imgEl.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    openImgModal(imgEl.src);
  });
}


    card.addEventListener("click", (e) => {
 
  if (e.target.closest("button")) return;
  openQuickView(p);
});


   
    if (images.length > 1) {
      const imgEl = card.querySelector(`#img_${p.id}`);
      const prevBtn = card.querySelector(`[data-prev="${p.id}"]`);
      const nextBtn = card.querySelector(`[data-next="${p.id}"]`);

      prevBtn.addEventListener("click", () => {
        activeIndex = (activeIndex - 1 + images.length) % images.length;
        imgEl.src = getFullUrl(images[activeIndex]);
      });

      nextBtn.addEventListener("click", () => {
        activeIndex = (activeIndex + 1) % images.length;
        imgEl.src = getFullUrl(images[activeIndex]);
      });
    }
  });

 
  document.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-add"));
      addToCart(id);
      openCart();
    });
  });
}



function applyFilters() {
  const q = (searchInput.value || "").toLowerCase().trim();
  let list = [...PRODUCTS];

  if (q) {
    list = list.filter((p) => {
      const name = safeText(p.name).toLowerCase();
      const category = safeText(p.category).toLowerCase(); 
      const code = safeText(p.productCode);
      return name.includes(q) || category.includes(q) || code.includes(q);
    });
  }

  const sort = sortSelect.value;

  if (sort === "price_asc") list.sort((a, b) => getMainPrice(a) - getMainPrice(b));
  if (sort === "price_desc") list.sort((a, b) => getMainPrice(b) - getMainPrice(a));
  if (sort === "name_asc")
    list.sort((a, b) => safeText(a.name).localeCompare(safeText(b.name), "ru"));

  renderProducts(list);
}

function renderCart() {
  cartCount.textContent = getCartCount();
  cartTotal.textContent = formatCartPrice(getCartTotal());

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `<div class="muted">Корзина пустая 🥲</div>`;
    return;
  }

  cart.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div class="cart-item__img">🛍️</div>
      <div class="cart-item__info">
        <div class="cart-item__title">${safeText(item.name)}</div>
        <div class="cart-item__sub">${formatCartPrice(item.price)} • Кол-во: ${item.qty}</div>
      </div>
      <div class="qty">
        <button data-dec="${item.id}">−</button>
        <b>${item.qty}</b>
        <button data-inc="${item.id}">+</button>
      </div>
    `;
    cartItems.appendChild(row);
  });

  document.querySelectorAll("[data-dec]").forEach((btn) => {
    btn.addEventListener("click", () => changeQty(Number(btn.dataset.dec), -1));
  });
  document.querySelectorAll("[data-inc]").forEach((btn) => {
    btn.addEventListener("click", () => changeQty(Number(btn.dataset.inc), +1));
  });
}

function openCart() {
  overlay.style.display = "block";
  cartDrawer.classList.add("open");
}

function closeCart() {
  overlay.style.display = "none";
  cartDrawer.classList.remove("open");
}

openCartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
overlay.addEventListener("click", (e) => {
  if (e.target !== overlay) return;
  closeCart();
  closeModal();
});



function openModal() {
  checkoutModal.classList.add("open");
  overlay.style.display = "block";
  orderResult.style.display = "none";
  orderResult.innerHTML = "";
}

function closeModal() {
  checkoutModal.classList.remove("open");
}

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Корзина пустая 🙃");
    return;
  }
  openModal();
});

closeModalBtn.addEventListener("click", closeModal);

function generateOrderId() {
  const part = Math.floor(100000 + Math.random() * 899999);
  return "KS-" + part;
}

checkoutForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("nameInput").value.trim();
  const phone = document.getElementById("checkoutPhoneInput").value.trim();
  const size = document.getElementById("sizeInput").value.trim();
  const address = document.getElementById("addressInput").value.trim();
  const telegram = document.getElementById("telegramInput")?.value.trim() || "";


  if (!name || !phone || !size || !address) {
  alert("Пожалуйста, заполните имя, телефон, размер и адрес");
  return;
}

  if (!cart.length) return alert("Корзина пустая 🙃");

  try {
    const res = await fetch(`${BACKEND_URL}/api/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ name, phone, telegram, size, address, cart }),
    });

    const text = await res.text();
    let data = {};
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    console.log("✅ ORDER RESPONSE:", res.status, data);

    if (!res.ok || !data.success) {
      alert(data.message || "Ошибка оформления заказа");
      return;
    }
    
sendOrderToSheets({
  orderId: data.orderId,
  name,
  phone,
  telegram,
  size,
  address,
  items: cart.map(i =>
    `${i.name} | ${i.productCode} | ${i.qty}шт`
  ).join(" ; "),
  total: getCartTotal()
});


    orderResult.style.display = "block";

const tgUsername = "kavi_manager";

const tgText =
  `Здравствуйте! Я с сайта KAVISTORE ✅\n` +
  `Мой заказ: ${data.orderId}\n` +
  `Телефон: ${phone}\n` +
  `Размер: ${size || "не указан"}\n`;

const tgLinkApp = `tg://resolve?domain=${tgUsername}&text=${encodeURIComponent(tgText)}`;
const tgLinkWeb = `https://t.me/${tgUsername}?text=${encodeURIComponent(tgText)}`;


orderResult.innerHTML = `
  ✅ <b>Заказ оформлен!</b><br/><br/>

  <b>Номер заказа:</b> ${data.orderId}<br/>
  <b>Сумма:</b> ${formatCartPrice(data.total)}<br/><br/>

  <a href="${tgLinkApp}" class="tg-pay-btn">
    💬 Написать менеджеру в Telegram
  </a>

  <div style="margin-top:10px">
    <button class="btn"
      onclick='copyTextToClipboard(${JSON.stringify(tgText)})'>
      📋 Скопировать текст
    </button>
  </div>

  <div style="margin-top:8px;font-size:12px;opacity:.7">
    Если Telegram открылся без текста — нажмите «Скопировать»
    И напишите менеджеру
  </div>
`;



    cart = [];
    saveCart();
    renderCart();
} catch (err) {
  console.log("❌ ORDER ERROR:", err);

  orderResult.style.display = "block";
  orderResult.innerHTML = `
    ⚠️ Заказ мог быть отправлен, но ответ от сервера не получен.<br/>
    Пожалуйста, попробуйте ещё раз через 3–5 секунд.
  `;
}
});





function normalizePhone(p) {
  return (p || "").trim();
}

trackBtn.addEventListener("click", async () => {
  const phone = phoneInput.value.trim();

  if (!phone) {
    alert("Введите номер телефона");
    return;
  }

  trackResult.style.display = "block";
  trackResult.innerHTML = "⏳ Проверяем...";

  try {
    const res = await fetch(
      `${BACKEND_URL}/api/track?phone=${encodeURIComponent(phone)}`
    );
    const data = await res.json();

    if (!data.ok) {
      trackResult.innerHTML = `❌ ${data.message || "Ошибка"}`;
      return;
    }

    if (!data.found) {
      trackResult.innerHTML = data.message;
      return;
    }

    trackResult.innerHTML = `
      ✅ Заказ найден!<br/>
      🧾 Код: <b>${data.orderId}</b><br/>
      📦 Статус: <b>${data.statusText}</b><br/>
      💰 Сумма: <b>${formatCartPrice(data.total)}</b>
    `;
  } catch (err) {
    trackResult.innerHTML = "❌ Ошибка соединения с сервером";
  }
});

searchInput.addEventListener("input", applyFilters);
sortSelect.addEventListener("change", applyFilters);

renderCart();
loadProducts();

let qvProduct = null;
let qvImages = [];
let qvIndex = 0;

function openQuickView(product) {
  qvProduct = product;

  qvImages = Array.isArray(product.images)
    ? product.images
    : product.image
    ? [product.image]
    : [];

  qvIndex = 0;

  qvTitle.textContent = safeText(product.name) || "Товар";
  qvCode.textContent = product.productCode ? `Код: ${product.productCode}` : "Telegram";
  qvPrice.innerHTML = formatPriceHTML(product.price || 0, product.prices);

  const sizesText = Array.isArray(product.sizes) && product.sizes.length
    ? `Размеры: ${product.sizes.join(", ")}`
    : "Размеры: уточняйте у менеджера";

  qvSizes.textContent = sizesText;

  if (qvImages.length > 0) {
    qvImage.src = new URL(qvImages[0], BACKEND_URL).href;
  } else {
    qvImage.src = "";
  }

  qvCount.textContent = qvImages.length ? `1 / ${qvImages.length}` : `0 / 0`;

  quickViewModal.classList.add("open");
  overlay.style.display = "block";
}

function closeQuickView() {
  quickViewModal.classList.remove("open");
}

function qvRender() {
  if (!qvImages.length) return;
  qvImage.src = new URL(qvImages[qvIndex], BACKEND_URL).href;
  qvCount.textContent = `${qvIndex + 1} / ${qvImages.length}`;
}

qvPrev.addEventListener("click", () => {
  if (!qvImages.length) return;
  qvIndex = (qvIndex - 1 + qvImages.length) % qvImages.length;
  qvRender();
});

qvNext.addEventListener("click", () => {
  if (!qvImages.length) return;
  qvIndex = (qvIndex + 1) % qvImages.length;
  qvRender();
});

closeQuickViewBtn.addEventListener("click", closeQuickView);

qvAddBtn.addEventListener("click", () => {
  if (!qvProduct) return;
  addToCart(Number(qvProduct.id));
  closeQuickView();
  openCart();
});

document.querySelectorAll(".faq-q").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item");
    item.classList.toggle("open");
  });
});

const imgModal = document.getElementById("imgModal");
const imgModalImage = document.getElementById("imgModalImage");
const imgModalClose = document.getElementById("imgModalClose");

function openImgModal(src) {
  imgModalImage.src = src;
  imgModal.classList.add("open");
}

function closeImgModal() {
  imgModal.classList.remove("open");
  imgModalImage.src = "";
}

imgModalClose.addEventListener("click", closeImgModal);

imgModal.addEventListener("click", (e) => {
 
  if (e.target === imgModal) closeImgModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeImgModal();
});



console.log("TRACK CLICKED");
console.log("PHONE:", phoneInput.value);

(function initReviewsMarquee() {
  const track = document.getElementById("reviewsTrack");
  if (!track) return;

  const items = Array.from(track.children);
  items.forEach((el) => track.appendChild(el.cloneNode(true)));

  function applyShift() {
    
    const half = track.scrollWidth / 2;
    track.style.setProperty("--reviews-shift", Math.round(half));
  }

  window.addEventListener("load", applyShift);

  window.addEventListener("resize", applyShift);

  track.querySelectorAll("img").forEach((img) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => openImgModal(img.src));
  });
})();


function copyTextToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert("Текст скопирован. Просто вставьте его в Telegram менеджеру 👍");
  });
}










