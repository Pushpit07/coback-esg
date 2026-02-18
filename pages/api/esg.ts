import type { NextApiRequest, NextApiResponse } from "next";
import { readEsgData, writeEsgData } from "@/lib/storage";
import type { EsgData } from "@/lib/types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const data = readEsgData();
    return res.status(200).json({ data });
  }

  if (req.method === "POST") {
    const body = req.body as Partial<EsgData>;

    // Server-side validation
    if (
      !body.company_name?.trim() ||
      !body.reporting_year ||
      body.scope1_tco2e == null ||
      body.scope2_tco2e == null
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (
      typeof body.scope1_tco2e !== "number" ||
      typeof body.scope2_tco2e !== "number" ||
      typeof body.reporting_year !== "number"
    ) {
      return res.status(400).json({ error: "Number fields must be numbers" });
    }

    // Preserve existing strategies/selection if not provided
    const existing = readEsgData();
    const data: EsgData = {
      company_name: body.company_name.trim(),
      reporting_year: body.reporting_year,
      scope1_tco2e: body.scope1_tco2e,
      scope2_tco2e: body.scope2_tco2e,
      scope3_tco2e: body.scope3_tco2e ?? undefined,
      energy_consumption_kwh: body.energy_consumption_kwh ?? undefined,
      notes: body.notes ?? undefined,
      strategies: existing?.strategies,
      selected_strategy_index: existing?.selected_strategy_index,
      updated_at: new Date().toISOString(),
    };

    writeEsgData(data);
    return res.status(200).json({ data });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
