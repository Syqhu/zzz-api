import "dotenv/config";
import Fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import sharp from "sharp";
import { z } from "zod";
import { agents, allAgents, datasetMeta, driveDiscs, materials, upcomingAgents, wEngines } from "./data.js";
import { calculateAgentLevelCosts } from "./upgrade.js";
import { getAgentMaterialPlan } from "./upgradeMaterials.js";
import { createBuild, getBuild, listBuilds } from "./buildStore.js";
import { localizeAgent, localizeDriveDisc, localizeMaterial, localizeWEngine, readLocale } from "./localization.js";
import { type AssetKind, type AssetVariant, iconManifestItem, officialIconUrl, renderAssetSvg, withImages } from "./assets.js";
import {
  getNanokaDataset,
  getNanokaDatasetPreview,
  getNanokaItem,
  getNanokaSourceMeta,
  getNanokaSourceSummary,
  listNanokaItems,
  type NanokaCatalogItem,
  nanokaDatasetSchema
} from "./nanokaSource.js";
import {
  getHoyolabAgentBasicList,
  getHoyolabAgentDetail,
  getHoyolabAgentDetails,
  getHoyolabConfigSummary,
  getHoyolabDriveDiscs,
  getHoyolabStatus,
  testHoyolabConnection,
  HoyolabApiError,
  HoyolabConfigError
} from "./hoyolab.js";

const app = Fastify({
  logger: true
});

await app.register(cors, {
  origin: true
});

await app.register(swagger, {
  openapi: {
    info: {
      title: "ZZZ API",
      description: "Unofficial API MVP for Zenless Zone Zero apps.",
      version: "0.1.0"
    }
  }
});

await app.register(swaggerUi, {
  routePrefix: "/docs"
});

app.setErrorHandler((error, request, reply) => {
  if (error instanceof z.ZodError) {
    return reply.code(400).send({
      error: "Invalid request",
      issues: error.issues
    });
  }

  request.log.error(error);
  return reply.code(500).send({ error: "Internal server error" });
});

app.get("/health", async () => ({
  ok: true,
  service: "zzz-api"
}));

app.get("/api/meta", async () => datasetMeta);

app.get("/api/source/latest", async (request, reply) => {
  try {
    return await getNanokaSourceMeta();
  } catch (error) {
    request.log.error(error);
    return reply.code(502).send({ error: "Failed to fetch latest upstream source metadata" });
  }
});

app.get("/api/source/latest/summary", async (request, reply) => {
  try {
    return await getNanokaSourceSummary();
  } catch (error) {
    request.log.error(error);
    return reply.code(502).send({ error: "Failed to fetch latest upstream source summary" });
  }
});

app.get("/api/source/latest/check", async (request, reply) => {
  const query = z.object({ knownVersion: z.string().optional() }).parse(request.query);

  try {
    const meta = await getNanokaSourceMeta();
    return {
      source: meta.source,
      latestVersion: meta.version,
      knownVersion: query.knownVersion ?? null,
      changed: query.knownVersion ? query.knownVersion !== meta.version : null,
      checkedAt: new Date().toISOString(),
      datasets: meta.datasets
    };
  } catch (error) {
    request.log.error(error);
    return reply.code(502).send({ error: "Failed to check latest upstream source version" });
  }
});

app.get("/api/source/latest/diff", async (request, reply) => {
  try {
    const summary = await getNanokaSourceSummary();
    const localCounts = {
      character: allAgents.length,
      weapon: wEngines.length,
      equipment: driveDiscs.length,
      item: materials.length
    };

    return {
      source: summary.source,
      version: summary.version,
      localCounts,
      upstreamCounts: Object.fromEntries(summary.datasets.map((dataset) => [dataset.dataset, dataset.count])),
      comparable: {
        character: compareCount(localCounts.character, summary.datasets.find((dataset) => dataset.dataset === "character")?.count),
        weapon: compareCount(localCounts.weapon, summary.datasets.find((dataset) => dataset.dataset === "weapon")?.count),
        equipment: compareCount(localCounts.equipment, summary.datasets.find((dataset) => dataset.dataset === "equipment")?.count),
        item: compareCount(localCounts.item, summary.datasets.find((dataset) => dataset.dataset === "item")?.count)
      },
      notes: [
        "character compares local agents including upcoming agents against upstream character records.",
        "weapon compares local W-Engines against upstream weapon records.",
        "equipment compares local drive discs against upstream equipment records.",
        "item is not one-to-one because the upstream item dataset contains many item categories beyond local materials."
      ]
    };
  } catch (error) {
    request.log.error(error);
    return reply.code(502).send({ error: "Failed to compare latest upstream data" });
  }
});

