// Catalog snapshot copied from royalbeeseg.com on 2026-11-26 and confirmed by the client.
export type FamilyId = 'sidr' | 'manuka' | 'export' | 'zero-sucrose' | 'hive' | 'mixes-nuts';
export type Tag = 'light' | 'strong' | 'gift' | 'no-sucrose' | 'wholesale';
export type Variant = { label: string; grams: number; price: number };
export type Product = {
  slug: string;
  name: string;
  family: FamilyId;
  origin?: string;
  short: string;
  variants: Variant[];
  image: string;
  featured?: boolean;
  tags?: Tag[];
};

export const FAMILIES: { id: FamilyId; name: string; blurb: string; tone: string }[] = [
  { id: 'sidr', name: 'السدر والجبلي', blurb: 'مصري، سعودي، ليبي، حضرمي يمني، دوعني وعصيمي.', tone: '#C8700A' },
  { id: 'manuka', name: 'المانوكا', blurb: 'بدرجات UMF من ٥ لحد ١٨، أندر عسل في المجموعة.', tone: '#8A4A0A' },
  { id: 'export', name: 'عسل التصدير', blurb: 'برسيم، موالح، بردقوش، حبة البركة وصحراوي.', tone: '#F5B21A' },
  { id: 'zero-sucrose', name: 'زيرو سكروز', blurb: 'نفس أنواع التصدير، بنسبة سكروز صفر.', tone: '#E9C46A' },
  { id: 'hive', name: 'منتجات الخلية', blurb: 'غذاء ملكات، بروبوليس، حبوب لقاح وشمع.', tone: '#B8862B' },
  { id: 'mixes-nuts', name: 'خلطات ومكسرات', blurb: 'خلطات بالعسل ومكسرات طازة.', tone: '#9C6B3C' },
];

// size helpers
const Q = (price: number): Variant => ({ label: 'ربع كيلو', grams: 250, price });
const H = (price: number): Variant => ({ label: 'نص كيلو', grams: 500, price });
const K = (price: number): Variant => ({ label: 'كيلو', grams: 1000, price });
const J = (price: number): Variant => ({ label: 'جركن ٥ كيلو', grams: 5000, price });
const G = (grams: number, price: number, label = `${toAr(grams)} جرام`): Variant => ({ label, grams, price });
function toAr(n: number) { return String(n).replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]); }

