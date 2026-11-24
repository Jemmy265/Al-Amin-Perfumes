/* Site settings + editable copy — migrated from the original index.html and
   js/data.js. Every string here is original website copy, except
   hero.slogan ("عندما تدمن العطور"), which was supplied by the client for
   the redesign. Placeholders: {freeMin} and {discount} are filled from
   settings so prices/offers stay in one place. */
import type { Labels, SiteContent, StoreSettings } from "../../types/content";
import { SEED_REVIEWS } from "./reviews";
import { DEFAULT_SECTIONS } from "../../shared/content";

export const SEED_SETTINGS: StoreSettings = {
  whatsappNumber: "201006747034",
  generalWhatsappMessage: "مرحبًا، أرغب في الاستفسار عن منتجاتكم من الأمين للعطور.",
  siteUrl: "https://jemmy265.github.io/Al-Amin-Perfumes/",
  currency: "ج.م",
  sizes: [35, 55, 110],
  shippingZones: [
    { id: "cairo", label: "القاهرة والجيزة", fee: 95 },
    { id: "delta", label: "باقي المحافظات", fee: 110 },
    { id: "upper", label: "الصعيد", fee: 120 },
  ],
  freeShippingMin: 1500,
  sizeDiscount: { size: 110, percent: 20 },
  bestSellers: ["madawi", "erba-pura", "burberry-her", "bianco-latte"],
  phone: "+201006747034",
  phoneDisplay: "+20 100 674 7034",
  email: "abdelazizamin99@gmail.com",
  social: {
    instagram: "https://www.instagram.com/alaminperfume",
    facebook: "https://www.facebook.com/share/1HqVRArYdn/",
    tiktok: "https://www.tiktok.com/@alaminperfumes",
  },
};

export const LABELS: Labels = {
  audience: { women: "نسائي", men: "رجالي", unisex: "للجنسين" },
  scents: {
    fresh: { label: "فريش ومائي", emoji: "🌊" },
    sweet: { label: "حلو وفانيليا", emoji: "🍦" },
    woody: { label: "خشبي وعود", emoji: "🌲" },
    fruity: { label: "فواكه وورد", emoji: "🌸" },
  },
  occasions: { daily: "يومي وشغل", evening: "خروجات وسهرات", occasion: "مناسبات" },
  intensity: { light: "هادي", medium: "متوسط", strong: "قوي وفوّاح" },
};

