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

function datasetUrl(version: string, dataset: NanokaDataset) {
  return `${STATIC_BASE}/${version}/${datasetPaths[dataset]}`;
}