app.get("/api/versions", async () => {
  const versions = [...new Set([...allAgents, ...wEngines, ...driveDiscs].map((item) => item.releaseVersion).filter(isString))].sort(compareVersions);

  return {
    latest: datasetMeta.maxVersion,
    versions: versions.map((version) => versionSummary(version))
  };
});

app.get("/api/versions/latest", async () => versionSummary(datasetMeta.maxVersion));

app.get("/api/versions/:version", async (request) => {
  const params = z.object({ version: z.string() }).parse(request.params);
  return versionSummary(params.version);
});

app.get("/api/image-proxy", async (request, reply) => {
  const queryResult = z
    .object({
      url: z.string().url(),
      w: z.coerce.number().int().min(1).max(2048).optional(),
      h: z.coerce.number().int().min(1).max(2048).optional(),
      fit: z.enum(["cover", "contain", "fill", "inside", "outside"]).optional(),
      format: z.enum(["webp", "png", "jpeg"]).optional()
    })
    .safeParse(request.query);

  if (!queryResult.success) {
    return reply.code(400).send({ error: "Invalid image proxy query", issues: queryResult.error.issues });
  }

  const query = queryResult.data;
  const parsed = new URL(query.url);
  const allowedHosts = new Set(["fastcdn.hoyoverse.com", "static.nanoka.cc", "api.hakush.in", "zenless-zone-zero.fandom.com"]);

  if (parsed.protocol !== "https:" || !allowedHosts.has(parsed.hostname)) {
    return reply.code(400).send({ error: "Image host is not allowed" });
  }

  try {
    const response = await fetch(parsed);
    const contentType = response.headers.get("content-type") ?? "";

    if (!response.ok || !contentType.startsWith("image/")) {
      return reply.code(502).send({ error: "Failed to fetch image" });
    }

    const original = Buffer.from(await response.arrayBuffer());
    const resized = await resizeImage(original, {
      width: query.w,
      height: query.h,
      fit: query.fit,
      format: query.format
    });

    return reply
      .type(resized.contentType ?? contentType)
      .header("Cache-Control", "public, max-age=86400")
      .header("X-Image-Source", parsed.hostname)
      .header("X-Image-Resized", resized.resized ? "true" : "false")
      .send(resized.body);
  } catch (error) {
    request.log.error(error);
    return reply.code(502).send({ error: "Failed to proxy image" });
  }
});

app.get("/api/hoyolab/config", async () => getHoyolabConfigSummary());

app.get("/api/hoyolab/test", async (request) => {
  const query = z.object({ details: z.coerce.boolean().optional() }).parse(request.query);
  return testHoyolabConnection(query.details ?? false);
});

app.get("/api/hoyolab/status", async (request, reply) => {
  try {
    return await getHoyolabStatus();
  } catch (error) {
    return handleHoyolabError(error, request, reply);
  }
});

app.get("/api/hoyolab/agents", async (request, reply) => {
  const query = z.object({ details: z.coerce.boolean().optional() }).parse(request.query);

  try {
    return query.details ? await getHoyolabAgentDetails() : await getHoyolabAgentBasicList();
  } catch (error) {
    return handleHoyolabError(error, request, reply);
  }
});

app.get("/api/hoyolab/agents/:avatarId", async (request, reply) => {
  const params = z.object({ avatarId: z.coerce.number().int().positive() }).parse(request.params);

  try {
    const detail = await getHoyolabAgentDetail(params.avatarId);

    if (!detail) {
      return reply.code(404).send({ error: "HoYoLAB agent detail not found" });
    }

    return detail;
  } catch (error) {
    return handleHoyolabError(error, request, reply);
  }
});

app.get("/api/hoyolab/drive-discs", async (request, reply) => {
  try {
    return await getHoyolabDriveDiscs();
  } catch (error) {
    return handleHoyolabError(error, request, reply);
  }
});

app.get("/api/source/latest/:dataset", async (request, reply) => {
  const params = z.object({ dataset: nanokaDatasetSchema }).parse(request.params);
  const query = z.object({ preview: z.coerce.boolean().optional(), limit: z.coerce.number().int().min(1).max(50).optional() }).parse(request.query);

  try {
    if (query.preview) {
      return await getNanokaDatasetPreview(params.dataset, query.limit ?? 10);
    }

    return await getNanokaDataset(params.dataset);
  } catch (error) {
    request.log.error(error);
    return reply.code(502).send({ error: `Failed to fetch latest upstream dataset: ${params.dataset}` });
  }
});

