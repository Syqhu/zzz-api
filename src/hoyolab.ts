type HoyolabEndpoint = "status" | "agent-basic-list" | "agent-details";

type HoyolabConfig = {
  uid?: string;
  region?: string;
  ltuid?: string;
  ltoken?: string;
  cookieVersion: "v1" | "v2";
  eNapToken?: string;
  deviceId?: string;
  deviceFp?: string;
  lang: string;
  recordBaseUrl: string;
  cultivateBaseUrl: string;
  cookieExtra?: string;
  cacheTtlSeconds: number;
};

const defaultRecordBaseUrl = "https://sg-public-api.hoyolab.com/event/game_record_zzz/api/zzz";
const defaultCultivateBaseUrl = "https://act-api-takumi.mihoyo.com/event/nap_cultivate_tool";
const responseCache = new Map<string, { expiresAt: number; value: HoyolabResponse }>();

type HoyolabResponse = {
  endpoint: HoyolabEndpoint;
  source: string;
  data: unknown;
  cached: boolean;
};

export class HoyolabConfigError extends Error {
  missing: string[];

  constructor(missing: string[]) {
    super(`Missing HoYoLAB configuration: ${missing.join(", ")}`);
    this.name = "HoyolabConfigError";
    this.missing = missing;
  }
}

export class HoyolabApiError extends Error {
  status: number;
  payload: unknown;

  constructor(status: number, payload: unknown) {
    super(`HoYoLAB API request failed: ${status}`);
    this.name = "HoyolabApiError";
    this.status = status;
    this.payload = payload;
  }
}

export function getHoyolabConfigSummary() {
  const config = readHoyolabConfig();
  const requiredForStatus = missingStatusConfig(config);
  const requiredForAgents = missingAgentConfig(config);

  return {
    enabled: requiredForStatus.length === 0 || requiredForAgents.length === 0,
    statusAvailable: requiredForStatus.length === 0,
    agentDetailsAvailable: requiredForAgents.length === 0,
    missing: {
      status: requiredForStatus,
      agentDetails: requiredForAgents
    },
    configured: {
      uid: maskValue(config.uid),
      region: config.region ?? null,
      ltuid: maskValue(config.ltuid),
      ltoken: maskValue(config.ltoken),
      cookieVersion: config.cookieVersion,
      eNapToken: maskValue(config.eNapToken),
      deviceId: maskValue(config.deviceId),
      deviceFp: maskValue(config.deviceFp),
      lang: config.lang,
      recordBaseUrl: config.recordBaseUrl,
      cultivateBaseUrl: config.cultivateBaseUrl,
      cacheTtlSeconds: config.cacheTtlSeconds
    },
    cache: {
      entries: responseCache.size,
      ttlSeconds: config.cacheTtlSeconds
    },
    risks: hoyolabRisks
  };
}

export async function testHoyolabConnection(includeDetails = false) {
  const config = readHoyolabConfig();
  const checks = [];

  checks.push(await runHoyolabCheck("status", missingStatusConfig(config), () => getHoyolabStatus()));
  checks.push(await runHoyolabCheck("agents", missingAgentConfig(config), () => getHoyolabAgentBasicList()));

  if (includeDetails) {
    checks.push(await runHoyolabCheck("agentDetails", missingAgentConfig(config), () => getHoyolabAgentDetails()));
    checks.push(await runHoyolabCheck("driveDiscs", missingAgentConfig(config), () => getHoyolabDriveDiscs()));
  }
  const ranChecks = checks.filter((check) => !check.skipped);

  return {
    ok: ranChecks.length > 0 && ranChecks.every((check) => check.ok),
    checkedAt: new Date().toISOString(),
    config: getHoyolabConfigSummary(),
    checks
  };
}

export async function getHoyolabStatus() {
  const config = readHoyolabConfig();
  assertConfigured(missingStatusConfig(config));

  const response = await requestHoyolab(
    `${config.recordBaseUrl}/note`,
    {
      server: config.region!,
      role_id: config.uid!
    },
    {
      method: "GET",
      cookie: buildLoginCookie(config),
      config,
      endpoint: "status"
    }
  );

  return {
    ...response,
    normalized: normalizeStatus(response.data)
  };
}

