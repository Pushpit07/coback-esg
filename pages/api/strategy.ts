import type { NextApiRequest, NextApiResponse } from "next";
import { generateStrategies } from "@/lib/generate-strategy";
import { readEsgData, writeEsgData } from "@/lib/storage";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { action } = req.body;

  if (action === "generate") {
    const existing = readEsgData();
    if (!existing) {
      return res.status(400).json({ error: "No saved ESG data found. Please save data first." });
    }

    const result = await generateStrategies({
      company_name: existing.company_name,
      reporting_year: existing.reporting_year,
      scope1_tco2e: existing.scope1_tco2e,
      scope2_tco2e: existing.scope2_tco2e,
      scope3_tco2e: existing.scope3_tco2e,
      energy_consumption_kwh: existing.energy_consumption_kwh,
    });

    // Save strategies to persistence
    existing.strategies = result.strategies;
    existing.selected_strategy_index = undefined;
    writeEsgData(existing);

    return res.status(200).json(result);
  }

  if (action === "select") {
    const { index } = req.body;
    if (typeof index !== "number" || index < 0 || index > 2) {
      return res.status(400).json({ error: "Invalid strategy index" });
    }

    const existing = readEsgData();
    if (!existing) {
      return res.status(404).json({ error: "No data found" });
    }

    existing.selected_strategy_index = index;
    writeEsgData(existing);
    return res.status(200).json({ success: true });
  }

  return res.status(400).json({ error: "Unknown action" });
}
