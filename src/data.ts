export type AgentRank = "A" | "S" | "I";
export type Attribute = "Electric" | "Fire" | "Ice" | "Physical" | "Ether" | "Wind" | "Honed Edge" | "Frost" | "Auric Ink";
export type Specialty = "Attack" | "Anomaly" | "Defense" | "Stun" | "Support" | "Rupture";
export type AttackType = "Slash" | "Strike" | "Pierce";

export type Agent = {
  id: string;
  name: string;
  rank: AgentRank;
  rarity: AgentRank;
  attribute: Attribute;
  specialty: Specialty;
  attackTypes: AttackType[];
  faction: string;
  releaseVersion: string;
  releaseDate?: string;
  releaseStatus: "released" | "upcoming";
};

export type WEngine = {
  id: string;
  name: string;
  rarity: "B" | "A" | "S";
  specialty: Specialty;
  source?: "gacha" | "craftable" | "battle-pass" | "event" | "starter";
  releaseVersion?: string;
};

export type Material = {
  id: string;
  name: string;
  category: "agent_exp" | "denny" | "promotion" | "skill" | "engine_exp" | "engine_modify" | "core_skill" | "universal";
};

export type DriveDisc = {
  id: string;
  name: string;
  twoPiece: string;
  fourPiece: string;
  releaseVersion?: string;
};

const agent = (
  id: string,
  name: string,
  rank: AgentRank,
  attribute: Attribute,
  specialty: Specialty,
  attackTypes: AttackType[],
  faction: string,
  releaseVersion: string,
  releaseDate?: string,
  releaseStatus: Agent["releaseStatus"] = "released"
): Agent => ({
  id,
  name,
  rank,
  rarity: rank,
  attribute,
  specialty,
  attackTypes,
  faction,
  releaseVersion,
  releaseDate,
  releaseStatus
});

