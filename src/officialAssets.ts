import type { AssetKind } from "./assets.js";

type OfficialAsset = {
  icon: string;
  card?: string;
  source: "hoyoverse-official" | "hakush" | "fandom-special-redirect";
};

const hakush = (path: string) => `https://api.hakush.in/zzz/UI/${path}`;
const hoyoverseCdn = (path: string) => `https://fastcdn.hoyoverse.com/content-v2/nap/${path}`;

const agentAssets: Record<string, OfficialAsset> = {
  "alexandrina-sebastiane": { icon: hakush("IconRoleCrop22.webp"), card: hakush("IconRole22.webp"), source: "hakush" },
  "alice-thymefield": { icon: hakush("IconRoleCrop46.webp"), card: hakush("IconRole46.webp"), source: "hakush" },
  anby: { icon: hakush("IconRoleCrop01.webp"), card: hakush("IconRole01.webp"), source: "hakush" },
  "anton-ivanov": { icon: hakush("IconRoleCrop15.webp"), card: hakush("IconRole15.webp"), source: "hakush" },
  "asaba-harumasa": { icon: hakush("IconRoleCrop35.webp"), card: hakush("IconRole35.webp"), source: "hakush" },
  "astra-yao": { icon: hakush("IconRoleCrop36.webp"), card: hakush("IconRole36.webp"), source: "hakush" },
  banyue: { icon: hakush("IconRoleCrop54.webp"), card: hakush("IconRole54.webp"), source: "hakush" },
  "ben-bigger": { icon: hakush("IconRoleCrop16.webp"), card: hakush("IconRole16.webp"), source: "hakush" },
  billy: { icon: hakush("IconRoleCrop10.webp"), card: hakush("IconRole10.webp"), source: "hakush" },
  "burnice-white": { icon: hakush("IconRoleCrop32.webp"), card: hakush("IconRole32.webp"), source: "hakush" },
  "caesar-king": { icon: hakush("IconRoleCrop25.webp"), card: hakush("IconRole25.webp"), source: "hakush" },
  "corin-wickes": { icon: hakush("IconRoleCrop09.webp"), card: hakush("IconRole09.webp"), source: "hakush" },
  ellen: { icon: hakush("IconRoleCrop21.webp"), card: hakush("IconRole21.webp"), source: "hakush" },
  "evelyn-chevalier": { icon: hakush("IconRoleCrop37.webp"), card: hakush("IconRole37.webp"), source: "hakush" },
  "grace-howard": { icon: hakush("IconRoleCrop20.webp"), card: hakush("IconRole20.webp"), source: "hakush" },
  "hoshimi-miyabi": { icon: hakush("IconRoleCrop13.webp"), card: hakush("IconRole13.webp"), source: "hakush" },
  "hugo-vlad": { icon: hakush("IconRoleCrop42.webp"), card: hakush("IconRole42.webp"), source: "hakush" },
  "jane-doe": { icon: hakush("IconRoleCrop24.webp"), card: hakush("IconRole24.webp"), source: "hakush" },
  "ju-fufu": { icon: hakush("IconRoleCrop43.webp"), card: hakush("IconRole43.webp"), source: "hakush" },
  koleda: { icon: hakush("IconRoleCrop14.webp"), card: hakush("IconRole14.webp"), source: "hakush" },
  "komano-manato": { icon: hakush("IconRoleCrop51.webp"), card: hakush("IconRole51.webp"), source: "hakush" },
  lighter: { icon: hakush("IconRoleCrop26.webp"), card: hakush("IconRole26.webp"), source: "hakush" },
  "lucia-elowen": { icon: hakush("IconRoleCrop50.webp"), card: hakush("IconRole50.webp"), source: "hakush" },
  "luciana-de-montefio": { icon: hakush("IconRoleCrop27.webp"), card: hakush("IconRole27.webp"), source: "hakush" },
  "nekomiya-mana": {
    icon: hoyoverseCdn("102427/ef4310d8f18a62aa70f412fb534b1086_7779971017639587835.png"),
    card: hoyoverseCdn("102427/2aaff92fc1ef7183af44bfaf83c436af_4830154317591375669.png"),
    source: "hoyoverse-official"
  },
  nicole: { icon: hakush("IconRoleCrop12.webp"), card: hakush("IconRole12.webp"), source: "hakush" },
  "orphie-magnusson-and-magus": { icon: hakush("IconRoleCrop49.webp"), card: hakush("IconRole49.webp"), source: "hakush" },
  "pan-yinhu": { icon: hakush("IconRoleCrop45.webp"), card: hakush("IconRole45.webp"), source: "hakush" },
  "piper-wheel": { icon: hakush("IconRoleCrop28.webp"), card: hakush("IconRole28.webp"), source: "hakush" },
  "pulchra-fellini": { icon: hakush("IconRoleCrop38.webp"), card: hakush("IconRole38.webp"), source: "hakush" },
  qingyi: { icon: hakush("IconRoleCrop29.webp"), card: hakush("IconRole29.webp"), source: "hakush" },
  seed: { icon: hakush("IconRoleCrop48.webp"), card: hakush("IconRole48.webp"), source: "hakush" },
  "seth-lowell": { icon: hakush("IconRoleCrop30.webp"), card: hakush("IconRole30.webp"), source: "hakush" },
  "soldier-0-anby": { icon: hakush("IconRoleCrop40.webp"), card: hakush("IconRole40.webp"), source: "hakush" },
  "soldier-11": { icon: hakush("IconRoleCrop05.webp"), card: hakush("IconRole05.webp"), source: "hakush" },
  soukaku: { icon: hakush("IconRoleCrop17.webp"), card: hakush("IconRole17.webp"), source: "hakush" },
  trigger: { icon: hakush("IconRoleCrop39.webp"), card: hakush("IconRole39.webp"), source: "hakush" },
  "tsukishiro-yanagi": { icon: hakush("IconRoleCrop31.webp"), card: hakush("IconRole31.webp"), source: "hakush" },
  "ukinami-yuzuha": { icon: hakush("IconRoleCrop47.webp"), card: hakush("IconRole47.webp"), source: "hakush" },
  "vivian-banshee": { icon: hakush("IconRoleCrop41.webp"), card: hakush("IconRole41.webp"), source: "hakush" },
  "von-lycaon": { icon: hakush("IconRoleCrop18.webp"), card: hakush("IconRole18.webp"), source: "hakush" },
  "yidhari-murphy": { icon: hakush("IconRoleCrop52.webp"), card: hakush("IconRole52.webp"), source: "hakush" },
  yixuan: { icon: hakush("IconRoleCrop44.webp"), card: hakush("IconRole44.webp"), source: "hakush" },
  "zhu-yuan": { icon: hakush("IconRoleCrop23.webp"), card: hakush("IconRole23.webp"), source: "hakush" }
};