type Seed = Omit<Product, 'image'>;
const seeds: Seed[] = [
  // ---- sidr & mountain honey
  { slug: 'sidr-egyptian', name: 'عسل السدر الجبلي مصري', family: 'sidr', origin: 'مصر', short: 'سدر جبلي مصري بطعم عميق.', variants: [Q(150), H(250), K(450)], featured: true, tags: ['strong'] },
  { slug: 'sidr-wild', name: 'عسل السدر الجبلي بري', family: 'sidr', short: 'سدر بري من مناحل جبلية.', variants: [Q(175), H(300), K(500)], tags: ['strong'] },
  { slug: 'sidr-saudi', name: 'عسل السدر الجبلي سعودي', family: 'sidr', origin: 'السعودية', short: 'سدر جبلي سعودي.', variants: [Q(350), H(600)], tags: ['strong'] },
  { slug: 'sidr-libyan', name: 'عسل السدر الجبلي ليبي', family: 'sidr', origin: 'ليبيا', short: 'سدر جبلي ليبي.', variants: [Q(350), H(600)], tags: ['strong'] },
  { slug: 'sidr-murr-hanoun', name: 'عسل السدر الجبلي مر حنون', family: 'sidr', short: 'سدر جبلي مر حنون.', variants: [Q(390), H(660)], tags: ['strong'] },
  { slug: 'sidr-thyme', name: 'عسل السدر الجبلي زعتر', family: 'sidr', short: 'سدر جبلي بنكهة الزعتر.', variants: [Q(350), H(600)], tags: ['strong'] },
  { slug: 'sidr-hadrami', name: 'عسل السدر الجبلي حضرمي يمني', family: 'sidr', origin: 'اليمن', short: 'سدر حضرمي من اليمن.', variants: [Q(750), H(1300)], tags: ['strong', 'gift'] },
  { slug: 'sidr-doani', name: 'عسل السدر الجبلي دوعني', family: 'sidr', origin: 'اليمن', short: 'سدر دوعني، من أندر أنواع السدر.', variants: [Q(850), H(1500)], featured: true, tags: ['strong', 'gift'] },
  { slug: 'sidr-osaimi', name: 'عسل السدر العصيمي', family: 'sidr', short: 'سدر عصيمي فاخر.', variants: [Q(1200), H(2100)], tags: ['strong', 'gift'] },
  { slug: 'mountain-egyptian-clips', name: 'جبلي مصري كلبس', family: 'sidr', origin: 'مصر', short: 'عسل جبلي مصري في عبوة كلبس.', variants: [Q(270), H(370), K(650)], tags: ['strong'] },
  { slug: 'mountain-wild-clips', name: 'جبلي بري كلبس', family: 'sidr', short: 'عسل جبلي بري في عبوة كلبس.', variants: [G(250, 290), G(500, 400), K(700)], tags: ['strong'] },
  { slug: 'mountain-saudi-clips', name: 'جبلي سعودي كلبس', family: 'sidr', origin: 'السعودية', short: 'عسل جبلي سعودي في عبوة كلبس.', variants: [G(250, 475), G(500, 790)], tags: ['strong'] },
  { slug: 'mountain-murr-hanoun-clips', name: 'جبلي مرحنون كلبس', family: 'sidr', short: 'عسل جبلي مرحنون في عبوة كلبس.', variants: [G(250, 515), G(500, 850)], tags: ['strong'] },
  // ---- manuka (quarter kilo each)
  { slug: 'manuka-umf-5', name: 'عسل مانوكا UMF 5', family: 'manuka', short: 'مانوكا بدرجة UMF 5.', variants: [Q(1500)], tags: ['gift'] },
  { slug: 'manuka-umf-10', name: 'عسل مانوكا UMF 10', family: 'manuka', short: 'مانوكا بدرجة UMF 10.', variants: [Q(2500)], tags: ['gift'] },
  { slug: 'manuka-umf-15', name: 'عسل مانوكا UMF 15', family: 'manuka', short: 'مانوكا بدرجة UMF 15.', variants: [Q(4000)], featured: true, tags: ['gift'] },
  { slug: 'manuka-umf-18', name: 'عسل مانوكا UMF 18', family: 'manuka', short: 'مانوكا بدرجة UMF 18، أعلى درجة عندنا.', variants: [Q(5000)], tags: ['gift'] },
  // ---- export grade
  { slug: 'clover-export', name: 'عسل نوارة البرسيم للتصدير', family: 'export', short: 'عسل برسيم خفيف للسفرة اليومية.', variants: [Q(65), H(110), K(195), J(950)], featured: true, tags: ['light', 'wholesale'] },
  { slug: 'citrus-export', name: 'عسل موالح للتصدير', family: 'export', short: 'عسل زهر الموالح بطعم منعش.', variants: [Q(70), H(125), K(220), J(1050)], tags: ['light', 'wholesale'] },
  { slug: 'black-seed-export', name: 'عسل حبة البركة للتصدير', family: 'export', short: 'عسل حبة البركة بطعم قوي.', variants: [Q(75), H(125), K(220), J(1050)], tags: ['strong', 'wholesale'] },
  { slug: 'desert-export', name: 'عسل صحراوي تصدير', family: 'export', short: 'عسل صحراوي.', variants: [H(130), K(230), J(1100)], tags: ['wholesale'] },
  { slug: 'marjoram-export', name: 'عسل بردقوش للتصدير', family: 'export', short: 'عسل زهر البردقوش.', variants: [H(125), K(220)] },
  { slug: 'medicinal-plants-export', name: 'عسل النباتات الطبية', family: 'export', short: 'عسل من زهور النباتات الطبية.', variants: [H(130), K(230)] },
  { slug: 'baladi-export', name: 'عسل بلدي للتصدير', family: 'export', short: 'عسل بلدي.', variants: [H(120), K(215)] },
  { slug: 'comb-export', name: 'عسل بالشمع للتصدير', family: 'export', short: 'عسل بقطع الشمع.', variants: [H(125), K(230)] },
  // ---- zero sucrose
  { slug: 'clover-zero', name: 'عسل نوارة البرسيم زيرو سكروز', family: 'zero-sucrose', short: 'برسيم بنسبة سكروز صفر.', variants: [Q(95), H(160), K(290)], tags: ['no-sucrose', 'light'] },
  { slug: 'citrus-zero', name: 'عسل الموالح زيرو سكروز', family: 'zero-sucrose', short: 'موالح بنسبة سكروز صفر.', variants: [Q(100), H(175), K(310)], tags: ['no-sucrose', 'light'] },
  { slug: 'desert-zero', name: 'عسل صحراوي زيرو سكروز', family: 'zero-sucrose', short: 'صحراوي بنسبة سكروز صفر.', variants: [Q(110), H(185), K(330)], tags: ['no-sucrose'] },
  { slug: 'marjoram-zero', name: 'عسل البردقوش زيرو سكروز', family: 'zero-sucrose', short: 'بردقوش بنسبة سكروز صفر.', variants: [H(175), K(310)], tags: ['no-sucrose'] },
  { slug: 'black-seed-zero', name: 'عسل حبة البركة زيرو سكروز', family: 'zero-sucrose', short: 'حبة البركة بنسبة سكروز صفر.', variants: [H(175), K(310)], tags: ['no-sucrose', 'strong'] },
  { slug: 'medicinal-plants-zero', name: 'عسل نباتات طبية زيرو سكروز', family: 'zero-sucrose', short: 'نباتات طبية بنسبة سكروز صفر.', variants: [H(180), K(320)], tags: ['no-sucrose'] },
  { slug: 'baladi-zero', name: 'عسل بلدي زيرو سكروز', family: 'zero-sucrose', short: 'بلدي بنسبة سكروز صفر.', variants: [H(180), K(320)], tags: ['no-sucrose'] },
  { slug: 'comb-zero', name: 'عسل نحل بالشمع زيرو سكروز', family: 'zero-sucrose', short: 'عسل بالشمع بنسبة سكروز صفر.', variants: [H(215)], tags: ['no-sucrose'] },
  // ---- hive products
  { slug: 'royal-jelly-imported', name: 'غذاء ملكات النحل مستورد', family: 'hive', short: 'غذاء ملكات مستورد.', variants: [G(5, 80)] },
  { slug: 'royal-jelly-baladi', name: 'غذاء ملكات النحل بلدي', family: 'hive', short: 'غذاء ملكات بلدي.', variants: [G(5, 125)] },
  { slug: 'bee-pollen', name: 'حبوب لقاح النحل', family: 'hive', short: 'حبوب لقاح النحل.', variants: [{ label: 'العبوة', grams: 0, price: 70 }] },
  { slug: 'propolis', name: 'بروبليس', family: 'hive', short: 'صمغ النحل (بروبوليس).', variants: [G(10, 75)] },
  { slug: 'ginseng-white', name: 'الجنسنج الأبيض', family: 'hive', short: 'جنسنج أبيض.', variants: [G(10, 75)] },
  { slug: 'ginseng-red', name: 'الجنسنج الأحمر', family: 'hive', short: 'جنسنج أحمر.', variants: [G(10, 125)] },
  { slug: 'palm-pollen', name: 'طلع النخل', family: 'hive', short: 'طلع النخل.', variants: [G(20, 150)] },
  { slug: 'beeswax-box', name: 'علبة شمع العسل', family: 'hive', short: 'شمع عسل طبيعي.', variants: [H(115)] },
  // ---- mixes & nuts
  { slug: 'weight-gain-mix', name: 'خلطة العسل الطبيعية لزيادة الوزن', family: 'mixes-nuts', short: 'خلطة عسل طبيعية.', variants: [H(125), K(230)] },
  { slug: 'kids-royal-jelly-honey', name: 'عسل بغذاء ملكات النحل للأطفال', family: 'mixes-nuts', short: 'عسل بغذاء الملكات للأطفال.', variants: [H(140)] },
  { slug: 'honey-nuts', name: 'عسل بالمكسرات', family: 'mixes-nuts', short: 'عسل بالمكسرات.', variants: [H(105)] },
  { slug: 'power-honey', name: 'Power Honey', family: 'mixes-nuts', short: 'Power Honey.', variants: [{ label: 'العبوة', grams: 0, price: 40 }] },
  { slug: 'nuts-hazelnut', name: 'مكسرات بندق', family: 'mixes-nuts', short: 'بندق.', variants: [G(200, 245), G(350, 400)] },
  { slug: 'nuts-almond', name: 'مكسرات لوز', family: 'mixes-nuts', short: 'لوز.', variants: [G(200, 185), G(350, 305)] },
  { slug: 'nuts-cashew', name: 'مكسرات كاجو', family: 'mixes-nuts', short: 'كاجو.', variants: [G(200, 215), G(350, 360)] },
  { slug: 'nuts-pistachio', name: 'مكسرات فستق', family: 'mixes-nuts', short: 'فستق.', variants: [G(200, 230), G(350, 390)] },
  { slug: 'nuts-walnut', name: 'مكسرات عين جمل', family: 'mixes-nuts', short: 'عين جمل.', variants: [G(200, 195), G(350, 325)] },
  { slug: 'nuts-mixed', name: 'مكسرات مشكل', family: 'mixes-nuts', short: 'مكسرات مشكلة.', variants: [G(200, 210), G(350, 345)] },
];

export const PRODUCTS: Product[] = seeds.map((s) => ({ ...s, image: `/images/products/${s.slug}.webp` }));

export function byFamily(id: FamilyId): Product[] {
  return PRODUCTS.filter((p) => p.family === id);
}

export function bySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function fromPrice(p: Product): number {
  return Math.min(...p.variants.map((v) => v.price));
}

export function familyById(id: FamilyId) {
  return FAMILIES.find((f) => f.id === id)!;
}
