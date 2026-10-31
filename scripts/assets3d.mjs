#!/usr/bin/env node
/**
 * Remotion 3D Asset Manager (Pmndrs Market + Kenney CC0 3D Catalog)
 *
 * Contoh penggunaan:
 *   npm run assets -- search tree
 *   npm run assets -- search kitchen
 *   npm run assets -- add apple orange carton soda-can pot-stew plant
 *   npm run assets -- add kitchenCabinet kitchenCoffeeMachine kitchenBlender
 */

import fs from "node:fs";
import path from "node:path";

const PUBLIC_MODELS_DIR = path.resolve(process.cwd(), "public/assets/models");

function getCategoryFolder(name) {
  const n = name.toLowerCase();
  if (
    n.includes("fridge") ||
    n.includes("blender") ||
    n.includes("coffee") ||
    n.includes("microwave") ||
    n.includes("stove") ||
    n.includes("sink") ||
    n.includes("toaster") ||
    n.includes("washer") ||
    n.includes("dryer") ||
    n.includes("hood") ||
    n.includes("fan")
  ) {
    return "appliances";
  }
  if (
    n.includes("house") ||
    n.includes("barn") ||
    n.includes("tower") ||
    n.includes("bridge") ||
    n.includes("library") ||
    n.includes("farm") ||
    n.includes("turbine") ||
    n.includes("ferris")
  ) {
    return "buildings";
  }
  if (
    n.includes("sedan") ||
    n.includes("suv") ||
    n.includes("taxi") ||
    n.includes("police") ||
    n.includes("ambulance") ||
    n.includes("firetruck") ||
    n.includes("truck") ||
    n.includes("tractor") ||
    n.includes("van") ||
    n.includes("-car") ||
    n.includes("bike") ||
    n.includes("boat") ||
    n.includes("ship") ||
    n.includes("helicopter")
  ) {
    return "vehicles";
  }
  if (
    n.includes("shovel") ||
    n.includes("axe") ||
    n.includes("bag") ||
    n.includes("barrel") ||
    n.includes("chest") ||
    n.includes("crate") ||
    n.includes("cannon") ||
    n.includes("paddle") ||
    n.includes("sword") ||
    n.includes("trashcan")
  ) {
    return "tools";
  }
  if (
    n.includes("cabinet") ||
    n.includes("table") ||
    n.includes("chair") ||
    n.includes("stool") ||
    n.includes("bed") ||
    n.includes("bench") ||
    n.includes("wall") ||
    n.includes("floor") ||
    n.includes("door")
  ) {
    return "furniture";
  }
  if (
    n.includes("tree") ||
    n.includes("plant") ||
    n.includes("palm") ||
    n.includes("cactus") ||
    n.includes("rock") ||
    n.includes("stone")
  ) {
    return "nature";
  }
  if (
    n.includes("male") ||
    n.includes("female") ||
    n.includes("pirate") ||
    n.includes("zombie") ||
    n.includes("dog") ||
    n.includes("bunny") ||
    n.includes("horse") ||
    n.includes("dragon") ||
    n.includes("fish")
  ) {
    return "characters";
  }
  if (KENNEY_MODELS.includes(name)) {
    return "furniture";
  }
  return "food";
}

// Katalog Kenney Kitchen & Furniture (GLB)
const KENNEY_MODELS = [
  "ceilingFan",
  "chair",
  "chairCushion",
  "chairDesk",
  "chairRounded",
  "doorway",
  "doorwayFront",
  "doorwayOpen",
  "dryer",
  "floorCorner",
  "floorCornerRound",
  "floorFull",
  "floorHalf",
  "hoodLarge",
  "hoodModern",
  "kitchenBarEnd",
  "kitchenBlender",
  "kitchenCabinet",
  "kitchenCabinetCornerInner",
  "kitchenCabinetCornerRound",
  "kitchenCabinetDrawer",
  "kitchenCabinetUpper",
  "kitchenCabinetUpperCorner",
  "kitchenCabinetUpperDouble",
  "kitchenCabinetUpperLow",
  "kitchenCoffeeMachine",
  "kitchenFridge",
  "kitchenFridgeBuiltIn",
  "kitchenFridgeLarge",
  "kitchenFridgeSmall",
  "kitchenMicrowave",
  "kitchenSink",
  "kitchenStove",
  "kitchenStoveElectric",
  "stoolBar",
  "stoolBarSquare",
  "table",
  "tableCloth",
  "tableCoffee",
  "tableCoffeeGlass",
  "tableCoffeeGlassSquare",
  "tableCoffeeSquare",
  "tableCross",
  "tableCrossCloth",
  "tableGlass",
  "tableRound",
  "toaster",
  "trashcan",
  "wall",
  "wallCorner",
  "wallCornerRond",
  "wallDoorway",
  "wallDoorwayWide",
  "wallHalf",
  "wallWindow",
  "wallWindowSlide",
  "washer",
  "washerDryerStacked",
];

