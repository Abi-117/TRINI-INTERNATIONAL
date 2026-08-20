import type { Category, Product, Coupon, Review } from "@/types";

import catRc from "@/assets/cat-rc.jpg";
// import catDrone from "@/assets/cat-drone.jpg";
import catJewellery from "@/assets/cat-jewellery.jpg";
import catBags from "@/assets/cat-bags.jpg";
import catGadgets from "@/assets/cat-gadgets.jpg";
import catToys from "@/assets/cat-toys.jpg";
import catStationery from "@/assets/cat-stationery.jpg";
import catDiecast from "@/assets/cat-diecast.jpg";
import catBlaster from "@/assets/cat-blaster.jpg";

export const categories: Category[] = [
  { id: "c1", slug: "rc-cars", name: "RC Cars", description: "Radio controlled performance machines", image: catRc, productCount: 42 },
  { id: "c2", slug: "drift-cars", name: "Drift Cars", description: "Tail-happy drift specialists", image: catRc, productCount: 18 },
  // { id: "c3", slug: "drones", name: "Drones", description: "Camera drones & FPV racers", image: catDrone, productCount: 24 },
  { id: "c4", slug: "gel-blasters", name: "Gel Blasters", description: "Tactical gel blaster gear", image: catBlaster, productCount: 16 },
  { id: "c5", slug: "die-cast", name: "Licensed Die Cast", description: "Officially licensed scale models", image: catDiecast, productCount: 65 },
  { id: "c6", slug: "soft-toys", name: "Soft Toys", description: "Ultra-soft imported plush", image: catToys, productCount: 38 },
  { id: "c7", slug: "jewellery", name: "Jewellery", description: "Fashion jewellery with a luxe finish", image: catJewellery, productCount: 54 },
  { id: "c8", slug: "bags", name: "Bags", description: "Travel, school & designer bags", image: catBags, productCount: 31 },
  { id: "c9", slug: "gadgets", name: "Gadgets", description: "Audio, wearables & gaming gear", image: catGadgets, productCount: 47 },
  { id: "c10", slug: "stationery", name: "Korean Stationery", description: "Cute, collectible & premium", image: catStationery, productCount: 72 },
];

const sampleReviews = (seed: number): Review[] => [
  {
    id: `r${seed}-1`,
    author: "Arjun R.",
    rating: 5,
    title: "Genuine imported quality",
    body: "Packaging was premium and the product feels exactly like the showroom piece. Dispatched the same day from Trichy.",
    createdAt: "2026-05-12T10:00:00Z",
    verified: true,
  },
  {
    id: `r${seed}-2`,
    author: "Divya S.",
    rating: 4,
    title: "Worth the price",
    body: "Great build and finish. Delivery took 3 days to Chennai, support answered on WhatsApp instantly.",
    createdAt: "2026-04-28T10:00:00Z",
    verified: true,
  },
  {
    id: `r${seed}-3`,
    author: "Mohammed F.",
    rating: 5,
    title: "Kids are obsessed",
    body: "Bought as a birthday gift, the quality is far above anything available locally.",
    createdAt: "2026-03-18T10:00:00Z",
  },
];

interface Seed {
  title: string;
  brand: string;
  cat: string;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  stock: number;
  age: string;
  image: string;
  tags: Product["tags"];
}

