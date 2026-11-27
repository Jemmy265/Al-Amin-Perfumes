/* Store settings, discounts & free shipping, labels and homepage content — generated from the D1 database by scripts/pull-seed.ts (remote, 2026-11-27).
   Mirrors what the live site shows; it is the storefront's fallback when the API is unreachable.
   Do not edit by hand: change the data in the admin, then run `npm run db:pull-seed`. */
import type { Labels, SiteContent, StoreSettings } from "../../types/content";
import { SEED_REVIEWS } from "./reviews";

export const SEED_SETTINGS: StoreSettings = {
  "whatsappNumber": "201006747034",
  "generalWhatsappMessage": "مرحبًا، أرغب في الاستفسار عن منتجاتكم من الأمين للعطور.",
  "siteUrl": "https://alamin.win/",
  "currency": "ج.م",
  "sizes": [
    35,
    55,
    110
  ],
  "shippingZones": [
    {
      "id": "cairo",
      "label": "القاهرة والجيزة",
      "fee": 95
    },
    {
      "id": "delta",
      "label": "باقي المحافظات",
      "fee": 110
    },
    {
      "id": "upper",
      "label": "الصعيد",
      "fee": 120
    }
  ],
  "bestSellers": [
    "madawi",
    "perfume-2033d0d5",
    "erba-pura",
    "burberry-her",
    "bianco-latte",
    "stronger-with-you-intensely",
    "black-xs"
  ],
  "phone": "+201006747034",
  "phoneDisplay": "+20 100 674 7034",
  "email": "abdelazizamin99@gmail.com",
  "social": {
    "instagram": "https://www.instagram.com/alaminperfume",
    "facebook": "https://www.facebook.com/share/1HqVRArYdn/",
    "tiktok": "https://www.tiktok.com/@alaminperfumes"
  },
  "discounts": [
    {
      "id": "legacy-size",
      "name": "",
      "percent": 20,
      "scope": {
        "kind": "sizes",
        "sizes": [
          110
        ]
      },
      "enabled": true,
      "startDate": null,
      "endDate": null
    }
  ],
  "freeShipping": {
    "enabled": true,
    "min": 1500
  }
};

export const LABELS: Labels = {
  "audience": {
    "women": "نسائي",
    "men": "رجالي",
    "unisex": "للجنسين"
  },
  "scents": {
    "fresh": {
      "label": "فريش ومائي",
      "emoji": "🌊"
    },
    "sweet": {
      "label": "حلو وفانيليا",
      "emoji": "🍦"
    },
    "woody": {
      "label": "خشبي وعود",
      "emoji": "🌲"
    },
    "fruity": {
      "label": "فواكه وورد",
      "emoji": "🌸"
    }
  },
  "occasions": {
    "daily": "يومي وشغل",
    "evening": "خروجات وسهرات",
    "occasion": "مناسبات"
  },
  "intensity": {
    "light": "هادي",
    "medium": "متوسط",
    "strong": "قوي وفوّاح"
  }
};