export const agents: Agent[] = [
  agent("alexandrina-sebastiane", "Alexandrina Sebastiane", "S", "Electric", "Support", ["Strike"], "Victoria Housekeeping Co.", "1.0", "2024-07-04"),
  agent("alice-thymefield", "Alice Thymefield", "S", "Physical", "Anomaly", ["Slash"], "Spook Shack", "2.1", "2025-08-06"),
  agent("anby", "Anby Demara", "A", "Electric", "Stun", ["Slash"], "Cunning Hares", "1.0", "2024-07-04"),
  agent("anton-ivanov", "Anton Ivanov", "A", "Electric", "Attack", ["Pierce"], "Belobog Heavy Industries", "1.0", "2024-07-04"),
  agent("aria", "Aria", "S", "Ether", "Anomaly", ["Strike"], "Angels of Delusion", "2.6", "2026-03-04"),
  agent("asaba-harumasa", "Asaba Harumasa", "S", "Electric", "Attack", ["Pierce", "Slash"], "Hollow Special Operations Section 6", "1.4", "2024-12-18"),
  agent("astra-yao", "Astra Yao", "S", "Ether", "Support", ["Strike"], "Stars of Lyra", "1.5", "2025-01-22"),
  agent("banyue", "Banyue", "S", "Fire", "Rupture", ["Strike"], "Krampus Compliance Authority", "2.4", "2025-12-17"),
  agent("ben-bigger", "Ben Bigger", "A", "Fire", "Defense", ["Strike"], "Belobog Heavy Industries", "1.0", "2024-07-04"),
  agent("billy", "Billy Kid", "A", "Physical", "Attack", ["Pierce"], "Cunning Hares", "1.0", "2024-07-04"),
  agent("burnice-white", "Burnice White", "S", "Fire", "Anomaly", ["Pierce"], "Sons of Calydon", "1.2", "2024-10-16"),
  agent("caesar-king", "Caesar King", "S", "Physical", "Defense", ["Slash", "Strike"], "Sons of Calydon", "1.2", "2024-09-25"),
  agent("cissia", "Cissia", "S", "Electric", "Attack", ["Slash"], "Metropolitan Order Division", "2.7", "2026-04-15"),
  agent("corin-wickes", "Corin Wickes", "A", "Physical", "Attack", ["Slash"], "Victoria Housekeeping Co.", "1.0", "2024-07-04"),
  agent("dialyn", "Dialyn", "S", "Physical", "Stun", ["Slash"], "Krampus Compliance Authority", "2.4", "2025-11-26"),
  agent("ellen", "Ellen Joe", "S", "Ice", "Attack", ["Slash"], "Victoria Housekeeping Co.", "1.0", "2024-07-04"),
  agent("evelyn-chevalier", "Evelyn Chevalier", "S", "Fire", "Attack", ["Slash"], "Stars of Lyra", "1.5", "2025-02-12"),
  agent("grace-howard", "Grace Howard", "S", "Electric", "Anomaly", ["Pierce"], "Belobog Heavy Industries", "1.0", "2024-07-04"),
  agent("hoshimi-miyabi", "Hoshimi Miyabi", "S", "Frost", "Anomaly", ["Slash"], "Hollow Special Operations Section 6", "1.4", "2024-12-18"),
  agent("hugo-vlad", "Hugo Vlad", "S", "Ice", "Attack", ["Slash"], "Mockingbird", "1.7", "2025-05-14"),
  agent("jane-doe", "Jane Doe", "S", "Physical", "Anomaly", ["Slash"], "Criminal Investigation Special Response Team", "1.1", "2024-09-04"),
  agent("ju-fufu", "Ju Fufu", "S", "Fire", "Stun", ["Strike"], "Yunkui Summit", "2.0", "2025-06-25"),
  agent("koleda", "Koleda Belobog", "S", "Fire", "Stun", ["Strike"], "Belobog Heavy Industries", "1.0", "2024-07-04"),
  agent("komano-manato", "Komano Manato", "A", "Fire", "Rupture", ["Slash"], "Spook Shack", "2.3", "2025-10-15"),
  agent("lighter", "Lighter", "S", "Fire", "Stun", ["Strike"], "Sons of Calydon", "1.3", "2024-11-27"),
  agent("lucia-elowen", "Lucia Elowen", "S", "Ether", "Support", ["Strike"], "Spook Shack", "2.3", "2025-10-15"),
  agent("luciana-de-montefio", "Luciana de Montefio", "A", "Fire", "Support", ["Strike"], "Sons of Calydon", "1.0", "2024-07-04"),
  agent("nangong-yu", "Nangong Yu", "S", "Ether", "Stun", ["Strike"], "Angels of Delusion", "2.7", "2026-03-24"),
  agent("nekomiya-mana", "Nekomiya Mana", "S", "Physical", "Attack", ["Slash"], "Cunning Hares", "1.0", "2024-07-04"),
  agent("nicole", "Nicole Demara", "A", "Ether", "Support", ["Strike"], "Cunning Hares", "1.0", "2024-07-04"),
  agent("orphie-magnusson-and-magus", "Orphie Magnusson & Magus", "S", "Fire", "Attack", ["Pierce", "Slash"], "Obol Squad", "2.2", "2025-09-24"),
  agent("pan-yinhu", "Pan Yinhu", "A", "Physical", "Defense", ["Strike"], "Yunkui Summit", "2.0", "2025-06-06"),
  agent("piper-wheel", "Piper Wheel", "A", "Physical", "Anomaly", ["Slash"], "Sons of Calydon", "1.0", "2024-07-04"),
  agent("promeia", "Promeia", "S", "Ice", "Anomaly", ["Slash"], "Krampus Compliance Authority", "2.8", "2026-05-06"),
  agent("pulchra-fellini", "Pulchra Fellini", "A", "Physical", "Stun", ["Slash"], "Sons of Calydon", "1.6", "2025-03-12"),
  agent("pyrois", "Pyrois", "I", "Ether", "Attack", ["Slash"], "Phaethon", "3.0", "2026-06-17"),
  agent("qingyi", "Qingyi", "S", "Electric", "Stun", ["Strike"], "Criminal Investigation Special Response Team", "1.1", "2024-08-14"),
  agent("seed", "Seed", "S", "Electric", "Attack", ["Slash", "Strike"], "Obol Squad", "2.2", "2025-09-04"),
  agent("seth-lowell", "Seth Lowell", "A", "Electric", "Defense", ["Slash"], "Criminal Investigation Special Response Team", "1.1", "2024-09-04"),
  agent("soldier-0-anby", "Soldier 0 - Anby", "S", "Electric", "Attack", ["Slash"], "Defense Force - Silver Squad", "1.6", "2025-03-12"),
  agent("soldier-11", "Soldier 11", "S", "Fire", "Attack", ["Slash"], "Obol Squad", "1.0", "2024-07-04"),
  agent("soukaku", "Soukaku", "A", "Ice", "Support", ["Slash"], "Hollow Special Operations Section 6", "1.0", "2024-07-04"),
  agent("starlight-billy-kid", "Starlight - Billy Kid", "S", "Physical", "Rupture", ["Slash"], "Cunning Hares", "2.8", "2026-05-27"),
  agent("sunna", "Sunna", "S", "Physical", "Support", ["Strike"], "Angels of Delusion", "2.6", "2026-02-06"),
  agent("trigger", "Trigger", "S", "Electric", "Stun", ["Pierce"], "Obol Squad", "1.6", "2025-04-02"),
  agent("tsukishiro-yanagi", "Tsukishiro Yanagi", "S", "Electric", "Anomaly", ["Slash"], "Hollow Special Operations Section 6", "1.3", "2024-11-06"),
  agent("ukinami-yuzuha", "Ukinami Yuzuha", "S", "Physical", "Support", ["Strike"], "Spook Shack", "2.1", "2025-07-16"),
  agent("velina-airgid", "Velina Airgid", "S", "Wind", "Anomaly", ["Slash"], "External Strategy Department", "3.0", "2026-06-17"),
  agent("vivian-banshee", "Vivian Banshee", "S", "Ether", "Anomaly", ["Slash"], "Mockingbird", "1.7", "2025-04-23"),
  agent("von-lycaon", "Von Lycaon", "S", "Ice", "Stun", ["Strike"], "Victoria Housekeeping Co.", "1.0", "2024-07-04"),
  agent("ye-shunguang", "Ye Shunguang", "S", "Honed Edge", "Attack", ["Slash"], "Yunkui Summit", "2.5", "2025-12-30"),
  agent("yidhari-murphy", "Yidhari Murphy", "S", "Ice", "Rupture", ["Strike"], "Spook Shack", "2.3", "2025-11-05"),
  agent("yixuan", "Yixuan", "S", "Auric Ink", "Rupture", ["Strike"], "Yunkui Summit", "2.0", "2025-06-06"),
  agent("zhao", "Zhao", "S", "Ice", "Defense", ["Slash"], "Krampus Compliance Authority", "2.5", "2025-12-30"),
  agent("zhu-yuan", "Zhu Yuan", "S", "Ether", "Attack", ["Pierce"], "Criminal Investigation Special Response Team", "1.0", "2024-07-24")
];

