# موقع مملكة النحل: خطة البناء

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**الهدف:** بناء موقع براند عربي فاخر لمملكة النحل. فيه كتالوج وقائمة طلب بتتبعت على واتساب، وهيرو قصة بالعسل اللي بينزل مع السكرول.

**المعمار:**
- موقع ثابت بـ Astro، وكل صفحة بتطلع HTML جاهز.
- الكتالوج في ملف TypeScript واحد.
- منطق قائمة الطلب ورسالة واتساب دوال نقية متختبرة.
- الحركة في سكريبتات صغيرة: GSAP + ScrollTrigger + Lenis.
- مفيش framework للواجهة.

**التقنيات:** Astro 5، TypeScript strict، GSAP 3، Lenis 1.3، @fontsource، Vitest (الدوال)، Playwright (المتصفح)، @astrojs/sitemap.

**التصميم المرجعي:** `royal-bees/docs/superpowers/specs/2026-11-26-royal-bees-site-design.md`. الهيرو المرجعي: `royal-bees/spike/hero-story.html`.

**مكان المشروع:** `H:\Cloude\royal-bees\site\`. كل المسارات تحت نسبةً له.

## قيود عامة (بتنطبق على كل مهمة)

**اللغة والأرقام**
- `<html lang="ar" dir="rtl">` في كل الصفحات.
- الأرقام المعروضة بالأرقام العربية الهندية، من غير فواصل آلاف (١٥٠٠).

**الهوية**
- **الألوان:** `--bg #140B05`، `--bg-2 #1C1008`، `--gold #E8A317`، `--gold-2 #F7C45A`، `--cream #F7EBD3`، `--muted #CDB99C`، `--line rgba(247,235,211,.12)`.
- **الخطوط:** El Messiri (500/600/700) للعناوين، وIBM Plex Sans Arabic (400/500/600) للنص. مستضافين محلياً بـ @fontsource.
- **مناطق الضغط:** 44×44 على الأقل. الأزرار الأساسية ارتفاعها 52.
- **الأيقونات:** SVG فقط، من غير إيموجي.

**المحتوى**
- ممنوع تقييمات أو آراء أو شارات خصم مش حقيقية.
- ممنوع أي ادعاء طبي غير أسماء منتجات العميل زي ما هي.
- نبرة النصوص: عامية مصرية مهذبة.

**الإعدادات**
- رقم الواتساب مؤقت: `WHATSAPP_NUMBER = '20XXXXXXXXXX'` في `src/config.ts` بس.
- **بيانات التواصل:**
  - التليفون `0238090519`
  - الإيميل `Info@Royalbeeseg.Com`
  - العنوان "أبو النمرس، الجيزة"
  - سنة التأسيس 1990
- **التوصيل:** "توصيل القاهرة والجيزة"، والرسوم "بنأكدها معاك على واتساب".

**الأداء والجودة**
- JS الصفحة الرئيسية أقل من 90 كيلو (مضغوط gzip).
- تحميلها الأولي من غير فريمات الهيرو أقل من 1.2 ميجا.
- LCP أقل من 2.5 ثانية على موبايل 4G.
- Lighthouse على الموبايل: الأداء 90 أو أكتر، وإمكانية الوصول 95 أو أكتر، وSEO 100.

**الحركة**
- `transform` و`opacity` بس.
- مع `prefers-reduced-motion: reduce` أو Save-Data أو نت 2G: مفيش Lenis ولا تثبيت ولا فريمات، والمحتوى ظاهر من غير حركة.

**Astro View Transitions**
- أي سكريبت تفاعلي يتشغّل على `astro:page-load`، مش مرة واحدة بس.

## نقاط مراجعة (حالات مش في التصميم صراحةً بس هتقابل الزوار)

1. **نفس المنتج بنفس الحجم يتضاف مرتين:** يزود العدد في نفس السطر، مش سطر جديد. (المهمة 3)
2. **`localStorage` مش متاح أو فيه بيانات بايظة** (Safari الخاص، أو JSON تالف): القائمة تشتغل في الذاكرة من غير ما الصفحة تقع. (المهمة 3)
3. **حروف خاصة في الرسالة** (`& # ? +` أو إيموجي في الاسم): تتشفر صح في رابط واتساب. (المهمة 3)
4. **التنقل بين الصفحات بـ View Transitions والرجوع بزرار Back:** الدرج والعداد والهيرو والفلاتر يرجعوا يشتغلوا. (المهمتين 4 و5)
5. **فريمات الهيرو فشلت أو بطيئة:** صورة البداية تفضل ظاهرة، والكانفاس ما يظهرش أسود. (المهمة 5)

---

### Task 1: هيكل المشروع والهوية والتخطيط الأساسي

