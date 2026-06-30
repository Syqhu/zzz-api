import { z } from "zod";

const HOME_URL = "https://zzz.nanoka.cc/";
const STATIC_BASE = "https://static.nanoka.cc/zzz";

export const nanokaDatasetSchema = z.enum(["character", "weapon", "equipment", "bangboo", "monster", "item"]);
export type NanokaDataset = z.infer<typeof nanokaDatasetSchema>;

const datasetPaths: Record<NanokaDataset, string> = {
  character: "character.json",
  weapon: "weapon.json",
  equipment: "equipment.json",
  bangboo: "bangboo.json",
  monster: "monster.json",
  item: "en/item.json"
};

let cachedVersion: { version: string; fetchedAt: number } | undefined;
const cachedDatasets = new Map<string, { data: unknown; fetchedAt: number }>();
const cacheTtlMs = 10 * 60 * 1000;

export type NanokaCatalogItem = {
  id: string;
  name: string;
  rank: number | null;
  class: number | null;
  iconPath: string | null;
  images: {
    generatedIcon: string;
    generatedCard: string;
    sourcePath: string | null;
    source: "nanoka";
  };
  source: {
    name: "zzz.nanoka.cc";
    version: string;
    dataset: "item";
  };
};

export type NanokaItemListQuery = {
  q?: string;
  rank?: number;
  class?: number;
  limit?: number;
  offset?: number;
};

export async function getLatestNanokaVersion() {
  const now = Date.now();
  if (cachedVersion && now - cachedVersion.fetchedAt < cacheTtlMs) {
    return cachedVersion.version;
  }

  const response = await fetch(HOME_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch nanoka home: ${response.status}`);
  }

  const html = await response.text();
  const versions = Array.from(html.matchAll(/static\.nanoka\.cc\/zzz\/([^/]+)\//g), (match) => match[1]);
  const version = versions.at(0);

  if (!version) {
    throw new Error("Could not detect nanoka data version");
  }

  cachedVersion = { version, fetchedAt: now };
  return version;
}

export async function getNanokaDataset(dataset: NanokaDataset) {
  const version = await getLatestNanokaVersion();
  const cacheKey = `${version}:${dataset}`;
  const now = Date.now();
  const cached = cachedDatasets.get(cacheKey);

  if (cached && now - cached.fetchedAt < cacheTtlMs) {
    return {
      version,
      dataset,
      url: datasetUrl(version, dataset),
      data: cached.data,
      cached: true
    };
  }

  const url = datasetUrl(version, dataset);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch nanoka ${dataset}: ${response.status}`);
  }

  const data = (await response.json()) as unknown;
  cachedDatasets.set(cacheKey, { data, fetchedAt: now });

  return {
    version,
    dataset,
    url,
    data,
    cached: false
  };
}

export async function getNanokaSourceMeta() {
  const version = await getLatestNanokaVersion();
  const datasets = Object.fromEntries(
    Object.keys(datasetPaths).map((key) => [key, datasetUrl(version, key as NanokaDataset)])
  );

  return {
    source: "zzz.nanoka.cc",
    version,
    homeUrl: HOME_URL,
    staticBase: `${STATIC_BASE}/${version}`,
    cacheTtlSeconds: cacheTtlMs / 1000,
    datasets
  };
}

export async function getNanokaSourceSummary() {
  const version = await getLatestNanokaVersion();
  const datasets = await Promise.all(
    nanokaDatasetSchema.options.map(async (dataset) => {
      const result = await getNanokaDataset(dataset);
      return {
        dataset,
        url: result.url,
        count: countRecords(result.data),
        cached: result.cached
      };
    })
  );

  return {
    source: "zzz.nanoka.cc",
    version,
    datasets
  };
}

export async function getNanokaDatasetPreview(dataset: NanokaDataset, limit: number) {
  const result = await getNanokaDataset(dataset);
  const entries = Object.entries(asRecord(result.data)).slice(0, limit);

  return {
    version: result.version,
    dataset: result.dataset,
    url: result.url,
    count: countRecords(result.data),
    limit,
    items: entries.map(([id, value]) => ({ id, value }))
  };
}

export async function listNanokaItems(query: NanokaItemListQuery = {}) {
  const result = await getNanokaDataset("item");
  const allItems = Object.entries(asRecord(result.data)).map(([id, value]) => normalizeNanokaItem(id, value, result.version));
  const search = query.q?.trim().toLowerCase();
  const filtered = allItems.filter((item) => {
    return (
      (!search || item.id.includes(search) || item.name.toLowerCase().includes(search)) &&
      (query.rank === undefined || item.rank === query.rank) &&
      (query.class === undefined || item.class === query.class)
    );
  });
  const offset = Math.max(query.offset ?? 0, 0);
  const limit = Math.min(Math.max(query.limit ?? 50, 1), 200);

  return {
    source: "zzz.nanoka.cc",
    version: result.version,
    dataset: "item",
    total: allItems.length,
    count: filtered.length,
    limit,
    offset,
    items: filtered.slice(offset, offset + limit)
  };
}

export async function getNanokaItem(itemId: string) {
  const result = await getNanokaDataset("item");
  const value = asRecord(result.data)[itemId];

  if (!value) {
    return undefined;
  }

  return normalizeNanokaItem(itemId, value, result.version);
}

function datasetUrl(version: string, dataset: NanokaDataset) {
  return `${STATIC_BASE}/${version}/${datasetPaths[dataset]}`;
}

function countRecords(data: unknown) {
  return Object.keys(asRecord(data)).length;
}

function asRecord(data: unknown): Record<string, unknown> {
  if (data && typeof data === "object" && !Array.isArray(data)) {
    return data as Record<string, unknown>;
  }

  return {};
}

function normalizeNanokaItem(id: string, value: unknown, version: string): NanokaCatalogItem {
  const record = asRecord(value);
  const name = readString(record.name) ?? `Item ${id}`;
  const rank = readNumber(record.rank);
  const itemClass = readNumber(record.class);
  const iconPath = readString(record.icon) ?? null;

  return {
    id,
    name,
    rank,
    class: itemClass,
    iconPath,
    images: {
      generatedIcon: `/api/assets/items/${id}/icon.svg`,
      generatedCard: `/api/assets/items/${id}/card.svg`,
      sourcePath: iconPath,
      source: "nanoka"
    },
    source: {
      name: "zzz.nanoka.cc",
      version,
      dataset: "item"
    }
  };
}

function readString(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function readNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