export const upcomingAgents: Agent[] = [
  agent("norma-hollowell", "Norma Hollowell", "S", "Fire", "Stun", ["Strike"], "External Strategy Department", "3.0", undefined, "upcoming")
];

export const allAgents: Agent[] = [...agents, ...upcomingAgents];

const wEngine = (
  id: string,
  name: string,
  rarity: WEngine["rarity"],
  specialty: Specialty,
  source?: WEngine["source"],
  releaseVersion?: string
): WEngine => ({ id, name, rarity, specialty, source, releaseVersion });

export const wEngines: WEngine[] = [
  wEngine("angel-in-the-shell", "Angel in the Shell", "S", "Anomaly", "gacha"),
  wEngine("bellicose-blaze", "Bellicose Blaze", "S", "Attack", "gacha"),
  wEngine("blazing-laurel", "Blazing Laurel", "S", "Stun", "gacha"),
  wEngine("chief-sidekick", "Chief Sidekick", "S", "Stun", "gacha"),
  wEngine("cloudcleave-radiance", "Cloudcleave Radiance", "S", "Attack", "gacha"),
  wEngine("cordis-germina", "Cordis Germina", "S", "Attack", "gacha"),
  wEngine("deep-sea-visitor", "Deep Sea Visitor", "S", "Attack", "gacha", "1.0"),
  wEngine("dreamlit-hearth", "Dreamlit Hearth", "S", "Support", "gacha"),
  wEngine("elegant-vanity", "Elegant Vanity", "S", "Support", "gacha"),
  wEngine("flamemaker-shaker", "Flamemaker Shaker", "S", "Anomaly", "gacha"),
  wEngine("flight-of-fancy", "Flight of Fancy", "S", "Anomaly", "gacha"),
  wEngine("frostfall-sickle", "Frostfall Sickle", "S", "Anomaly", "gacha"),
  wEngine("fusion-compiler", "Fusion Compiler", "S", "Anomaly", "gacha", "1.0"),
  wEngine("hailstorm-shrine", "Hailstorm Shrine", "S", "Anomaly", "gacha"),
  wEngine("half-sugar-bunny", "Half-Sugar Bunny", "S", "Defense", "gacha"),
  wEngine("heartstring-nocturne", "Heartstring Nocturne", "S", "Attack", "gacha"),
  wEngine("hellfire-gears", "Hellfire Gears", "S", "Stun", "gacha", "1.0"),
  wEngine("ice-jade-teapot", "Ice-Jade Teapot", "S", "Stun", "gacha"),
  wEngine("joyau-dore", "Joyau Dore", "S", "Anomaly", "gacha", "3.0"),
  wEngine("krakens-cradle", "Kraken's Cradle", "S", "Rupture", "gacha"),
  wEngine("metanukimorphosis", "Metanukimorphosis", "S", "Support", "gacha"),
  wEngine("myriad-eclipse", "Myriad Eclipse", "S", "Attack", "gacha"),
  wEngine("neon-fantasies", "Neon Fantasies", "S", "Stun", "gacha"),
  wEngine("practiced-perfection", "Practiced Perfection", "S", "Anomaly", "gacha"),
  wEngine("qingming-birdcage", "Qingming Birdcage", "S", "Rupture", "gacha"),
  wEngine("riot-suppressor-mark-vi", "Riot Suppressor Mark VI", "S", "Attack", "gacha", "1.0"),
  wEngine("roaring-fur-nace", "Roaring Fur-nace", "S", "Stun", "gacha"),
  wEngine("serpentine-seeker", "Serpentine Seeker", "S", "Attack", "gacha"),
  wEngine("severed-innocence", "Severed Innocence", "S", "Attack", "gacha"),
  wEngine("sharpened-stinger", "Sharpened Stinger", "S", "Anomaly", "gacha"),
  wEngine("sol-exuvia", "Sol Exuvia", "S", "Attack", "gacha", "3.0"),
  wEngine("spectral-gaze", "Spectral Gaze", "S", "Stun", "gacha"),
  wEngine("starlight-rider-faceplate", "Starlight Rider Faceplate", "S", "Rupture", "gacha"),
  wEngine("steel-cushion", "Steel Cushion", "S", "Attack", "gacha", "1.0"),
  wEngine("the-brimstone", "The Brimstone", "S", "Attack", "gacha", "1.0"),
  wEngine("the-restrained", "The Restrained", "S", "Stun", "gacha", "1.0"),
  wEngine("thoughtbop", "Thoughtbop", "S", "Support", "gacha"),
  wEngine("timeweaver", "Timeweaver", "S", "Anomaly", "gacha"),
  wEngine("tusks-of-fury", "Tusks of Fury", "S", "Defense", "gacha"),
  wEngine("weeping-cradle", "Weeping Cradle", "S", "Support", "gacha", "1.0"),
  wEngine("wrathful-vajra", "Wrathful Vajra", "S", "Rupture", "gacha"),
  wEngine("yesterday-calls", "Yesterday Calls", "S", "Stun", "gacha"),
  wEngine("zanshin-herb-case", "Zanshin Herb Case", "S", "Attack", "gacha"),
  wEngine("bashful-demon", "Bashful Demon", "A", "Support", "gacha", "1.0"),
  wEngine("big-cylinder", "Big Cylinder", "A", "Defense", "craftable", "1.0"),
  wEngine("box-cutter", "Box Cutter", "A", "Stun", "gacha"),
  wEngine("bunny-band", "Bunny Band", "A", "Defense", "gacha", "1.0"),
  wEngine("cannon-rotor", "Cannon Rotor", "A", "Attack", "battle-pass", "1.0"),
  wEngine("cauldron-of-clarity", "Cauldron of Clarity", "A", "Rupture", "gacha"),
  wEngine("demara-battery-mark-ii", "Demara Battery Mark II", "A", "Stun", "gacha", "1.0"),
  wEngine("drill-rig-red-axis", "Drill Rig - Red Axis", "A", "Attack", "gacha", "1.0"),
  wEngine("electro-lip-gloss", "Electro-Lip Gloss", "A", "Anomaly", "battle-pass", "1.0"),
  wEngine("gilded-blossom", "Gilded Blossom", "A", "Attack", "event"),
  wEngine("grill-owisp", "Grill O'Wisp", "A", "Rupture", "gacha"),
  wEngine("housekeeper", "Housekeeper", "A", "Attack", "gacha", "1.0"),
  wEngine("iris-enigma", "Iris Enigma", "A", "Support", "gacha"),
  wEngine("kaboom-the-cannon", "Kaboom the Cannon", "A", "Support", "gacha", "1.0"),
  wEngine("marcato-desire", "Marcato Desire", "A", "Attack", "event"),
  wEngine("original-transmorpher", "Original Transmorpher", "A", "Defense", "gacha", "1.0"),
  wEngine("peacekeeper-specialized", "Peacekeeper - Specialized", "A", "Defense", "gacha", "1.0"),
  wEngine("precious-fossilized-core", "Precious Fossilized Core", "A", "Stun", "craftable", "1.0"),
  wEngine("puzzle-sphere", "Puzzle Sphere", "A", "Rupture", "gacha"),
  wEngine("radiowave-journey", "Radiowave Journey", "A", "Rupture", "gacha"),
  wEngine("rainforest-gourmet", "Rainforest Gourmet", "A", "Anomaly", "craftable", "1.0"),
  wEngine("reel-projector", "Reel Projector", "A", "Defense", "gacha"),
  wEngine("roaring-ride", "Roaring Ride", "A", "Anomaly", "gacha", "1.0"),
  wEngine("six-shooter", "Six Shooter", "A", "Stun", "battle-pass", "1.0"),
  wEngine("slice-of-time", "Slice of Time", "A", "Support", "battle-pass", "1.0"),
  wEngine("spring-embrace", "Spring Embrace", "A", "Defense", "battle-pass", "1.0"),
  wEngine("starlight-engine", "Starlight Engine", "A", "Attack", "craftable", "1.0"),
  wEngine("starlight-engine-replica", "Starlight Engine Replica", "A", "Attack", "gacha", "1.0"),
  wEngine("steam-oven", "Steam Oven", "A", "Stun", "craftable", "1.0"),
  wEngine("street-superstar", "Street Superstar", "A", "Attack", "craftable", "1.0"),
  wEngine("the-simmering-pot", "The Simmering Pot", "A", "Stun", "gacha"),
  wEngine("the-vault", "The Vault", "A", "Support", "gacha", "1.0"),
  wEngine("tremor-trigram-vessel", "Tremor Trigram Vessel", "A", "Defense", "gacha"),
  wEngine("unfettered-game-ball", "Unfettered Game Ball", "A", "Support", "craftable", "1.0"),
  wEngine("weeping-gemini", "Weeping Gemini", "A", "Anomaly", "craftable", "1.0"),
  wEngine("cinder-cobalt", "[Cinder] Cobalt", "B", "Rupture", "starter"),
  wEngine("identity-base", "[Identity] Base", "B", "Defense", "starter", "1.0"),
  wEngine("identity-inflection", "[Identity] Inflection", "B", "Defense", "starter", "1.0"),
  wEngine("lunar-decrescent", "[Lunar] Decrescent", "B", "Attack", "starter", "1.0"),
  wEngine("lunar-noviluna", "[Lunar] Noviluna", "B", "Attack", "starter", "1.0"),
  wEngine("lunar-pleniluna", "[Lunar] Pleniluna", "B", "Attack", "starter", "1.0"),
  wEngine("magnetic-storm-alpha", "[Magnetic Storm] Alpha", "B", "Anomaly", "starter", "1.0"),
  wEngine("magnetic-storm-bravo", "[Magnetic Storm] Bravo", "B", "Anomaly", "starter", "1.0"),
  wEngine("magnetic-storm-charlie", "[Magnetic Storm] Charlie", "B", "Anomaly", "starter", "1.0"),
  wEngine("reverb-mark-i", "[Reverb] Mark I", "B", "Support", "starter", "1.0"),
  wEngine("reverb-mark-ii", "[Reverb] Mark II", "B", "Support", "starter", "1.0"),
  wEngine("reverb-mark-iii", "[Reverb] Mark III", "B", "Support", "starter", "1.0"),
  wEngine("vortex-arrow", "[Vortex] Arrow", "B", "Stun", "starter", "1.0"),
  wEngine("vortex-hatchet", "[Vortex] Hatchet", "B", "Stun", "starter", "1.0"),
  wEngine("vortex-revolver", "[Vortex] Revolver", "B", "Stun", "starter", "1.0")
];