**الملفات:**
- إنشاء: `package.json`، و`astro.config.mjs` (site: `https://royalbeeseg.com`، والتكاملات: sitemap)، و`tsconfig.json` (strict)، و`vitest.config.ts`، و`playwright.config.ts` (webServer: `npm run preview`، والمشاريع: Desktop Chrome 1440×900 وPixel 7 وiPhone 14 WebKit)
- إنشاء: `src/config.ts`، و`src/styles/tokens.css`، و`src/styles/base.css`، و`src/layouts/Base.astro`
- إنشاء: `src/components/Logo.astro`، و`src/assets/logo.svg`
- اختبار: `tests/e2e/smoke.spec.ts`

**الواجهات:**
- **ينتج `src/config.ts`:**
  ```ts
  export const SITE = { name: 'مملكة النحل', phone: '0238090519', email: 'Info@Royalbeeseg.Com', address: 'أبو النمرس، الجيزة', founded: 1990, whatsapp: '20XXXXXXXXXX', delivery: 'توصيل القاهرة والجيزة' } as const;
  ```
- **ينتج `Base.astro`:** props `{ title: string; description: string; image?: string; noindex?: boolean }`، وslots: `default` و`head`.
- **ينتج `Logo.astro`:** props `{ size?: number; withWordmark?: boolean }`.

- [ ] **الخطوة 1:** `git init` في `royal-bees/`، وأضف `.gitignore` (node_modules، dist، .astro). بعدها `npm create astro@latest site -- --template minimal --typescript strict --no-install`، و`npm i`، و`npm i -D vitest @playwright/test`، و`npm i @astrojs/sitemap gsap lenis @fontsource/el-messiri @fontsource/ibm-plex-sans-arabic`.
- [ ] **الخطوة 2: اكتب الاختبار الفاشل `tests/e2e/smoke.spec.ts`:**
  ```ts
  test('home is Arabic RTL with brand title', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page).toHaveTitle(/مملكة النحل/);
    await expect(page.locator('header img, header svg').first()).toBeVisible();
  });
  ```
- [ ] **الخطوة 3:** شغّل `npx playwright test tests/e2e/smoke.spec.ts`. المتوقع: FAIL.
- [ ] **الخطوة 4: نفّذ.**
  - `tokens.css` فيه الألوان من القيود العامة.
  - `base.css` فيه نفس قواعد `spike/hero-story.html` للأزرار والـ eyebrow والـ focus-visible.
  - `Base.astro` بيضيف الخطوط من @fontsource (حروف العربي بس) والميتا.
  - `logo.svg`: أعد رسم `royal-bees/assets/logo-source.png` بنفس الشكل: دايرة `#111`، وتاج `#C9A13B`، ونحلة بيضا، ونص "ROYAL BEES" و"ESTP 1990" حوالين الدايرة، و"مملكة النحل".
  - `src/pages/index.astro` مؤقتة.
- [ ] **الخطوة 5:** شغّل `npm run build`، وبعدها `npx playwright test tests/e2e/smoke.spec.ts`. المتوقع: PASS.
- [ ] **الخطوة 6:** اعرض `logo.svg` جنب `logo-source.png` على المستخدم وخد موافقته على الشعار.
- [ ] **الخطوة 7:** commit بالرسالة `chore: scaffold Astro site with brand tokens, base layout and logo`.

### Task 2: الكتالوج وأدوات العرض

**الملفات:**
- إنشاء: `src/data/products.ts`، و`src/lib/format.ts`
- اختبار: `tests/unit/products.test.ts`، و`tests/unit/format.test.ts`

**الواجهات:**
- **ينتج:**
  ```ts
  type FamilyId = 'sidr' | 'manuka' | 'export' | 'zero-sucrose' | 'hive' | 'mixes-nuts';
  type Variant = { label: string; grams: number; price: number };
  type Product = { slug: string; name: string; family: FamilyId; origin?: string; short: string; variants: Variant[]; image: string; featured?: boolean; tags?: ('light'|'strong'|'gift'|'no-sucrose'|'wholesale')[] };
  export const FAMILIES: { id: FamilyId; name: string; blurb: string; tone: string }[];
  export const PRODUCTS: Product[];
  export function byFamily(id: FamilyId): Product[];
  export function bySlug(slug: string): Product | undefined;
  export function fromPrice(p: Product): number;           // أقل سعر
  // src/lib/format.ts
  export function arDigits(n: number | string): string;    // 1500 → "١٥٠٠"
  export function priceLabel(n: number): string;           // 150 → "١٥٠ جنيه"
  ```
- **أسماء العائلات:**
  - `sidr`: "السدر والجبلي"
  - `manuka`: "المانوكا"
  - `export`: "عسل التصدير"
  - `zero-sucrose`: "زيرو سكروز"
  - `hive`: "منتجات الخلية"
  - `mixes-nuts`: "خلطات ومكسرات"
