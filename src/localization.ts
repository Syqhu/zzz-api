import type { Agent, DriveDisc, Material, WEngine } from "./data.js";

type Locale = "en" | "ja";

const attributeJa: Record<string, string> = {
  Electric: "電気",
  Fire: "炎",
  Ice: "氷",
  Physical: "物理",
  Ether: "エーテル",
  Wind: "風",
  "Honed Edge": "烈霜",
  Frost: "霜寒",
  "Auric Ink": "玄墨"
};

const specialtyJa: Record<string, string> = {
  Attack: "強攻",
  Anomaly: "異常",
  Defense: "防護",
  Stun: "撃破",
  Support: "支援",
  Rupture: "命破"
};

const attackTypeJa: Record<string, string> = {
  Slash: "斬撃",
  Strike: "打撃",
  Pierce: "刺突"
};

const releaseStatusJa: Record<string, string> = {
  released: "実装済み",
  upcoming: "実装予定"
};

const materialCategoryJa: Record<string, string> = {
  agent_exp: "エージェント経験値",
  denny: "ディニー",
  promotion: "昇格素材",
  skill: "スキル素材",
  engine_exp: "音動機経験値",
  engine_modify: "音動機改造素材",
  core_skill: "コアスキル素材",
  universal: "汎用素材"
};

const agentNameJa: Record<string, string> = {
  "alexandrina-sebastiane": "アレクサンドリナ・セバスチャン",
  anby: "アンビー・デマラ",
  "anton-ivanov": "アンドー・イワノフ",
  "asaba-harumasa": "浅羽悠真",
  "astra-yao": "アストラ・ヤオ",
  "ben-bigger": "ベン・ビガー",
  billy: "ビリー・キッド",
  "burnice-white": "バーニス・ホワイト",
  "caesar-king": "シーザー・キング",
  "corin-wickes": "カリン・ウィクス",
  ellen: "エレン・ジョー",
  "evelyn-chevalier": "イヴリン・シェヴァリエ",
  "grace-howard": "グレース・ハワード",
  "hoshimi-miyabi": "星見雅",
  "hugo-vlad": "ヒューゴ・ヴラド",
  "jane-doe": "ジェーン・ドゥ",
  "koleda": "クレタ・ベロボーグ",
  lighter: "ライト",
  "luciana-de-montefio": "ルーシー",
  "nekomiya-mana": "猫宮又奈",
  nicole: "ニコ・デマラ",
  "piper-wheel": "パイパー・ウィール",
  "pulchra-fellini": "プルクラ・フェリーニ",
  qingyi: "青衣",
  "seth-lowell": "セス・ローウェル",
  "soldier-0-anby": "零号・アンビー",
  "soldier-11": "11号",
  soukaku: "蒼角",
  trigger: "トリガー",
  "tsukishiro-yanagi": "月城柳",
  "vivian-banshee": "ビビアン・バンシー",
  "von-lycaon": "フォン・ライカン",
  "zhu-yuan": "朱鳶"
};

const factionJa: Record<string, string> = {
  "Victoria Housekeeping Co.": "ヴィクトリア家政",
  "Cunning Hares": "邪兎屋",
  "Belobog Heavy Industries": "白祇重工",
  "Hollow Special Operations Section 6": "対ホロウ6課",
  "Stars of Lyra": "スターズ・オブ・リラ",
  "Sons of Calydon": "カリュドーンの子",
  "Criminal Investigation Special Response Team": "特務捜査班",
  "Yunkui Summit": "雲嶽山",
  "Obol Squad": "オボルス小隊",
  "Victoria Housekeeping": "ヴィクトリア家政",
  Phaethon: "パエトーン"
};

const wEngineNameJa: Record<string, string> = {
  "demara-battery-mark-ii": "デマラ式電池II型",
  "the-vault": "ザ・ボールト",
  "deep-sea-visitor": "ディープシー・ビジター",
  "hellfire-gears": "燃獄ギア",
  "joyau-dore": "金賞の花"
};