export const SEED_CONTENT: SiteContent = {
  "sections": [
    {
      "id": "best",
      "visible": true
    },
    {
      "id": "quizCta",
      "visible": true
    },
    {
      "id": "catalog",
      "visible": true
    },
    {
      "id": "reviews",
      "visible": true
    },
    {
      "id": "about",
      "visible": true
    },
    {
      "id": "faq",
      "visible": true
    },
    {
      "id": "contact",
      "visible": true
    }
  ],
  "announcements": [
    "توصيل **مجاني** لأي أوردر فوق **{freeMin} ج.م**",
    "خصم **{discount}%** على أي إزازة **110 مل**",
    "توصيل لجميع محافظات مصر"
  ],
  "hero": {
    "slogan": "عندما تدمن العطور",
    "tagline": "حيث يلتقي العبق بالأصالة",
    "titleLine1": "عطور فاخرة تُخلق لتدوم",
    "titleLine2": "وتروي حكايتك أينما ذهبت",
    "description": "عطور مستوحاة من أشهر العطور العالمية وعطور النيش والعطور العربية، بأربعة أحجام تناسب ذوقك وميزانيتك.",
    "primaryCta": "تصفّح التشكيلة",
    "secondaryCta": "اكتشف عطرك",
    "image": "assets/products/imperial-valley.jpg",
    "stats": [
      {
        "value": "+35",
        "label": "عطر مختار"
      },
      {
        "value": "4",
        "label": "أحجام"
      },
      {
        "value": "27",
        "label": "محافظة"
      }
    ]
  },
  "benefitsTitle": "لماذا الأمين للعطور",
  "benefits": [
    {
      "icon": "star",
      "title": "تشكيلة مختارة بعناية",
      "text": "عالمية ونيش وعربية في مكان واحد."
    },
    {
      "icon": "drop",
      "title": "ثلاثة أحجام",
      "text": "35 و55 و110 مل لكل ميزانية."
    },
    {
      "icon": "truck",
      "title": "توصيل لكل مصر",
      "text": "من يومين لـ 5 أيام حسب المحافظة."
    },
    {
      "icon": "chat",
      "title": "طلب سهل عبر واتساب",
      "text": "اختار، ضيف للسلة، وابعت."
    }
  ],
  "bestSellers": {
    "kicker": "الأكثر طلبًا",
    "title": "العطور اللي الكل بيسأل عليها"
  },
  "quizCta": {
    "kicker": "محتار تختار إيه؟",
    "title": "اكتشف عطرك في 4 أسئلة",
    "text": "جاوب على 4 أسئلة سريعة، وهنرشحلك أنسب 3 عطور ليك.",
    "button": "ابدأ الاختبار"
  },
  "catalog": {
    "kicker": "تشكيلتنا",
    "title": "عطور مختارة لكل الأذواق",
    "text": "اختار الحجم، وضيف للسلة، وابعت طلبك كله مرة واحدة على واتساب.",
    "searchPlaceholder": "ابحث عن عطر، ماركة أو مكوّن…",
    "noResults": "مش لاقيين عطر مطابق لبحثك."
  },
  "reviews": {
    "kicker": "آراء عملائنا",
    "title": "كلامهم أحسن من كلامنا",
    "text": "رسايل وتوصيات حقيقية وصلتنا من عملائنا على فيسبوك وواتساب."
  },
  "about": {
    "kicker": "من نحن",
    "title": "شغف بالعطر، وذوق في الاختيار",
    "text": "في الأمين للعطور، نؤمن أن العطر توقيع شخصي لا يُنسى. نجمع لكم تشكيلة مختارة من العطور المستوحاة من أشهر العطور العالمية وعطور النيش والعطور العربية، ونوفّرها بثلاثة أحجام لتجدوا ما يناسب ذوقكم وميزانيتكم، مع طلب سهل ومباشر عبر واتساب وتوصيل لجميع محافظات مصر.",
    "cta": "اكتشف التشكيلة",
    "images": [
      "assets/products/imperial-valley.jpg",
      "assets/products/kayali-marshmallow.jpg",
      "assets/products/megamare.jpg"
    ]
  },
  "faq": {
    "kicker": "أسئلة شائعة",
    "title": "كل اللي محتاج تعرفه"
  },
  "faqItems": [
    {
      "q": "الطلب بيوصل في قد إيه؟",
      "a": "التوصيل بياخد من **يومين لـ 5 أيام** حسب المحافظة، ونوصّل لجميع محافظات مصر."
    },
    {
      "q": "الشحن بكام؟",
      "a": "القاهرة والجيزة **95 ج.م** · باقي المحافظات **110 ج.م** · الصعيد **120 ج.م**.\nوالتوصيل **مجاني** لأي أوردر فوق **1,500 ج.م**."
    },
    {
      "q": "إيه طرق الدفع المتاحة؟",
      "a": "متاح الدفع بكل الطرق. ابعتلنا على واتساب ونتفق على الطريقة اللي تناسبك."
    },
    {
      "q": "العطور أصلية ولا مستوحاة؟",
      "a": "العطور **مستوحاة** من أشهر العطور العالمية وعطور النيش والعطور العربية. اسم الماركة اللي مكتوب على كل عطر هو العطر الأصلي اللي اتعمل على طريقته."
    },
    {
      "q": "إيه الأحجام المتاحة؟ وشكل الإزازة إيه؟",
      "a": "كل عطر متاح بـ 3 أحجام: **35 و55 و110 مل**، والإزازة بنفس الشكل اللي في صور الموقع."
    },
    {
      "q": "في عروض أو خصومات؟",
      "a": "أيوه! خصم **20%** على أي إزازة **110 مل** (الخصم محسوب تلقائيًا في الأسعار)، وتوصيل **مجاني** لأي أوردر فوق **1,500 ج.م**."
    },
    {
      "q": "أطلب إزاي؟",
      "a": "اختار الحجم ودوس «أضف للسلة» لكل عطر عايزه، وبعدين افتح السلة 🛍️ واختار محافظتك ودوس «ابعت الطلب على واتساب». هيوصلنا الطلب كامل بالأسعار، ونرد عليك نأكد معاك."
    },
    {
      "q": "محتار ومش عارف أختار؟",
      "a": "جرّب {{quiz|«اكتشف عطرك»}}: 4 أسئلة بس وهنرشحلك أنسب 3 عطور. أو كلّمنا على واتساب ونساعدك تختار."
    }
  ],
  "contact": {
    "kicker": "تواصل معنا",
    "title": "عندك سؤال؟ راسلنا دلوقتي",
    "text": "فريقنا جاهز يرد على استفساراتك ويساعدك تختار العطر الأنسب ليك.",
    "whatsappCta": "راسلنا على واتساب",
    "deliveryNote": "توصيل لجميع محافظات مصر"
  },
  "footer": {
    "brandName": "الأمين للعطور",
    "tagline": "عطور فاخرة، تُختار بعناية لتدوم.",
    "copyright": "الأمين للعطور. جميع الحقوق محفوظة. · العطور مستوحاة، وأسماء الماركات ملك أصحابها."
  },
  "reviewItems": SEED_REVIEWS
};
