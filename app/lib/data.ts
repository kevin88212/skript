export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  emoji: string;
  rating: number;
  reviews: number;
  time: string;
  tag?: string;
  popular?: boolean;
  unit?: string;
  origin?: string;
}

export const categories = [
  { id: "all", label: "Alles", emoji: "🛒" },
  { id: "obst", label: "Obst", emoji: "🍎" },
  { id: "gemuese", label: "Gemüse", emoji: "🥦" },
  { id: "nudeln", label: "Nudeln & Teig", emoji: "🍝" },
  { id: "regional", label: "Regional", emoji: "🏡" },
  { id: "kraeuter", label: "Kräuter", emoji: "🌿" },
  { id: "milch", label: "Milch & Käse", emoji: "🧀" },
];

export const menuItems: FoodItem[] = [
  {
    id: "o1", name: "Erdbeeren", category: "obst", emoji: "🍓",
    description: "Sonnengereift vom Hof Bergmann, 45 km von Berlin. Saftig süß, keine Pestizide.",
    price: 3.9, rating: 4.9, reviews: 3241, time: "30 Min", tag: "Saison", popular: true,
    unit: "500g", origin: "Hof Bergmann, Brandenburg",
  },
  {
    id: "o2", name: "Äpfel Cox Orange", category: "obst", emoji: "🍎",
    description: "Alte Apfelsorte, knackig und aromatisch. Direktlieferung vom Obstgarten.",
    price: 2.9, rating: 4.7, reviews: 1876, time: "30 Min", unit: "1kg", origin: "Obsthof Ritter, Werder",
  },
  {
    id: "o3", name: "Heidelbeeren", category: "obst", emoji: "🫐",
    description: "Prall, aromatisch, direkt aus Brandenburg. Perfekt für Müsli oder pur.",
    price: 4.5, rating: 4.8, reviews: 2109, time: "30 Min", tag: "Beliebt", popular: true,
    unit: "250g", origin: "Beerbaum, Brandenburg",
  },
  {
    id: "g1", name: "Brokkoli", category: "gemuese", emoji: "🥦",
    description: "Frisch geerntet, festes Köpfchen. Reich an Vitaminen C und K.",
    price: 1.99, rating: 4.6, reviews: 987, time: "30 Min", unit: "1 Stück (ca. 600g)", origin: "Gemüsehof Schulze, Havelland",
  },
  {
    id: "g2", name: "Tomaten-Mix", category: "gemuese", emoji: "🍅",
    description: "Bunte Mischung: Kirschtomaten, Fleischtomaten, Grüne. Vom Gewächshof.",
    price: 3.5, rating: 4.9, reviews: 4211, time: "30 Min", tag: "Bestseller", popular: true,
    unit: "750g", origin: "Glashäuser Nürnberg, Berlin-Nah",
  },
  {
    id: "g3", name: "Karotten-Bund", category: "gemuese", emoji: "🥕",
    description: "Junges Bund mit Grün. Süß, knackig — direkt aus dem Freilandanbau.",
    price: 1.49, rating: 4.7, reviews: 2344, time: "30 Min", unit: "Bund ~500g", origin: "Bio-Gärtnerei Kohl, Potsdam",
  },
  {
    id: "g4", name: "Spinat", category: "gemuese", emoji: "🥬",
    description: "Junger Blattspinat, zart und mild. Erntefrisch, bereits gewaschen.",
    price: 2.49, rating: 4.5, reviews: 876, time: "30 Min", unit: "200g Beutel", origin: "Gemüsering Berlin",
  },
  {
    id: "n1", name: "Tagliatelle all'uovo", category: "nudeln", emoji: "🍝",
    description: "Handgemachte Pasta aus regionalem Freilandei-Mehl. Pasta-Manufaktur Berlin.",
    price: 3.9, rating: 5.0, reviews: 1543, time: "30 Min", tag: "Handgemacht", popular: true,
    unit: "250g", origin: "Pasta Manufaktur Prenzlberg",
  },
  {
    id: "n2", name: "Vollkorn-Spaghetti", category: "nudeln", emoji: "🌾",
    description: "Aus regionalem Vollkornweizen, langsam getrocknet. Nussig, sättigend.",
    price: 2.9, rating: 4.7, reviews: 1102, time: "30 Min", unit: "500g",
    origin: "Mühle Havelland",
  },
  {
    id: "n3", name: "Dinkel-Penne", category: "nudeln", emoji: "🍽️",
    description: "Aus altem Dinkelkorn — bekömmlicher als Weizen, nussiger Geschmack.",
    price: 3.2, rating: 4.6, reviews: 788, time: "30 Min", unit: "400g", origin: "Dinkelwerk Sachsen",
  },
  {
    id: "r1", name: "Teltower Rübchen", category: "regional", emoji: "🫚",
    description: "Die legendäre Brandenburger Rarität. Einzigartiger milder Geschmack — nirgendwo sonst.",
    price: 4.9, rating: 4.9, reviews: 3421, time: "30 Min", tag: "Rarität", popular: true,
    unit: "500g", origin: "Teltow, Brandenburg",
  },
  {
    id: "r2", name: "Märkisches Landbrot", category: "regional", emoji: "🍞",
    description: "Sauerteig-Roggenbrot nach alter Familienrezeptur. Täglich frisch gebacken.",
    price: 5.5, rating: 4.9, reviews: 2876, time: "30 Min", tag: "Frisch", popular: true,
    unit: "750g Laib", origin: "Bäckerei Wilde, Zossen",
  },
  {
    id: "m1", name: "Frische Vollmilch", category: "milch", emoji: "🥛",
    description: "Direkt vom Betrieb, Vorzugsmilch unhomogenisiert. Sahne oben drauf.",
    price: 1.8, rating: 4.8, reviews: 1987, time: "30 Min", unit: "1 Liter",
    origin: "Gut Groß Machnow, Blankenfelde",
  },
  {
    id: "m2", name: "Brandenburger Quark", category: "milch", emoji: "🧀",
    description: "Cremiger Magerquark aus regionaler Molkerei. Ideal zum Kochen oder Frühstück.",
    price: 1.5, rating: 4.6, reviews: 1234, time: "30 Min", unit: "500g",
    origin: "Molkerei Löhme, Barnim",
  },
  {
    id: "k1", name: 'Kräuter-Mix "Küche"', category: "kraeuter", emoji: "🌿",
    description: "Basilikum, Petersilie, Schnittlauch, Rosmarin — frisch geschnitten, gebündelt.",
    price: 2.2, rating: 4.7, reviews: 1543, time: "30 Min", tag: "Frisch",
    unit: "Bund gemischt", origin: "Kräutergarten Wannsee",
  },
];

export const stats = [
  { value: "30 Min", label: "Lieferzeit", emoji: "⚡" },
  { value: "120+", label: "Regionale Produkte", emoji: "🌱" },
  { value: "4.9★", label: "Bewertung", emoji: "⭐" },
  { value: "35+", label: "Lokale Erzeuger", emoji: "🏡" },
];

export const features = [
  {
    emoji: "🌱",
    title: "Direkt vom Erzeuger",
    desc: "Kein Großhandel, kein Umweg. Wir arbeiten direkt mit über 35 regionalen Höfen und Manufakturen zusammen.",
  },
  {
    emoji: "⚡",
    title: "In 30 Minuten da",
    desc: "Frisch geerntet heute Morgen, bei dir am Mittag. Unser Kühltransport hält alles auf optimaler Temperatur.",
  },
  {
    emoji: "📅",
    title: "Saisonal & ehrlich",
    desc: "Wir liefern was gerade reif ist — kein Import aus Übersee, kein Treibhausgemüse im Winter.",
  },
  {
    emoji: "💚",
    title: "Null Plastik",
    desc: "100% plastikfreie Verpackung — Papier, Baumwolle, Glas. Gut für dich, gut für Brandenburg.",
  },
];
