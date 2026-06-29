import type { Agent, DriveDisc, Material, WEngine } from "./data.js";
import { findOfficialAsset } from "./officialAssets.js";

export type AssetKind = "agents" | "w-engines" | "drive-discs" | "materials";
export type AssetVariant = "icon" | "card";

type AssetItem = Agent | WEngine | DriveDisc | Material;

const kindTheme: Record<AssetKind, { bg: string; fg: string; accent: string; title: string }> = {
  agents: { bg: "#17151f", fg: "#fff7da", accent: "#f2c14e", title: "AGENT" },
  "w-engines": { bg: "#101820", fg: "#eaf7ff", accent: "#54d2ff", title: "W-ENGINE" },
  "drive-discs": { bg: "#1b1510", fg: "#fff2e2", accent: "#ff9f45", title: "DRIVE DISC" },
  materials: { bg: "#121a14", fg: "#efffed", accent: "#68d391", title: "MATERIAL" }
};

const rarityColor: Record<string, string> = {
  S: "#f6c65b",
  A: "#c790ff",
  B: "#7fb7ff",
  I: "#ff7a7a"
};

export function assetUrl(kind: AssetKind, id: string, variant: AssetVariant = "icon", lang?: string) {
  const path = `/api/assets/${kind}/${id}/${variant}.svg`;
  return lang === "ja" ? `${path}?lang=ja` : path;
}

export function officialIconUrl(kind: AssetKind, item: { id: string; name: string }) {
  const override = findOfficialAsset(kind, item.id);
  if (override) {
    return override.icon;
  }

  const prefix = kind === "materials" ? "Item" : "Icon";
  const filename = `${prefix}_${toWikiFileSegment(item.name)}.png`;
  return `https://zenless-zone-zero.fandom.com/wiki/Special:Redirect/file/${encodeURIComponent(filename)}`;
}

export function withImages<T extends { id: string; name: string }>(kind: AssetKind, item: T, lang?: string) {
  const generatedIcon = assetUrl(kind, item.id, "icon", lang);
  const override = findOfficialAsset(kind, item.id);
  const card = override?.card ?? assetUrl(kind, item.id, "card", lang);

  return {
    ...item,
    images: {
      icon: officialIconUrl(kind, item),
      generatedIcon,
      card,
      source: override?.source ?? "fandom-special-redirect"
    }
  };
}

export function iconManifestItem<T extends { id: string; name: string }>(kind: AssetKind, item: T, lang?: string) {
  return {
    id: item.id,
    name: item.name,
    icon: officialIconUrl(kind, item),
    generatedIcon: assetUrl(kind, item.id, "icon", lang),
    source: findOfficialAsset(kind, item.id)?.source ?? "fandom-special-redirect"
  };
}

export function renderAssetSvg(kind: AssetKind, item: AssetItem, variant: AssetVariant, label: string) {
  const theme = kindTheme[kind];
  const rarity = "rarity" in item ? item.rarity : "releaseVersion" in item ? item.releaseVersion ?? "" : "";
  const accent = rarityColor[String(rarity)] ?? theme.accent;
  const size = variant === "card" ? { width: 640, height: 360 } : { width: 256, height: 256 };
  const initial = label.trim().slice(0, 1).toUpperCase() || "?";
  const subtitle = buildSubtitle(item);
  const escapedLabel = escapeXml(label);
  const escapedSubtitle = escapeXml(subtitle);
  const escapedInitial = escapeXml(initial);

  if (variant === "icon") {
    return svg(size.width, size.height, `
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${theme.bg}"/>
          <stop offset="100%" stop-color="#050608"/>
        </linearGradient>
      </defs>
      <rect width="256" height="256" rx="42" fill="url(#bg)"/>
      <circle cx="128" cy="118" r="72" fill="${accent}" opacity="0.18"/>
      <circle cx="128" cy="118" r="54" fill="none" stroke="${accent}" stroke-width="8"/>
      <text x="128" y="142" text-anchor="middle" font-size="76" font-weight="800" fill="${theme.fg}">${escapedInitial}</text>
      <rect x="28" y="204" width="200" height="30" rx="15" fill="${accent}" opacity="0.95"/>
      <text x="128" y="225" text-anchor="middle" font-size="16" font-weight="700" fill="#101010">${escapeXml(theme.title)}</text>
    `);
  }

  return svg(size.width, size.height, `
    <defs>
      <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="${theme.bg}"/>
        <stop offset="100%" stop-color="#050608"/>
      </linearGradient>
      <radialGradient id="glow" cx="75%" cy="25%" r="80%">
        <stop offset="0%" stop-color="${accent}" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="640" height="360" rx="0" fill="url(#bg)"/>
    <rect width="640" height="360" fill="url(#glow)"/>
    <circle cx="504" cy="120" r="86" fill="${accent}" opacity="0.18"/>
    <circle cx="504" cy="120" r="60" fill="none" stroke="${accent}" stroke-width="9"/>
    <text x="504" y="145" text-anchor="middle" font-size="84" font-weight="800" fill="${theme.fg}">${escapedInitial}</text>
    <text x="48" y="78" font-size="20" font-weight="800" fill="${accent}" letter-spacing="3">${escapeXml(theme.title)}</text>
    <text x="48" y="168" font-size="44" font-weight="800" fill="${theme.fg}">${escapedLabel}</text>
    <text x="50" y="214" font-size="24" font-weight="600" fill="${theme.fg}" opacity="0.78">${escapedSubtitle}</text>
    <rect x="48" y="286" width="192" height="34" rx="17" fill="${accent}"/>
    <text x="144" y="309" text-anchor="middle" font-size="17" font-weight="800" fill="#101010">${escapeXml(String(rarity || "ZZZ"))}</text>
  `);
}

function buildSubtitle(item: AssetItem) {
  if ("attribute" in item) {
    return `${item.attribute} / ${item.specialty}`;
  }
  if ("specialty" in item) {
    return `${item.rarity}-Rank / ${item.specialty}`;
  }
  if ("twoPiece" in item) {
    return item.releaseVersion ? `Version ${item.releaseVersion}` : "Drive Disc Set";
  }
  return item.category;
}

function svg(width: number, height: number, body: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">
  <style>
    text { font-family: Inter, "Segoe UI", "Noto Sans JP", Arial, sans-serif; }
  </style>
  ${body}
</svg>`;
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function toWikiFileSegment(value: string) {
  return value
    .replaceAll("&", "and")
    .replaceAll("'", "")
    .replaceAll("[", "")
    .replaceAll("]", "")
    .replaceAll(" - ", " ")
    .replaceAll("-", " ")
    .replace(/[^\p{L}\p{N}]+/gu, "_")
    .replace(/^_+|_+$/g, "");
}
