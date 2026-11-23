/* ============================================================
   الأمين للعطور — منطق الموقع
   البيانات (المنتجات، الأسعار، الشحن، الآراء) في js/data.js
   ============================================================ */

/* -------------------------------------------------------------
   Icons
   ------------------------------------------------------------- */
const ICON = {
  wa: `<svg viewBox="0 0 24 24" class="icon icon-fill" aria-hidden="true"><path d="M17.6 6.32A8.86 8.86 0 0 0 11.94 4c-4.9 0-8.9 4-8.9 8.9 0 1.57.41 3.1 1.19 4.44L3 21l3.77-1.2a8.9 8.9 0 0 0 4.17 1.06h.01c4.9 0 8.9-4 8.9-8.9a8.86 8.86 0 0 0-2.25-5.64Zm-5.66 13.7h-.01a7.4 7.4 0 0 1-3.77-1.03l-.27-.16-2.8.9.9-2.73-.18-.28a7.38 7.38 0 0 1-1.14-3.92c0-4.08 3.32-7.4 7.4-7.4a7.35 7.35 0 0 1 5.23 2.17 7.34 7.34 0 0 1 2.17 5.23c0 4.08-3.33 7.4-7.4 7.4Zm4.06-5.54c-.22-.11-1.31-.65-1.51-.72-.2-.07-.35-.11-.5.11-.15.22-.57.72-.7.87-.13.15-.26.16-.48.06-.22-.11-.94-.35-1.79-1.1-.66-.59-1.11-1.32-1.24-1.54-.13-.22-.01-.34.1-.45.1-.1.22-.26.33-.39.11-.13.15-.22.22-.37.07-.15.04-.28-.02-.39-.06-.11-.5-1.2-.68-1.65-.18-.43-.36-.37-.5-.38h-.43c-.15 0-.39.06-.59.28-.2.22-.78.76-.78 1.85 0 1.09.8 2.14.91 2.29.11.15 1.57 2.4 3.81 3.36.53.23.95.37 1.27.47.53.17 1.02.15 1.4.09.43-.06 1.31-.53 1.49-1.05.19-.51.19-.95.13-1.04-.06-.09-.2-.15-.42-.26Z"/></svg>`,
  bag: `<svg viewBox="0 0 24 24" class="icon" aria-hidden="true"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" class="icon" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>`,
  minus: `<svg viewBox="0 0 24 24" class="icon" aria-hidden="true"><path d="M5 12h14"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" class="icon" aria-hidden="true"><path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/></svg>`,
  share: `<svg viewBox="0 0 24 24" class="icon" aria-hidden="true"><circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="m8.2 10.8 7.6-4M8.2 13.2l7.6 4"/></svg>`,
  link: `<svg viewBox="0 0 24 24" class="icon" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>`,
  top: `<svg viewBox="0 0 24 24" class="icon" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 4v16M4 12h16M6.3 6.3l11.4 11.4M17.7 6.3 6.3 17.7"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" class="icon" aria-hidden="true"><circle cx="12" cy="12" r="2.2"/><path d="M12 9.8C10.5 6 12 3.5 12 3.5s1.5 2.5 0 6.3ZM12 14.2c1.5 3.8 0 6.3 0 6.3s-1.5-2.5 0-6.3ZM9.8 12C6 13.5 3.5 12 3.5 12s2.5-1.5 6.3 0ZM14.2 12c3.8-1.5 6.3 0 6.3 0s-2.5 1.5-6.3 0Z"/></svg>`,
  base: `<svg viewBox="0 0 24 24" class="icon" aria-hidden="true"><ellipse cx="12" cy="6" rx="6" ry="2.5"/><path d="M6 6v12c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V6"/><path d="M9 11.5c1 .6 2 .9 3 .9M10 16c.7.3 1.3.4 2 .4"/></svg>`,
  close: `<svg viewBox="0 0 24 24" class="icon" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>`,
  check: `<svg viewBox="0 0 24 24" class="icon" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>`,
};

