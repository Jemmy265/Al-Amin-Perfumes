/* Product catalog (published products, in catalog order) — generated from the D1 database by scripts/pull-seed.ts (remote, 2026-11-27).
   Mirrors what the live site shows; it is the storefront's fallback when the API is unreachable.
   Do not edit by hand: change the data in the admin, then run `npm run db:pull-seed`. */
import type { Product } from "../../types/catalog";

export const SEED_PRODUCTS: Product[] = [
  {
    "id": "imperial-valley",
    "name": "امبريال ڤالي",
    "nameEn": "Imperial Valley",
    "house": "Gissah",
    "label": "",
    "isNew": false,
    "tags": {
      "audience": "unisex",
      "scents": [
        "woody"
      ],
      "occasions": [
        "evening",
        "occasion"
      ],
      "intensity": "strong"
    },
    "family": "شرقي - خشبي",
    "year": 2021,
    "perfumer": "",
    "notes": {
      "top": "البرغموت الصقلي، الفلفل الوردي و الدافانا",
      "heart": "العود، العنبر الأبيض و إكليل الجبل",
      "base": "الجلود، المسك و نجيل الهند من هايتي"
    },
    "prices": {
      "20": 175,
      "35": 300,
      "55": 450,
      "110": 650
    },
    "image": "/assets/products/imperial-valley.jpg",
    "sortOrder": 1
  },
  {
    "id": "oud-bouquet",
    "name": "عود بوكيه",
    "nameEn": "Oud Bouquet",
    "house": "Lancôme",
    "label": "",
    "isNew": true,
    "tags": {
      "audience": "unisex",
      "scents": [
        "woody",
        "sweet"
      ],
      "occasions": [
        "evening",
        "occasion"
      ],
      "intensity": "strong"
    },
    "family": "شرقي - خشبي",
    "year": 2016,
    "perfumer": "Fabrice Pellegrin",
    "notes": {
      "all": "حلوي اللوز، العود، الفانيليا، الورد، أخشاب الغاياك و بلسم كوباهو"
    },
    "prices": {
      "20": 175,
      "35": 300,
      "55": 450,
      "110": 600
    },
    "image": "/assets/products/oud-bouquet.jpg",
    "sortOrder": 2
  },
  {
    "id": "althair",
    "name": "الثائر",
    "nameEn": "Althaïr",
    "house": "Parfums de Marly",
    "label": "",
    "isNew": false,
    "tags": {
      "audience": "men",
      "scents": [
        "sweet"
      ],
      "occasions": [
        "evening",
        "occasion"
      ],
      "intensity": "medium"
    },
    "family": "شرقي - فانيليا",
    "year": 2023,
    "perfumer": "Hamid Merati-Kashani و Ilias Ermenidis",
    "notes": {
      "top": "القرفة، زهر البرتقال، الهيل و البرغموت",
      "heart": "فانيليا بوربون و الإليمي",
      "base": "حلوي اللوز، المسك، الأمبروكسان، حبوب التونكا، أخشاب الغاياك و اللوز المحلى"
    },
    "prices": {
      "20": 200,
      "35": 350,
      "55": 500,
      "110": 700
    },
    "image": "/assets/products/althair.jpg",
    "sortOrder": 3
  },
  {
    "id": "perfume-34a37f75",
    "name": "أنچيلز شير",
    "nameEn": "",
    "house": "Angels' Share By Kilian",
    "label": "نيش",
    "isNew": true,
    "tags": {
      "audience": "unisex",
      "scents": [
        "sweet"
      ],
      "occasions": [
        "evening",
        "daily"
      ],
      "intensity": "strong"
    },
    "family": "شرقي - فانيليا",
    "year": 2020,
    "perfumer": "Benoist Lapouza",
    "notes": {
      "top": "الكونياك",
      "heart": "القرفة, حبوب التونكا, البلوط و جزئ هديون",
      "base": "الفانيليا, حلوي اللوز, خشب الصندل و اللوز المحلى"
    },
    "prices": {
      "20": 175,
      "35": 350,
      "55": 500,
      "110": 700
    },
    "image": "/images/products/afabbec9-e1a2-4a4f-b18e-59901ee76884.jpg",
    "sortOrder": 4
  },
  {
    "id": "black-afgano",
    "name": "بلاك أفغانو",
    "nameEn": "Black Afgano",
    "house": "Nasomatto",
    "label": "نيش",
    "isNew": true,
    "tags": {
      "audience": "men",
      "scents": [
        "woody"
      ],
      "occasions": [
        "evening",
        "occasion"
      ],
      "intensity": "strong"
    },
    "family": "خشبي",
    "year": 2009,
    "perfumer": "Alessandro Gualtieri",
    "notes": {
      "top": "القنب, النوتات الخضراء, الدافانا, الزعفران و الزعتر",
      "heart": "الراتينجات, الأخشاب, التبغ, القهوه, القرفة, توت العليق و البنفسج",
      "base": "العود, البخور, العنبر, نوتة حيوانية, أخشاب الغاياك, المسك, خشب الأرز, حبوب التونكا, بلسم غرجان, الأمبروكسان و الفانيليا"
    },
    "prices": {
      "20": 250,
      "35": 420,
      "55": 600,
      "110": 950
    },
    "image": "/images/products/765e27bc-7399-4c93-b693-e5ef9cb48fe9.jpg",
    "sortOrder": 5
  },
  {
    "id": "perfume-e8b835a1",
    "name": "مياكي",
    "nameEn": "",
    "house": "L'Eau d'Issey Pour Homme Issey Miyake",
    "label": "ديزاينر",
    "isNew": true,
    "tags": {
      "audience": "men",
      "scents": [
        "fresh"
      ],
      "occasions": [
        "daily"
      ],
      "intensity": "medium"
    },
    "family": "خشبي - مائي",
    "year": 1994,
    "perfumer": "Jacques Cavallier Belletrud",
    "notes": {
      "top": "يوزو, الليمون, البرغموت, الفيربينا, الماندرين (اليوسفي), أشجار السرو, جزئ الكالون, الكزبرة, المريمية و الطرخون",
      "heart": "اللوتس الأزرق, زنابق الوادي, جوزه الطيب, ابره الراعي, الزعفران, قرفة سيلان و ريزيدا",
      "base": "نجيل الهند من تاهيتي, المسك, خشب الأرز, خشب الصندل, العنبر و التبغ"
    },
    "prices": {
      "20": 175,
      "35": 280,
      "55": 420,
      "110": 575
    },
    "image": "/images/products/c01f1cce-f6e3-44d3-bd8b-1604272d3bd6.jpg",
    "sortOrder": 6
  },
  {
    "id": "khamrah-mira",
    "name": "خمرة ميرا",
    "nameEn": "Khamrah Mira",
    "house": "Lattafa",
    "label": "",
    "isNew": true,
    "tags": {
      "audience": "women",
      "scents": [
        "sweet"
      ],
      "occasions": [
        "daily",
        "evening"
      ],
      "intensity": "medium"
    },
    "family": "شرقي - ڤانيليا",
    "year": 2026,
    "perfumer": "Jordi Fernández و Gaël Montero",
    "notes": {
      "top": "الكشمش الأحمر, الماندرين (اليوسفي) و القرفة",
      "heart": "الكستناء, زهر البرتقال, روزيفوليا و ياسمين سامباك",
      "base": "فانيليا مدغشقر, الكاكاو, المسك, البنزوين - الجاوي و حبوب التونكا."
    },
    "prices": {
      "20": 190,
      "35": 320,
      "55": 440,
      "110": 680
    },
    "image": "/images/products/87ef10b8-fc4f-47fe-8e33-c810af1c85fc.jpg",
    "sortOrder": 7
  },
  {
    "id": "perfume-2033d0d5",
    "name": "انفكتوس فيكتوري الكسير",
    "nameEn": "",
    "house": "Invictus Victory Elixir Rabanne",
    "label": "ديزاينر",
    "isNew": false,
    "tags": {
      "audience": "men",
      "scents": [
        "sweet"
      ],
      "occasions": [
        "daily",
        "evening"
      ],
      "intensity": "strong"
    },
    "family": "شرقي - خشبي",
    "year": 2023,
    "perfumer": "Domitille Michalon Bertier, Anne Flipo و Nicolas Beaulieu",
    "notes": {
      "top": "الخزامي, الهيل و الفلفل الأسود",
      "heart": "البخور و الباتشولي",
      "base": "الفانيليا و حبوب التونكا"
    },
    "prices": {
      "20": 175,
      "35": 300,
      "55": 450,
      "110": 600
    },
    "image": "/images/products/eb3377ea-d295-4ece-a95e-9b2d84cac31f.jpg",
    "sortOrder": 8
  },
  {
    "id": "arrogate-addict-elixir",
    "name": "أروجيت أديكت الكسير",
    "nameEn": "Arrogate Addict Elixir",
    "house": "Assaf",
    "label": "",
    "isNew": true,
    "tags": {
      "audience": "unisex",
      "scents": [
        "fresh"
      ],
      "occasions": [
        "daily"
      ],
      "intensity": "strong"
    },
    "family": "",
    "year": null,
    "perfumer": "",
    "notes": {},
    "prices": {
      "150": 2350
    },
    "image": "/images/products/bbb91add-ebf3-499b-a39b-633568c04dc4.jpg",
    "sortOrder": 9
  },
  {
    "id": "dangerous-arrogate",
    "name": "الخطير أروجيت",
    "nameEn": "Dangerous arrogate",
    "house": "Assaf",
    "label": "",
    "isNew": true,
    "tags": {
      "audience": "unisex",
      "scents": [
        "fruity"
      ],
      "occasions": [
        "daily",
        "evening",
        "occasion"
      ],
      "intensity": "medium"
    },
    "family": "",
    "year": null,
    "perfumer": "",
    "notes": {},
    "prices": {
      "200": 2200
    },
    "image": "/images/products/75bc54e3-2280-4a47-a1a6-dd2719222148.jpg",
    "sortOrder": 10
  },
  {
    "id": "aura",
    "name": "أورا",
    "nameEn": "Aura",
    "house": "Assaf",
    "label": "",
    "isNew": true,
    "tags": {
      "audience": "unisex",
      "scents": [
        "fresh",
        "woody"
      ],
      "occasions": [
        "daily"
      ],
      "intensity": "strong"
    },
    "family": "",
    "year": null,
    "perfumer": "",
    "notes": {},
    "prices": {
      "150": 2200
    },
    "image": "/images/products/a21ed429-f1b5-4e22-b6b3-df12d695ec1c.jpg",
    "sortOrder": 11
  },
  {
    "id": "frankel-black-elixir",
    "name": "فرانكل بلاك الكسير",
    "nameEn": "Frankel Black Elixir",
    "house": "Assaf",
    "label": "",
    "isNew": true,
    "tags": {
      "audience": "unisex",
      "scents": [
        "fresh"
      ],
      "occasions": [
        "daily"
      ],
      "intensity": "medium"
    },
    "family": "",
    "year": null,
    "perfumer": "",
    "notes": {},
    "prices": {
      "200": 2200
    },
    "image": "/images/products/738be172-4b7a-469a-81fd-b11a1a9c2603.jpg",
    "sortOrder": 12
  },
  {
    "id": "perfume-cf63a904",
    "name": "بي ام دبليو",
    "nameEn": "",
    "house": "BMW",
    "label": "ديزاينر",
    "isNew": false,
    "tags": {
      "audience": "men",
      "scents": [
        "fresh"
      ],
      "occasions": [
        "daily"
      ],
      "intensity": "medium"
    },
    "family": "حمضي - منعش",
    "year": 1972,
    "perfumer": "",
    "notes": {
      "top": "ليمون بريموفيوري، برغموت كالابريا، زنجبيل",
      "heart": "المريمية، Helvetolide، زهر البرتقال.",
      "base": "Anthamber، سيبريول، فيتيفر هايتي."
    },
    "prices": {
      "20": 150,
      "35": 290,
      "55": 380,
      "110": 550
    },
    "image": "/images/products/d13d68c2-d118-45ef-8edd-96bc28558f59.jpg",
    "sortOrder": 13
  },
  {
    "id": "khamrah",
    "name": "خمرة",
    "nameEn": "Khamrah",
    "house": "Lattafa",
    "label": "",
    "isNew": true,
    "tags": {
      "audience": "unisex",
      "scents": [
        "sweet"
      ],
      "occasions": [
        "daily",
        "evening"
      ],
      "intensity": "strong"
    },
    "family": "شرقي - حار",
    "year": 2022,
    "perfumer": "",
    "notes": {
      "top": "القرفة, جوزة الطيب و البرغموت",
      "heart": "التمر/البلح, حلوي اللوز, مسك الروم و ماهونيال",
      "base": "الفانيليا, حبوب التونكا, خشب العنبر, المر, البنزوين - الجاوي و أكيغالاوود."
    },
    "prices": {
      "20": 150,
      "35": 280,
      "55": 420,
      "110": 550
    },
    "image": "/images/products/4ed31969-4fe7-4836-b2db-caf0419ae9ed.jpg",
    "sortOrder": 14
  },
  {
    "id": "oud-maracuja",
    "name": "عود ماراكوچا",
    "nameEn": "Oud Maracujá",
    "house": "Maison Crivelli",
    "label": "نيش",
    "isNew": true,
    "tags": {
      "audience": "men",
      "scents": [
        "woody"
      ],
      "occasions": [
        "evening",
        "occasion"
      ],
      "intensity": "strong"
    },
    "family": "جلود - عود",
    "year": 2023,
    "perfumer": "Jordi Fernández",
    "notes": {
      "top": "الباشون فروت، نوتات الفواكه، الزعفران و الورد التركي",
      "heart": "العود, البنزوين - الجاوي وأوراق الباتشولي الإندونيسي",
      "base": "الجلود, أكيغالاوود, العنبر, الفانيليا و اللابدانوم."
    },
    "prices": {
      "20": 200,
      "35": 350,
      "55": 500,
      "110": 750
    },
    "image": "/images/products/7bb7e181-fe76-49c9-806e-f9c2a525a12c.jpg",
    "sortOrder": 15
  },
  {
    "id": "stronger-with-you-intensely",
    "name": "سترونجر ويذ يو انتنسلي",
    "nameEn": "Stronger With You Intensely",
    "house": "Giorgio Armani",
    "label": "ديزاينر",
    "isNew": true,
    "tags": {
      "audience": "men",
      "scents": [
        "sweet"
      ],
      "occasions": [
        "daily"
      ],
      "intensity": "medium"
    },
    "family": "",
    "year": 2019,
    "perfumer": "",
    "notes": {
      "top": "الفلفل الوردي, العرعر و البنفسج",
      "heart": "الطوفي, القرفة, الخزامي و المريمية",
      "base": "الفانيليا, العنبر, حبوب التونكا و جلد الغزال (الجلد المدبوغ)."
    },
    "prices": {
      "20": 175,
      "35": 300,
      "55": 450,
      "110": 600
    },
    "image": "/images/products/61f3f4ac-f6e5-4ac1-9d9a-e12ecab37db3.jpg",
    "sortOrder": 16
  },
  {
    "id": "shuhrah-pour-homme",
    "name": "شهرة",
    "nameEn": "Shuhrah Pour Homme",
    "house": "Rasasi",
    "label": "",
    "isNew": true,
    "tags": {
      "audience": "men",
      "scents": [
        "woody"
      ],
      "occasions": [
        "evening",
        "occasion"
      ],
      "intensity": "strong"
    },
    "family": "خشبي - أروماتك",
    "year": null,
    "perfumer": "",
    "notes": {
      "top": "أوراق الطماطم، الورد و الفريزيا",
      "heart": "الورد، خشب الصندل، خشب الأرز و الياسمين",
      "base": "الجلود، العود، المسك، طحلب البلوط (طحلب السنديان) و العنبر"
    },
    "prices": {
      "20": 175,
      "35": 300,
      "55": 450,
      "110": 600
    },
    "image": "/assets/products/shuhrah-pour-homme.jpg",
    "sortOrder": 17
  },
  {
    "id": "vanilla-powder",
    "name": "فانيلا باودر",
    "nameEn": "Vanilla Powder",
    "house": "Matière Première",
    "label": "نيش",
    "isNew": true,
    "tags": {
      "audience": "unisex",
      "scents": [
        "sweet"
      ],
      "occasions": [
        "daily",
        "evening"
      ],
      "intensity": "medium"
    },
    "family": "",
    "year": 2023,
    "perfumer": "Aurélien Guichard",
    "notes": {
      "top": "بودرة جوز الهند و الهيلوتروب",
      "heart": "فانيليا مدغشقر",
      "base": "الفانيليا، المسك الأبيض، المسك، بالو سانتو، جوز الهند و لاكتونات"
    },
    "prices": {
      "20": 175,
      "35": 300,
      "55": 450,
      "110": 600
    },
    "image": "/assets/products/vanilla-powder.jpg",
    "sortOrder": 18
  },
  {
    "id": "roses-vanille",
    "name": "روز ڤانيلا",
    "nameEn": "Roses Vanille",
    "house": "Mancera",
    "label": "",
    "isNew": true,
    "tags": {
      "audience": "unisex",
      "scents": [
        "sweet",
        "fruity"
      ],
      "occasions": [
        "daily",
        "evening"
      ],
      "intensity": "medium"
    },
    "family": "شرقي - فانيليا",
    "year": 2011,
    "perfumer": "Pierre Montale",
    "notes": {
      "top": "الليمون الإيطالي",
      "heart": "الورد التركي",
      "base": "الفانيليا، المسك الأبيض و خشب الأرز"
    },
    "prices": {
      "20": 175,
      "35": 300,
      "55": 450,
      "110": 600
    },
    "image": "/assets/products/roses-vanille.jpg",
    "sortOrder": 19
  },
  {
    "id": "ultra-male",
    "name": "ألترا ميل",
    "nameEn": "Ultra Male",
    "house": "Jean Paul Gaultier",
    "label": "ديزاينر",
    "isNew": true,
    "tags": {
      "audience": "men",
      "scents": [
        "sweet"
      ],
      "occasions": [
        "evening",
        "occasion"
      ],
      "intensity": "strong"
    },
    "family": "شرقي - فوچير",
    "year": 2015,
    "perfumer": "Francis Kurkdjian",
    "notes": {
      "top": "الكمثري، الخزامي، النعناع، البرغموت و الليمون",
      "heart": "القرفة، المريمية و الكاراوية",
      "base": "قشور الفانيليا السوداء، العنبر، الباتشولي و خشب الأرز"
    },
    "prices": {
      "20": 175,
      "35": 300,
      "55": 450,
      "110": 600
    },
    "image": "/assets/products/ultra-male.jpg",
    "sortOrder": 20
  },
  {
    "id": "lapidus-pour-homme",
    "name": "لابيدوس",
    "nameEn": "Lapidus Pour Homme",
    "house": "Ted Lapidus",
    "label": "",
    "isNew": true,
    "tags": {
      "audience": "men",
      "scents": [
        "woody",
        "sweet"
      ],
      "occasions": [
        "evening",
        "occasion"
      ],
      "intensity": "strong"
    },
    "family": "شرقي",
    "year": 1987,
    "perfumer": "Martin Gras",
    "notes": {
      "top": "الأناناس، الخزامي، الشيح، توت العرعر، الريحان، الليمون و البرغموت",
      "heart": "العسل، البخور، أشجار الصنوبر، الورد، خشب الورد البرازيلي، الياسمين، الكاراوية، جذور السوسن، زنابق الوادي و البيتيتغرين",
      "base": "التبغ، الباتشولي، طحلب البلوط (طحلب السنديان)، المسك، العنبر، خشب الصندل، حبوب التونكا و خشب الأرز"
    },
    "prices": {
      "20": 175,
      "35": 300,
      "55": 450,
      "110": 600
    },
    "image": "/assets/products/lapidus-pour-homme.jpg",
    "sortOrder": 21
  },
  {
    "id": "black-orchid",
    "name": "بلاك أوركيد",
    "nameEn": "Black Orchid",
    "house": "Tom Ford",
    "label": "ديزاينر",
    "isNew": true,
    "tags": {
      "audience": "unisex",
      "scents": [
        "sweet",
        "fruity",
        "woody"
      ],
      "occasions": [
        "evening",
        "occasion"
      ],
      "intensity": "strong"
    },
    "family": "شرقي - زهري",
    "year": 2006,
    "perfumer": "David Apel و Pierre Negrin",
    "notes": {
      "top": "الكمأة، الغاردينيا، الكشمش الأسود، الإيلنغ، الياسمين، البرغموت، الماندرين (اليوسفي) و الليمون",
      "heart": "الأوركيد، التوابل، الغاردينيا، نوتات الفواكه، الإيلنغ، الياسمين و اللوتس",
      "base": "الشيكولاتة المكسيكية، الباتشولي، الفانيليا، البخور، العنبر، خشب الصندل، نجيل الهند و المسك الأبيض"
    },
    "prices": {
      "20": 175,
      "35": 300,
      "55": 450,
      "110": 600
    },
    "image": "/assets/products/black-orchid.jpg",
    "sortOrder": 22
  },
  {
    "id": "bianco-latte",
    "name": "بيانكو لاتيه",
    "nameEn": "Bianco Latte",
    "house": "Giardini Di Toscana",
    "label": "نيش",
    "isNew": true,
    "tags": {
      "audience": "unisex",
      "scents": [
        "sweet"
      ],
      "occasions": [
        "daily",
        "evening"
      ],
      "intensity": "medium"
    },
    "family": "شرقي - فانيليا",
    "year": 2014,
    "perfumer": "Silvia Martinelli",
    "notes": {
      "top": "الكاراميل",
      "heart": "الكومارين و العسل",
      "base": "الفانيليا و المسك الأبيض"
    },
    "prices": {
      "20": 175,
      "35": 300,
      "55": 450,
      "110": 600
    },
    "image": "/assets/products/bianco-latte.jpg",
    "sortOrder": 23
  },
  {
    "id": "silver-mountain-water",
    "name": "سيلفر ماونتن ووتر",
    "nameEn": "Silver Mountain Water",
    "house": "Creed",
    "label": "نيش",
    "isNew": true,
    "tags": {
      "audience": "unisex",
      "scents": [
        "fresh"
      ],
      "occasions": [
        "daily"
      ],
      "intensity": "light"
    },
    "family": "أروماتك",
    "year": 1995,
    "perfumer": "Olivier Creed و Pierre Bourdon",
    "notes": {
      "top": "البرغموت و الماندرين (اليوسفي)",
      "heart": "الشاي الأخضر و الكشمش الأسود",
      "base": "المسك، البيتيتغرين، خشب الصندل و الغلابانوم"
    },
    "prices": {
      "20": 150,
      "35": 250,
      "55": 375,
      "110": 500
    },
    "image": "/assets/products/silver-mountain-water.jpg",
    "sortOrder": 24
  },
  {
    "id": "megamare",
    "name": "ميجامير",
    "nameEn": "Megamare",
    "house": "Orto Parisi",
    "label": "",
    "isNew": false,
    "tags": {
      "audience": "unisex",
      "scents": [
        "fresh"
      ],
      "occasions": [
        "daily"
      ],
      "intensity": "strong"
    },
    "family": "أروماتك - مائي",
    "year": 2019,
    "perfumer": "Alessandro Gualtieri",
    "notes": {
      "top": "البرغموت و الليمون",
      "heart": "الطحالب البحرية، جزئ الكالون و جزئ هديون",
      "base": "المسك، الأمبروكسان و خشب الأرز"
    },
    "prices": {
      "20": 175,
      "35": 300,
      "55": 450,
      "110": 600
    },
    "image": "/assets/products/megamare.jpg",
    "sortOrder": 25
  },
  {
    "id": "pacific-chill",
    "name": "باسيفيك شيل",
    "nameEn": "Pacific Chill",
    "house": "Louis Vuitton",
    "label": "",
    "isNew": false,
    "tags": {
      "audience": "unisex",
      "scents": [
        "fresh",
        "fruity"
      ],
      "occasions": [
        "daily"
      ],
      "intensity": "light"
    },
    "family": "أروماتك - فواكه",
    "year": 2023,
    "perfumer": "Jacques Cavallier Belletrud",
    "notes": {
      "top": "الأترج، البرتقال، الليمون، النعناع، الكشمش الأسود و الكزبرة",
      "heart": "المشمش، الريحان، بذور الجزر و ورد ماي",
      "base": "ثمار التين، التمر/البلح و الأمبريت"
    },
    "prices": {
      "20": 200,
      "35": 350,
      "55": 500,
      "110": 700
    },
    "image": "/assets/products/pacific-chill.jpg",
    "sortOrder": 26
  },
  {
    "id": "erba-pura",
    "name": "اربابورا",
    "nameEn": "Erba Pura",
    "house": "Xerjoff",
    "label": "",
    "isNew": false,
    "tags": {
      "audience": "unisex",
      "scents": [
        "fruity",
        "sweet"
      ],
      "occasions": [
        "daily",
        "evening"
      ],
      "intensity": "strong"
    },
    "family": "",
    "year": 2019,
    "perfumer": "Christian Carbonnel و Laura Santander",
    "notes": {
      "top": "البرتقال الصقلي، برغموت كالابريا و الليمون الصقلي",
      "heart": "الفواكه",
      "base": "المسك الأبيض، فانيليا مدغشقر و العنبر"
    },
    "prices": {
      "20": 200,
      "35": 350,
      "55": 500,
      "110": 700
    },
    "image": "/assets/products/erba-pura.jpg",
    "sortOrder": 27
  },
  {
    "id": "nautica-voyage",
    "name": "نوتيكا ڤوياچ",
    "nameEn": "Nautica Voyage",
    "house": "Nautica",
    "label": "",
    "isNew": false,
    "tags": {
      "audience": "men",
      "scents": [
        "fresh"
      ],
      "occasions": [
        "daily"
      ],
      "intensity": "light"
    },
    "family": "عشبي - مائي",
    "year": 2006,
    "perfumer": "Maurice Roucel",
    "notes": {
      "top": "الأوراق الخضراء و التفاح",
      "heart": "اللوتس و الميموزا",
      "base": "المسك، خشب الأرز، طحلب البلوط (طحلب السنديان) و العنبر"
    },
    "prices": {
      "20": 150,
      "35": 240,
      "55": 375,
      "110": 550
    },
    "image": "/assets/products/nautica-voyage.jpg",
    "sortOrder": 28
  },
  {
    "id": "madawi",
    "name": "مضاوي",
    "nameEn": "Madawi",
    "house": "Arabian Oud",
    "label": "",
    "isNew": false,
    "tags": {
      "audience": "unisex",
      "scents": [
        "fruity"
      ],
      "occasions": [
        "daily",
        "evening",
        "occasion"
      ],
      "intensity": "strong"
    },
    "family": "",
    "year": 2017,
    "perfumer": "Claire Liégent و Dominique Ropion",
    "notes": {
      "top": "الخوخ و زهر التفاح",
      "heart": "زهر الأناناس",
      "base": "المسك، الورد البري و الباتشولي"
    },
    "prices": {
      "20": 175,
      "35": 300,
      "55": 475,
      "110": 650
    },
    "image": "/assets/products/madawi.jpg",
    "sortOrder": 29
  },
  {
    "id": "bleu-de-chanel",
    "name": "بلو دي شانيل",
    "nameEn": "Bleu de Chanel",
    "house": "Chanel",
    "label": "ديزاينر",
    "isNew": false,
    "tags": {
      "audience": "men",
      "scents": [
        "fresh",
        "woody"
      ],
      "occasions": [
        "daily",
        "evening"
      ],
      "intensity": "medium"
    },
    "family": "خشبي - أروماتك",
    "year": 2010,
    "perfumer": "Jacques Polge",
    "notes": {
      "top": "الجريب فروت، الليمون، النعناع و الفلفل الوردي",
      "heart": "الزنجبيل، جوزه الطيب، الياسمين و أيزو إي سوبر",
      "base": "البخور، خشب الأرز، نجيل الهند، خشب الصندل، الباتشولي، اللابدانوم و المسك الأبيض"
    },
    "prices": {
      "20": 175,
      "35": 300,
      "55": 450,
      "110": 600
    },
    "image": "/assets/products/bleu-de-chanel.jpg",
    "sortOrder": 30
  },
  {
    "id": "allure-homme-sport",
    "name": "ألور أوم سبورت",
    "nameEn": "Allure Homme Sport",
    "house": "Chanel",
    "label": "ديزاينر",
    "isNew": false,
    "tags": {
      "audience": "men",
      "scents": [
        "fresh",
        "sweet"
      ],
      "occasions": [
        "daily"
      ],
      "intensity": "medium"
    },
    "family": "خشبي - حار",
    "year": 2004,
    "perfumer": "Jacques Polge",
    "notes": {
      "top": "البرتقال، نسيم البحر، الألدهيدات و الماندرين الأحمر",
      "heart": "الفلفل، النيرولي و خشب الأرز",
      "base": "الفانيليا، حبوب التونكا، المسك الأبيض، العنبر، نجيل الهند و راتنج الإليمي"
    },
    "prices": {
      "20": 175,
      "35": 300,
      "55": 450,
      "110": 600
    },
    "image": "/assets/products/allure-homme-sport.jpg",
    "sortOrder": 31
  },
  {
    "id": "black-xs",
    "name": "بلاك ليكسيز",
    "nameEn": "Black XS L’Exces for Him",
    "house": "Rabanne",
    "label": "",
    "isNew": false,
    "tags": {
      "audience": "men",
      "scents": [
        "fruity",
        "fresh"
      ],
      "occasions": [
        "daily"
      ],
      "intensity": "medium"
    },
    "family": "خشبي - أروماتك",
    "year": 2012,
    "perfumer": "Fabrice Pellegrin",
    "notes": {
      "top": "الليمون و الخزامي",
      "heart": "السيبرول (الناجراموثا) و نسيم البحر",
      "base": "العنبر و الباتشولي"
    },
    "prices": {
      "20": 150,
      "35": 250,
      "55": 390,
      "110": 550
    },
    "image": "/assets/products/black-xs.jpg",
    "sortOrder": 32
  },
  {
    "id": "kayali-marshmallow",
    "name": "كيالي مارشميلو",
    "nameEn": "Yum Boujee Marshmallow | 81",
    "house": "Kayali Fragrances",
    "label": "نيش",
    "isNew": true,
    "tags": {
      "audience": "women",
      "scents": [
        "sweet",
        "fruity"
      ],
      "occasions": [
        "daily",
        "evening"
      ],
      "intensity": "medium"
    },
    "family": "زهري - فواكه - جورماند",
    "year": 2024,
    "perfumer": "Gabriela Chelariu",
    "notes": {
      "top": "الفريزيا، الليمون الإيطالي، زهر النكتارين و التفاح",
      "heart": "المارشميللو، الفراوله، جوز الهند و زهر البرتقال",
      "base": "الكريمة المخفوقة، السكر، الفانيليا، المسك، توت العليق و الأمبروكسان"
    },
    "prices": {
      "35": 250,
      "55": 390,
      "110": 550
    },
    "image": "/assets/products/kayali-marshmallow.jpg",
    "sortOrder": 33
  },
  {
    "id": "yara-candy",
    "name": "يارا كاندي",
    "nameEn": "Yara Candy",
    "house": "Lattafa Perfumes",
    "label": "",
    "isNew": true,
    "tags": {
      "audience": "women",
      "scents": [
        "sweet",
        "fruity"
      ],
      "occasions": [
        "daily"
      ],
      "intensity": "medium"
    },
    "family": "زهري - فواكه - جورماند",
    "year": 2024,
    "perfumer": "",
    "notes": {
      "top": "الكشمش الأسود و الماندرين الأخضر",
      "heart": "حلوى الفراولة الفوارة و الغاردينيا",
      "base": "الفانيليا، المسك، العنبر و خشب الصندل"
    },
    "prices": {
      "20": 150,
      "35": 275,
      "55": 390,
      "110": 550
    },
    "image": "/assets/products/yara-candy.jpg",
    "sortOrder": 34
  },
  {
    "id": "burberry-her",
    "name": "بيربري هير",
    "nameEn": "Burberry Her",
    "house": "Burberry",
    "label": "",
    "isNew": false,
    "tags": {
      "audience": "women",
      "scents": [
        "fruity",
        "sweet"
      ],
      "occasions": [
        "daily",
        "evening"
      ],
      "intensity": "medium"
    },
    "family": "زهري - فواكه - جورماند",
    "year": 2018,
    "perfumer": "Francis Kurkdjian",
    "notes": {
      "top": "الفراوله، توت العليق، التوت الأسود، الكرز الحامض، الكشمش الأسود، الماندرين (اليوسفي) و الليمون",
      "heart": "البنفسج و الياسمين",
      "base": "المسك، الفانيليا، أخشاب الكشمير، الأخشاب، العنبر، طحلب البلوط (طحلب السنديان) و الباتشولي"
    },
    "prices": {
      "20": 150,
      "35": 275,
      "55": 390,
      "110": 550
    },
    "image": "/assets/products/burberry-her.jpg",
    "sortOrder": 35
  },
  {
    "id": "yara",
    "name": "يارا",
    "nameEn": "Yara",
    "house": "Yara - Lattafa Perfumes",
    "label": "",
    "isNew": false,
    "tags": {
      "audience": "women",
      "scents": [
        "sweet"
      ],
      "occasions": [
        "daily"
      ],
      "intensity": "medium"
    },
    "family": "شرقي - فانيليا",
    "year": 2020,
    "perfumer": "",
    "notes": {
      "top": "الأوركيد، الهيلوتروب و تانجرين (اليوسفي)",
      "heart": "اتفاق غورماند و الفواكه الإستوائيه",
      "base": "الفانيليا، المسك و خشب الصندل"
    },
    "prices": {
      "20": 150,
      "35": 275,
      "55": 390,
      "110": 550
    },
    "image": "/assets/products/yara.jpg",
    "sortOrder": 36
  }
];