export const materials: Material[] = [
  { id: "denny", name: "Denny", category: "denny" },
  { id: "basic-investigation-log", name: "Basic Investigation Log", category: "agent_exp" },
  { id: "advanced-investigation-log", name: "Advanced Investigation Log", category: "agent_exp" },
  { id: "senior-investigation-log", name: "Senior Investigation Log", category: "agent_exp" },
  { id: "w-engine-battery", name: "W-Engine Battery", category: "engine_exp" },
  { id: "w-engine-power-supply", name: "W-Engine Power Supply", category: "engine_exp" },
  { id: "w-engine-energy-module", name: "W-Engine Energy Module", category: "engine_exp" },
  { id: "basic-attack-certification-seal", name: "Basic Attack Certification Seal", category: "promotion" },
  { id: "advanced-attack-certification-seal", name: "Advanced Attack Certification Seal", category: "promotion" },
  { id: "pioneers-attack-certification-seal", name: "Pioneer's Attack Certification Seal", category: "promotion" },
  { id: "basic-anomaly-certification-seal", name: "Basic Anomaly Certification Seal", category: "promotion" },
  { id: "advanced-anomaly-certification-seal", name: "Advanced Anomaly Certification Seal", category: "promotion" },
  { id: "controller-certification-seal", name: "Controller Certification Seal", category: "promotion" },
  { id: "basic-defense-certification-seal", name: "Basic Defense Certification Seal", category: "promotion" },
  { id: "advanced-defense-certification-seal", name: "Advanced Defense Certification Seal", category: "promotion" },
  { id: "defender-certification-seal", name: "Defender Certification Seal", category: "promotion" },
  { id: "basic-stun-certification-seal", name: "Basic Stun Certification Seal", category: "promotion" },
  { id: "advanced-stun-certification-seal", name: "Advanced Stun Certification Seal", category: "promotion" },
  { id: "buster-certification-seal", name: "Buster Certification Seal", category: "promotion" },
  { id: "basic-support-certification-seal", name: "Basic Support Certification Seal", category: "promotion" },
  { id: "advanced-support-certification-seal", name: "Advanced Support Certification Seal", category: "promotion" },
  { id: "ruler-certification-seal", name: "Ruler Certification Seal", category: "promotion" },
  { id: "basic-rupture-certification-seal", name: "Basic Rupture Certification Seal", category: "promotion" },
  { id: "advanced-rupture-certification-seal", name: "Advanced Rupture Certification Seal", category: "promotion" },
  { id: "destroyer-certification-seal", name: "Destroyer Certification Seal", category: "promotion" },
  { id: "basic-physical-chip", name: "Basic Physical Chip", category: "skill" },
  { id: "advanced-physical-chip", name: "Advanced Physical Chip", category: "skill" },
  { id: "specialized-physical-chip", name: "Specialized Physical Chip", category: "skill" },
  { id: "basic-fire-chip", name: "Basic Fire Chip", category: "skill" },
  { id: "advanced-fire-chip", name: "Advanced Fire Chip", category: "skill" },
  { id: "specialized-fire-chip", name: "Specialized Fire Chip", category: "skill" },
  { id: "basic-ice-chip", name: "Basic Ice Chip", category: "skill" },
  { id: "advanced-ice-chip", name: "Advanced Ice Chip", category: "skill" },
  { id: "specialized-ice-chip", name: "Specialized Ice Chip", category: "skill" },
  { id: "basic-electric-chip", name: "Basic Electric Chip", category: "skill" },
  { id: "advanced-electric-chip", name: "Advanced Electric Chip", category: "skill" },
  { id: "specialized-electric-chip", name: "Specialized Electric Chip", category: "skill" },
  { id: "basic-ether-chip", name: "Basic Ether Chip", category: "skill" },
  { id: "advanced-ether-chip", name: "Advanced Ether Chip", category: "skill" },
  { id: "specialized-ether-chip", name: "Specialized Ether Chip", category: "skill" },
  { id: "basic-wind-chip", name: "Basic Wind Chip", category: "skill" },
  { id: "advanced-wind-chip", name: "Advanced Wind Chip", category: "skill" },
  { id: "specialized-wind-chip", name: "Specialized Wind Chip", category: "skill" },
  { id: "attack-component", name: "Attack Component", category: "engine_modify" },
  { id: "reinforced-attack-component", name: "Reinforced Attack Component", category: "engine_modify" },
  { id: "specialized-attack-component", name: "Specialized Attack Component", category: "engine_modify" },
  { id: "anomaly-component", name: "Anomaly Component", category: "engine_modify" },
  { id: "reinforced-anomaly-component", name: "Reinforced Anomaly Component", category: "engine_modify" },
  { id: "specialized-anomaly-component", name: "Specialized Anomaly Component", category: "engine_modify" },
  { id: "defense-component", name: "Defense Component", category: "engine_modify" },
  { id: "reinforced-defense-component", name: "Reinforced Defense Component", category: "engine_modify" },
  { id: "specialized-defense-component", name: "Specialized Defense Component", category: "engine_modify" },
  { id: "stun-component", name: "Stun Component", category: "engine_modify" },
  { id: "reinforced-stun-component", name: "Reinforced Stun Component", category: "engine_modify" },
  { id: "specialized-stun-component", name: "Specialized Stun Component", category: "engine_modify" },
  { id: "support-component", name: "Support Component", category: "engine_modify" },
  { id: "reinforced-support-component", name: "Reinforced Support Component", category: "engine_modify" },
  { id: "specialized-support-component", name: "Specialized Support Component", category: "engine_modify" },
  { id: "rupture-component", name: "Rupture Component", category: "engine_modify" },
  { id: "reinforced-rupture-component", name: "Reinforced Rupture Component", category: "engine_modify" },
  { id: "specialized-rupture-component", name: "Specialized Rupture Component", category: "engine_modify" },
  { id: "hamster-cage-pass", name: "Hamster Cage Pass", category: "universal" },
  { id: "higher-dimensional-data", name: "Higher Dimensional Data", category: "core_skill" },
  { id: "finale-dance-shoes", name: "Finale Dance Shoes", category: "core_skill" },
  { id: "ferocious-grip", name: "Ferocious Grip", category: "core_skill" },
  { id: "living-drive", name: "Living Drive", category: "core_skill" },
  { id: "scarlet-engine", name: "Scarlet Engine", category: "core_skill" }
];

