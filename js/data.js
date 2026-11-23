/* ============================================================
   الأمين للعطور — بيانات الموقع (عدّل هنا)
   ============================================================ */

/* ---------- 1) الإعدادات ---------- */

// رقم الواتساب بالصيغة الدولية بدون "+" وبدون الصفر الأول (01006747034 -> 201006747034)
const WHATSAPP_NUMBER = "201006747034";

// رسالة أزرار واتساب العامة
const GENERAL_WHATSAPP_MESSAGE = "مرحبًا، أرغب في الاستفسار عن منتجاتكم من الأمين للعطور.";

// رابط الموقع (يُستخدم في روابط المشاركة)
const SITE_URL = "https://jemmy265.github.io/Al-Amin-Perfumes/";

// أسعار الشحن حسب المنطقة
const SHIPPING_ZONES = [
  { id: "cairo",  label: "القاهرة والجيزة", fee: 95 },
  { id: "delta",  label: "باقي المحافظات",  fee: 110 },
  { id: "upper",  label: "الصعيد",          fee: 120 },
];

// توصيل مجاني لأي أوردر يساوي أو أكبر من المبلغ ده (بعد الخصم)
const FREE_SHIPPING_MIN = 1500;

// خصم على حجم معيّن: 20% على أي إزازة 110 مل — خليها 0 لإلغاء الخصم
const SIZE_DISCOUNT = { size: 110, percent: 20 };

// الأكثر طلبًا — بالترتيب
const BEST_SELLERS = ["madawi", "erba-pura", "burberry-her", "bianco-latte"];

const SIZES = [35, 55, 110];
const CURRENCY = "ج.م";
const AUDIENCE_LABELS = { women: "نسائي", men: "رجالي", unisex: "للجنسين" };

/* أنواع الريحة — تُستخدم في الفلتر وفي "اكتشف عطرك" */
const SCENTS = {
  fresh:  { label: "فريش ومائي",   emoji: "🌊" },
  sweet:  { label: "حلو وفانيليا", emoji: "🍦" },
  woody:  { label: "خشبي وعود",    emoji: "🌲" },
  fruity: { label: "فواكه وورد",   emoji: "🌸" },
};

