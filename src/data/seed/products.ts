/* Product catalog — migrated 1:1 from the original js/data.js (same order,
   names, notes, prices and images). Field renames: en→nameEn, tag→label,
   audience/scent/use/strength → tags.{audience,scents,occasions,intensity}.
   This file is the seed for the future D1 "products" table. */
import type { Product } from "../../types/catalog";

export const SEED_PRODUCTS: Product[] = [
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
      "35": 300,
      "55": 450,
      "110": 600
    },
    "image": "assets/products/vanilla-powder.jpg",
    "sortOrder": 1
  },
  {
    "id": "roses-vanille",
    "name": "روزز ڤانيل",
    "nameEn": "Roses Vanille",
    "house": "Mancera",
    "label": "",
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
    "family": "شرقي - فانيليا",
    "year": 2011,
    "perfumer": "Pierre Montale",
    "notes": {
      "top": "الليمون الإيطالي",
      "heart": "الورد التركي",
      "base": "الفانيليا، المسك الأبيض و خشب الأرز"
    },
    "prices": {
      "35": 300,
      "55": 450,
      "110": 600
    },
    "image": "assets/products/roses-vanille.jpg",
    "sortOrder": 2
  },
  {
    "id": "shuhrah-pour-homme",
    "name": "شهرة بور أوم",
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
      "35": 300,
      "55": 450,
      "110": 600
    },
    "image": "assets/products/shuhrah-pour-homme.jpg",
    "sortOrder": 3
  },
  {
    "id": "lapidus-pour-homme",
    "name": "لابيدوس بور أوم",
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
      "35": 300,
      "55": 450,
      "110": 600
    },
    "image": "assets/products/lapidus-pour-homme.jpg",
    "sortOrder": 4
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
      "35": 300,
      "55": 450,
      "110": 600
    },
    "image": "assets/products/ultra-male.jpg",
    "sortOrder": 5
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
      "35": 300,
      "55": 450,
      "110": 600
    },
    "image": "assets/products/oud-bouquet.jpg",
    "sortOrder": 6
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
      "35": 300,
      "55": 450,
      "110": 600
    },
    "image": "assets/products/bianco-latte.jpg",
    "sortOrder": 7
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
      "35": 300,
      "55": 450,
      "110": 600
    },
    "image": "assets/products/black-orchid.jpg",
    "sortOrder": 8
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
      "35": 250,
      "55": 375,
      "110": 500
    },
    "image": "assets/products/silver-mountain-water.jpg",
    "sortOrder": 9
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
        "daily",
        "evening"
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
      "35": 400,
      "55": 550,
      "110": 800
    },
    "image": "assets/products/megamare.jpg",
    "sortOrder": 10
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
      "35": 350,
      "55": 500,
      "110": 700
    },
    "image": "assets/products/pacific-chill.jpg",
    "sortOrder": 11
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
      "35": 350,
      "55": 500,
      "110": 700
    },
    "image": "assets/products/erba-pura.jpg",
    "sortOrder": 12
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
      "35": 350,
      "55": 500,
      "110": 700
    },
    "image": "assets/products/althair.jpg",
    "sortOrder": 13
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
      "35": 240,
      "55": 375,
      "110": 550
    },
    "image": "assets/products/nautica-voyage.jpg",
    "sortOrder": 14
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
        "evening"
      ],
      "intensity": "medium"
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
      "35": 290,
      "55": 450,
      "110": 650
    },
    "image": "assets/products/madawi.jpg",
    "sortOrder": 15
  },
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
      "35": 290,
      "55": 450,
      "110": 650
    },
    "image": "assets/products/imperial-valley.jpg",
    "sortOrder": 16
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
      "35": 280,
      "55": 420,
      "110": 600
    },
    "image": "assets/products/bleu-de-chanel.jpg",
    "sortOrder": 17
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
      "35": 280,
      "55": 420,
      "110": 600
    },
    "image": "assets/products/allure-homme-sport.jpg",
    "sortOrder": 18
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
        "woody",
        "fresh"
      ],
      "occasions": [
        "evening"
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
      "35": 250,
      "55": 390,
      "110": 550
    },
    "image": "assets/products/black-xs.jpg",
    "sortOrder": 19
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
    "image": "assets/products/kayali-marshmallow.jpg",
    "sortOrder": 20
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
      "35": 250,
      "55": 390,
      "110": 550
    },
    "image": "assets/products/yara-candy.jpg",
    "sortOrder": 21
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
      "35": 250,
      "55": 390,
      "110": 550
    },
    "image": "assets/products/burberry-her.jpg",
    "sortOrder": 22
  },
  {
    "id": "yara",
    "name": "يارا",
    "nameEn": "Yara",
    "house": "Lattafa Perfumes",
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
      "35": 250,
      "55": 390,
      "110": 550
    },
    "image": "assets/products/yara.jpg",
    "sortOrder": 23
  }
];