export const driveDiscs: DriveDisc[] = [
  {
    id: "fanged-metal",
    name: "Fanged Metal",
    twoPiece: "Increases Physical DMG.",
    fourPiece: "Increases damage dealt to targets affected by Assault.",
    releaseVersion: "1.0"
  },
  {
    id: "freedom-blues",
    name: "Freedom Blues",
    twoPiece: "Increases Anomaly Proficiency.",
    fourPiece: "Reduces enemy Anomaly Buildup RES for the equipper's attribute.",
    releaseVersion: "1.0"
  },
  {
    id: "hormone-punk",
    name: "Hormone Punk",
    twoPiece: "Increases ATK.",
    fourPiece: "Increases ATK after entering combat or switching in.",
    releaseVersion: "1.0"
  },
  {
    id: "inferno-metal",
    name: "Inferno Metal",
    twoPiece: "Increases Fire DMG.",
    fourPiece: "Increases CRIT Rate when hitting Burning enemies.",
    releaseVersion: "1.0"
  },
  {
    id: "polar-metal",
    name: "Polar Metal",
    twoPiece: "Increases Ice DMG.",
    fourPiece: "Increases Basic Attack and Dash Attack damage.",
    releaseVersion: "1.0"
  },
  {
    id: "puffer-electro",
    name: "Puffer Electro",
    twoPiece: "Increases PEN Ratio.",
    fourPiece: "Increases Ultimate damage and ATK after using Ultimate.",
    releaseVersion: "1.0"
  },
  {
    id: "soul-rock",
    name: "Soul Rock",
    twoPiece: "Increases DEF.",
    fourPiece: "Reduces damage taken after losing HP.",
    releaseVersion: "1.0"
  },
  {
    id: "woodpecker-electro",
    name: "Woodpecker Electro",
    twoPiece: "Increases CRIT Rate.",
    fourPiece: "Landing critical hits can increase attack.",
    releaseVersion: "1.0"
  },
  {
    id: "shockstar-disco",
    name: "Shockstar Disco",
    twoPiece: "Increases Impact.",
    fourPiece: "Basic Attacks, Dash Attacks, and Dodge Counters inflict more Daze.",
    releaseVersion: "1.0"
  },
  {
    id: "swing-jazz",
    name: "Swing Jazz",
    twoPiece: "Increases Energy Regen.",
    fourPiece: "Chain Attacks and Ultimates can increase squad damage.",
    releaseVersion: "1.0"
  },
  {
    id: "thunder-metal",
    name: "Thunder Metal",
    twoPiece: "Increases Electric DMG.",
    fourPiece: "Increases ATK when an enemy is Shocked.",
    releaseVersion: "1.0"
  },
  {
    id: "chaos-jazz",
    name: "Chaos Jazz",
    twoPiece: "Increases Anomaly Proficiency.",
    fourPiece: "Improves Fire and Electric damage while off-field.",
    releaseVersion: "1.2"
  },
  {
    id: "proto-punk",
    name: "Proto Punk",
    twoPiece: "Increases Shield Effect.",
    fourPiece: "Increases squad damage after Defensive Assist or Evasive Assist.",
    releaseVersion: "1.2"
  },
  {
    id: "chaotic-metal",
    name: "Chaotic Metal",
    twoPiece: "Increases Ether DMG.",
    fourPiece: "Increases CRIT DMG and improves the effect when any squad member triggers Corruption.",
    releaseVersion: "1.3"
  },
  {
    id: "branch-and-blade-song",
    name: "Branch & Blade Song",
    twoPiece: "Increases CRIT DMG.",
    fourPiece: "Improves CRIT Rate after Anomaly Mastery conditions are met.",
    releaseVersion: "1.4"
  },
  {
    id: "bunny-in-wonderland",
    name: "Bunny in Wonderland",
    twoPiece: "Increases HP.",
    fourPiece: "Improves squad damage when the equipper is a Defense character and uses EX Special Attack, Defensive Assist, or Evasive Assist.",
    releaseVersion: "2.0"
  },
  {
    id: "shadow-harmony",
    name: "Shadow Harmony",
    twoPiece: "Increases Aftershock and Dash Attack damage.",
    fourPiece: "Improves CRIT Rate and CRIT DMG after Aftershock or Dash Attacks.",
    releaseVersion: "1.6"
  },
  {
    id: "astral-voice",
    name: "Astral Voice",
    twoPiece: "Increases ATK.",
    fourPiece: "Improves squad damage after Quick Assist.",
    releaseVersion: "1.5"
  },
  {
    id: "phaethons-melody",
    name: "Phaethon's Melody",
    twoPiece: "Increases Energy Regen.",
    fourPiece: "Increases squad Anomaly Proficiency after EX Special Attack or Chain Attack.",
    releaseVersion: "1.7"
  },
  {
    id: "notes-from-the-chained",
    name: "Notes from the Chained",
    twoPiece: "Increases Ice DMG.",
    fourPiece: "Improves Anomaly Proficiency and Anomaly damage after triggering Abloom or Freeze.",
    releaseVersion: "2.1"
  },
  {
    id: "shining-aria",
    name: "Shining Aria",
    twoPiece: "Increases Ether DMG.",
    fourPiece: "Improves Anomaly Proficiency after Basic Attack and damage while enemies are Stunned.",
    releaseVersion: "2.0"
  },
  {
    id: "yunkui-tales",
    name: "Yunkui Tales",
    twoPiece: "Increases HP.",
    fourPiece: "Improves CRIT Rate after using EX Special Attack, Chain Attack, or Ultimate.",
    releaseVersion: "2.0"
  },
  {
    id: "king-of-the-summit",
    name: "King of the Summit",
    twoPiece: "Increases Daze.",
    fourPiece: "Improves squad CRIT DMG after applying a shield or using an EX Special Attack.",
    releaseVersion: "2.0"
  },
  {
    id: "moonlight-lullaby",
    name: "Moonlight Lullaby",
    twoPiece: "Increases Energy Regen.",
    fourPiece: "Improves squad damage when the equipper uses EX Special Attack, Chain Attack, or Ultimate.",
    releaseVersion: "2.1"
  },
  {
    id: "dawns-bloom",
    name: "Dawn's Bloom",
    twoPiece: "Increases Basic Attack damage.",
    fourPiece: "Improves Basic Attack and Dash Attack damage after EX Special Attack.",
    releaseVersion: "3.0"
  },
  {
    id: "white-water-ballad",
    name: "White Water Ballad",
    twoPiece: "Increases Physical DMG.",
    fourPiece: "Improves CRIT Rate and ATK around Ether Veil effects.",
    releaseVersion: "3.0"
  }
];