// Katalog Pmndrs Market (310 CC0 Models - Makanan, Pohon, Orang, Hewan, Kendaraan, Barang)
const PMNDRS_MODELS = [
  "ambulance", "apple-half", "apple", "avocado-half", "avocado", "axe", "bacon-raw", "bacon",
  "bag-flat", "bag", "banana", "barn", "barrel", "bed", "beet", "bench", "bike", "blaster-a",
  "boat-large", "boat-small", "bottle-ketchup", "bottle-large", "bottle-musterd", "bottle-oil",
  "bottle", "bowl-broth", "bowl-cereal", "bowl-soup", "bowl", "bread", "bridge-01", "broccoli",
  "bunny", "burger-cheese-double", "burger-cheese", "burger-double", "burger", "cabbage",
  "cactus", "cake-birthday", "cake-slicer", "cake", "can-open", "can-small", "can",
  "candy-bar-wrapper", "candy-bar", "cannon-ball", "cannon-large", "cannon-mobile", "cannon",
  "carrot", "carton-small", "carton", "cauliflower", "celery-stick", "cheese-cut",
  "cheese-slicer", "cheese", "cherries", "chest", "chinese", "chocolate-wrapper", "chocolate",
  "chopstick-fancy", "chopstick", "citroen-old-van", "cocktail", "coconut-half", "coconut",
  "cookie-chocolate", "cookie", "cooking-fork", "cooking-knife-chopping", "cooking-knife",
  "cooking-spatula", "cooking-spoon", "corn-dog", "corn", "coronavirus", "croissant",
  "cup-saucer", "cup-tea", "cup-thea", "cup", "cupcake", "cutting-board-japanese",
  "cutting-board-round", "cutting-board", "cyborg-female", "delivery-truck", "dim-sum",
  "dogue", "donut-1", "donut-chocolate", "donut-sprinkles", "donut", "dragon", "egg-cooked",
  "egg-cup", "egg-half", "egg", "eggplant", "expresso-cup", "ferris-wheel", "firetruck",
  "fish-bones", "fish", "formation-large-rock", "formation-large-stone", "formation-rock",
  "formation-stone", "frappe", "fries-empty", "fries", "frikandel-speciaal", "frying-pan-lid",
  "frying-pan", "garbage-truck", "ginger-bread-cutter", "ginger-bread", "glass-wine", "glass",
  "grapes", "guitar", "hatchback", "headphones", "helicopter", "hole", "honey", "hot-dog-raw",
  "hot-dog", "house-18", "house-3", "house-4", "house-5", "house-6", "house-7", "house1",
  "ice-cream-cone", "ice-cream-cup", "ice-cream-scoop-mint", "ice-cream-scoop",
  "ice-cream-truck", "ice-cream", "knife-block", "leek", "lemon-half", "lemon", "les-paul",
  "library-large", "loaf-baguette", "loaf-round", "loaf", "lollypop", "low-poly-farm",
  "low-poly-horse", "low-poly-tree", "lucy", "maki-roe", "maki-salmon", "maki-vegetable",
  "male", "meat-cooked", "meat-patty", "meat-raw", "meat-ribs", "meat-sausage",
  "meat-tenderizer", "mechanical-keyboard-tenkeyless", "mechanical-keyboard", "mincemeat-pie",
  "mortar-pestle", "mortar", "muffin", "mug-1", "mug", "mushroom-half", "mushroom",
  "mussel-open", "mussel", "nes-controller", "nes", "node", "onion-half", "onion", "orange",
  "paddle", "palm-detailed-long", "palm-detailed-short", "palm-long", "palm-short", "pan-stew",
  "pan", "pancakes", "paprika-slice", "paprika", "peanut-butter", "pear-half", "pear",
  "pepper-mill", "pepper", "pie", "pillow", "pineapple", "pirate-captain", "pirate-crew",
  "pirate-officer", "pizza-box", "pizza-cutter", "pizza", "plant-pirate-kit", "plant",
  "plate-broken", "plate-deep", "plate-dinner", "plate-rectangle", "plate-sauerkraut", "plate",
  "police-car", "popsicle-chocolate", "popsicle-stick", "popsicle", "pot-lid", "pot-stew-lid",
  "pot-stew", "pot", "present", "pudding", "pumpkin-basic", "pumpkin", "race-car",
  "race-futrure", "radish", "react-logo", "rice-ball", "rolling-pin", "salad", "sandwich",
  "sausage-half", "sausage", "sci-fi-crate", "sedan", "shaker-pepper", "shaker-salt",
  "ship-dark", "ship-light", "ship-wreck", "shovel", "skater-female", "skater-male",
  "skewer-vegetables", "skewer", "soda-bottle", "soda-can-crushed", "soda-can", "soda-glass",
  "soda", "soy", "spilling-coffee", "sports-sedan", "steamer", "strawberry",
  "styrofoam-dinner", "styrofoam", "sub", "sundae", "survivor-female", "survivor-male",
  "sushi-egg", "sushi-roll", "sushi-salmon", "suv-luxury", "suv", "suzanne-high-poly",
  "suzanne-low-poly", "sword-scimitar", "sword", "table", "taco", "tajine-lid", "tajine",
  "taxi", "tomato-slice", "tomato", "tower", "tractor-2", "tractor-police", "tractor",
  "tree-big", "tree-small", "truck-flat", "truck", "turkey", "turntable", "utensil-fork",
  "utensil-knife", "utensil-spoon", "van", "waffle", "watermelon", "whipped-cream", "whisk",
  "whole-ham", "wholer-ham", "wind-turbine", "wine-red", "wine-white", "zombie-1", "zombie-2",
];