export async function getHoyolabAgentBasicList() {
  const config = readHoyolabConfig();
  assertConfigured(missingAgentConfig(config));

  const response = await requestHoyolab(
    `${config.cultivateBaseUrl}/user/avatar_basic_list`,
    {
      uid: config.uid!,
      region: config.region!
    },
    {
      method: "GET",
      cookie: buildNapCookie(config),
      config,
      endpoint: "agent-basic-list"
    }
  );

  return {
    ...response,
    normalized: normalizeAgentBasicList(response.data)
  };
}

export async function getHoyolabAgentDetails(avatarIds?: number[]) {
  const config = readHoyolabConfig();
  assertConfigured(missingAgentConfig(config));
  const ids = avatarIds ?? (await getUnlockedAvatarIds());

  if (ids.length === 0) {
    return {
      list: [],
      count: 0
    };
  }

  const batches = chunk(ids.map((avatarId) => ({ avatar_id: avatarId })), 10);
  const responses = await Promise.all(
    batches.map((avatarList) =>
      requestHoyolab(
        `${config.cultivateBaseUrl}/user/batch_avatar_detail_v2`,
        {
          uid: config.uid!,
          region: config.region!
        },
        {
          method: "POST",
          cookie: buildNapCookie(config),
          config,
          endpoint: "agent-details",
          body: { avatar_list: avatarList }
        }
      )
    )
  );
  const list = responses.flatMap((response) => readListFromPayload(response.data));

  return {
    count: list.length,
    list,
    normalized: list.map(normalizeAgentDetail)
  };
}

export async function getHoyolabDriveDiscs() {
  const details = await getHoyolabAgentDetails();
  const list = details.list.map((item) => {
    const record = asRecord(item);
    const avatar = asRecord(record.avatar);
    return {
      avatarId: readNumber(avatar.id),
      avatarName: readString(avatar.name_mi18n) ?? readString(avatar.full_name_mi18n),
      driveDiscs: Array.isArray(record.equip) ? record.equip : []
    };
  });

  return {
    count: list.length,
    list,
    normalized: list.map((item) => ({
      avatarId: item.avatarId,
      avatarName: item.avatarName,
      driveDiscs: normalizeDriveDiscs(item.driveDiscs)
    }))
  };
}

export async function getHoyolabAgentDetail(avatarId: number) {
  const details = await getHoyolabAgentDetails([avatarId]);
  const raw = details.list[0];
  return raw ? { raw, normalized: normalizeAgentDetail(raw) } : null;
}

export const hoyolabRisks = [
  "HoYoLAB endpoints are unofficial for developers and may change without notice.",
  "Cookie values such as ltoken, ltuid, and e_nap_token can grant access to account-related HoYoLAB data. Keep them out of GitHub, logs, screenshots, and public APIs.",
  "This project never asks for a HoYoVerse password. Only copy cookies from your own browser session.",
  "Use this for a private/self-hosted API or bot. Do not collect other users' cookies.",
  "HoYoLAB may rate-limit requests or invalidate cookies. Re-authentication may be required."
];

function readHoyolabConfig(): HoyolabConfig {
  const cookieVersion = process.env.HOYOLAB_COOKIE_VERSION === "v1" ? "v1" : "v2";

  return {
    uid: process.env.ZZZ_UID,
    region: process.env.ZZZ_REGION,
    ltuid: process.env.HOYOLAB_LTUID,
    ltoken: process.env.HOYOLAB_LTOKEN,
    cookieVersion,
    eNapToken: process.env.HOYOLAB_E_NAP_TOKEN,
    deviceId: process.env.HOYOLAB_DEVICE_ID,
    deviceFp: process.env.HOYOLAB_DEVICE_FP,
    lang: process.env.HOYOLAB_LANG ?? "ja-jp",
    recordBaseUrl: process.env.HOYOLAB_RECORD_BASE_URL ?? defaultRecordBaseUrl,
    cultivateBaseUrl: process.env.HOYOLAB_CULTIVATE_BASE_URL ?? defaultCultivateBaseUrl,
    cookieExtra: process.env.HOYOLAB_COOKIE_EXTRA,
    cacheTtlSeconds: readCacheTtlSeconds()
  };
}

