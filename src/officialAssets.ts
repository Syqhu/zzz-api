import type { AssetKind } from "./assets.js";

type OfficialAsset = {
  icon: string;
  card?: string;
  source: "hoyoverse-official" | "hakush" | "fandom-special-redirect";
};

const hakush = (path: string) => `https://api.hakush.in/zzz/UI/${path}`;
const hoyoverseCdn = (path: string) => `https://fastcdn.hoyoverse.com/content-v2/nap/${path}`;

const agentAssets: Record<string, OfficialAsset> = {
  "alexandrina-sebastiane": { icon: hoyoverseCdn("113612/24f2740a52110a0491ae5bc49ecb23ba_4790537105761997346.png"), card: hoyoverseCdn("113612/24f2740a52110a0491ae5bc49ecb23ba_4790537105761997346.png"), source: "hoyoverse-official" },
  "alice-thymefield": { icon: hoyoverseCdn("156728/a8237a45141a924a7fba8d74a91ac261_3295946505674175020.png"), card: hoyoverseCdn("156728/a8237a45141a924a7fba8d74a91ac261_3295946505674175020.png"), source: "hoyoverse-official" },
  "anby": { icon: hoyoverseCdn("102103/1cf1ab68f06c0d2115ce382e6804e714_3383703376437037229.png"), card: hoyoverseCdn("102103/1cf1ab68f06c0d2115ce382e6804e714_3383703376437037229.png"), source: "hoyoverse-official" },
  "anton-ivanov": { icon: hoyoverseCdn("102769/ccc445fe52e84610e3e9343d34276899_9055334861656440129.png"), card: hoyoverseCdn("102769/ccc445fe52e84610e3e9343d34276899_9055334861656440129.png"), source: "hoyoverse-official" },
  "aria": { icon: hoyoverseCdn("161792/e1e816946b90b6af17d2a6beee7de6bf_6851365167422486772.png"), card: hoyoverseCdn("161792/e1e816946b90b6af17d2a6beee7de6bf_6851365167422486772.png"), source: "hoyoverse-official" },
  "asaba-harumasa": { icon: hoyoverseCdn("126693/e3b951480021844f724594411b317f10_3435695605970332945.png"), card: hoyoverseCdn("126693/e3b951480021844f724594411b317f10_3435695605970332945.png"), source: "hoyoverse-official" },
  "astra-yao": { icon: hoyoverseCdn("127387/6ab6842b1aa84556f176d87e0f41f8f3_4716046376600021245.png"), card: hoyoverseCdn("127387/6ab6842b1aa84556f176d87e0f41f8f3_4716046376600021245.png"), source: "hoyoverse-official" },
  "banyue": { icon: hoyoverseCdn("160168/5ca3559a147248da4114afa504397dd1_3443450437018539200.png"), card: hoyoverseCdn("160168/5ca3559a147248da4114afa504397dd1_3443450437018539200.png"), source: "hoyoverse-official" },
  "ben-bigger": { icon: hoyoverseCdn("102852/e81f1c2978debb5b7f6a33187572cc26_641108854745438561.png"), card: hoyoverseCdn("102852/e81f1c2978debb5b7f6a33187572cc26_641108854745438561.png"), source: "hoyoverse-official" },
  "billy": { icon: hoyoverseCdn("102184/96e7d507f3aa3a6ccd9de17b97b1c062_6037497242185281511.png"), card: hoyoverseCdn("102184/96e7d507f3aa3a6ccd9de17b97b1c062_6037497242185281511.png"), source: "hoyoverse-official" },
  "burnice-white": { icon: hoyoverseCdn("125214/9ccd4f5c1997318ec545a1f37bd23726_7904001525523783480.png"), card: hoyoverseCdn("125214/9ccd4f5c1997318ec545a1f37bd23726_7904001525523783480.png"), source: "hoyoverse-official" },
  "caesar-king": { icon: hoyoverseCdn("125210/17762e78d1316369f91bf2b94741ab9b_1106127992573250826.png"), card: hoyoverseCdn("125210/17762e78d1316369f91bf2b94741ab9b_1106127992573250826.png"), source: "hoyoverse-official" },
  "cissia": { icon: hoyoverseCdn("162680/585f3ee1e8c2b94705a63f5a825884cc_4908432112529369481.png"), card: hoyoverseCdn("162680/585f3ee1e8c2b94705a63f5a825884cc_4908432112529369481.png"), source: "hoyoverse-official" },
  "corin-wickes": { icon: hoyoverseCdn("102477/b2fb8efc534c5eaa2206ccfee19971f9_587151823061469836.png"), card: hoyoverseCdn("102477/b2fb8efc534c5eaa2206ccfee19971f9_587151823061469836.png"), source: "hoyoverse-official" },
  "dialyn": { icon: hoyoverseCdn("160142/dc7b9329d1e95c990094ac368d07dcdf_1308477408469485834.png"), card: hoyoverseCdn("160142/dc7b9329d1e95c990094ac368d07dcdf_1308477408469485834.png"), source: "hoyoverse-official" },
  "ellen": { icon: hoyoverseCdn("113671/59a98a82a886f49c3b1b89bdc77cbb36_21606237077173472.png"), card: hoyoverseCdn("113671/59a98a82a886f49c3b1b89bdc77cbb36_21606237077173472.png"), source: "hoyoverse-official" },
  "evelyn-chevalier": { icon: hoyoverseCdn("127403/e90f841040d1b7f1d703dffebe2edf64_3255851908411847312.png"), card: hoyoverseCdn("127403/e90f841040d1b7f1d703dffebe2edf64_3255851908411847312.png"), source: "hoyoverse-official" },
  "grace-howard": { icon: hoyoverseCdn("113532/e30489408ee43cd0f2c089a9d0859143_7946847913858642631.png"), card: hoyoverseCdn("113532/e30489408ee43cd0f2c089a9d0859143_7946847913858642631.png"), source: "hoyoverse-official" },
  "hoshimi-miyabi": { icon: hoyoverseCdn("103379/a0b6a3fedf5b19a224dad6332f5c9404_8648655379164550438.png"), card: hoyoverseCdn("103379/a0b6a3fedf5b19a224dad6332f5c9404_8648655379164550438.png"), source: "hoyoverse-official" },
  "hugo-vlad": { icon: hoyoverseCdn("154609/615e0e4747ebb6850da580197afd808d_1117746455351627130.png"), card: hoyoverseCdn("154609/615e0e4747ebb6850da580197afd808d_1117746455351627130.png"), source: "hoyoverse-official" },
  "jane-doe": { icon: hoyoverseCdn("124675/be75dc37b5f356bdebc358fa21b7086a_5376265045261362106.png"), card: hoyoverseCdn("124675/be75dc37b5f356bdebc358fa21b7086a_5376265045261362106.png"), source: "hoyoverse-official" },
  "ju-fufu": { icon: hoyoverseCdn("155659/c47d1280baedc3e06d648835355697da_5057013715001391411.png"), card: hoyoverseCdn("155659/c47d1280baedc3e06d648835355697da_5057013715001391411.png"), source: "hoyoverse-official" },
  "koleda": { icon: hoyoverseCdn("102708/6e4c67af60cd634ce18433ba42527422_353400758901684502.png"), card: hoyoverseCdn("102708/6e4c67af60cd634ce18433ba42527422_353400758901684502.png"), source: "hoyoverse-official" },
  "komano-manato": { icon: hoyoverseCdn("158996/2679e3fcafde73e483927972cf7d2ae1_8136552018718167046.png"), card: hoyoverseCdn("158996/2679e3fcafde73e483927972cf7d2ae1_8136552018718167046.png"), source: "hoyoverse-official" },
  "lighter": { icon: hoyoverseCdn("126060/f47c1b283f33d8613af27ac949718128_6585648807276197340.png"), card: hoyoverseCdn("126060/f47c1b283f33d8613af27ac949718128_6585648807276197340.png"), source: "hoyoverse-official" },
  "lucia-elowen": { icon: hoyoverseCdn("158985/e90ee65a51825d15b050771b11266ed2_5406952935168116492.png"), card: hoyoverseCdn("158985/e90ee65a51825d15b050771b11266ed2_5406952935168116492.png"), source: "hoyoverse-official" },
  "luciana-de-montefio": { icon: hoyoverseCdn("124308/dfc4ba20f7d676267870771b3a075b86_7390214467576052477.png"), card: hoyoverseCdn("124308/dfc4ba20f7d676267870771b3a075b86_7390214467576052477.png"), source: "hoyoverse-official" },
  "nangong-yu": { icon: hoyoverseCdn("162652/af24710d9e7d31f33c7a12589bd14ba2_604255830637894303.png"), card: hoyoverseCdn("162652/af24710d9e7d31f33c7a12589bd14ba2_604255830637894303.png"), source: "hoyoverse-official" },
  "nekomiya-mana": { icon: hoyoverseCdn("102427/2aaff92fc1ef7183af44bfaf83c436af_4830154317591375669.png"), card: hoyoverseCdn("102427/2aaff92fc1ef7183af44bfaf83c436af_4830154317591375669.png"), source: "hoyoverse-official" },
  "nicole": { icon: hoyoverseCdn("102183/346659f4fb213f3075aee813997b9b31_990728217161469939.png"), card: hoyoverseCdn("102183/346659f4fb213f3075aee813997b9b31_990728217161469939.png"), source: "hoyoverse-official" },
  "orphie-magnusson-and-magus": { icon: hoyoverseCdn("157833/96b8690cbc3c06a1787dbbc024235e92_393693254733149336.png"), card: hoyoverseCdn("157833/96b8690cbc3c06a1787dbbc024235e92_393693254733149336.png"), source: "hoyoverse-official" },
  "pan-yinhu": { icon: hoyoverseCdn("155657/a85c9e2d346f14b2d6467217c6e5a5c8_4760102803573941038.png"), card: hoyoverseCdn("155657/a85c9e2d346f14b2d6467217c6e5a5c8_4760102803573941038.png"), source: "hoyoverse-official" },
  "piper-wheel": { icon: hoyoverseCdn("124310/a74a0121ab4ef5f83fe73abe72726593_6795023243569401643.png"), card: hoyoverseCdn("124310/a74a0121ab4ef5f83fe73abe72726593_6795023243569401643.png"), source: "hoyoverse-official" },
  "promeia": { icon: hoyoverseCdn("163316/d8b0bb6abf166120cd1ac42d7ff30dfe_1970899984572226888.png"), card: hoyoverseCdn("163316/d8b0bb6abf166120cd1ac42d7ff30dfe_1970899984572226888.png"), source: "hoyoverse-official" },
  "pulchra-fellini": { icon: hoyoverseCdn("129637/b4c279b96ee9da7cd8d8cc1d4c953a23_6222622343947038758.png"), card: hoyoverseCdn("129637/b4c279b96ee9da7cd8d8cc1d4c953a23_6222622343947038758.png"), source: "hoyoverse-official" },
  "pyrois": { icon: hoyoverseCdn("163768/c348d5d938a3d4b63cc16c8ccb1e294b_3881191356598004278.png"), card: hoyoverseCdn("163768/c348d5d938a3d4b63cc16c8ccb1e294b_3881191356598004278.png"), source: "hoyoverse-official" },
  "qingyi": { icon: hoyoverseCdn("124660/a4a287ed2641a9ebdc8a139cf14c98a9_4627928460942222748.png"), card: hoyoverseCdn("124660/a4a287ed2641a9ebdc8a139cf14c98a9_4627928460942222748.png"), source: "hoyoverse-official" },
  "seed": { icon: hoyoverseCdn("157829/786878e538b5fd6b6f9ef7243b8a6723_3026433832217459302.png"), card: hoyoverseCdn("157829/786878e538b5fd6b6f9ef7243b8a6723_3026433832217459302.png"), source: "hoyoverse-official" },
  "seth-lowell": { icon: hoyoverseCdn("124700/7e53d9ab9b00cc4a90be3e09b2385b1e_7742588341815502128.png"), card: hoyoverseCdn("124700/7e53d9ab9b00cc4a90be3e09b2385b1e_7742588341815502128.png"), source: "hoyoverse-official" },
  "soldier-0-anby": { icon: hoyoverseCdn("129632/7cbb1cf6e5925d997777653c68b35981_1077773102639067869.png"), card: hoyoverseCdn("129632/7cbb1cf6e5925d997777653c68b35981_1077773102639067869.png"), source: "hoyoverse-official" },
  "soldier-11": { icon: hoyoverseCdn("102292/62ce86e1b3fd01dec5f855f68a59e34c_2287457318617214984.png"), card: hoyoverseCdn("102292/62ce86e1b3fd01dec5f855f68a59e34c_2287457318617214984.png"), source: "hoyoverse-official" },
  "soukaku": { icon: hoyoverseCdn("103295/3216cf9232d277ceec1a8d0774496178_3552222678670728442.png"), card: hoyoverseCdn("103295/3216cf9232d277ceec1a8d0774496178_3552222678670728442.png"), source: "hoyoverse-official" },
  "starlight-billy-kid": { icon: hoyoverseCdn("163293/72203b341040aa1d5e41567bf776520f_1328464857447434543.png"), card: hoyoverseCdn("163293/72203b341040aa1d5e41567bf776520f_1328464857447434543.png"), source: "hoyoverse-official" },
  "sunna": { icon: hoyoverseCdn("161791/a434b4e933780b981ddb5f3921021f96_8036322301967591660.png"), card: hoyoverseCdn("161791/a434b4e933780b981ddb5f3921021f96_8036322301967591660.png"), source: "hoyoverse-official" },
  "trigger": { icon: hoyoverseCdn("129638/eb4fa741f6a0f0326fe38ae4e9251e2d_8201139830252731082.png"), card: hoyoverseCdn("129638/eb4fa741f6a0f0326fe38ae4e9251e2d_8201139830252731082.png"), source: "hoyoverse-official" },
  "tsukishiro-yanagi": { icon: hoyoverseCdn("126040/540d824077a048f0b73e22a068ef5276_6616923369095800098.png"), card: hoyoverseCdn("126040/540d824077a048f0b73e22a068ef5276_6616923369095800098.png"), source: "hoyoverse-official" },
  "ukinami-yuzuha": { icon: hoyoverseCdn("156729/becee89b80a25a3d89d3dda4e1994bcd_7088484842189623518.png"), card: hoyoverseCdn("156729/becee89b80a25a3d89d3dda4e1994bcd_7088484842189623518.png"), source: "hoyoverse-official" },
  "velina-airgid": { icon: hoyoverseCdn("163785/d5e2d9545a1490db7f6219c9d0787466_2876464395956313992.png"), card: hoyoverseCdn("163785/d5e2d9545a1490db7f6219c9d0787466_2876464395956313992.png"), source: "hoyoverse-official" },
  "vivian-banshee": { icon: hoyoverseCdn("154605/307b213b69532b3626dbb8a61623529b_7270360110938708640.png"), card: hoyoverseCdn("154605/307b213b69532b3626dbb8a61623529b_7270360110938708640.png"), source: "hoyoverse-official" },
  "von-lycaon": { icon: hoyoverseCdn("102529/abe371aa7c6c63bfbeaff9317bf0e92d_4940194306692044383.png"), card: hoyoverseCdn("102529/abe371aa7c6c63bfbeaff9317bf0e92d_4940194306692044383.png"), source: "hoyoverse-official" },
  "ye-shunguang": { icon: hoyoverseCdn("160762/173d01cbeacb3a3d5c9585fa6107918d_217473232024965946.png"), card: hoyoverseCdn("160762/173d01cbeacb3a3d5c9585fa6107918d_217473232024965946.png"), source: "hoyoverse-official" },
  "yidhari-murphy": { icon: hoyoverseCdn("158997/312790c0e8e46c57b1017cb2dc1f4256_7313603203238124964.png"), card: hoyoverseCdn("158997/312790c0e8e46c57b1017cb2dc1f4256_7313603203238124964.png"), source: "hoyoverse-official" },
  "yixuan": { icon: hoyoverseCdn("155654/527a49361dc4d54a77126e39b45aa8f2_9209841707526508747.png"), card: hoyoverseCdn("155654/527a49361dc4d54a77126e39b45aa8f2_9209841707526508747.png"), source: "hoyoverse-official" },
  "zhao": { icon: hoyoverseCdn("160758/8b90f4ec335bba4b9322cc56acb0dd53_6349089187938925913.png"), card: hoyoverseCdn("160758/8b90f4ec335bba4b9322cc56acb0dd53_6349089187938925913.png"), source: "hoyoverse-official" },
  "zhu-yuan": { icon: hoyoverseCdn("122782/429d3e32cd49a1fb11cf4a2e802e0fef_7560478538216099357.png"), card: hoyoverseCdn("122782/429d3e32cd49a1fb11cf4a2e802e0fef_7560478538216099357.png"), source: "hoyoverse-official" },
  "norma-hollowell": { icon: hoyoverseCdn("163786/a29aae92640f03e7b757fe9d566e293a_7326536601431031510.png"), card: hoyoverseCdn("163786/a29aae92640f03e7b757fe9d566e293a_7326536601431031510.png"), source: "hoyoverse-official" }
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
