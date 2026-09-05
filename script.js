/* ============================================================
   الأمين للعطور — Site script
   ============================================================ */

/* -------------------------------------------------------------
   1) SETTINGS — edit these two values for your business
   ------------------------------------------------------------- */

// رقم الواتساب الخاص بالنشاط التجاري، بالصيغة الدولية بدون "+" وبدون صفر في البداية
// مثال لمصر: كود الدولة 20 ثم الرقم بدون الصفر الأول -> 201234567890
const WHATSAPP_NUMBER = "201006747034"; // TODO: استبدل هذا برقم واتساب حقيقي

// الرسالة الافتراضية عند الضغط على "تواصل معنا" (بدون تحديد منتج)
const GENERAL_WHATSAPP_MESSAGE = "مرحبًا، أرغب في الاستفسار عن منتجاتكم من الأمين للعطور.";

/* -------------------------------------------------------------
   2) PRODUCTS — add, remove or edit perfumes here
   ------------------------------------------------------------- */
const PRODUCTS = [
  { name: "عبق الليل",     category: "women", desc: "مزيج ساحر من الياسمين والعنبر الدافئ", price: 850 },
  { name: "سحر الشرق",     category: "oud",   desc: "عود فاخر ممزوج بلمسة من المسك الأبيض", price: 1200 },
  { name: "لمسة ذهبية",    category: "women", desc: "فانيليا دافئة مع تفتّح رقيق لبتلات الورد", price: 780 },
  { name: "توهج الفجر",    category: "men",   desc: "انتعاش الحمضيات ممزوجًا بخشب الصندل", price: 900 },
  { name: "نسيم الياسمين", category: "women", desc: "ياسمين نقي مع لمسة من زهر البرتقال", price: 700 },
  { name: "أمير الليل",    category: "men",   desc: "عود شرقي أصيل مع التوابل الدافئة", price: 1100 },
  { name: "زهرة الصحراء",  category: "women", desc: "مسك أبيض ناعم مع لمسة ورد بلغاري", price: 820 },
  { name: "عنبر الملوك",   category: "oud",   desc: "عنبر فاخر ممزوج بالصندل واللبان", price: 1300 },
];

const CATEGORY_LABELS = { women: "نسائي", men: "رجالي", oud: "عود" };

/* -------------------------------------------------------------
   3) Helpers
   ------------------------------------------------------------- */
function buildWhatsAppLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function orderMessage(productName) {
  return `مرحبًا، أرغب في طلب عطر "${productName}" من الأمين للعطور.`;
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
    <article class="product-card" data-category="${p.category}" style="animation-delay:${i * 40}ms">
      ${bottleIconSVG}
      <span class="product-category">${CATEGORY_LABELS[p.category] || ""}</span>
      <h3>${p.name}</h3>
      <p class="product-desc">${p.desc}</p>
      <p class="product-price">${p.price}</p>
      <a class="btn btn-whatsapp order-btn" target="_blank" rel="noopener"
         href="${buildWhatsAppLink(orderMessage(p.name))}"
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
  initNavToggle();
  initStaticLinks();
});
