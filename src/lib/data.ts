import type { Category, MenuItem } from "./types";

export const CATEGORIES: Category[] = [
  { id: "bowls", label: "Grain Bowls" },
  { id: "salads", label: "Salads" },
  { id: "juice", label: "Cold-Press" },
  { id: "sides", label: "Sides & Snacks" },
];

export const MENU: MenuItem[] = [
  {
    id: "b1", cat: "bowls", name: "Harvest Quinoa Bowl", price: 13.5,
    desc: "Tri-color quinoa, roasted squash, kale, pomegranate, tahini-maple drizzle.",
    tags: ["Vegan", "High protein"], g: ["#E9B44C", "#C97A3B"], kcal: 540,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
  },
  {
    id: "b2", cat: "bowls", name: "Miso Ginger Power Bowl", price: 14.0,
    desc: "Brown rice, edamame, avocado, pickled carrot, crispy chickpeas, miso-ginger.",
    tags: ["Vegan", "GF"], g: ["#8FBF6E", "#3F7D4E"], kcal: 610,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
  },
  {
    id: "b3", cat: "bowls", name: "Sweet Potato & Black Bean", price: 12.5,
    desc: "Charred sweet potato, black beans, corn, cilantro-lime rice, chipotle crema.",
    tags: ["Vegetarian"], g: ["#E08A3C", "#A6452C"], kcal: 580,
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400&q=80",
  },
  {
    id: "b4", cat: "bowls", name: "Grilled Chicken Pesto", price: 15.0,
    desc: "Herbed grilled chicken, farro, sun-dried tomato, arugula, basil pesto.",
    tags: ["High protein"], g: ["#9DBE5C", "#5C7A33"], kcal: 660,
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80",
  },
  {
    id: "s1", cat: "salads", name: "Garden Crunch Salad", price: 11.0,
    desc: "Little gem, cucumber, radish, peas, herbs, lemon-shallot vinaigrette.",
    tags: ["Vegan", "GF"], g: ["#9ACB6B", "#4E8A4A"], kcal: 320,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80",
  },
  {
    id: "s2", cat: "salads", name: "Citrus Beet & Goat Cheese", price: 12.5,
    desc: "Roasted beets, orange segments, whipped goat cheese, candied walnuts.",
    tags: ["Vegetarian", "GF"], g: ["#D86A8C", "#9B3A5E"], kcal: 410,
    image: "https://images.unsplash.com/photo-1529059997568-3d847b1154f0?w=400&q=80",
  },
  {
    id: "s3", cat: "salads", name: "Kale Caesar", price: 11.5,
    desc: "Massaged kale, shaved parmesan, sourdough croutons, classic caesar.",
    tags: ["Vegetarian"], g: ["#7FB069", "#3D6B3A"], kcal: 390,
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&q=80",
  },
  {
    id: "j1", cat: "juice", name: "Green Glow", price: 7.5,
    desc: "Celery, cucumber, green apple, spinach, lemon, ginger.",
    tags: ["Cold-press"], g: ["#A7CE5B", "#5B8B2E"], kcal: 120,
    image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&q=80",
  },
  {
    id: "j2", cat: "juice", name: "Citrus Reset", price: 7.5,
    desc: "Orange, carrot, turmeric, lemon, a touch of cayenne.",
    tags: ["Cold-press"], g: ["#F0A93B", "#C56A1E"], kcal: 140,
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80",
  },
  {
    id: "j3", cat: "juice", name: "Berry Beet Boost", price: 8.0,
    desc: "Beet, strawberry, blueberry, apple, lime.",
    tags: ["Cold-press"], g: ["#C2557A", "#7C2B4C"], kcal: 160,
    image: "https://images.unsplash.com/photo-1525904220310-64ef12c1429b?q=80&w=1422&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "x1", cat: "sides", name: "Crispy Chickpeas", price: 4.0,
    desc: "Roasted with smoked paprika & sea salt.",
    tags: ["Vegan", "GF"], g: ["#D8A24A", "#9C6322"], kcal: 180,
    image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80",
  },
  {
    id: "x2", cat: "sides", name: "Avocado Toast", price: 6.5,
    desc: "Smashed avocado, chili flakes, lemon on seeded sourdough.",
    tags: ["Vegetarian"], g: ["#A7C66B", "#5E7E37"], kcal: 290,
    image: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=400&q=80",
  },
  {
    id: "x3", cat: "sides", name: "Coconut Chia Pudding", price: 5.5,
    desc: "Coconut chia, mango compote, toasted almond.",
    tags: ["Vegan", "GF"], g: ["#EAD9A0", "#C9A24B"], kcal: 240,
    image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&q=80",
  },
];

export const money = (n: number) => `$${n.toFixed(2)}`;

export const byId = (id: string) => MENU.find((m) => m.id === id);