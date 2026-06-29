import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { z } from "zod";
import { agents, allAgents, datasetMeta, driveDiscs, materials, upcomingAgents, wEngines } from "./data.js";
import { calculateAgentLevelCosts } from "./upgrade.js";
import { createBuild, getBuild, listBuilds } from "./buildStore.js";
import { localizeAgent, localizeDriveDisc, localizeMaterial, localizeWEngine, readLocale } from "./localization.js";
import { type AssetKind, type AssetVariant, iconManifestItem, renderAssetSvg, withImages } from "./assets.js";

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

app.get("/health", async () => ({
  ok: true,
  service: "zzz-api"
}));

app.get("/api/meta", async () => datasetMeta);

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
  const variant = parseAssetVariant(params.variant);
  const item = findAssetItem(params.kind, params.itemId);

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
  const query = z.object({ lang: z.string().optional(), includeUpcoming: z.coerce.boolean().optional() }).parse(request.query);
  const locale = readLocale(query.lang);
  const lang = locale === "ja" ? "ja" : undefined;
  const agentSource = query.includeUpcoming ? allAgents : agents;

  return {
    agents: agentSource.map((agent) => iconManifestItem("agents", localizeAgent(agent, locale), lang)),
    wEngines: wEngines.map((wEngine) => iconManifestItem("w-engines", localizeWEngine(wEngine, locale), lang)),
    driveDiscs: driveDiscs.map((driveDisc) => iconManifestItem("drive-discs", localizeDriveDisc(driveDisc, locale), lang)),
    materials: materials.map((material) => iconManifestItem("materials", localizeMaterial(material, locale), lang))
  };
});

app.get("/api/icons/:kind", async (request, reply) => {
  const params = z.object({ kind: z.enum(["agents", "w-engines", "drive-discs", "materials"]) }).parse(request.params);
  const query = z.object({ lang: z.string().optional(), includeUpcoming: z.coerce.boolean().optional() }).parse(request.query);
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

  return reply.code(404).send({ error: "Icon kind not found" });
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

function parseAssetVariant(value: string): AssetVariant | undefined {
  const normalized = value.replace(/\.svg$/i, "");
  return normalized === "icon" || normalized === "card" ? normalized : undefined;
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
