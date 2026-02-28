// Later you can replace this with DB queries.
// For now, this is clean mock data that matches your pages.

const ITEMS = [
  { id: 1, slug: "roblox-1000-robux", name: "1,000 Robux", game: "Roblox", price: 9.99, featured: true },
  { id: 2, slug: "valorant-1k-vp", name: "1,000 VP", game: "Valorant", price: 10.99, featured: true },
  { id: 3, slug: "fortnite-1000-vbucks", name: "1,000 V-Bucks", game: "Fortnite", price: 8.99, featured: true },
  { id: 4, slug: "steam-5-gift-card", name: "$5 Steam Gift Card", game: "Steam", price: 5.49, featured: true },
  { id: 5, slug: "minecraft-cape", name: "Cosmetic Cape", game: "Minecraft", price: 2.99, featured: false },
];

async function getAll() {
  return ITEMS;
}

async function getFeatured(limit = 4) {
  return ITEMS.filter(x => x.featured).slice(0, limit);
}

async function getBySlug(slug) {
  return ITEMS.find(x => x.slug === slug) || null;
}

async function getById(id) {
  return ITEMS.find(x => String(x.id) === String(id)) || null;
}

module.exports = { getAll, getFeatured, getBySlug, getById };