export const SEED_CONTENT: SiteContent = {
  sections: DEFAULT_SECTIONS,
  announcements: [
    "توصيل **مجاني** لأي أوردر فوق **{freeMin} ج.م**",
    "خصم **{discount}%** على أي إزازة **110 مل**",
    "توصيل لجميع محافظات مصر",
  ],
  hero: {
    slogan: "عندما تدمن العطور",
    tagline: "حيث يلتقي العبق بالأصالة",
    titleLine1: "عطور فاخرة تُخلق لتدوم",
    titleLine2: "وتروي حكايتك أينما ذهبت",
    description:
      "عطور مستوحاة من أشهر العطور العالمية وعطور النيش والعطور العربية، بثلاثة أحجام تناسب ذوقك وميزانيتك.",
    primaryCta: "تصفّح التشكيلة",
    secondaryCta: "اكتشف عطرك",
    image: "assets/products/imperial-valley.jpg",
    stats: [
      { value: "+20", label: "عطر مختار" },
      { value: "3", label: "أحجام" },
      { value: "27", label: "محافظة" },
    ],
  },
  benefitsTitle: "لماذا الأمين للعطور",
  benefits: [
    { icon: "star", title: "تشكيلة مختارة بعناية", text: "عالمية ونيش وعربية في مكان واحد." },
    { icon: "drop", title: "ثلاثة أحجام", text: "35 و55 و110 مل لكل ميزانية." },
    { icon: "truck", title: "توصيل لكل مصر", text: "من يومين لـ 5 أيام حسب المحافظة." },
    { icon: "chat", title: "طلب سهل عبر واتساب", text: "اختار، ضيف للسلة، وابعت." },
  ],
  bestSellers: { kicker: "الأكثر طلبًا", title: "العطور اللي الكل بيسأل عليها" },
  quizCta: {
    kicker: "محتار تختار إيه؟",
    title: "اكتشف عطرك في 4 أسئلة",
    text: "جاوب على 4 أسئلة سريعة، وهنرشحلك أنسب 3 عطور ليك.",
    button: "ابدأ الاختبار",
  },
  catalog: {
    kicker: "تشكيلتنا",
    title: "عطور مختارة لكل الأذواق",
    text: "اختار الحجم، وضيف للسلة، وابعت طلبك كله مرة واحدة على واتساب.",
    searchPlaceholder: "ابحث عن عطر، ماركة أو مكوّن…",
    noResults: "مش لاقيين عطر مطابق لبحثك.",
  },
  reviews: {
    kicker: "آراء عملائنا",
    title: "كلامهم أحسن من كلامنا",
    text: "رسايل وتوصيات حقيقية وصلتنا من عملائنا على فيسبوك وواتساب.",
  },
  reviewItems: SEED_REVIEWS,
  about: {
    kicker: "من نحن",
    title: "شغف بالعطر، وذوق في الاختيار",
    text:
      "في الأمين للعطور، نؤمن أن العطر توقيع شخصي لا يُنسى. نجمع لكم تشكيلة مختارة من العطور المستوحاة من أشهر العطور العالمية وعطور النيش والعطور العربية، ونوفّرها بثلاثة أحجام لتجدوا ما يناسب ذوقكم وميزانيتكم، مع طلب سهل ومباشر عبر واتساب وتوصيل لجميع محافظات مصر.",
    cta: "اكتشف التشكيلة",
    images: [
      "assets/products/imperial-valley.jpg",
      "assets/products/kayali-marshmallow.jpg",
      "assets/products/megamare.jpg",
    ],
  },
  faq: { kicker: "أسئلة شائعة", title: "كل اللي محتاج تعرفه" },
  faqItems: [
    { q: "الطلب بيوصل في قد إيه؟", a: "التوصيل بياخد من **يومين لـ 5 أيام** حسب المحافظة، ونوصّل لجميع محافظات مصر." },
    {
      q: "الشحن بكام؟",
      a: "القاهرة والجيزة **95 ج.م** · باقي المحافظات **110 ج.م** · الصعيد **120 ج.م**.\nوالتوصيل **مجاني** لأي أوردر فوق **1,500 ج.م**.",
    },
    { q: "إيه طرق الدفع المتاحة؟", a: "متاح الدفع بكل الطرق. ابعتلنا على واتساب ونتفق على الطريقة اللي تناسبك." },
    {
      q: "العطور أصلية ولا مستوحاة؟",
      a: "العطور **مستوحاة** من أشهر العطور العالمية وعطور النيش والعطور العربية. اسم الماركة اللي مكتوب على كل عطر هو العطر الأصلي اللي اتعمل على طريقته.",
    },
    {
      q: "إيه الأحجام المتاحة؟ وشكل الإزازة إيه؟",
      a: "كل عطر متاح بـ 3 أحجام: **35 و55 و110 مل**، والإزازة بنفس الشكل اللي في صور الموقع.",
    },
    {
      q: "في عروض أو خصومات؟",
      a: "أيوه! خصم **20%** على أي إزازة **110 مل** (الخصم محسوب تلقائيًا في الأسعار)، وتوصيل **مجاني** لأي أوردر فوق **1,500 ج.م**.",
    },
    {
      q: "أطلب إزاي؟",
      a: "اختار الحجم ودوس «أضف للسلة» لكل عطر عايزه، وبعدين افتح السلة 🛍️ واختار محافظتك ودوس «ابعت الطلب على واتساب». هيوصلنا الطلب كامل بالأسعار، ونرد عليك نأكد معاك.",
    },
    {
      q: "محتار ومش عارف أختار؟",
      a: "جرّب {{quiz|«اكتشف عطرك»}}: 4 أسئلة بس وهنرشحلك أنسب 3 عطور. أو كلّمنا على واتساب ونساعدك تختار.",
    },
  ],
  contact: {
    kicker: "تواصل معنا",
    title: "عندك سؤال؟ راسلنا دلوقتي",
    text: "فريقنا جاهز يرد على استفساراتك ويساعدك تختار العطر الأنسب ليك.",
    whatsappCta: "راسلنا على واتساب",
    deliveryNote: "توصيل لجميع محافظات مصر",
  },
  footer: {
    brandName: "الأمين للعطور",
    tagline: "عطور فاخرة، تُختار بعناية لتدوم.",
    copyright: "الأمين للعطور. جميع الحقوق محفوظة. · العطور مستوحاة، وأسماء الماركات ملك أصحابها.",
  },
};
