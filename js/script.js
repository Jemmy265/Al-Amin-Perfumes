/* ============================================================
   الأمين للعطور — Site script
   ============================================================ */

/* -------------------------------------------------------------
   1) SETTINGS — edit these two values for your business
   ------------------------------------------------------------- */

// رقم الواتساب الخاص بالنشاط التجاري، بالصيغة الدولية بدون "+" وبدون صفر في البداية
// مثال لمصر: كود الدولة 20 ثم الرقم بدون الصفر الأول -> 201234567890
const WHATSAPP_NUMBER = "201000000000"; // TODO: استبدل هذا برقم واتساب حقيقي

// الرسالة الافتراضية عند الضغط على "تواصل معنا" (بدون تحديد منتج)
const GENERAL_WHATSAPP_MESSAGE = "مرحبًا، أرغب في الاستفسار عن منتجاتكم من الأمين للعطور.";

/* -------------------------------------------------------------
   2) PRODUCTS — add, remove or edit perfumes here
   audience: "women" | "men" | "unisex"
   tag:      شارة اختيارية بجانب التصنيف (مثل: نيش، ديزاينر) — اتركها "" لإخفائها
   isNew:    true لإظهار شارة "جديد"
   prices:   السعر لكل حجم (35 / 55 / 110 مل)
   ------------------------------------------------------------- */