- **مسار الصورة:** `image` قيمته `/images/products/<slug>.webp` (المهمة 6 بتملاها).

- [ ] **الخطوة 1: اكتب الاختبارات الفاشلة.**
  - `FAMILIES.length === 6`.
  - كل `slug` مختلف.
  - كل منتج فيه variant واحد على الأقل، وكل `price > 0`.
  - `bySlug('sidr-doani').variants` يساوي `[{label:'ربع كيلو',grams:250,price:850},{label:'نص كيلو',grams:500,price:1500}]`.
  - `fromPrice(bySlug('clover-export')!) === 65`.
  - `byFamily('manuka').length === 4`.
  - `arDigits(1500) === '١٥٠٠'`.
  - `priceLabel(65) === '٦٥ جنيه'`.
- [ ] **الخطوة 2:** شغّل `npx vitest run tests/unit`. المتوقع: FAIL.
- [ ] **الخطوة 3: نفّذ.**
  - انقل **كل** منتجات ملحق (أ) في التصميم بأسعارها بالظبط.
  - أسماء الأحجام: "ربع كيلو" و"نص كيلو" و"كيلو" و"جركن ٥ كيلو"، و"٢٥٠ جرام"/"٥٠٠ جرام" للكلبس، و"٢٠٠ جرام"/"٣٥٠ جرام" للمكسرات، والوزن زي ما هو للخلية.
  - ألوان `tone`:
    - sidr `#C8700A`
    - manuka `#8A4A0A`
    - export `#F5B21A`
    - zero-sucrose `#E9C46A`
    - hive `#B8862B`
    - mixes-nuts `#9C6B3C`
  - `featured`: sidr-doani، وmanuka-umf-15، وsidr-egyptian، وclover-export.
- [ ] **الخطوة 4:** شغّل `npx vitest run tests/unit`. المتوقع: PASS.
- [ ] **الخطوة 5:** commit بالرسالة `feat: add catalog data and Arabic formatting helpers`.

### Task 3: منطق قائمة الطلب ورسالة واتساب

**الملفات:**
- إنشاء: `src/lib/order.ts`
- اختبار: `tests/unit/order.test.ts`

**الواجهات:**
- **ينتج:**
  ```ts
  type OrderLine = { slug: string; name: string; variant: string; unitPrice: number; qty: number };
  export const MAX_LINES = 30;
  export const STORAGE_KEY = 'rb-order-v1';
  export function addLine(lines: OrderLine[], line: Omit<OrderLine,'qty'>, qty?: number): { lines: OrderLine[]; added: boolean }; // added=false لو وصل MAX_LINES
  export function setQty(lines: OrderLine[], slug: string, variant: string, qty: number): OrderLine[]; // qty<=0 بيشيل السطر، والحد الأقصى 99
  export function removeLine(lines: OrderLine[], slug: string, variant: string): OrderLine[];
  export function orderTotal(lines: OrderLine[]): number;
  export function orderCount(lines: OrderLine[]): number;   // مجموع الكميات
  export function loadOrder(storage?: Storage): OrderLine[]; // بترجع [] لو مفيش storage أو البيانات بايظة
  export function saveOrder(lines: OrderLine[], storage?: Storage): void; // ما بترميش errors
  export function buildMessage(lines: OrderLine[], who?: { name?: string; area?: string }): string;
  export function whatsappUrl(text: string, number?: string): string; // https://wa.me/<number>?text=<encodeURIComponent(text)>
  ```

- [ ] **الخطوة 1: اكتب الاختبارات الفاشلة.**
  - إضافة نفس `slug+variant` مرتين بتعمل سطر واحد `qty: 2`.
  - السطر رقم 31 بيرجع `added:false` والطول يفضل 30.
  - `setQty(...,0)` بيشيل السطر.
  - `orderTotal` لـ (دوعني ربع ×2 + لوز ٢٠٠ ×1) = 1885.
  - `loadOrder` بترجع `[]` مع storage قيمته `'{bad json'`، ومع storage بيرمي error عند القراءة.
  - `saveOrder` ما بترميش error مع storage بيرمي عند الكتابة.
  - `buildMessage` للمثال ده بيطابق بالظبط:
    ```
    السلام عليكم، عايز أطلب من مملكة النحل:
    • عسل السدر الجبلي دوعني (ربع كيلو) × ٢ = ١٧٠٠ جنيه
    • مكسرات لوز (٢٠٠ جرام) × ١ = ١٨٥ جنيه
    الإجمالي: ١٨٨٥ جنيه (من غير التوصيل)
    الاسم: …
    المنطقة: …
    ```
    مع `who={name:'أحمد & سارة'}`، السطر بيبقى `الاسم: أحمد & سارة`.
  - `whatsappUrl('a&b #1')` بيحتوي `text=a%26b%20%231`، وبيستخدم `SITE.whatsapp` لو الرقم مش متحدد.