/* -------------------------------------------------------------
   Helpers
   ------------------------------------------------------------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const byId = id => PRODUCTS.find(p => p.id === id);
const fmt = n => Math.round(n).toLocaleString("en-US");

function priceInfo(p, size) {
  const base = p.prices[size];
  const off = SIZE_DISCOUNT && SIZE_DISCOUNT.percent && Number(size) === SIZE_DISCOUNT.size;
  const final = off ? Math.round(base * (100 - SIZE_DISCOUNT.percent) / 100) : base;
  return { base, final, discounted: !!off };
}

function waLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function singleOrderMessage(p, size) {
  const { final, discounted } = priceInfo(p, size);
  return [
    "مرحبًا، أرغب في طلب العطر التالي من الأمين للعطور:",
    `العطر: ${p.name} (${p.en}) — مستوحى من ${p.house}`,
    `الحجم: ${size} مل`,
    `السعر: ${fmt(final)} ${CURRENCY}${discounted ? ` (بعد خصم ${SIZE_DISCOUNT.percent}%)` : ""}`,
  ].join("\n");
}

function perfumeUrl(p) { return `${SITE_URL}#perfume/${p.id}`; }

// توحيد النص للبحث
function normalize(str) {
  return String(str || "")
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[ً-ٰٟـ]/g, "")
    .replace(/[إأآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه")
    .replace(/ڤ/g, "ف").replace(/چ/g, "ج")
    .replace(/[’'`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function searchText(p) {
  const n = p.notes || {};
  const scents = (p.scent || []).map(s => SCENTS[s] && SCENTS[s].label).join(" ");
  return normalize([p.name, p.en, p.house, p.family, AUDIENCE_LABELS[p.audience], p.tag, scents, n.top, n.heart, n.base, n.all].join(" "));
}

function notesList(p, withIcons) {
  const n = p.notes || {};
  if (n.all) return `<div>${withIcons ? `<span class="note-ico">${ICON.heart}</span>` : ""}<dt>المكوّنات</dt><dd>${n.all}</dd></div>`;
  const row = (key, label, ico) => n[key] ? `<div>${withIcons ? `<span class="note-ico">${ico}</span>` : ""}<dt>${label}</dt><dd>${n[key]}</dd></div>` : "";
  return row("top", "الافتتاحية", ICON.top) + row("heart", "القلب", ICON.heart) + row("base", "القاعدة", ICON.base);
}

function metaText(p) {
  const parts = [];
  if (p.year) parts.push(`صدر الأصلي عام ${p.year}`);
  if (p.perfumer) parts.push(`بتوقيع <bdi>${p.perfumer}</bdi>`);
  return parts.join(" ");
}

function sizeOptions(p, groupName) {
  return SIZES.map((s, k) => {
    const { base, final, discounted } = priceInfo(p, s);
    return `
      <label class="size-option">
        <input type="radio" name="${groupName}" value="${s}"${k === 0 ? " checked" : ""}>
        <span class="size-pill">
          ${discounted ? `<span class="size-off" dir="ltr">-${SIZE_DISCOUNT.percent}%</span>` : ""}
          <span class="size-ml">${s} مل</span>
          <span class="size-price">${fmt(final)} <small>${CURRENCY}</small></span>
          ${discounted ? `<s class="size-was">${fmt(base)}</s>` : ""}
        </span>
      </label>`;
  }).join("");
}

function chipsHTML(p) {
  const rank = BEST_SELLERS.indexOf(p.id);
  return `
    <span class="product-category">${AUDIENCE_LABELS[p.audience] || ""}</span>
    ${rank > -1 ? `<span class="product-tag product-tag--best">الأكثر طلبًا</span>` : ""}
    ${p.isNew ? `<span class="product-tag product-tag--new">جديد</span>` : ""}
    ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ""}`;
}

function scentChips(p) {
  return (p.scent || []).map(s => SCENTS[s] ? `<span class="scent-chip">${SCENTS[s].emoji} ${SCENTS[s].label}</span>` : "").join("");
}

/* -------------------------------------------------------------
   Toast
   ------------------------------------------------------------- */
let toastTimer;
function toast(html) {
  const el = $("#toast");
  if (!el) return;
  el.innerHTML = html;
  el.classList.add("is-shown");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("is-shown"), 2600);
}

/* -------------------------------------------------------------
   Product cards
   ------------------------------------------------------------- */