/* ---------- 2) المنتجات ----------
   audience:  women | men | unisex
   scent:     واحد أو أكثر من: fresh, sweet, woody, fruity
   use:       daily (يومي وشغل) | evening (خروجات وسهرات) | occasion (مناسبات)
   strength:  light (هادي) | medium (متوسط) | strong (قوي)
   notes:     top / heart / base — أو all لو العطر مكتوب بدون تقسيم
   inspiredBy: اسم الماركة الأصلية (العطور مستوحاة)
------------------------------------------------------------- */
const PRODUCTS = [
  /* ---------- الإضافات الجديدة ---------- */
  {
    id: "vanilla-powder", name: "فانيلا باودر", en: "Vanilla Powder", house: "Matière Première",
    audience: "unisex", tag: "نيش", isNew: true,
    scent: ["sweet"], use: ["daily", "evening"], strength: "medium",
    family: "", year: 2023, perfumer: "Aurélien Guichard",
    notes: {
      top: "بودرة جوز الهند و الهيلوتروب",
      heart: "فانيليا مدغشقر",
      base: "الفانيليا، المسك الأبيض، المسك، بالو سانتو، جوز الهند و لاكتونات",
    },
    prices: { 35: 300, 55: 450, 110: 600 },
    image: "assets/products/vanilla-powder.jpg",
  },
  {
    id: "roses-vanille", name: "روزز ڤانيل", en: "Roses Vanille", house: "Mancera",
    audience: "women", tag: "", isNew: true,
    scent: ["sweet", "fruity"], use: ["daily", "evening"], strength: "medium",
    family: "شرقي - فانيليا", year: 2011, perfumer: "Pierre Montale",
    notes: {
      top: "الليمون الإيطالي",
      heart: "الورد التركي",
      base: "الفانيليا، المسك الأبيض و خشب الأرز",
    },
    prices: { 35: 300, 55: 450, 110: 600 },
    image: "assets/products/roses-vanille.jpg",
  },
  {
    id: "shuhrah-pour-homme", name: "شهرة بور أوم", en: "Shuhrah Pour Homme", house: "Rasasi",
    audience: "men", tag: "", isNew: true,
    scent: ["woody"], use: ["evening", "occasion"], strength: "strong",
    family: "خشبي - أروماتك", year: null, perfumer: "",
    notes: {
      top: "أوراق الطماطم، الورد و الفريزيا",
      heart: "الورد، خشب الصندل، خشب الأرز و الياسمين",
      base: "الجلود، العود، المسك، طحلب البلوط (طحلب السنديان) و العنبر",
    },
    prices: { 35: 300, 55: 450, 110: 600 },
    image: "assets/products/shuhrah-pour-homme.jpg",
  },
  {
    id: "lapidus-pour-homme", name: "لابيدوس بور أوم", en: "Lapidus Pour Homme", house: "Ted Lapidus",
    audience: "men", tag: "", isNew: true,
    scent: ["woody", "sweet"], use: ["evening", "occasion"], strength: "strong",
    family: "شرقي", year: 1987, perfumer: "Martin Gras",
    notes: {
      top: "الأناناس، الخزامي، الشيح، توت العرعر، الريحان، الليمون و البرغموت",
      heart: "العسل، البخور، أشجار الصنوبر، الورد، خشب الورد البرازيلي، الياسمين، الكاراوية، جذور السوسن، زنابق الوادي و البيتيتغرين",
      base: "التبغ، الباتشولي، طحلب البلوط (طحلب السنديان)، المسك، العنبر، خشب الصندل، حبوب التونكا و خشب الأرز",
    },
    prices: { 35: 300, 55: 450, 110: 600 },
    image: "assets/products/lapidus-pour-homme.jpg",
  },
  {
    id: "ultra-male", name: "ألترا ميل", en: "Ultra Male", house: "Jean Paul Gaultier",
    audience: "men", tag: "ديزاينر", isNew: true,
    scent: ["sweet"], use: ["evening", "occasion"], strength: "strong",
    family: "شرقي - فوچير", year: 2015, perfumer: "Francis Kurkdjian",
    notes: {
      top: "الكمثري، الخزامي، النعناع، البرغموت و الليمون",
      heart: "القرفة، المريمية و الكاراوية",
      base: "قشور الفانيليا السوداء، العنبر، الباتشولي و خشب الأرز",
    },
    prices: { 35: 300, 55: 450, 110: 600 },
    image: "assets/products/ultra-male.jpg",
  },
  {
    id: "oud-bouquet", name: "عود بوكيه", en: "Oud Bouquet", house: "Lancôme",
    audience: "unisex", tag: "", isNew: true,
    scent: ["woody", "sweet"], use: ["evening", "occasion"], strength: "strong",
    family: "شرقي - خشبي", year: 2016, perfumer: "Fabrice Pellegrin",
    notes: {
      all: "حلوي اللوز، العود، الفانيليا، الورد، أخشاب الغاياك و بلسم كوباهو",
    },
    prices: { 35: 300, 55: 450, 110: 600 },
    image: "assets/products/oud-bouquet.jpg",
  },
  {
    id: "bianco-latte", name: "بيانكو لاتيه", en: "Bianco Latte", house: "Giardini Di Toscana",
    audience: "unisex", tag: "نيش", isNew: true,
    scent: ["sweet"], use: ["daily", "evening"], strength: "medium",
    family: "شرقي - فانيليا", year: 2014, perfumer: "Silvia Martinelli",
    notes: {
      top: "الكاراميل",
      heart: "الكومارين و العسل",
      base: "الفانيليا و المسك الأبيض",
    },
    prices: { 35: 300, 55: 450, 110: 600 },
    image: "assets/products/bianco-latte.jpg",
  },
  {
    id: "black-orchid", name: "بلاك أوركيد", en: "Black Orchid", house: "Tom Ford",
    audience: "unisex", tag: "ديزاينر", isNew: true,
    scent: ["sweet", "fruity", "woody"], use: ["evening", "occasion"], strength: "strong",
    family: "شرقي - زهري", year: 2006, perfumer: "David Apel و Pierre Negrin",
    notes: {
      top: "الكمأة، الغاردينيا، الكشمش الأسود، الإيلنغ، الياسمين، البرغموت، الماندرين (اليوسفي) و الليمون",
      heart: "الأوركيد، التوابل، الغاردينيا، نوتات الفواكه، الإيلنغ، الياسمين و اللوتس",
      base: "الشيكولاتة المكسيكية، الباتشولي، الفانيليا، البخور، العنبر، خشب الصندل، نجيل الهند و المسك الأبيض",
    },
    prices: { 35: 300, 55: 450, 110: 600 },
    image: "assets/products/black-orchid.jpg",
  },
  {
    id: "silver-mountain-water", name: "سيلفر ماونتن ووتر", en: "Silver Mountain Water", house: "Creed",
    audience: "unisex", tag: "نيش", isNew: true,
    scent: ["fresh"], use: ["daily"], strength: "light",
    family: "أروماتك", year: 1995, perfumer: "Olivier Creed و Pierre Bourdon",
    notes: {
      top: "البرغموت و الماندرين (اليوسفي)",
      heart: "الشاي الأخضر و الكشمش الأسود",
      base: "المسك، البيتيتغرين، خشب الصندل و الغلابانوم",
    },
    prices: { 35: 250, 55: 375, 110: 500 },
    image: "assets/products/silver-mountain-water.jpg",
  },

  /* ---------- التشكيلة الحالية ---------- */
  {
    id: "megamare", name: "ميجامير", en: "Megamare", house: "Orto Parisi",
    audience: "unisex", tag: "", isNew: false,
    scent: ["fresh"], use: ["daily", "evening"], strength: "strong",
    family: "أروماتك - مائي", year: 2019, perfumer: "Alessandro Gualtieri",
    notes: {
      top: "البرغموت و الليمون",
      heart: "الطحالب البحرية، جزئ الكالون و جزئ هديون",
      base: "المسك، الأمبروكسان و خشب الأرز",
    },
    prices: { 35: 400, 55: 550, 110: 800 },
    image: "assets/products/megamare.jpg",
  },
  {
    id: "pacific-chill", name: "باسيفيك شيل", en: "Pacific Chill", house: "Louis Vuitton",
    audience: "unisex", tag: "", isNew: false,
    scent: ["fresh", "fruity"], use: ["daily"], strength: "light",
    family: "أروماتك - فواكه", year: 2023, perfumer: "Jacques Cavallier Belletrud",
    notes: {
      top: "الأترج، البرتقال، الليمون، النعناع، الكشمش الأسود و الكزبرة",
      heart: "المشمش، الريحان، بذور الجزر و ورد ماي",
      base: "ثمار التين، التمر/البلح و الأمبريت",
    },
    prices: { 35: 350, 55: 500, 110: 700 },
    image: "assets/products/pacific-chill.jpg",
  },
  {
    id: "erba-pura", name: "اربابورا", en: "Erba Pura", house: "Xerjoff",
    audience: "unisex", tag: "", isNew: false,
    scent: ["fruity", "sweet"], use: ["daily", "evening"], strength: "strong",
    family: "", year: 2019, perfumer: "Christian Carbonnel و Laura Santander",
    notes: {
      top: "البرتقال الصقلي، برغموت كالابريا و الليمون الصقلي",
      heart: "الفواكه",
      base: "المسك الأبيض، فانيليا مدغشقر و العنبر",
    },
    prices: { 35: 350, 55: 500, 110: 700 },
    image: "assets/products/erba-pura.jpg",
  },
  {
    id: "althair", name: "الثائر", en: "Althaïr", house: "Parfums de Marly",
    audience: "men", tag: "", isNew: false,
    scent: ["sweet"], use: ["evening", "occasion"], strength: "medium",
    family: "شرقي - فانيليا", year: 2023, perfumer: "Hamid Merati-Kashani و Ilias Ermenidis",
    notes: {
      top: "القرفة، زهر البرتقال، الهيل و البرغموت",
      heart: "فانيليا بوربون و الإليمي",
      base: "حلوي اللوز، المسك، الأمبروكسان، حبوب التونكا، أخشاب الغاياك و اللوز المحلى",
    },
    prices: { 35: 350, 55: 500, 110: 700 },
    image: "assets/products/althair.jpg",
  },
  {
    id: "nautica-voyage", name: "نوتيكا ڤوياچ", en: "Nautica Voyage", house: "Nautica",
    audience: "men", tag: "", isNew: false,
    scent: ["fresh"], use: ["daily"], strength: "light",
    family: "عشبي - مائي", year: 2006, perfumer: "Maurice Roucel",
    notes: {
      top: "الأوراق الخضراء و التفاح",
      heart: "اللوتس و الميموزا",
      base: "المسك، خشب الأرز، طحلب البلوط (طحلب السنديان) و العنبر",
    },
    prices: { 35: 240, 55: 375, 110: 550 },
    image: "assets/products/nautica-voyage.jpg",
  },
  {
    id: "madawi", name: "مضاوي", en: "Madawi", house: "Arabian Oud",
    audience: "unisex", tag: "", isNew: false,
    scent: ["fruity"], use: ["daily", "evening"], strength: "medium",
    family: "", year: 2017, perfumer: "Claire Liégent و Dominique Ropion",
    notes: {
      top: "الخوخ و زهر التفاح",
      heart: "زهر الأناناس",
      base: "المسك، الورد البري و الباتشولي",
    },
    prices: { 35: 290, 55: 450, 110: 650 },
    image: "assets/products/madawi.jpg",
  },
  {
    id: "imperial-valley", name: "امبريال ڤالي", en: "Imperial Valley", house: "Gissah",
    audience: "unisex", tag: "", isNew: false,
    scent: ["woody"], use: ["evening", "occasion"], strength: "strong",
    family: "شرقي - خشبي", year: 2021, perfumer: "",
    notes: {
      top: "البرغموت الصقلي، الفلفل الوردي و الدافانا",
      heart: "العود، العنبر الأبيض و إكليل الجبل",
      base: "الجلود، المسك و نجيل الهند من هايتي",
    },
    prices: { 35: 290, 55: 450, 110: 650 },
    image: "assets/products/imperial-valley.jpg",
  },
  {
    id: "bleu-de-chanel", name: "بلو دي شانيل", en: "Bleu de Chanel", house: "Chanel",
    audience: "men", tag: "ديزاينر", isNew: false,
    scent: ["fresh", "woody"], use: ["daily", "evening"], strength: "medium",
    family: "خشبي - أروماتك", year: 2010, perfumer: "Jacques Polge",
    notes: {
      top: "الجريب فروت، الليمون، النعناع و الفلفل الوردي",
      heart: "الزنجبيل، جوزه الطيب، الياسمين و أيزو إي سوبر",
      base: "البخور، خشب الأرز، نجيل الهند، خشب الصندل، الباتشولي، اللابدانوم و المسك الأبيض",
    },
    prices: { 35: 280, 55: 420, 110: 600 },
    image: "assets/products/bleu-de-chanel.jpg",
  },
  {
    id: "allure-homme-sport", name: "ألور أوم سبورت", en: "Allure Homme Sport", house: "Chanel",
    audience: "men", tag: "ديزاينر", isNew: false,
    scent: ["fresh", "sweet"], use: ["daily"], strength: "medium",
    family: "خشبي - حار", year: 2004, perfumer: "Jacques Polge",
    notes: {
      top: "البرتقال، نسيم البحر، الألدهيدات و الماندرين الأحمر",
      heart: "الفلفل، النيرولي و خشب الأرز",
      base: "الفانيليا، حبوب التونكا، المسك الأبيض، العنبر، نجيل الهند و راتنج الإليمي",
    },
    prices: { 35: 280, 55: 420, 110: 600 },
    image: "assets/products/allure-homme-sport.jpg",
  },
  {
    id: "black-xs", name: "بلاك ليكسيز", en: "Black XS L’Exces for Him", house: "Rabanne",
    audience: "men", tag: "", isNew: false,
    scent: ["woody", "fresh"], use: ["evening"], strength: "medium",
    family: "خشبي - أروماتك", year: 2012, perfumer: "Fabrice Pellegrin",
    notes: {
      top: "الليمون و الخزامي",
      heart: "السيبرول (الناجراموثا) و نسيم البحر",
      base: "العنبر و الباتشولي",
    },
    prices: { 35: 250, 55: 390, 110: 550 },
    image: "assets/products/black-xs.jpg",
  },
  {
    id: "kayali-marshmallow", name: "كيالي مارشميلو", en: "Yum Boujee Marshmallow | 81", house: "Kayali Fragrances",
    audience: "women", tag: "نيش", isNew: true,
    scent: ["sweet", "fruity"], use: ["daily", "evening"], strength: "medium",
    family: "زهري - فواكه - جورماند", year: 2024, perfumer: "Gabriela Chelariu",
    notes: {
      top: "الفريزيا، الليمون الإيطالي، زهر النكتارين و التفاح",
      heart: "المارشميللو، الفراوله، جوز الهند و زهر البرتقال",
      base: "الكريمة المخفوقة، السكر، الفانيليا، المسك، توت العليق و الأمبروكسان",
    },
    prices: { 35: 250, 55: 390, 110: 550 },
    image: "assets/products/kayali-marshmallow.jpg",
  },
  {
    id: "yara-candy", name: "يارا كاندي", en: "Yara Candy", house: "Lattafa Perfumes",
    audience: "women", tag: "", isNew: true,
    scent: ["sweet", "fruity"], use: ["daily"], strength: "medium",
    family: "زهري - فواكه - جورماند", year: 2024, perfumer: "",
    notes: {
      top: "الكشمش الأسود و الماندرين الأخضر",
      heart: "حلوى الفراولة الفوارة و الغاردينيا",
      base: "الفانيليا، المسك، العنبر و خشب الصندل",
    },
    prices: { 35: 250, 55: 390, 110: 550 },
    image: "assets/products/yara-candy.jpg",
  },
  {
    id: "burberry-her", name: "بيربري هير", en: "Burberry Her", house: "Burberry",
    audience: "women", tag: "", isNew: false,
    scent: ["fruity", "sweet"], use: ["daily", "evening"], strength: "medium",
    family: "زهري - فواكه - جورماند", year: 2018, perfumer: "Francis Kurkdjian",
    notes: {
      top: "الفراوله، توت العليق، التوت الأسود، الكرز الحامض، الكشمش الأسود، الماندرين (اليوسفي) و الليمون",
      heart: "البنفسج و الياسمين",
      base: "المسك، الفانيليا، أخشاب الكشمير، الأخشاب، العنبر، طحلب البلوط (طحلب السنديان) و الباتشولي",
    },
    prices: { 35: 250, 55: 390, 110: 550 },
    image: "assets/products/burberry-her.jpg",
  },
  {
    id: "yara", name: "يارا", en: "Yara", house: "Lattafa Perfumes",
    audience: "women", tag: "", isNew: false,
    scent: ["sweet"], use: ["daily"], strength: "medium",
    family: "شرقي - فانيليا", year: 2020, perfumer: "",
    notes: {
      top: "الأوركيد، الهيلوتروب و تانجرين (اليوسفي)",
      heart: "اتفاق غورماند و الفواكه الإستوائيه",
      base: "الفانيليا، المسك و خشب الصندل",
    },
    prices: { 35: 250, 55: 390, 110: 550 },
    image: "assets/products/yara.jpg",
  },
];