app.get("/api/assets/items/:itemId/:variant", async (request, reply) => {
  const params = z
    .object({
      itemId: z.string(),
      variant: z.string()
    })
    .parse(request.params);
  const variant = parseAssetVariant(params.variant);

  if (!variant) {
    return reply.code(404).send({ error: "Asset not found" });
  }

  try {
    const item = await getNanokaItem(params.itemId);

    if (!item) {
      return reply.code(404).send({ error: "Item asset not found" });
    }

    return reply
      .type("image/svg+xml; charset=utf-8")
      .header("Cache-Control", "public, max-age=86400")
      .send(renderNanokaItemSvg(item, variant));
  } catch (error) {
    request.log.error(error);
    return reply.code(502).send({ error: "Failed to fetch latest upstream item asset" });
  }
});

app.get("/api/assets/:kind/:itemId/:variant", async (request, reply) => {
  const params = z
    .object({
      kind: z.enum(["agents", "w-engines", "drive-discs", "materials"]),
      itemId: z.string(),
      variant: z.string()
    })
    .parse(request.params);
  const query = z.object({ lang: z.string().optional() }).parse(request.query);
  const locale = readLocale(query.lang);
  const officialVariant = parseOfficialAssetVariant(params.variant);
  const item = findAssetItem(params.kind, params.itemId);

  if (officialVariant) {
    if (!item) {
      return reply.code(404).send({ error: "Official asset not found" });
    }

    return reply.redirect(officialAssetRedirectUrl(params.kind, item, officialVariant), 302);
  }

  const variant = parseAssetVariant(params.variant);

  if (!item || !variant) {
    return reply.code(404).send({ error: "Asset not found" });
  }

  const localized = localizeAssetItem(params.kind, item, locale);
  const label = getAssetLabel(localized);

  return reply
    .type("image/svg+xml; charset=utf-8")
    .header("Cache-Control", "public, max-age=86400")
    .send(renderAssetSvg(params.kind, item, variant, label));
});

app.get("/api/icons", async (request) => {
  const query = z
    .object({ lang: z.string().optional(), includeUpcoming: z.coerce.boolean().optional(), includeItems: z.coerce.boolean().optional() })
    .parse(request.query);
  const locale = readLocale(query.lang);
  const lang = locale === "ja" ? "ja" : undefined;
  const agentSource = query.includeUpcoming ? allAgents : agents;

  const response: Record<string, unknown> = {
    agents: agentSource.map((agent) => iconManifestItem("agents", localizeAgent(agent, locale), lang)),
    wEngines: wEngines.map((wEngine) => iconManifestItem("w-engines", localizeWEngine(wEngine, locale), lang)),
    driveDiscs: driveDiscs.map((driveDisc) => iconManifestItem("drive-discs", localizeDriveDisc(driveDisc, locale), lang)),
    materials: materials.map((material) => iconManifestItem("materials", localizeMaterial(material, locale), lang))
  };

  if (query.includeItems) {
    response.items = (await listNanokaItems({ limit: 200 })).items.map(iconManifestNanokaItem);
  }

  return response;
});

app.get("/api/icons/:kind", async (request, reply) => {
  const params = z.object({ kind: z.enum(["agents", "w-engines", "drive-discs", "materials", "items"]) }).parse(request.params);
  const query = z
    .object({
      lang: z.string().optional(),
      includeUpcoming: z.coerce.boolean().optional(),
      q: z.string().optional(),
      rank: z.coerce.number().int().optional(),
      class: z.coerce.number().int().optional(),
      limit: z.coerce.number().int().min(1).max(200).optional(),
      offset: z.coerce.number().int().min(0).optional()
    })
    .parse(request.query);
  const locale = readLocale(query.lang);
  const lang = locale === "ja" ? "ja" : undefined;

  if (params.kind === "agents") {
    const source = query.includeUpcoming ? allAgents : agents;
    return source.map((agent) => iconManifestItem("agents", localizeAgent(agent, locale), lang));
  }

  if (params.kind === "w-engines") {
    return wEngines.map((wEngine) => iconManifestItem("w-engines", localizeWEngine(wEngine, locale), lang));
  }

  if (params.kind === "drive-discs") {
    return driveDiscs.map((driveDisc) => iconManifestItem("drive-discs", localizeDriveDisc(driveDisc, locale), lang));
  }

  if (params.kind === "materials") {
    return materials.map((material) => iconManifestItem("materials", localizeMaterial(material, locale), lang));
  }

  if (params.kind === "items") {
    try {
      const result = await listNanokaItems({
        q: query.q,
        rank: query.rank,
        class: query.class,
        limit: query.limit,
        offset: query.offset
      });

      return {
        ...result,
        items: result.items.map(iconManifestNanokaItem)
      };
    } catch (error) {
      request.log.error(error);
      return reply.code(502).send({ error: "Failed to fetch latest upstream item icons" });
    }
  }

  return reply.code(404).send({ error: "Icon kind not found" });
});