- [ ] **الخطوة 2:** شغّل `npx vitest run tests/unit/order.test.ts`. المتوقع: FAIL.
- [ ] **الخطوة 3:** نفّذ كل الدوال كدوال نقية (بترجع arrays جديدة). الأرقام في الرسالة بـ `arDigits`.
- [ ] **الخطوة 4:** شغّل `npx vitest run tests/unit`. المتوقع: PASS.
- [ ] **الخطوة 5:** commit بالرسالة `feat: order list logic and WhatsApp message builder`.

### Task 4: الهيدر والفوتر والقائمة ودرج الطلب

**الملفات:**
- إنشاء: `src/components/Header.astro`، و`src/components/Footer.astro`، و`src/components/MobileMenu.astro`، و`src/components/OrderDrawer.astro`، و`src/components/AddToOrder.astro`، و`src/scripts/order-ui.ts`
- تعديل: `src/layouts/Base.astro` (يضيف الهيدر والفوتر والدرج و`<ViewTransitions />` من `astro:transitions`)
- اختبار: `tests/e2e/order.spec.ts`

**الواجهات:**
- **يستهلك:** `order.ts` (المهمة 3)، و`SITE` (المهمة 1).
- **ينتج `AddToOrder.astro`:** props `{ product: Product; variant?: string; compact?: boolean }`. بيرسم `<button data-add-order data-slug data-name data-variant data-price>`. `order-ui.ts` بيسمع على أي عنصر عليه `data-add-order`.
- **ينتج حدث** `rb:order-changed` على `document` بعد أي تغيير.
- **الأيقونة:** `[data-order-count]`.
- **الدرج:** `#order-drawer` بـ `role="dialog"` و`aria-modal="true"`. Escape بيقفله، والتركيز بيرجع للزرار اللي فتحه.

- [ ] **الخطوة 0:** أنشئ صفحة اختبار `src/pages/dev/order-fixture.astro` (`noindex`). فيها `AddToOrder` لـ `sidr-doani` بالـ variant "ربع كيلو"، ورابط لـ `/`. الصفحة دي بتتمسح في المهمة 12.
- [ ] **الخطوة 1: اكتب الاختبارات الفاشلة في `order.spec.ts`.**
  - في `/dev/order-fixture/`: الضغط مرتين على `AddToOrder` بيخلي `[data-order-count]` = "٢".
  - فتح الدرج بيبين سطر واحد فيه "× ٢".
  - رابط "ابعت الطلب على واتساب" `href` بيبدأ بـ `https://wa.me/` وبيحتوي `%D8%A7%D9%84%D8%A5%D8%AC%D9%85%D8%A7%D9%84%D9%8A` (كلمة "الإجمالي").
  - بعد `page.reload()` العدد لسه "٢".
  - بعد التنقل لصفحة تانية (View Transition) والرجوع بـ `page.goBack()`، الضغط على `AddToOrder` بيخلي العدد "٣".
  - Escape بيقفل الدرج.
- [ ] **الخطوة 2:** شغّل `npx playwright test tests/e2e/order.spec.ts`. المتوقع: FAIL.
- [ ] **الخطوة 3: نفّذ.**
  - **الهيدر:** شفاف، وبيبقى `.scrolled` بعد 40 بكسل (نفس النموذج).
  - **القائمة على الموبايل:** طبقة كاملة تحت 900 بكسل.
  - **الدرج:** من الجنب على الكمبيوتر، ومن تحت (bottom sheet) على الموبايل. فيه حقلين اختياريين: الاسم والمنطقة.
  - **العداد:** بيتنطط 0.4 ثانية.
  - **زرار "ابدأ طلب جديد":** بيمسح القائمة بعد تأكيد.
  - **رسالة بالحد الأقصى:** "وصلت لأقصى عدد (٣٠)، ابعت الطلب ده الأول".
  - **الفوتر:** الشعار الكبير، والعنوان، والتليفون (`tel:`)، والإيميل (`mailto:`)، والصفحات، و"توصيل القاهرة والجيزة".
  - كل الربط في `order-ui.ts` بيتشغّل على `astro:page-load`، وبيشيل listeners القديمة.
- [ ] **الخطوة 4:** شغّل `npx playwright test tests/e2e/order.spec.ts`. المتوقع: PASS على المشاريع التلاتة.
- [ ] **الخطوة 5:** commit بالرسالة `feat: header, footer, mobile menu and WhatsApp order drawer`.

### Task 5: هيرو القصة ونظام الحركة