/* ---------- 3) آراء العملاء (نص الرسائل كما هو) ---------- */
const REVIEWS = [
  { text: "صدقا.. جربت من عنده إربا بورا وبلاك لكسيز ومضاوي وكام حاجة كمان فوق الوصف.. كل اللي شمهم سألني عليهم. ومن كام يوم كنت مع صحبي عايش في إيطاليا شم عليا إربا بورا انبهر بيه. ولا ننسى ذوق وأمانة صاحب البراند ده كوم لوحده 🤍", name: "أحمد", source: "facebook" },
  { text: "بصراحة شهادة حق للراجل دة.. بجد جودة حلوة اوى وفوحان وثبات، انا جربت حجات اغلى وهو تفوق عليها. فعلا قيمة مقابل سعر، وان شاء الله نجدد تانى ❤️", name: "محمد", source: "facebook" },
  { text: "برش العطر في الأوضة بيشموه في الصالة، مبقيتش أعرف أرش في صمت 😭 .. اللي كنت راشه قبل ٢٤ ساعة كان لسة ريحته باينة والشباب بتسألني عليه 😂", name: "", source: "whatsapp" },
  { text: "عندهم مشكلة واحدة بجد: العطر بتاعهم بيخلص. أول مرة أحس فلوس العطر حلال بجد والله 💙", name: "خالد", source: "facebook" },
  { text: "والله ياغالي حاجه قمه الجمال والروعه والهدوء زي مايكون متفصل زي منا كنت عايز.. لا فخامه وحاجه توب، للامانه حلال فلوسها ❤️", name: "", source: "whatsapp" },
  { text: "بصراحة مشوفتش جمال زي كده أقسم بالله، جودة عالية جدا ومعاملة زي الفل", name: "طارق", source: "facebook" },
  { text: "ايوا وصل الحمد لله و بجد كلهم تحفه اوي وان شاء الله مش آخر تعامل ❤️", name: "", source: "whatsapp" },
  { text: "بسم الله ما شاء الله، كوالتى وجوده محترمه جدا ومعاملة محترمة", name: "أمير", source: "facebook" },
  { text: "السلام عليكم، كالعادة الحمدلله العطور جميلة وكواليتي محترم تسلم ايدك", name: "", source: "message" },
  { text: "بس فوحان رهيب والله تسلم ايدك 🤩❤️", name: "", source: "whatsapp" },
  { text: "وصل اه الحمد لله، وتسلم ايدك عليه بصراحه وان شاء الله مش اخر تعامل", name: "", source: "whatsapp" },
];