// Kamus Bahasa Indonesia -> kata kunci katalog
const ID_ALIASES = {
  kulkas: ["kitchenFridge", "kitchenFridgeLarge", "kitchenFridgeSmall", "kitchenFridgeBuiltIn"],
  pohon: ["tree-big", "tree-small", "low-poly-tree", "palm-long", "palm-short", "plant", "cactus"],
  meja: ["table", "tableCloth", "tableCoffee", "tableRound", "tableCrossCloth", "bench"],
  kursi: ["chair", "chairCushion", "chairDesk", "chairRounded", "stoolBar"],
  orang: ["male", "skater-male", "skater-female", "survivor-male", "survivor-female", "cyborg-female", "pirate-captain"],
  hewan: ["dogue", "bunny", "low-poly-horse", "fish", "turkey", "dragon"],
  dapur: ["kitchenCabinet", "kitchenCabinetDrawer", "kitchenCoffeeMachine", "kitchenBlender", "kitchenMicrowave", "kitchenSink", "kitchenStove", "pot-stew", "frying-pan"],
  makanan: ["apple", "orange", "banana", "burger", "pizza", "turkey", "bread", "carrot", "broccoli", "cheese", "cake"],
  minuman: ["carton", "soda-can", "soda-bottle", "bottle", "mug", "cup-tea", "frappe"],
  mobil: ["sedan", "sports-sedan", "suv", "taxi", "police-car", "ambulance", "firetruck", "truck", "delivery-truck"],
  rumah: ["house1", "house-3", "house-4", "house-5", "barn", "library-large", "tower"],
};

async function downloadModel(name) {
  const cat = getCategoryFolder(name);
  const targetDir = path.join(PUBLIC_MODELS_DIR, cat);
  fs.mkdirSync(targetDir, { recursive: true });

  if (KENNEY_MODELS.includes(name)) {
    const url = `https://raw.githubusercontent.com/mr-akashdesai/kitchen-kreation/master/models/gltf/${name}.glb`;
    const dest = path.join(targetDir, `${name}.glb`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Gagal mengunduh ${url} (${res.status})`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log(`✅ Berhasil mengunduh [Kenney GLB]: public/assets/models/${cat}/${name}.glb (${(buf.length / 1024).toFixed(1)} KB)`);
    return `assets/models/${cat}/${name}.glb`;
  }

  if (PMNDRS_MODELS.includes(name)) {
    const url = `https://raw.githubusercontent.com/pmndrs/market-assets/main/files/models/${name}/model.gltf`;
    const dest = path.join(targetDir, `${name}.gltf`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Gagal mengunduh ${url} (${res.status})`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log(`✅ Berhasil mengunduh [Pmndrs GLTF]: public/assets/models/${cat}/${name}.gltf (${(buf.length / 1024).toFixed(1)} KB)`);
    return `assets/models/${cat}/${name}.gltf`;
  }

  throw new Error(
    `Model "${name}" tidak ditemukan. Jalankan: npm run assets -- search <kata-kunci>`
  );
}

async function main() {
  const [cmd, ...args] = process.argv.slice(2);

  if (!cmd || cmd === "help") {
    console.log(`
📦 Remotion 3D Asset Manager (Total: ${KENNEY_MODELS.length + PMNDRS_MODELS.length} Model 3D Gratis CC0)

Perintah:
  npm run assets -- search <kata>        Cari model (bisa B. Indonesia: kulkas, pohon, meja, orang, hewan, dapur, makanan, mobil)
  npm run assets -- add <nama1> <nama2>  Download model ke public/models/
  npm run assets -- list                 Tampilkan semua kategori model
`);
    return;
  }

  if (cmd === "list") {
    console.log("Kategori Bahasa Indonesia:", Object.keys(ID_ALIASES).join(", "));
    console.log("\nKenney Furniture & Kitchen (57 model):", KENNEY_MODELS.join(", "));
    console.log("\nPmndrs Market (310 model):", PMNDRS_MODELS.join(", "));
    return;
  }

  if (cmd === "search") {
    const q = (args[0] || "").toLowerCase();
    const aliasHits = ID_ALIASES[q] || [];
    const directHits = [...KENNEY_MODELS, ...PMNDRS_MODELS].filter((m) =>
      m.toLowerCase().includes(q)
    );
    const results = [...new Set([...aliasHits, ...directHits])];
    console.log(`🔍 Hasil pencarian "${q}" (${results.length} model):`);
    console.log(results.join(", "));
    return;
  }

  if (cmd === "add") {
    if (args.length === 0) {
      console.error("Masukkan minimal 1 nama model. Contoh: npm run assets -- add apple tree-small");
      process.exit(1);
    }
    for (const name of args) {
      await downloadModel(name);
    }
    return;
  }
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});