function cardHTML(p, i) {
  return `
    <article class="product-card" data-id="${p.id}" data-category="${p.audience}" data-scent="${(p.scent || []).join(" ")}" data-search="${searchText(p)}" data-reveal style="--d:${(i % 3) * 70}ms">
      <a class="product-media" href="#perfume/${p.id}" aria-label="تفاصيل ${p.name}">
        <img class="product-img" src="${p.image}" alt="${p.name} — ${p.en}" loading="lazy" decoding="async" width="600" height="750">
        <span class="product-chips">${chipsHTML(p)}</span>
        <span class="media-hint">عرض التفاصيل</span>
      </a>

      <div class="product-body">
        <h3><a href="#perfume/${p.id}">${p.name}</a></h3>
        <p class="product-en" dir="ltr">${p.en}</p>
        <p class="product-house">مستوحى من <bdi dir="ltr">${p.house}</bdi></p>
        <div class="scent-chips">${scentChips(p)}</div>

        <details class="product-details">
          <summary>
            <span>مكوّنات العطر</span>
            <svg viewBox="0 0 24 24" class="icon chevron" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
          </summary>
          <dl class="product-notes">${notesList(p, false)}</dl>
          ${metaText(p) ? `<p class="product-meta">${metaText(p)}</p>` : ""}
        </details>

        <div class="sizes" role="radiogroup" aria-label="اختر الحجم">${sizeOptions(p, `size-${p.id}`)}</div>

        <div class="card-actions">
          <button type="button" class="btn btn-gold add-btn" data-add="${p.id}">${ICON.bag}<span>أضف للسلة</span></button>
          <a class="btn btn-icon order-btn" target="_blank" rel="noopener" href="${waLink(singleOrderMessage(p, SIZES[0]))}" aria-label="اطلب ${p.name} مباشرة عبر واتساب" title="اطلب مباشرة عبر واتساب">${ICON.wa}</a>
        </div>
      </div>
    </article>`;
}

function renderProducts() {
  const grid = $("#product-grid");
  if (grid) grid.innerHTML = PRODUCTS.map(cardHTML).join("");
}

function selectedSize(scope) {
  const checked = $(".size-option input:checked", scope);
  return Number(checked ? checked.value : SIZES[0]);
}

function initCardInteractions() {
  document.addEventListener("change", e => {
    if (!e.target.matches(".size-option input")) return;
    const scope = e.target.closest("[data-id]");
    if (!scope) return;
    const p = byId(scope.dataset.id);
    const btn = $(".order-btn", scope);
    if (p && btn) btn.href = waLink(singleOrderMessage(p, selectedSize(scope)));
  });

  document.addEventListener("click", e => {
    const add = e.target.closest("[data-add]");
    if (!add) return;
    const p = byId(add.dataset.add);
    const scope = add.closest("[data-id]");
    const size = add.dataset.size ? Number(add.dataset.size) : selectedSize(scope || document);
    Cart.add(p.id, size);
    add.classList.add("is-added");
    setTimeout(() => add.classList.remove("is-added"), 900);
    toast(`${ICON.check}<span>اتضاف <b>${p.name}</b> (${size} مل) للسلة</span><button type="button" class="toast-link" data-open-cart>عرض السلة</button>`);
  });
}

/* -------------------------------------------------------------
   Best sellers
   ------------------------------------------------------------- */
function renderBestSellers() {
  const wrap = $("#best-grid");
  if (!wrap) return;
  wrap.innerHTML = BEST_SELLERS.map(byId).filter(Boolean).map((p, i) => {
    const { final } = priceInfo(p, SIZES[0]);
    return `
      <a class="best-card" href="#perfume/${p.id}" data-reveal style="--d:${i * 90}ms">
        <span class="best-rank">${i + 1}</span>
        <img src="${p.image}" alt="${p.name}" loading="lazy" width="600" height="750">
        <span class="best-info">
          <span class="best-name">${p.name}</span>
          <span class="best-en" dir="ltr">${p.en}</span>
          <span class="best-price">يبدأ من ${fmt(final)} ${CURRENCY}</span>
        </span>
      </a>`;
  }).join("");
}

/* -------------------------------------------------------------
   Reviews
   ------------------------------------------------------------- */
const SOURCE_LABEL = { facebook: "توصية على فيسبوك", whatsapp: "رسالة على واتساب", message: "رسالة من عميل" };

function renderReviews() {
  const track = $("#reviews-track");
  if (!track) return;
  track.innerHTML = REVIEWS.map(r => `
    <figure class="review-card">
      <span class="review-stars" aria-label="تقييم ٥ نجوم">★★★★★</span>
      <blockquote>${r.text}</blockquote>
      <figcaption>${r.name ? `<b>${r.name}</b> · ` : ""}${SOURCE_LABEL[r.source] || ""}</figcaption>
    </figure>`).join("");

  const prev = $("#reviews-prev"), next = $("#reviews-next");
  const step = () => (track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width + 16 : 300);
  // RTL: التمرير للأمام = قيمة سالبة
  if (next) next.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
  if (prev) prev.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
}

/* -------------------------------------------------------------
   Filters (audience + scent) + search
   ------------------------------------------------------------- */