const PRODUCTS = [
  {
    id: "megamare", name: "ميجامير", en: "Megamare", house: "Orto Parisi",
    audience: "unisex", tag: "", isNew: false,
    family: "أروماتك - مائي", year: 2019, perfumer: "Alessandro Gualtieri",
    notes: {
      top: "البرغموت و الليمون",
      heart: "الطحالب البحرية، جزئ الكالون و جزئ هديون",
      base: "المسك، الأمبروكسان و خشب الأرز",
    },
    prices: { 35: 400, 55: 550, 110: 800 },
    image: "", // اختياري: مسار صورة العطر مثل "assets/products/megamare.jpg"
  },
  {
    id: "pacific-chill", name: "باسيفيك شيل", en: "Pacific Chill", house: "Louis Vuitton",
    audience: "unisex", tag: "", isNew: false,
    family: "أروماتك - فواكه", year: 2023, perfumer: "Jacques Cavallier Belletrud",
    notes: {
      top: "الأترج، البرتقال، الليمون، النعناع، الكشمش الأسود و الكزبرة",
      heart: "المشمش، الريحان، بذور الجزر و ورد ماي",
      base: "ثمار التين، التمر/البلح و الأمبريت",
    },
    prices: { 35: 350, 55: 500, 110: 700 },
    image: "", // اختياري: مسار صورة العطر مثل "assets/products/megamare.jpg"
  },
  {
    id: "erba-pura", name: "اربابورا", en: "Erba Pura", house: "Xerjoff",
    audience: "unisex", tag: "", isNew: false,
    family: "", year: 2019, perfumer: "Christian Carbonnel و Laura Santander",
    notes: {
      top: "البرتقال الصقلي، برغموت كالابريا و الليمون الصقلي",
      heart: "الفواكه",
      base: "المسك الأبيض، فانيليا مدغشقر و العنبر",
    },
    prices: { 35: 350, 55: 500, 110: 700 },
    image: "", // اختياري: مسار صورة العطر مثل "assets/products/megamare.jpg"
  },
  {
    id: "althair", name: "الثائر", en: "Althaïr", house: "Parfums de Marly",
    audience: "men", tag: "", isNew: false,
    family: "شرقي - فانيليا", year: 2023, perfumer: "Hamid Merati-Kashani و Ilias Ermenidis",
    notes: {
      top: "القرفة، زهر البرتقال، الهيل و البرغموت",
      heart: "فانيليا بوربون و الإليمي",
      base: "حلوي اللوز، المسك، الأمبروكسان، حبوب التونكا، أخشاب الغاياك و اللوز المحلى",
    },
    prices: { 35: 350, 55: 500, 110: 700 },
    image: "", // اختياري: مسار صورة العطر مثل "assets/products/megamare.jpg"
  },
  {
    id: "nautica-voyage", name: "نوتيكا ڤوياچ", en: "Nautica Voyage", house: "Nautica",
    audience: "men", tag: "", isNew: false,
    family: "عشبي - مائي", year: 2006, perfumer: "Maurice Roucel",
    notes: {
      top: "الأوراق الخضراء و التفاح",
      heart: "اللوتس و الميموزا",
      base: "المسك، خشب الأرز، طحلب البلوط (طحلب السنديان) و العنبر",
    },
    prices: { 35: 240, 55: 375, 110: 550 },
    image: "", // اختياري: مسار صورة العطر مثل "assets/products/megamare.jpg"
  },
  {
    id: "madawi", name: "مضاوي", en: "Madawi", house: "Arabian Oud",
    audience: "unisex", tag: "", isNew: false,
    family: "", year: 2017, perfumer: "Claire Liégent و Dominique Ropion",
    notes: {
      top: "الخوخ و زهر التفاح",
      heart: "زهر الأناناس",
      base: "المسك، الورد البري و الباتشولي",
    },
    prices: { 35: 290, 55: 450, 110: 650 },
    image: "", // اختياري: مسار صورة العطر مثل "assets/products/megamare.jpg"
  },
  {
    id: "imperial-valley", name: "امبريال ڤالي", en: "Imperial Valley", house: "Gissah",
    audience: "unisex", tag: "", isNew: false,
    family: "شرقي - خشبي", year: 2021, perfumer: "",
    notes: {
      top: "البرغموت الصقلي، الفلفل الوردي و الدافانا",
      heart: "العود، العنبر الأبيض و إكليل الجبل",
      base: "الجلود، المسك و نجيل الهند من هايتي",
    },
    prices: { 35: 290, 55: 450, 110: 650 },
    image: "", // اختياري: مسار صورة العطر مثل "assets/products/megamare.jpg"
  },
  {
    id: "bleu-de-chanel", name: "بلو دي شانيل", en: "Bleu de Chanel", house: "Chanel",
    audience: "men", tag: "ديزاينر", isNew: false,
    family: "خشبي - أروماتك", year: 2010, perfumer: "Jacques Polge",
    notes: {
      top: "الجريب فروت، الليمون، النعناع و الفلفل الوردي",
      heart: "الزنجبيل، جوزه الطيب، الياسمين و أيزو إي سوبر",
      base: "البخور، خشب الأرز، نجيل الهند، خشب الصندل، الباتشولي، اللابدانوم و المسك الأبيض",
    },
    prices: { 35: 280, 55: 420, 110: 600 },
    image: "", // اختياري: مسار صورة العطر مثل "assets/products/megamare.jpg"
  },
  {
    id: "allure-homme-sport", name: "ألور أوم سبورت", en: "Allure Homme Sport", house: "Chanel",
    audience: "men", tag: "ديزاينر", isNew: false,
    family: "خشبي - حار", year: 2004, perfumer: "Jacques Polge",
    notes: {
      top: "البرتقال، نسيم البحر، الألدهيدات و الماندرين الأحمر",
      heart: "الفلفل، النيرولي و خشب الأرز",
      base: "الفانيليا، حبوب التونكا، المسك الأبيض، العنبر، نجيل الهند و راتنج الإليمي",
    },
    prices: { 35: 280, 55: 420, 110: 600 },
    image: "", // اختياري: مسار صورة العطر مثل "assets/products/megamare.jpg"
  },
  {
    id: "black-xs", name: "بلاك ليكسيز", en: "Black XS L’Exces for Him", house: "Rabanne",
    audience: "men", tag: "", isNew: false,
    family: "خشبي - أروماتك", year: 2012, perfumer: "Fabrice Pellegrin",
    notes: {
      top: "الليمون و الخزامي",
      heart: "السيبرول (الناجراموثا) و نسيم البحر",
      base: "العنبر و الباتشولي",
    },
    prices: { 35: 250, 55: 390, 110: 550 },
    image: "", // اختياري: مسار صورة العطر مثل "assets/products/megamare.jpg"
  },
  {
    id: "kayali-marshmallow", name: "كيالي مارشميلو", en: "Yum Boujee Marshmallow | 81", house: "Kayali Fragrances",
    audience: "women", tag: "نيش", isNew: true,
    family: "زهري - فواكه - جورماند", year: 2024, perfumer: "Gabriela Chelariu",
    notes: {
      top: "الفريزيا، الليمون الإيطالي، زهر النكتارين و التفاح",
      heart: "المارشميللو، الفراوله، جوز الهند و زهر البرتقال",
      base: "الكريمة المخفوقة، السكر، الفانيليا، المسك، توت العليق و الأمبروكسان",
    },
    prices: { 35: 250, 55: 390, 110: 550 },
    image: "", // اختياري: مسار صورة العطر مثل "assets/products/megamare.jpg"
  },
  {
    id: "yara-candy", name: "يارا كاندي", en: "Yara Candy", house: "Lattafa Perfumes",
    audience: "women", tag: "", isNew: true,
    family: "زهري - فواكه - جورماند", year: 2024, perfumer: "",
    notes: {
      top: "الكشمش الأسود و الماندرين الأخضر",
      heart: "حلوى الفراولة الفوارة و الغاردينيا",
      base: "الفانيليا، المسك، العنبر و خشب الصندل",
    },
    prices: { 35: 250, 55: 390, 110: 550 },
    image: "", // اختياري: مسار صورة العطر مثل "assets/products/megamare.jpg"
  },
  {
    id: "burberry-her", name: "بيربري هير", en: "Burberry Her", house: "Burberry",
    audience: "women", tag: "", isNew: false,
    family: "زهري - فواكه - جورماند", year: 2018, perfumer: "Francis Kurkdjian",
    notes: {
      top: "الفراوله، توت العليق، التوت الأسود، الكرز الحامض، الكشمش الأسود، الماندرين (اليوسفي) و الليمون",
      heart: "البنفسج و الياسمين",
      base: "المسك، الفانيليا، أخشاب الكشمير، الأخشاب، العنبر، طحلب البلوط (طحلب السنديان) و الباتشولي",
    },
    prices: { 35: 250, 55: 390, 110: 550 },
    image: "", // اختياري: مسار صورة العطر مثل "assets/products/megamare.jpg"
  },
  {
    id: "yara", name: "يارا", en: "Yara", house: "Lattafa Perfumes",
    audience: "women", tag: "", isNew: false,
    family: "شرقي - فانيليا", year: 2020, perfumer: "",
    notes: {
      top: "الأوركيد، الهيلوتروب و تانجرين (اليوسفي)",
      heart: "اتفاق غورماند و الفواكه الإستوائيه",
      base: "الفانيليا، المسك و خشب الصندل",
    },
    prices: { 35: 250, 55: 390, 110: 550 },
    image: "", // اختياري: مسار صورة العطر مثل "assets/products/megamare.jpg"
  },
];