**الملفات:**
- نقل: `royal-bees/spike/media/story/{d,m}/*.webp` إلى `public/media/story/{d,m}/`، و`story-poster*.jpg` إلى `public/media/`
- إنشاء: `src/components/StoryHero.astro`، و`src/scripts/story.ts`، و`src/scripts/motion.ts`، و`src/lib/story-math.ts`
- اختبار: `tests/unit/story-math.test.ts`، و`tests/e2e/hero.spec.ts`

**الواجهات:**
- **ينتج:**
  ```ts
  // story-math.ts
  export function frameForProgress(p: number, frames: number, hold = 0.1, span = 0.8): number; // 0..frames-1، مقصوصة
  export function frameLoadOrder(frames: number, steps?: number[]): number[]; // الافتراضي [16,8,4,2,1]، كل index مرة واحدة
  // motion.ts
  export function motionAllowed(): boolean; // false مع reduced-motion أو saveData أو 2g
  export function initMotion(): void;       // Lenis + reveals ([data-reveal]) + hover-only card lift
  ```
- **`StoryHero.astro`:** نفس DOM ونصوص `spike/hero-story.html`، مع التعديلات دي:
  - الـ eyebrow: "منذ ١٩٩٠ · أبو النمرس، الجيزة".
  - عدد الفريمات `FRAMES = 64`.
  - مدة القصة `1.3 × innerHeight`.
  - مواضع المراحل: beat-1 بتخرج عند 0.18، وbeat-2 بتدخل 0.3 وبتخرج 0.56، وbeat-3 بتدخل 0.63.
  - نقط الخط الدهبي عند 0 و0.3 و0.66.
  - الستارة: `scale 0.93` و`opacity 0.35`.

- [ ] **الخطوة 1: اكتب الاختبارات الفاشلة.**
  - **`story-math`:**
    - `frameForProgress(0.05, 64) === 0`.
    - `frameForProgress(0.5, 64)` ≈ `31.5`.
    - `frameForProgress(1, 64) === 63`.
    - `frameForProgress(-1, 64) === 0`.
    - `frameLoadOrder(64)` طولها 64، وأول عنصر 0، ومفيهاش تكرار.
  - **`hero.spec`:**
    - (أ) مع `reducedMotion: 'reduce'`: `html` ما عليهاش `js-story`، و`.beat-1 h1` ظاهر، ومفيش طلبات لـ `/media/story/`.
    - (ب) عادي: بعد السكرول لـ `0.6 × viewport`، `.beat-2` opacity أكبر من 0.9.
    - (ج) مع `page.route('**/media/story/**', r => r.abort())`: الـ `background-image` بتاع `.media` (البوستر) لسه موجود، والكانفاس ما عليهوش `.ready`.
    - (د) بعد الانتقال لـ `/honey/` والرجوع، السكرول لسه بيغيّر المراحل.
- [ ] **الخطوة 2:** شغّل `npx vitest run tests/unit/story-math.test.ts` و`npx playwright test tests/e2e/hero.spec.ts`. المتوقع: FAIL.
- [ ] **الخطوة 3: نفّذ.**
  - انقل منطق النموذج لـ `story.ts` باستخدام `story-math`.
  - Lenis وGSAP من npm.
  - أي ScrollTrigger وLenis بيتشال (`kill`/`destroy`) على `astro:before-swap`، وبيتعمل من جديد على `astro:page-load`.
  - `motion.ts`: reveal بـ 1 ثانية `power3.out` وفرق 0.12، مرة واحدة. ورفع الكارت 6 بكسل جوه `@media (hover:hover)` بس.
- [ ] **الخطوة 4:** شغّل نفس الأوامر. المتوقع: PASS.
- [ ] **الخطوة 5:** commit بالرسالة `feat: scroll-driven story hero and shared motion system`.

### Task 6: صور المنتجات من موقع العميل

**الملفات:**
- إنشاء: `scripts/fetch-product-images.mjs`، و`scripts/image-map.json` (`slug` → رابط الصورة الأصلي)، و`public/images/products/*.webp`
- اختبار: `tests/unit/images.test.ts`

**الواجهات:**
- **يستهلك:** `PRODUCTS[].image` (المهمة 2).

- [ ] **الخطوة 1:** اكتب الاختبار الفاشل: لكل `p` في `PRODUCTS`، الملف `public${p.image}` موجود وحجمه أكبر من 2 كيلو.
- [ ] **الخطوة 2:** شغّل `npx vitest run tests/unit/images.test.ts`. المتوقع: FAIL.
- [ ] **الخطوة 3:** افتح royalbeeseg.com في المتصفح، واقرا طلبات الشبكة عشان تلاقي روابط صور المنتجات (الموقع بيرسم بالجافاسكريبت). املا `image-map.json`.
- [ ] **الخطوة 4:** السكريبت بينزّل كل صورة في مجلد مؤقت منفصل، وبيحوّلها لـ WebP بعرض 800 بـ `ffmpeg` (جودة 78)، وبيحفظها في `public/images/products/<slug>.webp`. لو منتج ملوش صورة، يستخدم `public/images/products/_placeholder.webp` (سداسي دهبي على `--bg-2`) ويطبع تحذير.
- [ ] **الخطوة 5:** شغّل الاختبار. المتوقع: PASS. اعرض قائمة المنتجات اللي أخدت placeholder على المستخدم.
- [ ] **الخطوة 6:** commit بالرسالة `feat: product images from client site`.