function initCatalogControls() {
  const audienceBtns = $$("[data-filter]");
  const scentBtns = $$("[data-scent-filter]");
  const input = $("#product-search");
  const clearBtn = $("#search-clear");
  const countEl = $("#results-count");
  const emptyEl = $("#no-results");
  const cards = $$(".product-card");

  audienceBtns.forEach(btn => {
    const f = btn.dataset.filter;
    const n = f === "all" ? PRODUCTS.length : PRODUCTS.filter(p => p.audience === f).length;
    const badge = $(".filter-count", btn);
    if (badge) badge.textContent = n;
  });

  let audience = "all";
  let scent = "";

  function apply() {
    const terms = normalize(input ? input.value : "").split(" ").filter(Boolean);
    let visible = 0;
    cards.forEach(card => {
      const okA = audience === "all" || card.dataset.category === audience;
      const okS = !scent || card.dataset.scent.split(" ").includes(scent);
      const okT = terms.every(t => card.dataset.search.includes(t));
      const show = okA && okS && okT;
      card.hidden = !show;
      if (show) visible++;
    });
    if (countEl) countEl.textContent = `${visible} عطر`;
    if (emptyEl) emptyEl.hidden = visible !== 0;
    if (clearBtn) clearBtn.hidden = !(input && input.value);
  }

  audienceBtns.forEach(btn => btn.addEventListener("click", () => {
    audienceBtns.forEach(b => { b.classList.toggle("is-active", b === btn); b.setAttribute("aria-pressed", String(b === btn)); });
    audience = btn.dataset.filter;
    apply();
  }));

  scentBtns.forEach(btn => btn.addEventListener("click", () => {
    const val = btn.dataset.scentFilter;
    scent = scent === val ? "" : val;             // ضغطة تانية بتلغي الفلتر
    scentBtns.forEach(b => { const on = b.dataset.scentFilter === scent; b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", String(on)); });
    apply();
  }));

  if (input) input.addEventListener("input", apply);
  if (clearBtn) clearBtn.addEventListener("click", () => { input.value = ""; apply(); input.focus(); });

  const reset = $("#reset-search");
  if (reset) reset.addEventListener("click", () => {
    input.value = "";
    scent = "";
    scentBtns.forEach(b => { b.classList.remove("is-active"); b.setAttribute("aria-pressed", "false"); });
    audienceBtns[0].click();
  });

  apply();
}

/* -------------------------------------------------------------
   Cart
   ------------------------------------------------------------- */
const Cart = (() => {
  const KEY = "alamin-cart-v1";
  let state = { items: [], zone: "", name: "", address: "" };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        state = Object.assign(state, s);
        state.items = (state.items || []).filter(it => byId(it.id) && SIZES.includes(Number(it.size)) && it.qty > 0);
      }
    } catch (e) { /* التخزين غير متاح — السلة تشتغل عادي لحد ما الصفحة تتقفل */ }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  function add(id, size, qty = 1) {
    const it = state.items.find(x => x.id === id && Number(x.size) === Number(size));
    if (it) it.qty += qty; else state.items.push({ id, size: Number(size), qty });
    save(); render();
    bump();
  }
  function setQty(id, size, qty) {
    const it = state.items.find(x => x.id === id && Number(x.size) === Number(size));
    if (!it) return;
    it.qty = Math.max(0, qty);
    state.items = state.items.filter(x => x.qty > 0);
    save(); render();
  }
  function clear() { state.items = []; save(); render(); }

  function totals() {
    let subtotal = 0, original = 0, count = 0;
    state.items.forEach(it => {
      const { base, final } = priceInfo(byId(it.id), it.size);
      subtotal += final * it.qty;
      original += base * it.qty;
      count += it.qty;
    });
    const zone = SHIPPING_ZONES.find(z => z.id === state.zone);
    const free = subtotal >= FREE_SHIPPING_MIN;
    const shipping = !count ? 0 : free ? 0 : zone ? zone.fee : null;
    const total = subtotal + (shipping || 0);
    return { subtotal, original, savings: original - subtotal, count, zone, free, shipping, total };
  }

  function message() {
    const t = totals();
    const lines = ["مرحبًا، أرغب في طلب الآتي من الأمين للعطور:", ""];
    state.items.forEach((it, i) => {
      const p = byId(it.id);
      const { final } = priceInfo(p, it.size);
      lines.push(`${i + 1}) ${p.name} (${p.en}) — ${it.size} مل × ${it.qty} = ${fmt(final * it.qty)} ${CURRENCY}`);
    });
    lines.push("");
    if (t.savings > 0) lines.push(`الخصم: ${fmt(t.savings)} ${CURRENCY}`);
    lines.push(`المجموع: ${fmt(t.subtotal)} ${CURRENCY}`);
    if (t.free) lines.push("الشحن: مجاني 🎉");
    else if (t.zone) lines.push(`الشحن (${t.zone.label}): ${fmt(t.shipping)} ${CURRENCY}`);
    else lines.push("الشحن: حسب المحافظة");
    lines.push(`الإجمالي: ${fmt(t.total)} ${CURRENCY}${!t.free && !t.zone ? " + الشحن" : ""}`);
    const name = state.name.trim(), address = state.address.trim();
    if (name || address) lines.push("");
    if (name) lines.push(`الاسم: ${name}`);
    if (address) lines.push(`العنوان: ${address}`);
    return lines.join("\n");
  }

  function bump() {
    $$(".cart-count").forEach(el => { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); });
  }

  function render() {
    const t = totals();
    $$(".cart-count").forEach(el => { el.textContent = t.count; el.hidden = t.count === 0; });

    const list = $("#cart-items");
    if (!list) return;
    const empty = $("#cart-empty"), footer = $("#cart-footer");
    empty.hidden = t.count > 0;
    footer.hidden = t.count === 0;

    list.innerHTML = state.items.map(it => {
      const p = byId(it.id);
      const { base, final, discounted } = priceInfo(p, it.size);
      return `
        <li class="cart-item">
          <img src="${p.image}" alt="" width="72" height="90">
          <div class="cart-item-info">
            <a href="#perfume/${p.id}" class="cart-item-name">${p.name}</a>
            <span class="cart-item-sub">${it.size} مل · ${fmt(final)} ${CURRENCY}${discounted ? ` <s>${fmt(base)}</s>` : ""}</span>
            <div class="qty">
              <button type="button" data-qty="${p.id}|${it.size}|1" aria-label="زيادة">${ICON.plus}</button>
              <span aria-live="polite">${it.qty}</span>
              <button type="button" data-qty="${p.id}|${it.size}|-1" aria-label="تقليل">${ICON.minus}</button>
            </div>
          </div>
          <div class="cart-item-end">
            <b>${fmt(final * it.qty)} <small>${CURRENCY}</small></b>
            <button type="button" class="cart-remove" data-remove="${p.id}|${it.size}" aria-label="حذف ${p.name}">${ICON.trash}</button>
          </div>
        </li>`;
    }).join("");

    // شريط التوصيل المجاني
    const bar = $("#free-ship");
    if (bar) {
      const pct = Math.min(100, (t.subtotal / FREE_SHIPPING_MIN) * 100);
      $(".free-ship-fill", bar).style.width = pct + "%";
      $(".free-ship-text", bar).innerHTML = t.free
        ? `🎉 مبروك! طلبك عليه <b>توصيل مجاني</b>`
        : `فاضلك <b>${fmt(FREE_SHIPPING_MIN - t.subtotal)} ${CURRENCY}</b> وتاخد <b>توصيل مجاني</b>`;
    }

    $("#cart-subtotal").textContent = `${fmt(t.subtotal)} ${CURRENCY}`;
    const sv = $("#cart-savings-row");
    sv.hidden = t.savings <= 0;
    $("#cart-savings").textContent = `- ${fmt(t.savings)} ${CURRENCY}`;
    $("#cart-shipping").innerHTML = t.free ? `<span class="free">مجاني</span>` : t.zone ? `${fmt(t.shipping)} ${CURRENCY}` : `<span class="muted">اختار المحافظة</span>`;
    $("#cart-total").textContent = `${fmt(t.total)} ${CURRENCY}`;

    const zoneSel = $("#cart-zone");
    if (zoneSel && zoneSel.value !== state.zone) zoneSel.value = state.zone;
    const send = $("#cart-send");
    if (send) send.href = waLink(message());
  }

  function init() {
    load();
    const zoneSel = $("#cart-zone");
    if (zoneSel) {
      zoneSel.innerHTML = `<option value="">اختار المحافظة…</option>` +
        SHIPPING_ZONES.map(z => `<option value="${z.id}">${z.label} — ${z.fee} ${CURRENCY}</option>`).join("");
      zoneSel.addEventListener("change", () => { state.zone = zoneSel.value; save(); render(); });
    }
    const nameIn = $("#cart-name"), addrIn = $("#cart-address");
    if (nameIn) { nameIn.value = state.name; nameIn.addEventListener("input", () => { state.name = nameIn.value; save(); render(); }); }
    if (addrIn) { addrIn.value = state.address; addrIn.addEventListener("input", () => { state.address = addrIn.value; save(); render(); }); }

    const dialog = $("#cart");
    document.addEventListener("click", e => {
      if (e.target.closest("[data-open-cart]")) { e.preventDefault(); openDialog(dialog); }
      const q = e.target.closest("[data-qty]");
      if (q) { const [id, size, d] = q.dataset.qty.split("|"); const it = state.items.find(x => x.id === id && x.size === Number(size)); if (it) setQty(id, Number(size), it.qty + Number(d)); }
      const r = e.target.closest("[data-remove]");
      if (r) { const [id, size] = r.dataset.remove.split("|"); setQty(id, Number(size), 0); }
      if (e.target.closest("#cart-clear")) clear();
      if (e.target.closest(".cart-item-name")) closeDialog(dialog);
    });
    const send = $("#cart-send");
    if (send) send.addEventListener("click", () => { send.href = waLink(message()); });
    render();
  }

  return { init, add, render };
})();