function missingStatusConfig(config: HoyolabConfig): string[] {
  const requirements = [
    { name: "ZZZ_UID", value: config.uid },
    { name: "ZZZ_REGION", value: config.region },
    { name: "HOYOLAB_LTUID", value: config.ltuid },
    { name: "HOYOLAB_LTOKEN", value: config.ltoken }
  ];

  return requirements.filter((item) => !item.value).map((item) => item.name);
}

function missingAgentConfig(config: HoyolabConfig): string[] {
  const requirements = [
    { name: "ZZZ_UID", value: config.uid },
    { name: "ZZZ_REGION", value: config.region },
    { name: "HOYOLAB_E_NAP_TOKEN", value: config.eNapToken },
    { name: "HOYOLAB_DEVICE_FP", value: config.deviceFp }
  ];

  return requirements.filter((item) => !item.value).map((item) => item.name);
}

function assertConfigured(missing: string[]) {
  if (missing.length > 0) {
    throw new HoyolabConfigError(missing);
  }
}

async function getUnlockedAvatarIds() {
  const basic = await getHoyolabAgentBasicList();
  const list = readListFromPayload(basic.data);

  if (!Array.isArray(list)) {
    return [];
  }

  return list
    .filter((item) => asRecord(item).unlocked === true)
    .map((item) => readNumber(asRecord(asRecord(item).avatar).id))
    .filter((id): id is number => id !== undefined);
}

async function requestHoyolab(
  baseUrl: string,
  query: Record<string, string | number | undefined>,
  options: {
    method: "GET" | "POST";
    cookie: string;
    config: HoyolabConfig;
    endpoint: HoyolabEndpoint;
    body?: unknown;
  }
) {
  const url = new URL(baseUrl);
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });
  const cacheKey = JSON.stringify({
    endpoint: options.endpoint,
    method: options.method,
    url: url.toString(),
    body: options.body
  });
  const cached = readCache(cacheKey);

  if (cached) {
    return {
      ...cached,
      cached: true
    };
  }

  const response = await fetch(url, {
    method: options.method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Cookie: options.cookie,
      "User-Agent": "zzz-api/0.1.0",
      "x-rpc-language": options.config.lang,
      "x-rpc-client_type": "5",
      ...(options.config.deviceId ? { "x-rpc-device_id": options.config.deviceId } : {}),
      ...(options.config.deviceFp ? { "x-rpc-device_fp": options.config.deviceFp } : {})
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body)
  });
  const payload = await readJson(response);

  if (!response.ok) {
    throw new HoyolabApiError(response.status, payload);
  }

  const result = {
    endpoint: options.endpoint,
    source: url.origin,
    data: payload,
    cached: false
  };
  writeCache(cacheKey, result, options.config.cacheTtlSeconds);

  return result;
}

async function runHoyolabCheck(name: string, missing: string[], action: () => Promise<unknown>) {
  if (missing.length > 0) {
    return {
      name,
      ok: false,
      skipped: true,
      missing
    };
  }

  try {
    const startedAt = Date.now();
    await action();
    return {
      name,
      ok: true,
      skipped: false,
      latencyMs: Date.now() - startedAt
    };
  } catch (error) {
    if (error instanceof HoyolabApiError) {
      return {
        name,
        ok: false,
        skipped: false,
        status: error.status,
        payload: error.payload
      };
    }

    return {
      name,
      ok: false,
      skipped: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

function normalizeStatus(payload: unknown) {
  const data = unwrapPayloadData(payload);

  return {
    energy: readFirstNumber(data, ["energy", "cur_energy", "current_energy", "stamina", "vitality"]),
    maxEnergy: readFirstNumber(data, ["max_energy", "energy_limit", "max_stamina", "max_vitality"]),
    activeTime: readFirstString(data, ["active_time", "activeTime"]),
    weeklyTask: data.weekly_task ?? data.weeklyTask ?? null,
    rawKeys: Object.keys(data)
  };
}

function normalizeAgentBasicList(payload: unknown) {
  const list = readListFromPayload(payload);

  return {
    count: list.length,
    agents: list.map((item) => {
      const record = asRecord(item);
      const avatar = asRecord(record.avatar);
      const source = Object.keys(avatar).length > 0 ? avatar : record;

      return {
        avatarId: readFirstNumber(source, ["id", "avatar_id"]),
        name: readFirstString(source, ["name_mi18n", "full_name_mi18n", "name"]),
        level: readFirstNumber(record, ["level", "lv"]) ?? readFirstNumber(source, ["level", "lv"]),
        rank: readFirstString(source, ["rank", "rarity"]),
        unlocked: record.unlocked ?? null,
        icon: readFirstString(source, ["icon", "avatar_icon", "square_icon"])
      };
    })
  };
}

function normalizeAgentDetail(item: unknown) {
  const record = asRecord(item);
  const avatar = asRecord(record.avatar);
  const weapon = asRecord(record.weapon ?? record.w_engine);
  const equip = Array.isArray(record.equip) ? record.equip : [];

  return {
    avatarId: readFirstNumber(avatar, ["id", "avatar_id"]) ?? readFirstNumber(record, ["id", "avatar_id"]),
    name: readFirstString(avatar, ["name_mi18n", "full_name_mi18n", "name"]),
    level: readFirstNumber(avatar, ["level", "lv"]) ?? readFirstNumber(record, ["level", "lv"]),
    rank: readFirstString(avatar, ["rank", "rarity"]),
    weapon: Object.keys(weapon).length > 0 ? normalizeNamedItem(weapon) : null,
    driveDiscs: normalizeDriveDiscs(equip),
    stats: record.properties ?? record.stats ?? null
  };
}

function normalizeDriveDiscs(items: unknown) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item) => normalizeNamedItem(asRecord(item)));
}