const seeds: Seed[] = [
  { title: "Velocity X1 Pro 4WD Drift RC Car", brand: "Trini Motorsport", cat: "drift-cars", price: 8499, mrp: 12999, rating: 4.8, reviews: 214, stock: 12, age: "8+", image: catRc, tags: ["flash-sale", "featured", "best-seller"] },
  { title: "Hyper Rally 1:10 Brushless RC Buggy", brand: "Kyoto RC", cat: "rc-cars", price: 14999, mrp: 19999, rating: 4.7, reviews: 148, stock: 7, age: "12+", image: catRc, tags: ["featured", "trending"] },
  { title: "Nitro Street King High Speed 60KMPH", brand: "Trini Motorsport", cat: "rc-cars", price: 6299, mrp: 8999, rating: 4.5, reviews: 96, stock: 21, age: "8+", image: catRc, tags: ["todays-deal", "best-seller"] },
  // { title: "SkyVision Pro 4K Foldable Camera Drone", brand: "AeroX", cat: "drones", price: 24999, mrp: 32999, rating: 4.9, reviews: 322, stock: 5, age: "14+", image: catDrone, tags: ["featured", "new-arrival", "trending"] },
  // { title: "FPV Racer Mini Drone with Goggles", brand: "AeroX", cat: "drones", price: 11499, mrp: 15499, rating: 4.4, reviews: 87, stock: 14, age: "14+", image: catDrone, tags: ["flash-sale"] },
  { title: "Tactical Gel Blaster MK-9 Electric", brand: "StormLine", cat: "gel-blasters", price: 4299, mrp: 6499, rating: 4.3, reviews: 132, stock: 30, age: "14+", image: catBlaster, tags: ["todays-deal", "trending"] },
  { title: "Gel Blaster Recon Pistol Kit", brand: "StormLine", cat: "gel-blasters", price: 2499, mrp: 3799, rating: 4.2, reviews: 58, stock: 44, age: "14+", image: catBlaster, tags: ["best-seller"] },
  { title: "Officially Licensed 1:18 GT Supercar", brand: "AutoLegend", cat: "die-cast", price: 5499, mrp: 7499, rating: 4.9, reviews: 265, stock: 9, age: "6+", image: catDiecast, tags: ["featured", "best-seller"] },
  { title: "Die Cast Heritage Racing Set of 5", brand: "AutoLegend", cat: "die-cast", price: 3199, mrp: 4599, rating: 4.6, reviews: 141, stock: 26, age: "6+", image: catDiecast, tags: ["todays-deal"] },
  { title: "Cloud Hug Premium Plush Bear 60cm", brand: "Momoi", cat: "soft-toys", price: 1899, mrp: 2999, rating: 4.8, reviews: 402, stock: 60, age: "3+", image: catToys, tags: ["best-seller", "trending"] },
  { title: "Pastel Dream Soft Toy Gift Bundle", brand: "Momoi", cat: "soft-toys", price: 2499, mrp: 3499, rating: 4.5, reviews: 118, stock: 33, age: "3+", image: catToys, tags: ["new-arrival"] },
  { title: "Aurelia 18K Gold Plated Necklace Set", brand: "Maison Trini", cat: "jewellery", price: 3499, mrp: 5999, rating: 4.7, reviews: 289, stock: 18, age: "Adults", image: catJewellery, tags: ["featured", "flash-sale"] },
  { title: "Solitaire Shine Zircon Earrings", brand: "Maison Trini", cat: "jewellery", price: 1299, mrp: 2299, rating: 4.6, reviews: 176, stock: 40, age: "Adults", image: catJewellery, tags: ["best-seller"] },
  { title: "Regal Kundan Bridal Jewellery Set", brand: "Maison Trini", cat: "jewellery", price: 6999, mrp: 10999, rating: 4.9, reviews: 91, stock: 6, age: "Adults", image: catJewellery, tags: ["new-arrival", "trending"] },
  { title: "Voyager Anti-Theft Travel Backpack", brand: "Nordfell", cat: "bags", price: 3299, mrp: 4999, rating: 4.6, reviews: 233, stock: 28, age: "Adults", image: catBags, tags: ["featured", "todays-deal"] },
  { title: "Metropolis Weekender Duffle", brand: "Nordfell", cat: "bags", price: 4599, mrp: 6999, rating: 4.5, reviews: 84, stock: 15, age: "Adults", image: catBags, tags: ["new-arrival"] },
  { title: "Pulse Buds Pro ANC Wireless Earbuds", brand: "Sonarq", cat: "gadgets", price: 3999, mrp: 6999, rating: 4.7, reviews: 512, stock: 55, age: "12+", image: catGadgets, tags: ["flash-sale", "best-seller", "trending"] },
  { title: "Apex Gaming Mouse 26K DPI RGB", brand: "Sonarq", cat: "gadgets", price: 2799, mrp: 4299, rating: 4.6, reviews: 198, stock: 37, age: "12+", image: catGadgets, tags: ["featured"] },
  { title: "Chrono Fit Amoled Smartwatch", brand: "Sonarq", cat: "gadgets", price: 4499, mrp: 7999, rating: 4.4, reviews: 305, stock: 24, age: "12+", image: catGadgets, tags: ["todays-deal", "new-arrival"] },
  { title: "Seoul Series Premium Stationery Kit", brand: "Hanui", cat: "stationery", price: 1499, mrp: 2299, rating: 4.8, reviews: 367, stock: 80, age: "6+", image: catStationery, tags: ["best-seller", "featured"] },
  { title: "Pastel Ink Gel Pen Collection (12)", brand: "Hanui", cat: "stationery", price: 649, mrp: 999, rating: 4.7, reviews: 421, stock: 120, age: "6+", image: catStationery, tags: ["trending"] },
  { title: "Sticker Studio Deluxe Journal Box", brand: "Hanui", cat: "stationery", price: 1099, mrp: 1699, rating: 4.6, reviews: 155, stock: 64, age: "6+", image: catStationery, tags: ["new-arrival", "todays-deal"] },
  { title: "Track Master 1:8 Monster Truck RC", brand: "Kyoto RC", cat: "rc-cars", price: 17999, mrp: 23999, rating: 4.8, reviews: 76, stock: 4, age: "12+", image: catRc, tags: ["new-arrival", "trending"] },
  { title: "Drift Legend RWD Tuner Edition", brand: "Trini Motorsport", cat: "drift-cars", price: 10999, mrp: 14999, rating: 4.7, reviews: 63, stock: 11, age: "12+", image: catRc, tags: ["featured"] },
];

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const products: Product[] = seeds.map((s, i) => {
  const category = categories.find((c) => c.slug === s.cat)!;
  return {
    id: `p${i + 1}`,
    slug: slugify(s.title),
    title: s.title,
    brand: s.brand,
    category: category.name,
    categorySlug: category.slug,
    description: `The ${s.title} is part of the Trini International premium imported range. Hand-picked for build quality, finish and long-term reliability, every unit is inspected in our Trichy - Puthur facility before same-day dispatch. Backed by genuine-product assurance and fast customer support.`,
    highlights: [
      "100% genuine imported product",
      "Same day dispatch before 4 PM",
      "Premium gift-ready packaging",
      "Delivery across India",
    ],
    specifications: {
      Brand: s.brand,
      Category: category.name,
      "Age Group": s.age,
      "Country of Origin": "Imported",
      Warranty: "6 months brand warranty",
      "In the Box": "Product, manual, accessories",
    },
    price: s.price,
    mrp: s.mrp,
    rating: s.rating,
    reviewCount: s.reviews,
    stock: s.stock,
    ageGroup: s.age,
    images: [s.image, s.image, s.image],
    colors: [
      { id: "col-1", label: "Color", value: "Obsidian", inStock: true },
      { id: "col-2", label: "Color", value: "Neon Cyan", inStock: true },
      { id: "col-3", label: "Color", value: "Magenta", inStock: s.stock > 10 },
    ],
    sizes:
      s.cat === "bags" || s.cat === "soft-toys"
        ? [
            { id: "sz-1", label: "Size", value: "Standard", inStock: true },
            { id: "sz-2", label: "Size", value: "Large", inStock: true, priceDelta: 700 },
          ]
        : undefined,
    tags: s.tags,
    reviews: sampleReviews(i + 1),
  };
});