const driveDiscAssets: Record<string, OfficialAsset> = {
  "astral-voice": { icon: hakush("SuitAstralVoice.webp"), source: "hakush" },
  "branch-and-blade-song": { icon: hakush("SuitBranch&BladeSong.webp"), source: "hakush" },
  "chaos-jazz": { icon: hakush("SuitChaosJazz.webp"), source: "hakush" },
  "chaotic-metal": { icon: hakush("SuitChaosMetal.webp"), source: "hakush" },
  "dawns-bloom": { icon: hakush("SuitDawnsBloom.webp"), source: "hakush" },
  "fanged-metal": { icon: hakush("SuitFangedMetal.webp"), source: "hakush" },
  "freedom-blues": { icon: hakush("SuitFreedomBlues.webp"), source: "hakush" },
  "hormone-punk": { icon: hakush("SuitHormonePunk.webp"), source: "hakush" },
  "inferno-metal": { icon: hakush("SuitInfernoMetal.webp"), source: "hakush" },
  "king-of-the-summit": { icon: hakush("SuitKingoftheSummit.webp"), source: "hakush" },
  "moonlight-lullaby": { icon: hakush("SuitMoonlightLullaby.webp"), source: "hakush" },
  "phaethons-melody": { icon: hakush("SuitSavior.webp"), source: "hakush" },
  "polar-metal": { icon: hakush("SuitPolarMetal.webp"), source: "hakush" },
  "proto-punk": { icon: hakush("SuitProtoPunk.webp"), source: "hakush" },
  "puffer-electro": { icon: hakush("SuitPufferElectro.webp"), source: "hakush" },
  "shadow-harmony": { icon: hakush("SuitShadow.webp"), source: "hakush" },
  "shockstar-disco": { icon: hakush("SuitShockstarDisco.webp"), source: "hakush" },
  "soul-rock": { icon: hakush("SuitSoulRock.webp"), source: "hakush" },
  "swing-jazz": { icon: hakush("SuitSwingJazz.webp"), source: "hakush" },
  "thunder-metal": { icon: hakush("SuitThunderMetal.webp"), source: "hakush" },
  "woodpecker-electro": { icon: hakush("SuitWoodpeckerElectro.webp"), source: "hakush" },
  "yunkui-tales": { icon: hakush("SuitYunkuiTales.webp"), source: "hakush" }
};

const officialAssets: Partial<Record<AssetKind, Record<string, OfficialAsset>>> = {
  agents: agentAssets,
  "drive-discs": driveDiscAssets
};

export function findOfficialAsset(kind: AssetKind, id: string) {
  return officialAssets[kind]?.[id];
}