function normalizeNamedItem(record: Record<string, unknown>) {
  return {
    id: readFirstNumber(record, ["id", "equip_id", "weapon_id"]) ?? readFirstString(record, ["id", "equip_id", "weapon_id"]),
    name: readFirstString(record, ["name_mi18n", "name", "full_name_mi18n"]),
    level: readFirstNumber(record, ["level", "lv"]),
    rarity: readFirstString(record, ["rarity", "rank"]),
    icon: readFirstString(record, ["icon", "icon_url", "square_icon"]),
    properties: record.properties ?? record.main_property ?? null
  };
}

function unwrapPayloadData(payload: unknown) {
  const record = asRecord(payload);
  const data = asRecord(record.data);
  return Object.keys(data).length > 0 ? data : record;
}

function readListFromPayload(payload: unknown) {
  const data = unwrapPayloadData(payload);
  const list = data.list ?? data.avatar_list ?? data.avatars;
  return Array.isArray(list) ? list : [];
}

function readFirstNumber(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = readNumber(record[key]);
    if (value !== undefined) {
      return value;
    }
  }
  return undefined;
}

function readFirstString(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = readString(record[key]);
    if (value !== undefined) {
      return value;
    }
  }
  return undefined;
}

function readCache(key: string) {
  const cached = responseCache.get(key);
  if (!cached || cached.expiresAt <= Date.now()) {
    responseCache.delete(key);
    return undefined;
  }
  return cached.value;
}

function writeCache(key: string, value: HoyolabResponse, ttlSeconds: number) {
  if (ttlSeconds <= 0) {
    return;
  }

  responseCache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000
  });
}

function readCacheTtlSeconds() {
  const value = Number(process.env.HOYOLAB_CACHE_TTL_SECONDS ?? 300);
  return Number.isFinite(value) && value >= 0 ? value : 300;
}

function buildLoginCookie(config: HoyolabConfig) {
  const ltuidName = config.cookieVersion === "v2" ? "ltuid_v2" : "ltuid";
  const ltokenName = config.cookieVersion === "v2" ? "ltoken_v2" : "ltoken";
  return joinCookieParts([`${ltuidName}=${config.ltuid}`, `${ltokenName}=${config.ltoken}`, config.cookieExtra]);
}

function buildNapCookie(config: HoyolabConfig) {
  return joinCookieParts([`e_nap_token=${config.eNapToken}`, config.cookieExtra]);
}

function joinCookieParts(parts: Array<string | undefined>) {
  return parts.filter((part): part is string => Boolean(part && part.trim())).join("; ");
}

async function readJson(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

function chunk<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function readNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function readString(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function maskValue(value: string | undefined) {
  if (!value) {
    return null;
  }

  if (value.length <= 8) {
    return "********";
  }

  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}
