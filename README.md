# موقع الأمين للعطور — «عندما تدمن العطور»

متجر عربي (RTL) للعطور: سلة مشتريات تبعت الطلب كامل على واتساب، و«اكتشف عطرك»، وصفحة لكل عطر، وبحث وفلترة.

النسخة دي إعادة تصميم بـ **React + TypeScript + Vite** بهوية كحلي / عاجي / ذهبي شامبين، وخط **Aref Ruqaa** للعناوين و**IBM Plex Sans Arabic** للنصوص. نفس المنتجات والصور والنصوص والأسعار ومنطق الاختبار بتاع الموقع الأصلي.

## أشهر التعديلات

كل البيانات في `src/data/seed/` (ولما الـ API يتعمل، هتتعدل من لوحة التحكم):

| عايز تعدّل | الملف |
|---|---|
| المنتجات، الأسعار، الصور، الوصف | `src/data/seed/products.ts` |
| الواتساب، الشحن، التوصيل المجاني، الخصم، الأكثر طلبًا، السوشيال | `src/data/seed/content.ts` ← `SEED_SETTINGS` |
| نصوص الصفحة، الشعار، الأسئلة الشائعة | `src/data/seed/content.ts` ← `SEED_CONTENT` |
| آراء العملاء | `src/data/seed/reviews.ts` |

- **إضافة عطر:** ارفع صورته في `public/assets/products/` باسم إنجليزي بدون مسافات، وانسخ أي منتج في `products.ts` وعدّل بياناته و`sortOrder`.
- **تاجات «اكتشف عطرك»** في `tags` لكل عطر:
  - `audience`: `women` / `men` / `unisex`
  - `scents`: `fresh` / `sweet` / `woody` / `fruity` (ممكن أكتر من نوع — **الأول هو الأساسي** وبياخد وزن أعلى في الترشيح)
  - `occasions`: `daily` / `evening` / `occasion`
  - `intensity`: `light` / `medium` / `strong`
- في النصوص: `**كلام**` = خط عريض، و`{{quiz|نص}}` = زرار بيفتح «اكتشف عطرك».

## لوحة التحكم (إدارة المتجر)

من الموبايل على `/admin/`: إضافة وتعديل وحذف العطور، رفع الصور، الأحجام والأسعار، وسوم «اكتشف عطرك»، النشر أو الحفظ كمسودة، وترتيب ظهور العطور (التشكيلة و«الأكثر طلبًا»).
البيانات بتتحفظ في Cloudflare D1 والصور في R2، والمتجر بيقرأ منها مباشرة.

التشغيل المحلي والنشر وقائمة التجهيز للإنتاج: **[docs/ADMIN.md](docs/ADMIN.md)**.

## لينك لكل عطر

كل عطر له لينك مباشر: `https://alamin.win/#perfume/<id>`

## التشغيل والنشر

```bash
npm install
npm run dev        # تجربة محلية
npm test           # اختبارات (منها مطابقة «اكتشف عطرك» مع الموقع الأصلي)
npm run build      # الناتج في dist/
```

**Cloudflare Pages:** Build command `npm run build` · Output directory `dist`.

> ⚠️ الموقع دلوقتي محتاج build. GitHub Pages اللي بيعرض الريبو مباشرة **مش هيشتغل** على النسخة دي غير لو اتعمل GitHub Action تنشر `dist/` (أو بعد النقل لـ Cloudflare Pages).

## هيكل الكود

```
src/
├── types/            أنواع البيانات (Product, ProductTags, SiteContent) — نفس شكل جداول D1 المستقبلية
├── data/seed/        البيانات الحالية (منقولة 1:1 من الموقع القديم)
├── services/         طبقة البيانات: static اليوم، Hono API بكرة (VITE_DATA_SOURCE=api)
├── domain/           منطق خالص بدون UI: الأسعار، السلة، الاختبار، البحث، رسائل واتساب
├── state/            React providers: Store, Cart (localStorage), UI (سلة/اختبار/توست)
├── components/       مكونات الواجهة (layout, product, cart, quiz, ui)
├── sections/         أقسام الصفحة الرئيسية
└── styles/           tokens.css (الألوان والخطوط) + باقي التنسيقات
```

### الحركة والتمرير

- **Lenis** للتمرير الناعم (`src/motion/SmoothScroll.tsx`)، متزامن مع GSAP ScrollTrigger، وبيقف تلقائيًا لما السلة أو الاختبار أو صفحة العطر تتفتح.
- **GSAP**: مقدمة الهيرو، البارالاكس، وعدّاد الأرقام (`src/motion/`).
- **React Bits**: `SplitText` و`AnimatedContent` في `src/components/reactbits/` (منسوخين زي ما هم من reactbits.dev). العناوين العربي بتتقسم **بالكلمة** مش بالحرف عشان الحروف تفضل متصلة.
- كل الحركة بتتلغي تلقائيًا لو المستخدم مفعّل «تقليل الحركة» في جهازه.
- التشكيلة بتتعرض **9 عطور في الصفحة** مع أرقام صفحات، وبترجع للصفحة الأولى مع أي فلتر أو بحث.

### الربط مع الـ Backend لاحقًا (Hono + D1 + R2)

- اعمل `.env` من `.env.example` وحط `VITE_DATA_SOURCE=api` و`VITE_API_BASE_URL`.
- الواجهة متوقعة `GET /api/products` و`GET /api/site` (التفاصيل في `src/services/apiDataSource.ts`). لو الـ API وقع، الموقع بيرجع للبيانات المضمّنة.
- مسار الصورة ممكن يكون لينك كامل من R2 — `assetUrl()` بتتعامل مع الحالتين.
- لوحة التحكم هتكتب لنفس الـ API؛ الحقول اللي هتتعدل هي نفسها اللي في `src/types/`.