const AUDIENCE_LABELS = { women: "نسائي", men: "رجالي", unisex: "للجنسين" };
const SIZES = [35, 55, 110];   // الأحجام المتاحة بالملليلتر
const CURRENCY = "ج.م";

/* -------------------------------------------------------------
   3) Helpers
   ------------------------------------------------------------- */
function buildWhatsAppLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function orderMessage(p, size) {
  return [
    "مرحبًا، أرغب في طلب العطر التالي من الأمين للعطور:",
    `العطر: ${p.name} (${p.en}، ${p.house})`,
    `الحجم: ${size} مل`,
    `السعر: ${p.prices[size]} ${CURRENCY}`,
  ].join("\n");
}

function updateOrderLink(card) {
  const p = PRODUCTS[Number(card.dataset.index)];
  const checked = card.querySelector(".size-option input:checked");
  const size = Number(checked ? checked.value : SIZES[0]);
  card.querySelector(".order-btn").href = buildWhatsAppLink(orderMessage(p, size));
}

const bottleIconSVG = `
  <svg viewBox="0 0 220 320" class="bottle-illustration" aria-hidden="true">
    <rect x="70" y="40" width="20" height="18" rx="3"></rect>
    <rect x="78" y="18" width="4" height="24"></rect>
    <path d="M85 58c30 6 45 30 45 62v150a30 30 0 0 1-30 30H90a30 30 0 0 1-30-30V120c0-32 15-56 45-62Z" fill="none" stroke="currentColor" stroke-width="2"></path>
    <line x1="60" y1="150" x2="140" y2="150" stroke="currentColor" stroke-width="1"></line>
    <line x1="60" y1="240" x2="140" y2="240" stroke="currentColor" stroke-width="1"></line>
  </svg>`;

/* -------------------------------------------------------------
   4) Render products
   ------------------------------------------------------------- */