app.get("/api/search", async (request, reply) => {
  const query = z
    .object({
      q: z.string().min(1),
      kinds: z.string().optional(),
      lang: z.string().optional(),
      includeUpcoming: z.coerce.boolean().optional(),
      includeItems: z.coerce.boolean().optional(),
      limit: z.coerce.number().int().min(1).max(100).optional()
    })
    .parse(request.query);
  const locale = readLocale(query.lang);
  const lang = locale === "ja" ? "ja" : undefined;
  const requestedKinds = new Set((query.kinds ?? "agents,w-engines,drive-discs,materials,items").split(",").map((kind) => kind.trim()));
  const limit = query.limit ?? 25;
  const results: SearchResult[] = [];

  if (requestedKinds.has("agents")) {
    const source = query.includeUpcoming ? allAgents : agents;
    results.push(
      ...source.map((agent) => searchResult("agents", withImages("agents", localizeAgent(agent, locale), lang), query.q, searchAliases[agent.id]))
    );
  }

  if (requestedKinds.has("w-engines")) {
    results.push(...wEngines.map((wEngine) => searchResult("w-engines", withImages("w-engines", localizeWEngine(wEngine, locale), lang), query.q)));
  }

  if (requestedKinds.has("drive-discs")) {
    results.push(...driveDiscs.map((driveDisc) => searchResult("drive-discs", withImages("drive-discs", localizeDriveDisc(driveDisc, locale), lang), query.q)));
  }

  if (requestedKinds.has("materials")) {
    results.push(...materials.map((material) => searchResult("materials", withImages("materials", localizeMaterial(material, locale), lang), query.q)));
  }

  if (requestedKinds.has("items") || query.includeItems) {
    try {
      const items = await listNanokaItems({ q: query.q, limit });
      results.push(...items.items.map((item) => searchResult("items", item, query.q)));
    } catch (error) {
      request.log.error(error);
      return reply.code(502).send({ error: "Failed to search latest upstream items" });
    }
  }

  const filtered = results
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.kind.localeCompare(b.kind) || a.name.localeCompare(b.name))
    .slice(0, limit);

  return {
    query: query.q,
    count: filtered.length,
    limit,
    results: filtered
  };
});

app.get("/api/agents", async (request) => {
  const querySchema = z.object({
    attribute: z.string().optional(),
    specialty: z.string().optional(),
    rarity: z.string().optional(),
    rank: z.string().optional(),
    version: z.string().optional(),
    includeUpcoming: z.coerce.boolean().optional(),
    lang: z.string().optional()
  });

  const query = querySchema.parse(request.query);
  const locale = readLocale(query.lang);
  const lang = locale === "ja" ? "ja" : undefined;
  const source = query.includeUpcoming ? allAgents : agents;

  return source
    .filter((agent) => {
      const rank = query.rank ?? query.rarity;
      return (
        (!query.attribute || agent.attribute.toLowerCase() === query.attribute.toLowerCase()) &&
        (!query.specialty || agent.specialty.toLowerCase() === query.specialty.toLowerCase()) &&
        (!rank || agent.rank.toLowerCase() === rank.toLowerCase()) &&
        (!query.version || agent.releaseVersion === query.version)
      );
    })
    .map((agent) => withImages("agents", localizeAgent(agent, locale), lang));
});

app.get("/api/agents/upcoming", async (request) => {
  const query = z.object({ lang: z.string().optional() }).parse(request.query);
  const locale = readLocale(query.lang);
  const lang = locale === "ja" ? "ja" : undefined;
  return upcomingAgents.map((agent) => withImages("agents", localizeAgent(agent, locale), lang));
});

app.get("/api/agents/:agentId", async (request, reply) => {
  const params = z.object({ agentId: z.string() }).parse(request.params);
  const query = z.object({ lang: z.string().optional() }).parse(request.query);
  const locale = readLocale(query.lang);
  const lang = locale === "ja" ? "ja" : undefined;
  const agent = allAgents.find((item) => item.id === params.agentId);

  if (!agent) {
    return reply.code(404).send({ error: "Agent not found" });
  }

  return withImages("agents", localizeAgent(agent, locale), lang);
});