/* -------------------------------------------------------------
   Dialog helpers
   ------------------------------------------------------------- */
function openDialog(d) {
  if (!d || d.open) return;
  if (typeof d.showModal === "function") d.showModal(); else d.setAttribute("open", "");
  document.documentElement.classList.add("no-scroll");
}
function closeDialog(d) {
  if (!d || !d.open) return;
  d.classList.add("is-closing");
  setTimeout(() => {
    d.classList.remove("is-closing");
    if (typeof d.close === "function") d.close(); else d.removeAttribute("open");
  }, 180);
}
function initDialogs() {
  $$("dialog.sheet").forEach(d => {
    d.addEventListener("click", e => {
      if (e.target === d || e.target.closest("[data-close]")) closeDialog(d);
    });
    d.addEventListener("close", () => {
      if (!$$("dialog[open]").length) document.documentElement.classList.remove("no-scroll");
      d.dispatchEvent(new CustomEvent("sheet-closed"));
    });
  });
}

/* -------------------------------------------------------------
   Perfume page (#perfume/<id>)
   ------------------------------------------------------------- */
const STRENGTH = { light: { label: "هادي", v: 1 }, medium: { label: "متوسط", v: 2 }, strong: { label: "قوي وفوّاح", v: 3 } };
const USE_LABEL = { daily: "يومي وشغل", evening: "خروجات وسهرات", occasion: "مناسبات" };

