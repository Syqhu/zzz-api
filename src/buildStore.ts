import { randomUUID } from "node:crypto";

export type Build = {
  id: string;
  agentId: string;
  name: string;
  wEngineId?: string;
  driveDiscs: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateBuildInput = {
  agentId: string;
  name: string;
  wEngineId?: string;
  driveDiscs?: string[];
  notes?: string;
};

const builds = new Map<string, Build>();

export function createBuild(input: CreateBuildInput): Build {
  const now = new Date().toISOString();
  const build: Build = {
    id: randomUUID(),
    agentId: input.agentId,
    name: input.name,
    wEngineId: input.wEngineId,
    driveDiscs: input.driveDiscs ?? [],
    notes: input.notes,
    createdAt: now,
    updatedAt: now
  };

  builds.set(build.id, build);
  return build;
}

export function listBuilds(): Build[] {
  return Array.from(builds.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getBuild(id: string): Build | undefined {
  return builds.get(id);
}