app.get("/api/agents/:agentId/materials", async (request, reply) => {
  const params = z.object({ agentId: z.string() }).parse(request.params);
  const query = z
    .object({
      from: z.coerce.number().int().min(1).max(59).optional(),
      to: z.coerce.number().int().min(2).max(60).optional(),
      lang: z.string().optional()
    })
    .parse(request.query);
  const from = query.from ?? 1;
  const to = query.to ?? 60;
  const locale = readLocale(query.lang);
  const lang = locale === "ja" ? "ja" : undefined;

  if (from >= to) {
    return reply.code(400).send({ error: "`from` must be lower than `to`" });
  }

  const agent = allAgents.find((item) => item.id === params.agentId);

  if (!agent) {
    return reply.code(404).send({ error: "Agent not found" });
  }

  const plan = getAgentMaterialPlan(agent, from, to);
  return {
    agent: withImages("agents", localizeAgent(agent, locale), lang),
    ...plan,
    relatedMaterials: Object.fromEntries(
      Object.entries(plan.relatedMaterials).map(([key, values]) => [
        key,
        values.map((material) => withImages("materials", localizeMaterial(material, locale), lang))
      ])
    )
  };
});

app.get("/api/w-engines", async (request) => {
  const query = z
    .object({
      lang: z.string().optional(),
      rarity: z.string().optional(),
      specialty: z.string().optional(),
      source: z.string().optional(),
      version: z.string().optional()
    })
    .parse(request.query);
  const locale = readLocale(query.lang);
  const lang = locale === "ja" ? "ja" : undefined;
  return wEngines
    .filter((wEngine) => {
      return (
        (!query.rarity || wEngine.rarity.toLowerCase() === query.rarity.toLowerCase()) &&
        (!query.specialty || wEngine.specialty.toLowerCase() === query.specialty.toLowerCase()) &&
        (!query.source || wEngine.source?.toLowerCase() === query.source.toLowerCase()) &&
        (!query.version || wEngine.releaseVersion === query.version)
      );
    })
    .map((wEngine) => withImages("w-engines", localizeWEngine(wEngine, locale), lang));
});

app.get("/api/w-engines/:wEngineId", async (request, reply) => {
  const params = z.object({ wEngineId: z.string() }).parse(request.params);
  const query = z.object({ lang: z.string().optional() }).parse(request.query);
  const locale = readLocale(query.lang);
  const lang = locale === "ja" ? "ja" : undefined;
  const wEngine = wEngines.find((item) => item.id === params.wEngineId);

  if (!wEngine) {
    return reply.code(404).send({ error: "W-Engine not found" });
  }

  return withImages("w-engines", localizeWEngine(wEngine, locale), lang);
});

app.get("/api/drive-discs", async (request) => {
  const query = z.object({ lang: z.string().optional(), version: z.string().optional() }).parse(request.query);
  const locale = readLocale(query.lang);
  const lang = locale === "ja" ? "ja" : undefined;
  return driveDiscs
    .filter((driveDisc) => !query.version || driveDisc.releaseVersion === query.version)
    .map((driveDisc) => withImages("drive-discs", localizeDriveDisc(driveDisc, locale), lang));
});

app.get("/api/drive-discs/:driveDiscId", async (request, reply) => {
  const params = z.object({ driveDiscId: z.string() }).parse(request.params);
  const query = z.object({ lang: z.string().optional() }).parse(request.query);
  const locale = readLocale(query.lang);
  const lang = locale === "ja" ? "ja" : undefined;
  const driveDisc = driveDiscs.find((item) => item.id === params.driveDiscId);

  if (!driveDisc) {
    return reply.code(404).send({ error: "Drive disc not found" });
  }

  return withImages("drive-discs", localizeDriveDisc(driveDisc, locale), lang);
});

app.get("/api/materials", async (request) => {
  const query = z.object({ lang: z.string().optional(), category: z.string().optional() }).parse(request.query);
  const locale = readLocale(query.lang);
  const lang = locale === "ja" ? "ja" : undefined;
  return materials
    .filter((material) => !query.category || material.category.toLowerCase() === query.category.toLowerCase())
    .map((material) => withImages("materials", localizeMaterial(material, locale), lang));
});

app.get("/api/materials/:materialId", async (request, reply) => {
  const params = z.object({ materialId: z.string() }).parse(request.params);
  const query = z.object({ lang: z.string().optional() }).parse(request.query);
  const locale = readLocale(query.lang);
  const lang = locale === "ja" ? "ja" : undefined;
  const material = materials.find((item) => item.id === params.materialId);

  if (!material) {
    return reply.code(404).send({ error: "Material not found" });
  }

  return withImages("materials", localizeMaterial(material, locale), lang);
});

