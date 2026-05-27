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
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  emoji: string;
  rating: number;
  deliveryTime: string;
  minOrder: number;
  freeDelivery: boolean;
  items: FoodItem[];
}

export const categories = [
  { id: "all", label: "Alle", emoji: "🍽️" },
  { id: "burger", label: "Burger", emoji: "🍔" },
  { id: "pizza", label: "Pizza", emoji: "🍕" },
  { id: "sushi", label: "Sushi", emoji: "🍣" },
  { id: "pasta", label: "Pasta", emoji: "🍝" },
  { id: "salad", label: "Salate", emoji: "🥗" },
  { id: "dessert", label: "Desserts", emoji: "🍰" },
  { id: "drinks", label: "Getränke", emoji: "🥤" },
];

export const menuItems: FoodItem[] = [
  {
    id: "b1",
    name: "Zestly Signature Burger",
    description: "Doppeltes Wagyu-Patty, geschmolzener Comté, karamellisierte Zwiebeln, geheime Zestly-Sauce",
    price: 14.9,
    category: "burger",
    emoji: "🍔",
    rating: 4.9,
    reviews: 2341,
    time: "25 Min",
    tag: "Bestseller",
    popular: true,
  },
  {
    id: "b2",
    name: "Crispy Chicken Deluxe",
    description: "Knuspriges buttermilch-mariniertes Hühnchen, Avocado-Aioli, pickled jalapeños",
    price: 12.9,
    category: "burger",
    emoji: "🐔",
    rating: 4.7,
    reviews: 1876,
    time: "20 Min",
    tag: "Neu",
  },
  {
    id: "p1",
    name: "Truffle Margherita",
    description: "Trüffelöl, Büffel-Mozzarella, frisches Basilikum, San-Marzano-Tomaten",
    price: 16.5,
    category: "pizza",
    emoji: "🍕",
    rating: 4.8,
    reviews: 3102,
    time: "30 Min",
    tag: "Premium",
    popular: true,
  },
  {
    id: "p2",
    name: "4-Käse Inferno",
    description: "Gorgonzola, Taleggio, Mozzarella, Parmesan, Honig-Drizzle",
    price: 15.9,
    category: "pizza",
    emoji: "🧀",
    rating: 4.6,
    reviews: 987,
    time: "28 Min",
  },
  {
    id: "s1",
    name: "Dragon Roll Premium",
    description: "Lachs, Avocado, Gurke, Sriracha-Mayo, Tobiko",
    price: 18.9,
    category: "sushi",
    emoji: "🍣",
    rating: 4.9,
    reviews: 4211,
    time: "35 Min",
    tag: "Top",
    popular: true,
  },
  {
    id: "s2",
    name: "Sashimi Omakase",
    description: "12 Stück frischestes Tagesangebot, Wasabi, eingelegter Ingwer",
    price: 24.9,
    category: "sushi",
    emoji: "🐟",
    rating: 5.0,
    reviews: 1543,
    time: "40 Min",
    tag: "Chef's Choice",
  },
  {
    id: "pa1",
    name: "Carbonara Originale",
    description: "Pasta alla chitarra, Guanciale, Pecorino Romano, schwarzer Pfeffer – authentisch römisch",
    price: 13.9,
    category: "pasta",
    emoji: "🍝",
    rating: 4.8,
    reviews: 2099,
    time: "25 Min",
    popular: true,
  },
  {
    id: "pa2",
    name: "Lobster Linguine",
    description: "Frischer Hummer, Knoblauch-Bisque, Cherry-Tomaten, frisches Basilikum",
    price: 28.9,
    category: "pasta",
    emoji: "🦞",
    rating: 4.7,
    reviews: 876,
    time: "30 Min",
    tag: "Luxus",
  },
  {
    id: "sa1",
    name: "Power Bowls",
    description: "Quinoa, geröstete Süßkartoffeln, Avocado, Edamame, Tahini-Dressing",
    price: 11.9,
    category: "salad",
    emoji: "🥗",
    rating: 4.6,
    reviews: 1234,
    time: "15 Min",
    tag: "Gesund",
  },
  {
    id: "d1",
    name: "Crème Brûlée Tarte",
    description: "Karamellisierte Vanillecreme, frische Beeren, Feuilletine-Boden",
    price: 8.9,
    category: "dessert",
    emoji: "🍮",
    rating: 4.9,
    reviews: 3421,
    time: "15 Min",
    tag: "Liebling",
    popular: true,
  },
  {
    id: "d2",
    name: "Mochi Trio",
    description: "Matcha, Erdbeere, Mango – handgemacht, cremig, zart",
    price: 7.9,
    category: "dessert",
    emoji: "🍡",
    rating: 4.8,
    reviews: 2109,
    time: "10 Min",
  },
  {
    id: "dr1",
    name: "Zestly Signature Shake",
    description: "Mango-Passionsfrucht, Kokosmilch, frische Minze – unser Hausgetränk",
    price: 6.9,
    category: "drinks",
    emoji: "🥤",
    rating: 4.7,
    reviews: 1876,
    time: "10 Min",
    tag: "Exklusiv",
  },
];

export const stats = [
  { value: "12 Min", label: "Ø Lieferzeit", emoji: "⚡" },
  { value: "500+", label: "Gerichte", emoji: "🍽️" },
  { value: "4.9★", label: "Bewertung", emoji: "⭐" },
  { value: "50k+", label: "Kunden", emoji: "❤️" },
];

export const features = [
  {
    emoji: "⚡",
    title: "Blitzschnell",
    desc: "Durchschnittlich 12 Minuten. Kein Witz. Unser KI-optimiertes Routing macht es möglich.",
  },
  {
    emoji: "🔥",
    title: "Immer heiß",
    desc: "Unsere Thermo-Smart-Box hält alles auf perfekter Temperatur – von Küche zu dir.",
  },
  {
    emoji: "🎯",
    title: "Echtzeit-Tracking",
    desc: "Sieh deinen Fahrer live auf der Karte. Sekundengenau. Immer informiert.",
  },
  {
    emoji: "💎",
    title: "Premium-Qualität",
    desc: "Nur Restaurants, die unsere strengen Qualitätsstandards erfüllen. Dein Genuss, garantiert.",
  },
];