const materialNameJa: Record<string, string> = {
  denny: "ディニー",
  "basic-investigation-log": "初級調査員記録",
  "advanced-investigation-log": "上級調査員記録",
  "senior-investigation-log": "特級調査員記録",
  "basic-attack-certification-seal": "初級強攻認証バッジ",
  "advanced-attack-certification-seal": "上級強攻認証バッジ",
  "basic-anomaly-certification-seal": "初級異常認証バッジ",
  "advanced-anomaly-certification-seal": "上級異常認証バッジ",
  "basic-defense-certification-seal": "初級防護認証バッジ",
  "advanced-defense-certification-seal": "上級防護認証バッジ",
  "basic-stun-certification-seal": "初級撃破認証バッジ",
  "advanced-stun-certification-seal": "上級撃破認証バッジ",
  "basic-support-certification-seal": "初級支援認証バッジ",
  "advanced-support-certification-seal": "上級支援認証バッジ",
  "basic-rupture-certification-seal": "初級命破認証バッジ",
  "advanced-rupture-certification-seal": "上級命破認証バッジ",
  "w-engine-battery": "音動機用バッテリー",
  "w-engine-power-supply": "音動機用電源",
  "w-engine-energy-module": "音動機用エネルギーモジュール",
  "pioneers-attack-certification-seal": "先駆者の強攻認証バッジ",
  "controller-certification-seal": "統御者認証バッジ",
  "defender-certification-seal": "守護者認証バッジ",
  "buster-certification-seal": "破陣者認証バッジ",
  "ruler-certification-seal": "支配者認証バッジ",
  "destroyer-certification-seal": "破壊者認証バッジ",
  "basic-physical-chip": "初級物理チップ",
  "advanced-physical-chip": "上級物理チップ",
  "specialized-physical-chip": "特化物理チップ",
  "basic-fire-chip": "初級炎チップ",
  "advanced-fire-chip": "上級炎チップ",
  "specialized-fire-chip": "特化炎チップ",
  "basic-ice-chip": "初級氷チップ",
  "advanced-ice-chip": "上級氷チップ",
  "specialized-ice-chip": "特化氷チップ",
  "basic-electric-chip": "初級電気チップ",
  "advanced-electric-chip": "上級電気チップ",
  "specialized-electric-chip": "特化電気チップ",
  "basic-ether-chip": "初級エーテルチップ",
  "advanced-ether-chip": "上級エーテルチップ",
  "specialized-ether-chip": "特化エーテルチップ",
  "basic-wind-chip": "初級風チップ",
  "advanced-wind-chip": "上級風チップ",
  "specialized-wind-chip": "特化風チップ",
  "attack-component": "強攻キット",
  "reinforced-attack-component": "強化型強攻キット",
  "specialized-attack-component": "特化型強攻キット",
  "anomaly-component": "異常キット",
  "reinforced-anomaly-component": "強化型異常キット",
  "specialized-anomaly-component": "特化型異常キット",
  "defense-component": "防護キット",
  "reinforced-defense-component": "強化型防護キット",
  "specialized-defense-component": "特化型防護キット",
  "stun-component": "撃破キット",
  "reinforced-stun-component": "強化型撃破キット",
  "specialized-stun-component": "特化型撃破キット",
  "support-component": "支援キット",
  "reinforced-support-component": "強化型支援キット",
  "specialized-support-component": "特化型支援キット",
  "rupture-component": "命破キット",
  "reinforced-rupture-component": "強化型命破キット",
  "specialized-rupture-component": "特化型命破キット",
  "hamster-cage-pass": "ハムスターケージ",
  "higher-dimensional-data": "高次元データ",
  "finale-dance-shoes": "フィナーレ・ダンスシューズ",
  "ferocious-grip": "狂暴な掌握",
  "living-drive": "生命の駆動",
  "scarlet-engine": "緋色のエンジン"
};

const driveDiscNameJa: Record<string, string> = {
  "fanged-metal": "獣牙のヘヴィメタル",
  "freedom-blues": "フリーダム・ブルース",
  "hormone-punk": "ホルモン・パンク",
  "inferno-metal": "炎獄のヘヴィメタル",
  "polar-metal": "極地のヘヴィメタル",
  "puffer-electro": "パファー・エレクトロ",
  "soul-rock": "ソウル・ロック",
  "woodpecker-electro": "ウッドペッカー・エレクトロ",
  "shockstar-disco": "ショックスター・ディスコ",
  "swing-jazz": "スイング・ジャズ",
  "thunder-metal": "霹靂のヘヴィメタル",
  "chaos-jazz": "ケイオス・ジャズ",
  "proto-punk": "プロト・パンク",
  "chaotic-metal": "混沌のヘヴィメタル",
  "branch-and-blade-song": "折枝の刀歌",
  "bunny-in-wonderland": "不思議の国のバニー",
  "shadow-harmony": "シャドウハーモニー",
  "astral-voice": "アストラル・ボイス",
  "phaethons-melody": "パエトーンの歌",
  "notes-from-the-chained": "静寂の記録",
  "shining-aria": "輝きのアリア",
  "yunkui-tales": "雲嶽は我に似たり",
  "king-of-the-summit": "山大王",
  "moonlight-lullaby": "月光の子守唄",
  "white-water-ballad": "白波のバラード",
  "dawns-bloom": "暁に咲く花"
};

export function readLocale(value: unknown): Locale {
  return value === "ja" ? "ja" : "en";
}

export function localizeAgent(agent: Agent, locale: Locale) {
  if (locale !== "ja") {
    return agent;
  }

  return {
    ...agent,
    localized: {
      lang: "ja",
      name: agentNameJa[agent.id] ?? agent.name,
      attribute: attributeJa[agent.attribute] ?? agent.attribute,
      specialty: specialtyJa[agent.specialty] ?? agent.specialty,
      attackTypes: agent.attackTypes.map((type) => attackTypeJa[type] ?? type),
      faction: factionJa[agent.faction] ?? agent.faction,
      releaseStatus: releaseStatusJa[agent.releaseStatus] ?? agent.releaseStatus
    }
  };
}

export function localizeWEngine(wEngine: WEngine, locale: Locale) {
  if (locale !== "ja") {
    return wEngine;
  }

  return {
    ...wEngine,
    localized: {
      lang: "ja",
      name: wEngineNameJa[wEngine.id] ?? wEngine.name,
      specialty: specialtyJa[wEngine.specialty] ?? wEngine.specialty
    }
  };
}

export function localizeMaterial(material: Material, locale: Locale) {
  if (locale !== "ja") {
    return material;
  }

  return {
    ...material,
    localized: {
      lang: "ja",
      name: materialNameJa[material.id] ?? material.name,
      category: materialCategoryJa[material.category] ?? material.category
    }
  };
}

export function localizeDriveDisc(driveDisc: DriveDisc, locale: Locale) {
  if (locale !== "ja") {
    return driveDisc;
  }

  return {
    ...driveDisc,
    localized: {
      lang: "ja",
      name: driveDiscNameJa[driveDisc.id] ?? driveDisc.name
    }
  };
}
