import type { Agent, Attribute, Material, Specialty } from "./data.js";
import { materials } from "./data.js";
import { calculateAgentLevelCosts } from "./upgrade.js";

const promotionMaterialBySpecialty: Record<Specialty, string[]> = {
  Attack: ["basic-attack-certification-seal", "advanced-attack-certification-seal", "pioneers-attack-certification-seal"],
  Anomaly: ["basic-anomaly-certification-seal", "advanced-anomaly-certification-seal", "controller-certification-seal"],
  Defense: ["basic-defense-certification-seal", "advanced-defense-certification-seal", "defender-certification-seal"],
  Stun: ["basic-stun-certification-seal", "advanced-stun-certification-seal", "buster-certification-seal"],
  Support: ["basic-support-certification-seal", "advanced-support-certification-seal", "ruler-certification-seal"],
  Rupture: ["basic-rupture-certification-seal", "advanced-rupture-certification-seal", "destroyer-certification-seal"]
};

const skillChipAttribute: Record<Attribute, string> = {
  Electric: "electric",
  Fire: "fire",
  Ice: "ice",
  Physical: "physical",
  Ether: "ether",
  Wind: "wind",
  "Honed Edge": "physical",
  Frost: "ice",
  "Auric Ink": "ether"
};

export function getAgentMaterialPlan(agent: Agent, from = 1, to = 60) {
  const skillChip = skillChipAttribute[agent.attribute];
  const relatedMaterialIds = {
    level: ["basic-investigation-log", "advanced-investigation-log", "senior-investigation-log", "denny"],
    promotion: promotionMaterialBySpecialty[agent.specialty],
    skills: [`basic-${skillChip}-chip`, `advanced-${skillChip}-chip`, `specialized-${skillChip}-chip`, "hamster-cage-pass"],
    coreSkill: ["higher-dimensional-data", "finale-dance-shoes", "ferocious-grip", "living-drive", "scarlet-engine", "denny"]
  };

  return {
    agentId: agent.id,
    from,
    to,
    levelCosts: calculateAgentLevelCosts(from, to),
    relatedMaterialIds,
    relatedMaterials: {
      level: resolveMaterials(relatedMaterialIds.level),
      promotion: resolveMaterials(relatedMaterialIds.promotion),
      skills: resolveMaterials(relatedMaterialIds.skills),
      coreSkill: resolveMaterials(relatedMaterialIds.coreSkill)
    },
    notes: [
      "Level cost totals are calculated from the local level cost table.",
      "Promotion and skill materials are selected by the agent specialty and attribute.",
      "Core skill boss materials are listed as candidates because the local dataset does not yet store per-agent boss material bindings."
    ]
  };
}

function resolveMaterials(ids: string[]) {
  return ids.map((id) => materials.find((material) => material.id === id)).filter(isMaterial);
}

function isMaterial(value: Material | undefined): value is Material {
  return value !== undefined;
}