function renderProducts() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  grid.innerHTML = PRODUCTS.map((p, i) => `
    <article class="product-card" data-category="${p.audience}" data-index="${i}">
      <div class="product-media">
        ${p.image ? `<img class="product-img" src="${p.image}" alt="${p.name}" loading="lazy">` : bottleIconSVG}
      </div>
      <div class="product-chips">
        <span class="product-category">${AUDIENCE_LABELS[p.audience] || ""}</span>
        ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ""}
        ${p.isNew ? `<span class="product-tag product-tag--new">جديد</span>` : ""}
      </div>
      <h3>${p.name}</h3>
      <p class="product-en" dir="ltr">${p.en}</p>
      <p class="product-house" dir="ltr">${p.house}</p>
      ${p.family ? `<p class="product-family">${p.family}</p>` : ""}
      <dl class="product-notes">
        <div><dt>الافتتاحية</dt><dd>${p.notes.top}</dd></div>
        <div><dt>القلب</dt><dd>${p.notes.heart}</dd></div>
        <div><dt>القاعدة</dt><dd>${p.notes.base}</dd></div>
      </dl>
      <p class="product-meta">صدر عام ${p.year}${p.perfumer ? ` بتوقيع <bdi>${p.perfumer}</bdi>` : ""}</p>
      <div class="sizes" role="radiogroup" aria-label="اختر الحجم">
        ${SIZES.map((s, k) => `
        <label class="size-option">
          <input type="radio" name="size-${i}" value="${s}"${k === 0 ? " checked" : ""}>
          <span class="size-pill">
            <span class="size-ml">${s} مل</span>
            <span class="size-price">${p.prices[s]} ${CURRENCY}</span>
          </span>
        </label>`).join("")}
      </div>
      <a class="btn btn-whatsapp order-btn" target="_blank" rel="noopener"
         href="${buildWhatsAppLink(orderMessage(p, SIZES[0]))}"
         aria-label="اطلب ${p.name} عبر واتساب">
        <svg viewBox="0 0 24 24" class="icon" aria-hidden="true"><path d="M17.6 6.32A8.86 8.86 0 0 0 11.94 4c-4.9 0-8.9 4-8.9 8.9 0 1.57.41 3.1 1.19 4.44L3 21l3.77-1.2a8.9 8.9 0 0 0 4.17 1.06h.01c4.9 0 8.9-4 8.9-8.9a8.86 8.86 0 0 0-2.25-5.64Zm-5.66 13.7h-.01a7.4 7.4 0 0 1-3.77-1.03l-.27-.16-2.8.9.9-2.73-.18-.28a7.38 7.38 0 0 1-1.14-3.92c0-4.08 3.32-7.4 7.4-7.4a7.35 7.35 0 0 1 5.23 2.17 7.34 7.34 0 0 1 2.17 5.23c0 4.08-3.33 7.4-7.4 7.4Zm4.06-5.54c-.22-.11-1.31-.65-1.51-.72-.2-.07-.35-.11-.5.11-.15.22-.57.72-.7.87-.13.15-.26.16-.48.06-.22-.11-.94-.35-1.79-1.1-.66-.59-1.11-1.32-1.24-1.54-.13-.22-.01-.34.1-.45.1-.1.22-.26.33-.39.11-.13.15-.22.22-.37.07-.15.04-.28-.02-.39-.06-.11-.5-1.2-.68-1.65-.18-.43-.36-.37-.5-.38h-.43c-.15 0-.39.06-.59.28-.2.22-.78.76-.78 1.85 0 1.09.8 2.14.91 2.29.11.15 1.57 2.4 3.81 3.36.53.23.95.37 1.27.47.53.17 1.02.15 1.4.09.43-.06 1.31-.53 1.49-1.05.19-.51.19-.95.13-1.04-.06-.09-.2-.15-.42-.26Z"/></svg>
        <span>اطلب الآن</span>
      </a>
    </article>
  `).join("");
}

/* -------------------------------------------------------------
   5) Category filters
   ------------------------------------------------------------- */
function initFilters() {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = () => document.querySelectorAll(".product-card");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => { b.classList.remove("is-active"); b.setAttribute("aria-selected", "false"); });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");

      const filter = btn.dataset.filter;
      cards().forEach(card => {
        const show = filter === "all" || card.dataset.category === filter;
        card.hidden = !show;
      });
    });
  });
}

/* -------------------------------------------------------------
   5b) Size selection — refresh the WhatsApp link when the size changes
   ------------------------------------------------------------- */
function initSizeSelectors() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;
  grid.addEventListener("change", e => {
    if (e.target.matches(".size-option input")) {
      updateOrderLink(e.target.closest(".product-card"));
    }
  });
}

/* -------------------------------------------------------------
   6) Mobile nav toggle
   ------------------------------------------------------------- */
function initNavToggle() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* -------------------------------------------------------------
   7) Wire up static WhatsApp buttons + footer year
   ------------------------------------------------------------- */
function initStaticLinks() {
  const generalLink = buildWhatsAppLink(GENERAL_WHATSAPP_MESSAGE);
  const headerBtn = document.getElementById("header-whatsapp");
  const contactBtn = document.getElementById("contact-whatsapp");
  if (headerBtn) headerBtn.href = generalLink;
  if (contactBtn) contactBtn.href = generalLink;

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* -------------------------------------------------------------
   Init
   ------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  initFilters();
  initSizeSelectors();
  initNavToggle();
  initStaticLinks();
});
