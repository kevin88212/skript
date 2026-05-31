import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Branches
  const hauptfiliale = await prisma.branch.upsert({
    where: { id: "branch-hauptfiliale" },
    update: {},
    create: {
      id: "branch-hauptfiliale",
      name: "Hauptfiliale",
      location: "Zentrale",
      active: true,
    },
  });

  const filiale1 = await prisma.branch.upsert({
    where: { id: "branch-filiale1" },
    update: {},
    create: {
      id: "branch-filiale1",
      name: "Filiale Mitte",
      location: "Stadtmitte",
      active: true,
    },
  });

  const filiale2 = await prisma.branch.upsert({
    where: { id: "branch-filiale2" },
    update: {},
    create: {
      id: "branch-filiale2",
      name: "Filiale Nord",
      location: "Nordviertel",
      active: true,
    },
  });

  console.log("Branches created");

  // Users
  const adminPassword = await bcrypt.hash("admin123", 12);
  const employeePassword = await bcrypt.hash("mitarbeiter123", 12);
  const hauptfilialePassword = await bcrypt.hash("hauptfiliale123", 12);

  await prisma.user.upsert({
    where: { email: "admin@obstbauer-haller.de" },
    update: {},
    create: {
      name: "Administrator",
      email: "admin@obstbauer-haller.de",
      passwordHash: adminPassword,
      role: Role.ADMIN,
      branchId: hauptfiliale.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "hauptfiliale@obstbauer-haller.de" },
    update: {},
    create: {
      name: "Hauptfiliale Verwaltung",
      email: "hauptfiliale@obstbauer-haller.de",
      passwordHash: hauptfilialePassword,
      role: Role.HAUPTFILIALE,
      branchId: hauptfiliale.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "mitte@obstbauer-haller.de" },
    update: {},
    create: {
      name: "Maria Muster",
      email: "mitte@obstbauer-haller.de",
      passwordHash: employeePassword,
      role: Role.EMPLOYEE,
      branchId: filiale1.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "nord@obstbauer-haller.de" },
    update: {},
    create: {
      name: "Hans Müller",
      email: "nord@obstbauer-haller.de",
      passwordHash: employeePassword,
      role: Role.EMPLOYEE,
      branchId: filiale2.id,
    },
  });

  console.log("Users created");

  // Categories
  const categories = [
    { id: "cat-gemuese", name: "Gemüse", sortOrder: 1 },
    { id: "cat-fruechte", name: "Früchte", sortOrder: 2 },
    { id: "cat-eier", name: "Eier", sortOrder: 3 },
    { id: "cat-fisch", name: "Fisch", sortOrder: 4 },
    { id: "cat-kaese", name: "Käse / MoPro", sortOrder: 5 },
    { id: "cat-saefte", name: "Säfte", sortOrder: 6 },
    { id: "cat-wein", name: "Wein", sortOrder: 7 },
    { id: "cat-spirituosen", name: "Spirituosen", sortOrder: 8 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {},
      create: cat,
    });
  }

  console.log("Categories created");

  // Products - Gemüse
  const gemuese = [
    { name: "Tomaten", unit: "kg", sortOrder: 1 },
    { name: "Gurken", unit: "Stück", sortOrder: 2 },
    { name: "Paprika rot", unit: "kg", sortOrder: 3 },
    { name: "Paprika gelb", unit: "kg", sortOrder: 4 },
    { name: "Paprika grün", unit: "kg", sortOrder: 5 },
    { name: "Zucchini", unit: "kg", sortOrder: 6 },
    { name: "Karotten", unit: "kg", sortOrder: 7 },
    { name: "Zwiebeln", unit: "kg", sortOrder: 8 },
    { name: "Salat (Kopfsalat)", unit: "Stück", sortOrder: 9 },
    { name: "Rucola", unit: "Bund", sortOrder: 10 },
    { name: "Radieschen", unit: "Bund", sortOrder: 11 },
    { name: "Brokkoli", unit: "Stück", sortOrder: 12 },
    { name: "Blumenkohl", unit: "Stück", sortOrder: 13 },
    { name: "Spinat", unit: "kg", sortOrder: 14 },
    { name: "Lauch", unit: "Stück", sortOrder: 15 },
    { name: "Sellerie", unit: "Stück", sortOrder: 16 },
    { name: "Champignons", unit: "kg", sortOrder: 17 },
    { name: "Kartoffeln festkochend", unit: "kg", sortOrder: 18 },
    { name: "Kartoffeln mehligkochend", unit: "kg", sortOrder: 19 },
    { name: "Knoblauch", unit: "Kiste", sortOrder: 20 },
    { name: "Ingwer", unit: "kg", sortOrder: 21 },
    { name: "Petersilie", unit: "Bund", sortOrder: 22 },
    { name: "Schnittlauch", unit: "Bund", sortOrder: 23 },
    { name: "Basilikum", unit: "Topf", sortOrder: 24 },
  ];

  for (const p of gemuese) {
    await prisma.product.create({
      data: { ...p, categoryId: "cat-gemuese" },
    }).catch(() => {});
  }

  // Products - Früchte
  const fruechte = [
    { name: "Äpfel", unit: "kg", sortOrder: 1 },
    { name: "Birnen", unit: "kg", sortOrder: 2 },
    { name: "Bananen", unit: "kg", sortOrder: 3 },
    { name: "Erdbeeren", unit: "Schale", sortOrder: 4 },
    { name: "Himbeeren", unit: "Schale", sortOrder: 5 },
    { name: "Heidelbeeren", unit: "Schale", sortOrder: 6 },
    { name: "Weintrauben hell", unit: "kg", sortOrder: 7 },
    { name: "Weintrauben dunkel", unit: "kg", sortOrder: 8 },
    { name: "Orangen", unit: "kg", sortOrder: 9 },
    { name: "Mandarinen", unit: "kg", sortOrder: 10 },
    { name: "Zitronen", unit: "kg", sortOrder: 11 },
    { name: "Limetten", unit: "Stück", sortOrder: 12 },
    { name: "Mangos", unit: "Stück", sortOrder: 13 },
    { name: "Avocados", unit: "Stück", sortOrder: 14 },
    { name: "Kiwi", unit: "Stück", sortOrder: 15 },
    { name: "Ananas", unit: "Stück", sortOrder: 16 },
    { name: "Wassermelone", unit: "Stück", sortOrder: 17 },
    { name: "Pfirsiche", unit: "kg", sortOrder: 18 },
    { name: "Nektarinen", unit: "kg", sortOrder: 19 },
    { name: "Pflaumen", unit: "kg", sortOrder: 20 },
  ];

  for (const p of fruechte) {
    await prisma.product.create({
      data: { ...p, categoryId: "cat-fruechte" },
    }).catch(() => {});
  }

  // Products - Eier
  const eier = [
    { name: "Eier Gr. M (10er)", unit: "Packung", sortOrder: 1 },
    { name: "Eier Gr. L (10er)", unit: "Packung", sortOrder: 2 },
    { name: "Eier Gr. M (30er Kiste)", unit: "Kiste", sortOrder: 3 },
    { name: "Eier Gr. L (30er Kiste)", unit: "Kiste", sortOrder: 4 },
    { name: "Bio-Eier Gr. M (10er)", unit: "Packung", sortOrder: 5 },
    { name: "Bio-Eier Gr. L (10er)", unit: "Packung", sortOrder: 6 },
  ];

  for (const p of eier) {
    await prisma.product.create({
      data: { ...p, categoryId: "cat-eier" },
    }).catch(() => {});
  }

  // Products - Fisch
  const fisch = [
    { name: "Lachs (Filet)", unit: "kg", sortOrder: 1 },
    { name: "Forelle (ganz)", unit: "Stück", sortOrder: 2 },
    { name: "Kabeljau (Filet)", unit: "kg", sortOrder: 3 },
    { name: "Thunfisch (Dose)", unit: "Stück", sortOrder: 4 },
    { name: "Garnelen (TK)", unit: "kg", sortOrder: 5 },
    { name: "Hering (Filet)", unit: "kg", sortOrder: 6 },
    { name: "Geräucherter Lachs", unit: "kg", sortOrder: 7 },
    { name: "Makrele (geräuchert)", unit: "Stück", sortOrder: 8 },
  ];

  for (const p of fisch) {
    await prisma.product.create({
      data: { ...p, categoryId: "cat-fisch" },
    }).catch(() => {});
  }

  // Products - Käse / MoPro
  const kaese = [
    { name: "Emmentaler", unit: "kg", sortOrder: 1 },
    { name: "Gouda jung", unit: "kg", sortOrder: 2 },
    { name: "Gouda alt", unit: "kg", sortOrder: 3 },
    { name: "Brie", unit: "Stück", sortOrder: 4 },
    { name: "Camembert", unit: "Stück", sortOrder: 5 },
    { name: "Mozzarella", unit: "Stück", sortOrder: 6 },
    { name: "Feta", unit: "kg", sortOrder: 7 },
    { name: "Parmesan", unit: "kg", sortOrder: 8 },
    { name: "Butter (250g)", unit: "Stück", sortOrder: 9 },
    { name: "Vollmilch (1L)", unit: "Flasche", sortOrder: 10 },
    { name: "Sahne (200ml)", unit: "Becher", sortOrder: 11 },
    { name: "Joghurt natur (500g)", unit: "Becher", sortOrder: 12 },
    { name: "Schmand (200g)", unit: "Becher", sortOrder: 13 },
    { name: "Quark mager (500g)", unit: "Becher", sortOrder: 14 },
  ];

  for (const p of kaese) {
    await prisma.product.create({
      data: { ...p, categoryId: "cat-kaese" },
    }).catch(() => {});
  }

  // Products - Säfte
  const saefte = [
    { name: "Apfelsaft (1L)", unit: "Flasche", sortOrder: 1 },
    { name: "Apfelsaft (Kiste 12x1L)", unit: "Kiste", sortOrder: 2 },
    { name: "Orangensaft (1L)", unit: "Flasche", sortOrder: 3 },
    { name: "Orangensaft (Kiste 12x1L)", unit: "Kiste", sortOrder: 4 },
    { name: "Multivitaminsaft (1L)", unit: "Flasche", sortOrder: 5 },
    { name: "Traubensaft (1L)", unit: "Flasche", sortOrder: 6 },
    { name: "Tomatensaft (1L)", unit: "Flasche", sortOrder: 7 },
    { name: "Karottensaft (1L)", unit: "Flasche", sortOrder: 8 },
    { name: "Rote-Bete-Saft (750ml)", unit: "Flasche", sortOrder: 9 },
    { name: "Holundersaft (700ml)", unit: "Flasche", sortOrder: 10 },
  ];

  for (const p of saefte) {
    await prisma.product.create({
      data: { ...p, categoryId: "cat-saefte" },
    }).catch(() => {});
  }

  // Products - Wein
  const wein = [
    { name: "Riesling trocken (0,75L)", unit: "Flasche", sortOrder: 1 },
    { name: "Riesling trocken (Kiste 6x0,75L)", unit: "Kiste", sortOrder: 2 },
    { name: "Grauburgunder trocken (0,75L)", unit: "Flasche", sortOrder: 3 },
    { name: "Sauvignon Blanc (0,75L)", unit: "Flasche", sortOrder: 4 },
    { name: "Spätburgunder trocken (0,75L)", unit: "Flasche", sortOrder: 5 },
    { name: "Lemberger (0,75L)", unit: "Flasche", sortOrder: 6 },
    { name: "Dornfelder (0,75L)", unit: "Flasche", sortOrder: 7 },
    { name: "Sekt Brut (0,75L)", unit: "Flasche", sortOrder: 8 },
    { name: "Rosé trocken (0,75L)", unit: "Flasche", sortOrder: 9 },
    { name: "Rotwein Kiste 6x0,75L", unit: "Kiste", sortOrder: 10 },
  ];

  for (const p of wein) {
    await prisma.product.create({
      data: { ...p, categoryId: "cat-wein" },
    }).catch(() => {});
  }

  // Products - Spirituosen
  const spirituosen = [
    { name: "Obstler (0,5L)", unit: "Flasche", sortOrder: 1 },
    { name: "Apfelbrand (0,5L)", unit: "Flasche", sortOrder: 2 },
    { name: "Birnenbrand (0,5L)", unit: "Flasche", sortOrder: 3 },
    { name: "Kirschwasser (0,5L)", unit: "Flasche", sortOrder: 4 },
    { name: "Zwetschgenwasser (0,5L)", unit: "Flasche", sortOrder: 5 },
    { name: "Gin (0,7L)", unit: "Flasche", sortOrder: 6 },
    { name: "Whisky (0,7L)", unit: "Flasche", sortOrder: 7 },
    { name: "Rum (0,7L)", unit: "Flasche", sortOrder: 8 },
    { name: "Vodka (0,7L)", unit: "Flasche", sortOrder: 9 },
    { name: "Likör Sortiment (0,5L)", unit: "Flasche", sortOrder: 10 },
  ];

  for (const p of spirituosen) {
    await prisma.product.create({
      data: { ...p, categoryId: "cat-spirituosen" },
    }).catch(() => {});
  }

  console.log("Products created");
  console.log("\n✅ Seed abgeschlossen!");
  console.log("\nTest-Zugangsdaten:");
  console.log("  Admin:        admin@obstbauer-haller.de     / admin123");
  console.log("  Hauptfiliale: hauptfiliale@obstbauer-haller.de / hauptfiliale123");
  console.log("  Mitarbeiter:  mitte@obstbauer-haller.de     / mitarbeiter123");
  console.log("  Mitarbeiter:  nord@obstbauer-haller.de      / mitarbeiter123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