export const brands = Array.from(new Set(products.map((p) => p.brand))).sort();
export const ageGroups = ["3+", "6+", "8+", "12+", "14+", "Adults"];

export const coupons: Coupon[] = [
  { code: "TRINI10", type: "percent", value: 10, minSubtotal: 1500, description: "10% off on orders above ₹1,500" },
  { code: "PREMIUM500", type: "flat", value: 500, minSubtotal: 4000, description: "Flat ₹500 off above ₹4,000" },
  { code: "TRICHY15", type: "percent", value: 15, minSubtotal: 8000, description: "15% off above ₹8,000" },
];

export const collections = [
  { slug: "rc-racing", title: "RC Racing Collection", blurb: "Brushless power, race-tuned chassis", image: catRc, categorySlug: "rc-cars" },
  { slug: "luxury-jewellery", title: "Luxury Jewellery", blurb: "Gold-finish statement pieces", image: catJewellery, categorySlug: "jewellery" },
  { slug: "travel-bags", title: "Travel Bags", blurb: "Built for the long haul", image: catBags, categorySlug: "bags" },
  { slug: "gaming-gadgets", title: "Gaming Gadgets", blurb: "Low latency. High drama.", image: catGadgets, categorySlug: "gadgets" },
  { slug: "korean-stationery", title: "Korean Stationery", blurb: "Collectible desk culture", image: catStationery, categorySlug: "stationery" },
  { slug: "premium-toys", title: "Premium Toys", blurb: "Imported joy, ages 3 to adult", image: catToys, categorySlug: "soft-toys" },
];

export const testimonials = [
  { name: "Karthik Subramanian", city: "Trichy", rating: 5, text: "Ordered a 1:10 brushless RC. Dispatched same day, arrived flawless. Easily the most premium toy store experience in Tamil Nadu." },
  { name: "Sneha Iyer", city: "Coimbatore", rating: 5, text: "The jewellery finish is unreal for the price. Packaging looked like a luxury brand unboxing." },
  { name: "Rahul Menon", city: "Bengaluru", rating: 4, text: "Drone came genuine with bill and warranty. Support cleared my queries on call within minutes." },
  { name: "Aishwarya P.", city: "Chennai", rating: 5, text: "Korean stationery collection is addictive. My third order this quarter." },
  { name: "Vignesh K.", city: "Madurai", rating: 5, text: "Die cast models are officially licensed and sealed. Trustworthy seller." },
  { name: "Fathima N.", city: "Salem", rating: 5, text: "Gifted a soft toy bundle — the quality made it look far costlier than it was." },
];

export const popularSearches = [
  "Drift RC car",
  // "4K drone",
  "Gel blaster",
  "Die cast 1:18",
  "Gold plated necklace",
  "Travel backpack",
  "Wireless earbuds",
  "Korean pens",
];

export const instagramGallery = [
  catRc,
  catJewellery,
  // catDrone,
  catGadgets,
  catBags,
  catToys,
  catDiecast,
  catStationery,
];