function similarTo(p) {
  return PRODUCTS
    .filter(x => x.id !== p.id && (x.audience === p.audience || x.audience === "unisex" || p.audience === "unisex"))
    .map(x => ({ x, s: x.scent.filter(s => p.scent.includes(s)).length * 2 + (x.strength === p.strength ? 1 : 0) + (BEST_SELLERS.includes(x.id) ? .5 : 0) }))
    .filter(o => o.s >= 2)
    .sort((a, b) => b.s - a.s)
    .slice(0, 4)
    .map(o => o.x);
}

function renderPerfumeView(p) {
  const box = $("#pv-content");
  const st = STRENGTH[p.strength] || STRENGTH.medium;
  const sim = similarTo(p);
  box.innerHTML = `
    <div class="pv-grid" data-id="${p.id}">
      <div class="pv-media">
        <img src="${p.image}" alt="${p.name} — ${p.en}">
        <span class="product-chips">${chipsHTML(p)}</span>
      </div>
      <div class="pv-info">
        <p class="pv-house">مستوحى من <bdi dir="ltr">${p.house}</bdi></p>
        <h2 id="pv-title">${p.name}</h2>
        <p class="pv-en" dir="ltr">${p.en}</p>
        ${p.family ? `<p class="pv-family">${p.family}</p>` : ""}
        <div class="scent-chips">${scentChips(p)}</div>

        <div class="pv-facts">
          <div><span>القوة</span><b class="strength s${st.v}"><i></i><i></i><i></i> ${st.label}</b></div>
          <div><span>مناسب لـ</span><b>${(p.use || []).map(u => USE_LABEL[u]).join("، ")}</b></div>
          <div><span>لمين</span><b>${AUDIENCE_LABELS[p.audience]}</b></div>
        </div>

        <dl class="product-notes pv-notes">${notesList(p, true)}</dl>
        ${metaText(p) ? `<p class="product-meta">${metaText(p)}</p>` : ""}

        <div class="sizes" role="radiogroup" aria-label="اختر الحجم">${sizeOptions(p, `pv-size-${p.id}`)}</div>
        <div class="card-actions">
          <button type="button" class="btn btn-gold add-btn" data-add="${p.id}">${ICON.bag}<span>أضف للسلة</span></button>
          <a class="btn btn-icon order-btn" target="_blank" rel="noopener" href="${waLink(singleOrderMessage(p, SIZES[0]))}" aria-label="اطلب مباشرة عبر واتساب" title="اطلب مباشرة عبر واتساب">${ICON.wa}</a>
        </div>

        <div class="pv-share">
          <span>شارك العطر:</span>
          <a class="share-btn" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(`${p.name} (${p.en}) من الأمين للعطور 👇\n${perfumeUrl(p)}`)}">${ICON.wa}<span>واتساب</span></a>
          <button type="button" class="share-btn" data-copy="${perfumeUrl(p)}">${ICON.link}<span>نسخ اللينك</span></button>
        </div>
      </div>
    </div>
    ${sim.length ? `
    <div class="pv-similar">
      <h3>عطور ممكن تعجبك كمان</h3>
      <div class="mini-grid">
        ${sim.map(x => `
          <a class="mini-card" href="#perfume/${x.id}">
            <img src="${x.image}" alt="${x.name}" loading="lazy" width="600" height="750">
            <span class="mini-name">${x.name}</span>
            <span class="mini-en" dir="ltr">${x.en}</span>
          </a>`).join("")}
      </div>
    </div>` : ""}`;
  box.scrollTop = 0;
  $("#perfume-view").scrollTop = 0;
}