app.get("/api/items", async (request, reply) => {
  const query = z
    .object({
      q: z.string().optional(),
      rank: z.coerce.number().int().optional(),
      class: z.coerce.number().int().optional(),
      limit: z.coerce.number().int().min(1).max(200).optional(),
      offset: z.coerce.number().int().min(0).optional()
    })
    .parse(request.query);

  try {
    return await listNanokaItems(query);
  } catch (error) {
    request.log.error(error);
    return reply.code(502).send({ error: "Failed to fetch latest upstream items" });
  }
});

app.get("/api/items/:itemId", async (request, reply) => {
  const params = z.object({ itemId: z.string() }).parse(request.params);

  try {
    const item = await getNanokaItem(params.itemId);

    if (!item) {
      return reply.code(404).send({ error: "Item not found" });
    }

    return item;
  } catch (error) {
    request.log.error(error);
    return reply.code(502).send({ error: "Failed to fetch latest upstream item" });
  }
});

app.get("/api/upgrade/agent-costs", async (request, reply) => {
  const query = z
    .object({
      agentId: z.string(),
      from: z.coerce.number().int().min(1).max(59),
      to: z.coerce.number().int().min(2).max(60),
      lang: z.string().optional()
    })
    .parse(request.query);
  const locale = readLocale(query.lang);
  const lang = locale === "ja" ? "ja" : undefined;

  if (query.from >= query.to) {
    return reply.code(400).send({ error: "`from` must be lower than `to`" });
  }

  const agent = allAgents.find((item) => item.id === query.agentId);
  if (!agent) {
    return reply.code(404).send({ error: "Agent not found" });
  }

  return {
    agent: withImages("agents", localizeAgent(agent, locale), lang),
    ...calculateAgentLevelCosts(query.from, query.to)
  };
});

app.post("/api/builds", async (request, reply) => {
  const body = z
    .object({
      agentId: z.string(),
      name: z.string().min(1),
      wEngineId: z.string().optional(),
      driveDiscs: z.array(z.string()).max(6).optional(),
      notes: z.string().optional()
    })
    .parse(request.body);

  const agent = agents.find((item) => item.id === body.agentId);
  if (!agent) {
    return reply.code(400).send({ error: "Unknown agentId" });
  }

  if (body.wEngineId && !wEngines.some((item) => item.id === body.wEngineId)) {
    return reply.code(400).send({ error: "Unknown wEngineId" });
  }

  const unknownDisc = body.driveDiscs?.find((discId) => !driveDiscs.some((item) => item.id === discId));
  if (unknownDisc) {
    return reply.code(400).send({ error: `Unknown drive disc: ${unknownDisc}` });
  }

  return reply.code(201).send(createBuild(body));
});

app.get("/api/builds", async () => listBuilds());

app.get("/api/builds/:buildId", async (request, reply) => {
  const params = z.object({ buildId: z.string() }).parse(request.params);
  const build = getBuild(params.buildId);

  if (!build) {
    return reply.code(404).send({ error: "Build not found" });
  }

  return build;
});

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? "127.0.0.1";

await app.listen({ port, host });

type SearchResult = {
  kind: string;
  id: string;
  name: string;
  score: number;
  item: unknown;
};

const searchAliases: Record<string, string[]> = {
  anby: ["アンビー"],
  "alexandrina-sebastiane": ["リナ", "アレクサンドリナ"],
  "asaba-harumasa": ["浅羽悠真", "悠真"],
  "astra-yao": ["アストラ", "アストラ・ヤオ"],
  "ben-bigger": ["ベン"],
  billy: ["ビリー"],
  "burnice-white": ["バーニス"],
  "caesar-king": ["シーザー"],
  "corin-wickes": ["カリン"],
  ellen: ["エレン"],
  "evelyn-chevalier": ["イヴリン"],
  "grace-howard": ["グレース"],
  "hoshimi-miyabi": ["星見雅", "雅"],
  "jane-doe": ["ジェーン"],
  koleda: ["クレタ"],
  lighter: ["ライト"],
  "luciana-de-montefio": ["ルーシー"],
  "nekomiya-mana": ["猫又", "猫宮又奈"],
  nicole: ["ニコ"],
  "piper-wheel": ["パイパー"],
  qingyi: ["青衣"],
  "seth-lowell": ["セス"],
  "soldier-0-anby": ["零号アンビー", "0号アンビー"],
  "soldier-11": ["11号"],
  soukaku: ["蒼角"],
  trigger: ["トリガー"],
  "tsukishiro-yanagi": ["月城柳", "柳"],
  "vivian-banshee": ["ビビアン"],
  "von-lycaon": ["ライカン"],
  "zhu-yuan": ["朱鳶"]
};

