import { levelCostTable } from "./data.js";

export function calculateAgentLevelCosts(from: number, to: number) {
  let denny = 0;
  let exp = 0;

  for (let level = from; level < to; level += 1) {
    const bracket = levelCostTable.find((row) => level >= row.min && level < row.max);
    if (!bracket) {
      continue;
    }

    denny += bracket.dennyPerLevel;
    exp += bracket.expPerLevel;
  }

  return {
    from,
    to,
    totals: {
      denny,
      agentExp: exp
    }
  };
}