### Task 7: باقي أقسام الصفحة الرئيسية

**الملفات:**
- إنشاء: `src/components/home/Collections.astro`، و`Featured.astro`، و`Guarantee.astro`، و`Chooser.astro`، و`Numbers.astro`، و`Faq.astro`، و`FinalCta.astro`، و`src/components/ProductCard.astro`، و`src/scripts/chooser.ts`
- نقل: `royal-bees/spike/media/hero-1080.mp4` و`hero-poster.jpg` إلى `public/media/guarantee.mp4` و`guarantee-poster.jpg`
- تعديل: `src/pages/index.astro`
- اختبار: `tests/e2e/home.spec.ts`

**الواجهات:**
- **يستهلك:** `PRODUCTS` و`FAMILIES` و`fromPrice` و`priceLabel` (المهمة 2)، و`AddToOrder` (المهمة 4)، و`StoryHero` و`initMotion` (المهمة 5).
- **ينتج `ProductCard.astro`:** props `{ product: Product }`. فيها الصورة، والاسم، و"يبدأ من"، ورابط للمنتج، و`AddToOrder compact` بأول variant.
- **ينتج `Chooser`:** شرائح لكل tag، وكل شريحة بـ `data-tag`، وبتفلتر `[data-tags]` في الشبكة اللي تحتها.

- [ ] **الخطوة 1: اكتب الاختبارات الفاشلة.**
  - 6 كروت عائلات، وأول كارت فيه "يبدأ من".
  - قسم المميزة فيه 4 كروت.
  - الضغط على شريحة "من غير سكروز" بيخلي كل الكروت الظاهرة `data-tags` بتاعتها فيها `no-sucrose`.
  - فتح سؤال في الأسئلة الشائعة (`<details>`) بيبين الإجابة.
  - رقم السنين في Numbers بيساوي `new Date().getFullYear() - 1990` بالأرقام العربية.
  - مع `reducedMotion: 'reduce'`، فيديو الضمان ما بيتحمّلش (البوستر بس).
- [ ] **الخطوة 2:** شغّل `npx playwright test tests/e2e/home.spec.ts`. المتوقع: FAIL.
- [ ] **الخطوة 3: نفّذ حسب القسم 7 في التصميم.**
  - **الستارة:** `margin-top:-100vh` مع `.js-story` (زي النموذج).
  - **المميزة:** شريط أفقي بيتحرك مع السكرول (`x` مربوط بـ ScrollTrigger) على الكمبيوتر، و`scroll-snap` بالسحب على الموبايل.
  - **الضمان:**
    - 3 خطوات بالنص: "اشتري" ← "حلّل في أي معمل معتمد" ← "لو مش طبيعي فلوسك ترجع".
    - الفيديو `muted loop playsinline`، وبيتحمّل بس لما القسم يقرب من الشاشة.
  - **Numbers:** العد بـ GSAP مرة واحدة.
  - **الأسئلة الشائعة:**
    - الطلب
    - التوصيل: "توصيل القاهرة والجيزة، والرسوم والمدة بنأكدها معاك على واتساب"
    - الدفع: "بنأكده معاك على واتساب"
    - تبلور العسل طبيعي
    - الضمان
- [ ] **الخطوة 4:** شغّل نفس الأمر. المتوقع: PASS.
- [ ] **الخطوة 5:** commit بالرسالة `feat: home page sections`.

### Task 8: الكتالوج وصفحات العائلات

**الملفات:**
- إنشاء: `src/pages/honey/index.astro`، و`src/pages/honey/[family].astro`، و`src/scripts/catalog-filter.ts`
- اختبار: `tests/e2e/catalog.spec.ts`

**الواجهات:**
- **يستهلك:** `ProductCard` (المهمة 7)، و`byFamily` و`FAMILIES` (المهمة 2).
- **ينتج:** الفلتر بيقرا ويكتب `?family=<FamilyId>` و`?sort=price-asc|price-desc` بـ `history.replaceState`.

- [ ] **الخطوة 1: اكتب الاختبارات الفاشلة.**
  - `/honey/?family=manuka` بيبين 4 كروت بالظبط.
  - الضغط على شريحة "عسل التصدير" بيغيّر الرابط لـ `?family=export`.
  - `?sort=price-asc` أول كارت سعره أقل من أو يساوي التاني.
  - `/honey/hive/` فيها h1 "منتجات الخلية" و8 كروت.
  - شبكة الكروت عمودين على Pixel 7.