function searchResult(kind: string, item: { id: string; name: string; localized?: { name?: string } }, query: string, aliases: string[] = []): SearchResult {
  const score = searchScore([item.id, item.name, item.localized?.name, ...aliases].filter(Boolean).join(" "), query);
  return {
    kind,
    id: item.id,
    name: item.localized?.name ?? item.name,
    score,
    item
  };
}

function searchScore(value: string, query: string) {
  const normalizedValue = normalizeSearch(value);
  const normalizedQuery = normalizeSearch(query);

  if (normalizedValue === normalizedQuery) {
    return 100;
  }
  if (normalizedValue.startsWith(normalizedQuery)) {
    return 80;
  }
  if (normalizedValue.includes(normalizedQuery)) {
    return 60;
  }

  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
  if (tokens.length > 1 && tokens.every((token) => normalizedValue.includes(token))) {
    return 40;
  }

  return 0;
}

function normalizeSearch(value: string) {
  return value.toLowerCase().normalize("NFKC").replace(/['’.,[\]\-_:]/g, " ").replace(/\s+/g, " ").trim();
}

function versionSummary(version: string) {
  const versionAgents = allAgents.filter((item) => item.releaseVersion === version);
  const versionWEngines = wEngines.filter((item) => item.releaseVersion === version);
  const versionDriveDiscs = driveDiscs.filter((item) => item.releaseVersion === version);

  return {
    version,
    isLatest: version === datasetMeta.maxVersion,
    counts: {
      agents: versionAgents.length,
      wEngines: versionWEngines.length,
      driveDiscs: versionDriveDiscs.length
    },
    agents: versionAgents.map((item) => item.id),
    wEngines: versionWEngines.map((item) => item.id),
    driveDiscs: versionDriveDiscs.map((item) => item.id)
  };
}

function compareVersions(a: string, b: string) {
  const left = a.split(".").map(Number);
  const right = b.split(".").map(Number);
  const length = Math.max(left.length, right.length);

  for (let index = 0; index < length; index += 1) {
    const delta = (left[index] ?? 0) - (right[index] ?? 0);
    if (delta !== 0) {
      return delta;
    }
  }

  return a.localeCompare(b);
}

function handleHoyolabError(error: unknown, request: FastifyRequest, reply: FastifyReply) {
  if (error instanceof HoyolabConfigError) {
    return reply.code(501).send({
      error: "HoYoLAB integration is not configured",
      missing: error.missing,
      risks: getHoyolabConfigSummary().risks
    });
  }

  if (error instanceof HoyolabApiError) {
    return reply.code(502).send({
      error: "HoYoLAB upstream request failed",
      status: error.status,
      payload: error.payload
    });
  }

  request.log.error(error);
  return reply.code(502).send({ error: "HoYoLAB request failed" });
}

async function resizeImage(
  body: Buffer,
  options: {
    width?: number;
    height?: number;
    fit?: "cover" | "contain" | "fill" | "inside" | "outside";
    format?: "webp" | "png" | "jpeg";
  }
) {
  if (!options.width && !options.height && !options.format) {
    return {
      body,
      contentType: undefined,
      resized: false
    };
  }

  let pipeline = sharp(body, { limitInputPixels: 4096 * 4096 }).resize({
    width: options.width,
    height: options.height,
    fit: options.fit ?? "inside",
    withoutEnlargement: true
  });
  const format = options.format ?? "webp";

  if (format === "png") {
    pipeline = pipeline.png();
  } else if (format === "jpeg") {
    pipeline = pipeline.jpeg({ quality: 88 });
  } else {
    pipeline = pipeline.webp({ quality: 88 });
  }

  return {
    body: await pipeline.toBuffer(),
    contentType: `image/${format}`,
    resized: true
  };
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function parseAssetVariant(value: string): AssetVariant | undefined {
  const normalized = value.replace(/\.svg$/i, "");
  return normalized === "icon" || normalized === "card" ? normalized : undefined;
}

function parseOfficialAssetVariant(value: string) {
  return value === "official-icon" || value === "official-card" ? value : undefined;
}

function findAssetItem(kind: AssetKind, itemId: string) {
  if (kind === "agents") {
    return allAgents.find((item) => item.id === itemId);
  }
  if (kind === "w-engines") {
    return wEngines.find((item) => item.id === itemId);
  }
  if (kind === "drive-discs") {
    return driveDiscs.find((item) => item.id === itemId);
  }
  return materials.find((item) => item.id === itemId);
}

function localizeAssetItem(kind: AssetKind, item: NonNullable<ReturnType<typeof findAssetItem>>, locale: ReturnType<typeof readLocale>) {
  if (kind === "agents") {
    return localizeAgent(item as (typeof allAgents)[number], locale);
  }
  if (kind === "w-engines") {
    return localizeWEngine(item as (typeof wEngines)[number], locale);
  }
  if (kind === "drive-discs") {
    return localizeDriveDisc(item as (typeof driveDiscs)[number], locale);
  }
  return localizeMaterial(item as (typeof materials)[number], locale);
}

function getAssetLabel(item: unknown) {
  const maybeLocalized = item as { localized?: { name?: string }; name?: string };
  return maybeLocalized.localized?.name ?? maybeLocalized.name ?? "ZZZ";
}

function officialAssetRedirectUrl(kind: AssetKind, item: NonNullable<ReturnType<typeof findAssetItem>>, variant: "official-icon" | "official-card") {
  const base = withImages(kind, item as { id: string; name: string });
  if (variant === "official-card") {
    return base.images.card;
  }

  return officialIconUrl(kind, item as { id: string; name: string });
}

function compareCount(local: number, upstream: number | undefined) {
  if (upstream === undefined) {
    return {
      local,
      upstream: null,
      delta: null
    };
  }

  return {
    local,
    upstream,
    delta: upstream - local
  };
}

function iconManifestNanokaItem(item: NanokaCatalogItem) {
  return {
    id: item.id,
    name: item.name,
    rank: item.rank,
    class: item.class,
    icon: item.images.icon ?? item.images.generatedIcon,
    generatedIcon: item.images.generatedIcon,
    sourcePath: item.images.sourcePath,
    source: item.images.source
  };
}

function renderNanokaItemSvg(item: NanokaCatalogItem, variant: AssetVariant) {
  const rarity = item.rank ? `Rank ${item.rank}` : "ITEM";
  const accent = item.rank === 4 ? "#f6c65b" : item.rank === 3 ? "#c790ff" : item.rank === 2 ? "#7fb7ff" : "#68d391";
  const size = variant === "card" ? { width: 640, height: 360 } : { width: 256, height: 256 };
  const initial = escapeXml(item.name.trim().slice(0, 1).toUpperCase() || "?");
  const label = escapeXml(item.name);
  const subtitle = escapeXml(`Item ${item.id}${item.class === null ? "" : ` / Class ${item.class}`}`);

  if (variant === "icon") {
    return svg(size.width, size.height, `
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#181810"/>
          <stop offset="100%" stop-color="#050608"/>
        </linearGradient>
      </defs>
      <rect width="256" height="256" rx="42" fill="url(#bg)"/>
      <rect x="42" y="42" width="172" height="172" rx="34" fill="${accent}" opacity="0.16"/>
      <circle cx="128" cy="120" r="54" fill="none" stroke="${accent}" stroke-width="8"/>
      <text x="128" y="143" text-anchor="middle" font-size="72" font-weight="800" fill="#fff7da">${initial}</text>
      <text x="128" y="224" text-anchor="middle" font-size="16" font-weight="800" fill="${accent}">ITEM</text>
    `);
  }

  return svg(size.width, size.height, `
    <defs>
      <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#181810"/>
        <stop offset="100%" stop-color="#050608"/>
      </linearGradient>
      <radialGradient id="glow" cx="76%" cy="28%" r="80%">
        <stop offset="0%" stop-color="${accent}" stop-opacity="0.34"/>
        <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="640" height="360" fill="url(#bg)"/>
    <rect width="640" height="360" fill="url(#glow)"/>
    <circle cx="508" cy="122" r="76" fill="${accent}" opacity="0.18"/>
    <circle cx="508" cy="122" r="54" fill="none" stroke="${accent}" stroke-width="8"/>
    <text x="508" y="145" text-anchor="middle" font-size="76" font-weight="800" fill="#fff7da">${initial}</text>
    <text x="48" y="78" font-size="20" font-weight="800" fill="${accent}">ITEM</text>
    <text x="48" y="166" font-size="42" font-weight="800" fill="#fff7da">${label}</text>
    <text x="50" y="214" font-size="23" font-weight="600" fill="#fff7da" opacity="0.78">${subtitle}</text>
    <rect x="48" y="286" width="192" height="34" rx="17" fill="${accent}"/>
    <text x="144" y="309" text-anchor="middle" font-size="17" font-weight="800" fill="#101010">${escapeXml(rarity)}</text>
  `);
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
