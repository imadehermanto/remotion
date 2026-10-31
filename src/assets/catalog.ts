/**
 * ============================================================================
 * KATALOG ASET & IDENTITAS VISUAL UTAMA (BRAND ASSET REGISTRY)
 * ============================================================================
 * Gunakan konstanta `MODELS`, `SFX`, dan `BRAND_THEME` ini di semua video
 * agar seluruh channel memiliki gaya visual dan aset yang konsisten.
 */

export const MODELS = {
  appliances: {
    fridge: "assets/models/appliances/kitchenFridge.glb",
    coffeeMachine: "assets/models/appliances/kitchenCoffeeMachine.glb",
    blender: "assets/models/appliances/kitchenBlender.glb",
    microwave: "assets/models/appliances/kitchenMicrowave.glb",
    stove: "assets/models/appliances/kitchenStove.glb",
    sink: "assets/models/appliances/kitchenSink.glb",
    toaster: "assets/models/appliances/toaster.glb",
  },
  furniture: {
    kitchenCabinet: "assets/models/furniture/kitchenCabinet.glb",
    kitchenCabinetDrawer: "assets/models/furniture/kitchenCabinetDrawer.glb",
    tableCloth: "assets/models/furniture/tableCrossCloth.glb",
    chairRounded: "assets/models/furniture/chairRounded.glb",
    bench: "assets/models/furniture/bench.gltf",
    bed: "assets/models/furniture/bed.gltf",
  },
  buildings: {
    house1: "assets/models/buildings/house1.gltf",
    house3: "assets/models/buildings/house-3.gltf",
    house4: "assets/models/buildings/house-4.gltf",
    house5: "assets/models/buildings/house-5.gltf",
    barn: "assets/models/buildings/barn.gltf",
    tower: "assets/models/buildings/tower.gltf",
    bridge: "assets/models/buildings/bridge-01.gltf",
    windTurbine: "assets/models/buildings/wind-turbine.gltf",
  },
  vehicles: {
    sedan: "assets/models/vehicles/sedan.gltf",
    sportsSedan: "assets/models/vehicles/sports-sedan.gltf",
    suv: "assets/models/vehicles/suv.gltf",
    taxi: "assets/models/vehicles/taxi.gltf",
    policeCar: "assets/models/vehicles/police-car.gltf",
    ambulance: "assets/models/vehicles/ambulance.gltf",
    firetruck: "assets/models/vehicles/firetruck.gltf",
    truck: "assets/models/vehicles/truck.gltf",
    deliveryTruck: "assets/models/vehicles/delivery-truck.gltf",
    tractor: "assets/models/vehicles/tractor.gltf",
    bike: "assets/models/vehicles/bike.gltf",
    helicopter: "assets/models/vehicles/helicopter.gltf",
    boatSmall: "assets/models/vehicles/boat-small.gltf",
  },
  characters: {
    male: "assets/models/characters/male.gltf",
    skaterMale: "assets/models/characters/skater-male.gltf",
    skaterFemale: "assets/models/characters/skater-female.gltf",
    survivorMale: "assets/models/characters/survivor-male.gltf",
    survivorFemale: "assets/models/characters/survivor-female.gltf",
    dog: "assets/models/characters/dogue.gltf",
    bunny: "assets/models/characters/bunny.gltf",
    horse: "assets/models/characters/low-poly-horse.gltf",
    fish: "assets/models/characters/fish.gltf",
  },
  tools: {
    shovel: "assets/models/tools/shovel.gltf",
    axe: "assets/models/tools/axe.gltf",
    sackBag: "assets/models/tools/bag.gltf",
    burlapFlat: "assets/models/tools/bag-flat.gltf",
    barrel: "assets/models/tools/barrel.gltf",
    chest: "assets/models/tools/chest.gltf",
    crate: "assets/models/tools/sci-fi-crate.gltf",
    trashcan: "assets/models/tools/trashcan.glb",
  },
  nature: {
    pottedPlant: "assets/models/nature/plant.gltf",
    treeSmall: "assets/models/nature/tree-small.gltf",
    treeBig: "assets/models/nature/tree-big.gltf",
    lowPolyTree: "assets/models/nature/low-poly-tree.gltf",
    palmShort: "assets/models/nature/palm-short.gltf",
    cactus: "assets/models/nature/cactus.gltf",
    rock: "assets/models/nature/formation-rock.gltf",
    stone: "assets/models/nature/formation-stone.gltf",
    largeRock: "assets/models/nature/formation-large-rock.gltf",
  },
  food: {
    apple: "assets/models/food/apple.gltf",
    orange: "assets/models/food/orange.gltf",
    banana: "assets/models/food/banana.gltf",
    milkCarton: "assets/models/food/carton.gltf",
    sodaCan: "assets/models/food/soda-can.gltf",
    roastTurkey: "assets/models/food/turkey.gltf",
    plate: "assets/models/food/plate.gltf",
    hotStewPot: "assets/models/food/pot-stew.gltf",
    burger: "assets/models/food/burger.gltf",
    pizza: "assets/models/food/pizza.gltf",
    bread: "assets/models/food/bread.gltf",
    carrot: "assets/models/food/carrot.gltf",
    broccoli: "assets/models/food/broccoli.gltf",
    cheese: "assets/models/food/cheese.gltf",
    fryingPan: "assets/models/food/frying-pan.gltf",
    pot: "assets/models/food/pot.gltf",
    mug: "assets/models/food/mug.gltf",
    bottle: "assets/models/food/bottle.gltf",
  },
} as const;

export const SFX = {
  whoosh: "assets/sfx/whoosh.wav",
  ding: "assets/sfx/ding.wav",
  switch: "assets/sfx/switch.wav",
  whip: "assets/sfx/whip.wav",
} as const;

export const BGM = {
  schemingWeasel: "assets/audio/bgm-scheming-weasel.mp3",
} as const;

export const DRACO_DECODER_PATH = "assets/draco/";

/**
 * Palet Warna & Gradien Ciri Khas Channel (Wait, Really!? / How Come? Style)
 */
export const BRAND_THEME = {
  colors: {
    yellowPop: "#facc15",
    orangeHeat: "#ff5500",
    redAlert: "#ef4444",
    cyanCold: "#00e5ff",
    greenFact: "#4ade80",
    creamCard: "#fffbeb",
    darkOutline: "#090d16",
  },
  backgrounds: {
    warmRoom: "linear-gradient(180deg, #3b1d0f 0%, #271208 60%, #1a0c05 100%)",
    engineeringBlue: "linear-gradient(180deg, #0369a1 0%, #0c4a6e 55%, #1e293b 100%)",
    sunnyOutdoor: "linear-gradient(180deg, #0284c7 0%, #38bdf8 55%, #bae6fd 100%)",
    rainyOvercast: "linear-gradient(180deg, #334155 0%, #475569 55%, #64748b 100%)",
    microscopeDark: "linear-gradient(180deg, #0f172a 0%, #1e293b 60%, #090d16 100%)",
    dangerRed: "linear-gradient(180deg, #450a0a 0%, #1c0505 60%, #090d16 100%)",
    mountainSlope: "linear-gradient(180deg, #1e293b 0%, #334155 45%, #475569 100%)",
  },
} as const;