- [ ] **الخطوة 2:** شغّل `npx playwright test tests/e2e/catalog.spec.ts`. المتوقع: FAIL.
- [ ] **الخطوة 3:** نفّذ. كل الكروت موجودة في HTML (عشان SEO)، والفلترة بتخفي وتبين بس. `getStaticPaths` من `FAMILIES`.
- [ ] **الخطوة 4:** شغّل. المتوقع: PASS.
- [ ] **الخطوة 5:** commit بالرسالة `feat: catalog and family pages with URL filters`.

### Task 9: صفحة المنتج

**الملفات:**
- إنشاء: `src/pages/product/[slug].astro`، و`src/components/SizePicker.astro`، و`src/components/QtyStepper.astro`، و`src/scripts/product.ts`
- اختبار: `tests/e2e/product.spec.ts`

**الواجهات:**
- **يستهلك:** `bySlug` و`PRODUCTS` (المهمة 2)، و`whatsappUrl` و`buildMessage` (المهمة 3)، و`AddToOrder` وحدث `rb:order-changed` (المهمة 4).
- **ينتج:** `SizePicker` بـ `role="radiogroup"`، وكل خيار `role="radio"`. `product.ts` بيحدّث `[data-price]` و`AddToOrder` بالـ variant المختار.

- [ ] **الخطوة 1: اكتب الاختبارات الفاشلة.**
  - `/product/sidr-doani/` السعر الأولي "٨٥٠ جنيه".
  - اختيار "نص كيلو" بيخلي السعر "١٥٠٠ جنيه".
  - العدد 2 بيخلي الإجمالي "٣٠٠٠ جنيه".
  - "أضف للطلب" بيضيف سطر `(نص كيلو) × ٢`.
  - رابط "اطلب ده بس على واتساب" فيه نفس السطر بس.
  - على Pixel 7 الشريط السفلي الثابت ظاهر وفيه السعر.
  - فيه 3 منتجات تحت "ممكن يعجبك كمان" من نفس العائلة.
  - الأسهم في الكيبورد بتغيّر الحجم.
- [ ] **الخطوة 2:** شغّل `npx playwright test tests/e2e/product.spec.ts`. المتوقع: FAIL.
- [ ] **الخطوة 3:** نفّذ. السعر بيتقلب بحركة 0.4 ثانية (`y` + `opacity`)، ومن غير حركة مع reduced motion. شارة الضمان بتلينك على `/guarantee/`.
- [ ] **الخطوة 4:** شغّل. المتوقع: PASS.
- [ ] **الخطوة 5:** commit بالرسالة `feat: product page with size picker, quantity and order actions`.

### Task 10: صفحات المحتوى والموسوعة

**الملفات:**
- إنشاء: `src/pages/guarantee.astro`، و`src/pages/about.astro`، و`src/pages/contact.astro`، و`src/pages/404.astro`، و`src/content.config.ts` (collection `encyclopedia`: `{ title: string; description: string; date: Date; cover?: string }`)، و`src/content/encyclopedia/*.mdx`، و`src/pages/encyclopedia/index.astro`، و`src/pages/encyclopedia/[slug].astro`
- اختبار: `tests/e2e/pages.spec.ts`

- [ ] **الخطوة 1: اكتب الاختبارات الفاشلة.**
  - كل الصفحات دي بترجع 200 وفيها h1 واحد: `/guarantee/` و`/about/` و`/contact/` و`/encyclopedia/`.
  - صفحة الضمان فيها النص "إذا ثبت بالتحليل المخبري أن العسل غير طبيعي".
  - صفحة التواصل فيها `a[href="tel:0238090519"]` و`a[href^="mailto:"]`.
  - رابط مش موجود بيرجع صفحة 404 فيها رابط لـ `/honey/`.
- [ ] **الخطوة 2:** شغّل. المتوقع: FAIL.
- [ ] **الخطوة 3: نفّذ.**
  - **الموسوعة:** انقل المقالات من قسم "موسوعه عسل النحل" في موقعهم (العميل وافق)، كل مقالة في ملف MDX بعنوانها ونصها زي ما هو.
  - **التواصل:** خريطة Google مضمّنة بـ `loading="lazy"` لأبو النمرس.
  - **عن مملكة النحل:** النصوص من التصميم (منذ 1990، أبو النمرس، الضمان). ممنوع إضافة حقائق مش موجودة.
- [ ] **الخطوة 4:** شغّل. المتوقع: PASS.
- [ ] **الخطوة 5:** commit بالرسالة `feat: guarantee, about, contact, 404 and encyclopedia`.

### Task 11: SEO والبيانات المنظمة