export const levelCostTable = [
  { min: 1, max: 10, dennyPerLevel: 600, expPerLevel: 800 },
  { min: 10, max: 20, dennyPerLevel: 1200, expPerLevel: 1600 },
  { min: 20, max: 30, dennyPerLevel: 2400, expPerLevel: 3200 },
  { min: 30, max: 40, dennyPerLevel: 4800, expPerLevel: 6400 },
  { min: 40, max: 50, dennyPerLevel: 9000, expPerLevel: 12000 },
  { min: 50, max: 60, dennyPerLevel: 15000, expPerLevel: 20000 }
];

export const datasetMeta = {
  game: "Zenless Zone Zero",
  maxVersion: "3.0",
  generatedAt: "2026-06-29",
  releasedAgentCount: agents.length,
  upcomingAgentCount: upcomingAgents.length,
  wEngineCount: wEngines.length,
  driveDiscCount: driveDiscs.length,
  materialCount: materials.length,
  notes: [
    "Agents include released playable agents through Version 3.0 as of 2026-06-29.",
    "Norma Hollowell is included as upcoming because she is listed for Version 3.0 but not yet released on 2026-06-29.",
    "W-Engine and drive disc datasets are implemented as catalog records. Long effect text can be refined later without breaking IDs."
  ]
};