let lastScroll = 0;
function routeFromHash() {
  const m = location.hash.match(/^#perfume\/([\w-]+)/);
  const view = $("#perfume-view");
  if (m && byId(m[1])) {
    const p = byId(m[1]);
    renderPerfumeView(p);
    document.title = `${p.name} (${p.en}) | الأمين للعطور`;
    if (!view.open) { lastScroll = window.scrollY; openDialog(view); }
  } else if (view.open) {
    closeDialog(view);
  }
}

function initPerfumeView() {
  const view = $("#perfume-view");
  if (!view) return;
  const baseTitle = document.title;
  window.addEventListener("hashchange", routeFromHash);
  view.addEventListener("sheet-closed", () => {
    document.title = baseTitle;
    if (location.hash.startsWith("#perfume/")) {
      history.replaceState(null, "", location.pathname + location.search + "#products");
    }
    window.scrollTo({ top: lastScroll, behavior: "instant" });
  });
  document.addEventListener("click", async e => {
    const c = e.target.closest("[data-copy]");
    if (!c) return;
    try { await navigator.clipboard.writeText(c.dataset.copy); toast(`${ICON.check}<span>اتنسخ اللينك</span>`); }
    catch (err) { prompt("انسخ اللينك:", c.dataset.copy); }
  });
  routeFromHash();
}

/* -------------------------------------------------------------
   "اكتشف عطرك" — quiz
   ------------------------------------------------------------- */
const QUIZ = [
  { key: "who", q: "العطر ده لمين؟", options: [
    { v: "men", label: "لراجل", emoji: "🧔🏻" },
    { v: "women", label: "لست", emoji: "👩🏻" },
    { v: "any", label: "هدية / مش فارقة", emoji: "🎁" },
  ]},
  { key: "use", q: "هتستخدمه إمتى؟", options: [
    { v: "daily", label: "يومي وشغل", emoji: "☀️" },
    { v: "evening", label: "خروجات وسهرات", emoji: "🌙" },
    { v: "occasion", label: "مناسبات", emoji: "✨" },
  ]},
  { key: "scent", q: "بتحب الريحة تبقى…", options: [
    { v: "fresh", label: "فريش ومنعشة", emoji: "🌊" },
    { v: "sweet", label: "حلوة وفانيليا", emoji: "🍦" },
    { v: "woody", label: "خشبية وعود", emoji: "🌲" },
    { v: "fruity", label: "فواكه وورد", emoji: "🌸" },
  ]},
  { key: "strength", q: "عايزها تبقى…", options: [
    { v: "light", label: "هادية", emoji: "🍃" },
    { v: "medium", label: "متوسطة", emoji: "💫" },
    { v: "strong", label: "قوية وفوّاحة", emoji: "🔥" },
  ]},
];

function quizResults(a) {
  const lvl = { light: 1, medium: 2, strong: 3 };
  return PRODUCTS
    .filter(p => a.who === "any" || p.audience === a.who || p.audience === "unisex")
    .map(p => {
      let s = 0;
      if (p.scent.includes(a.scent)) s += p.scent[0] === a.scent ? 5 : 4;
      if ((p.use || []).includes(a.use)) s += 2;
      const d = Math.abs((lvl[p.strength] || 2) - (lvl[a.strength] || 2));
      s += d === 0 ? 2 : d === 1 ? 1 : 0;
      if (a.who !== "any" && p.audience === a.who) s += 1;
      if (BEST_SELLERS.includes(p.id)) s += 0.5;
      return { p, s };
    })
    .sort((x, y) => y.s - x.s)
    .slice(0, 3)
    .map(o => o.p);
}

function initQuiz() {
  const dialog = $("#quiz");
  if (!dialog) return;
  const body = $("#quiz-body");
  const bar = $("#quiz-progress");
  let step = 0, answers = {};

  function renderStep() {
    bar.style.width = `${(step / QUIZ.length) * 100}%`;
    if (step >= QUIZ.length) return renderResults();
    const s = QUIZ[step];
    body.innerHTML = `
      <p class="quiz-step">سؤال ${step + 1} من ${QUIZ.length}</p>
      <h3 class="quiz-q">${s.q}</h3>
      <div class="quiz-options">
        ${s.options.map(o => `<button type="button" class="quiz-opt${answers[s.key] === o.v ? " is-picked" : ""}" data-v="${o.v}"><span class="quiz-emoji">${o.emoji}</span><span>${o.label}</span></button>`).join("")}
      </div>
      ${step > 0 ? `<button type="button" class="quiz-back" data-back>→ السؤال اللي فات</button>` : ""}`;
    const first = $(".quiz-opt", body);
    if (first) first.focus({ preventScroll: true });
  }

  function renderResults() {
    const res = quizResults(answers);
    body.innerHTML = `
      <p class="quiz-step">النتيجة ✨</p>
      <h3 class="quiz-q">أنسب ${res.length} عطور ليك</h3>
      <div class="quiz-results">
        ${res.map((p, i) => `
          <div class="quiz-result" data-id="${p.id}">
            <span class="quiz-medal">${["🥇", "🥈", "🥉"][i]}</span>
            <img src="${p.image}" alt="${p.name}" width="600" height="750">
            <div class="quiz-result-info">
              <b>${p.name}</b>
              <span dir="ltr">${p.en}</span>
              <div class="scent-chips">${scentChips(p)}</div>
              <span class="quiz-price">يبدأ من ${fmt(priceInfo(p, SIZES[0]).final)} ${CURRENCY}</span>
            </div>
            <div class="quiz-result-actions">
              <a class="btn btn-outline btn-sm" href="#perfume/${p.id}" data-quiz-view>التفاصيل</a>
              <button type="button" class="btn btn-gold btn-sm" data-add="${p.id}" data-size="${SIZES[0]}">${ICON.bag}<span>أضف ${SIZES[0]} مل</span></button>
            </div>
          </div>`).join("")}
      </div>
      <button type="button" class="quiz-back" data-restart>↺ جرّب تاني</button>`;
  }

  body.addEventListener("click", e => {
    const opt = e.target.closest(".quiz-opt");
    if (opt) {
      answers[QUIZ[step].key] = opt.dataset.v;
      opt.classList.add("is-picked");
      setTimeout(() => { step++; renderStep(); }, 180);
    }
    if (e.target.closest("[data-back]")) { step = Math.max(0, step - 1); renderStep(); }
    if (e.target.closest("[data-restart]")) { step = 0; answers = {}; renderStep(); }
    if (e.target.closest("[data-quiz-view]")) closeDialog(dialog);
  });

  $$("[data-open-quiz]").forEach(b => b.addEventListener("click", e => {
    e.preventDefault();
    step = 0; answers = {};
    renderStep();
    openDialog(dialog);
  }));
}

/* -------------------------------------------------------------
   Scroll-reveal animations
   ------------------------------------------------------------- */
function initReveal() {
  const els = $$("[data-reveal]");
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    els.forEach(el => el.classList.add("is-in"));
    return;
  }
  document.documentElement.classList.add("js-reveal");
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  els.forEach(el => io.observe(el));
  // أمان: لو حاجة ماظهرتش لأي سبب، تظهر بعد ثانيتين
  setTimeout(() => els.forEach(el => el.classList.add("is-in")), 2500);
}

/* -------------------------------------------------------------
   Nav, header, static links
   ------------------------------------------------------------- */
function initNav() {
  const toggle = $("#nav-toggle"), nav = $("#main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    $$("a, button", nav).forEach(l => l.addEventListener("click", () => {
      nav.classList.remove("is-open"); toggle.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false");
    }));
  }
  const header = $("#site-header");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 10);
    // المنيو على الموبايل بيبدأ من تحت الهيدر بالظبط
    document.documentElement.style.setProperty("--header-h", `${Math.round(header.getBoundingClientRect().bottom)}px`);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
}

function initStaticLinks() {
  const general = waLink(GENERAL_WHATSAPP_MESSAGE);
  $$("[data-wa-general]").forEach(a => { a.href = general; });
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
  $$("[data-free-min]").forEach(el => { el.textContent = fmt(FREE_SHIPPING_MIN); });
  $$("[data-discount]").forEach(el => { el.textContent = SIZE_DISCOUNT.percent; });
}

/* -------------------------------------------------------------
   Init
   ------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderBestSellers();
  renderReviews();
  initCatalogControls();
  initCardInteractions();
  initDialogs();
  Cart.init();
  initQuiz();
  initPerfumeView();
  initNav();
  initStaticLinks();
  initReveal();
});