**الملفات:**
- إنشاء: `src/lib/jsonld.ts`، و`public/robots.txt`، و`public/og-default.jpg` (الشعار على `--bg`، 1200×630)
- تعديل: `Base.astro`، وصفحة المنتج، والرئيسية، وصفحات العائلات
- اختبار: `tests/unit/jsonld.test.ts`، و`tests/e2e/seo.spec.ts`

**الواجهات:**
- **ينتج:**
  ```ts
  export function organizationLd(): object;      // Organization + LocalBusiness: name, telephone, address (addressLocality "أبو النمرس", addressRegion "الجيزة", addressCountry "EG"), foundingDate "1990"
  export function productLd(p: Product, url: string): object; // offers: AggregateOffer { priceCurrency:'EGP', lowPrice, highPrice, offerCount }
  export function faqLd(items: { q: string; a: string }[]): object;
  export function breadcrumbLd(items: { name: string; url: string }[]): object;
  ```

- [ ] **الخطوة 1: اكتب الاختبارات الفاشلة.**
  - `productLd(bySlug('sidr-doani')!, …).offers` يساوي `{ '@type':'AggregateOffer', priceCurrency:'EGP', lowPrice:850, highPrice:1500, offerCount:2 }`.
  - في المتصفح: `/product/sidr-doani/` فيها `script[type="application/ld+json"]` بيتقرا JSON، وفيه `"priceCurrency":"EGP"`.
  - كل صفحة فيها `link[rel=canonical]` و`meta[property="og:image"]`.
  - `/sitemap-index.xml` بيرجع 200.
- [ ] **الخطوة 2:** شغّل. المتوقع: FAIL.
- [ ] **الخطوة 3:** نفّذ وأضف العناوين والأوصاف بالعربي لكل صفحة.
  - `organizationLd` في `Base.astro`.
  - `faqLd` في الرئيسية بنفس أسئلة `Faq.astro`.
  - `productLd` و`breadcrumbLd` في صفحة المنتج.
  - `breadcrumbLd` في صفحات العائلات.
- [ ] **الخطوة 4:** شغّل. المتوقع: PASS.
- [ ] **الخطوة 5:** commit بالرسالة `feat: SEO metadata, JSON-LD and sitemap`.

### Task 12: الأداء والفحص النهائي وتجهيز النشر

**الملفات:**
- إنشاء: `scripts/budget.mjs`، و`netlify.toml` (build: `npm run build`، publish: `dist`، وheaders: كاش سنة لـ `/media/*` و`/_astro/*`)، و`docs/qa-checklist.md`

- [ ] **الخطوة 0:** امسح `src/pages/dev/`، وخلّي `order.spec.ts` يستخدم `/product/sidr-doani/` بدل صفحة الاختبار.
- [ ] **الخطوة 1:** اكتب `scripts/budget.mjs`. بيقرا `dist/index.html` وكل الأصول اللي بيحمّلها في البداية (غير `/media/story/`)، وبيفشل لو:
  - JS المضغوط أكبر من 90 كيلو.
  - المجموع أكبر من 1.2 ميجا.
- [ ] **الخطوة 2:** شغّل `npm run build && node scripts/budget.mjs`. المتوقع: PASS، ولو فشل صلّح قبل ما تكمل.
- [ ] **الخطوة 3:** شغّل `npx lighthouse http://localhost:4321/ --preset=perf --form-factor=mobile` و`/product/sidr-doani/`. المتوقع: الأداء 90 أو أكتر، وإمكانية الوصول 95 أو أكتر، وSEO 100. صلّح أي حاجة أقل.
- [ ] **الخطوة 4:** شغّل `npx playwright test` كلها على المشاريع التلاتة. المتوقع: PASS.
- [ ] **الخطوة 5:** اكتب `docs/qa-checklist.md` للتجربة على **أجهزة حقيقية** (آيفون Safari، وأندرويد Chrome متوسط):
  - إحساس السكرول في الهيرو
  - الدرج
  - رسالة واتساب بتفتح التطبيق
  - تقليل الحركة
  - Slow 4G

  واطلب من المستخدم يجربهم.
- [ ] **الخطوة 6:** commit بالرسالة `chore: performance budget, QA checklist and Netlify config`.

---

## متابعة بعد الخطة (مش مهام، بتستنى العميل)

- **رقم الواتساب الحقيقي:** يتغير في `src/config.ts`.
- **موافقة العميل على `logo.svg`** (المهمة 1، الخطوة 6).
- **الدومين والتحويلات 301** من روابط موقعهم القديم وقت الإطلاق.
- **روابط السوشيال ميديا** للفوتر.
- **قسم "للمحلات والكميات"** (الجراكن 5 كيلو) في الرئيسية: بيتضاف لو العميل أكّد إنه بيبيع جملة (التصميم، القسم 7.6).
