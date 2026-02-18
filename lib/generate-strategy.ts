import { StrategyRequest, StrategyResponse } from "./types";

function generateMockStrategies(req: StrategyRequest): StrategyResponse {
  const total =
    req.scope1_tco2e + req.scope2_tco2e + (req.scope3_tco2e ?? 0);
  const dominant =
    req.scope1_tco2e >= req.scope2_tco2e
      ? "Scope 1 (direct)"
      : "Scope 2 (indirect)";

  return {
    strategies: [
      // SHORT (2-4 sentences)
      `${req.company_name} emitted a total of ${total.toLocaleString()} tCO2e in ${req.reporting_year}, with ${dominant} emissions being the dominant contributor. ` +
        `Prioritizing reduction in ${dominant} emissions through operational efficiency improvements and renewable energy procurement could yield a 15-20% reduction within the first year. ` +
        `Immediate action on energy audits is recommended.`,

      // NEUTRAL (5-8 sentences)
      `In reporting year ${req.reporting_year}, ${req.company_name} recorded Scope 1 emissions of ${req.scope1_tco2e.toLocaleString()} tCO2e and Scope 2 emissions of ${req.scope2_tco2e.toLocaleString()} tCO2e` +
        `${req.scope3_tco2e ? `, with Scope 3 emissions adding ${req.scope3_tco2e.toLocaleString()} tCO2e` : ""}, ` +
        `totaling ${total.toLocaleString()} tCO2e. ` +
        `A balanced decarbonization strategy should address both direct and energy-related emissions. ` +
        `For Scope 2 reduction, transitioning to renewable electricity through Power Purchase Agreements (PPAs) or on-site solar installation could reduce indirect emissions by up to 40%. ` +
        `Scope 1 emissions can be targeted through fleet electrification and process optimization. ` +
        `Setting annual reduction targets of 4.2% aligns with Science Based Targets initiative (SBTi) 1.5°C pathways. ` +
        `${req.energy_consumption_kwh ? `With current energy consumption at ${req.energy_consumption_kwh.toLocaleString()} kWh, energy efficiency measures should be a key pillar of the strategy. ` : ""}` +
        `Regular monitoring and third-party verification will ensure credible progress reporting.`,

      // DETAILED (structured)
      `ESG Decarbonization Strategy for ${req.company_name} (${req.reporting_year})\n\n` +
        `CURRENT EMISSIONS PROFILE:\n` +
        `• Scope 1 (Direct Emissions): ${req.scope1_tco2e.toLocaleString()} tCO2e\n` +
        `• Scope 2 (Energy Indirect): ${req.scope2_tco2e.toLocaleString()} tCO2e\n` +
        `${req.scope3_tco2e ? `• Scope 3 (Value Chain): ${req.scope3_tco2e.toLocaleString()} tCO2e\n` : ""}` +
        `• Total Emissions: ${total.toLocaleString()} tCO2e\n` +
        `${req.energy_consumption_kwh ? `• Energy Consumption: ${req.energy_consumption_kwh.toLocaleString()} kWh\n` : ""}` +
        `\nSHORT-TERM ACTIONS (0-12 months):\n` +
        `1. Conduct comprehensive energy audit across all facilities\n` +
        `2. Switch to certified renewable electricity tariffs to reduce Scope 2 by ~30%\n` +
        `3. Implement LED lighting and HVAC optimization for immediate efficiency gains\n` +
        `4. Establish baseline carbon accounting and reporting framework\n` +
        `\nMEDIUM-TERM ACTIONS (1-3 years):\n` +
        `1. Electrify vehicle fleet and heating systems to address ${req.scope1_tco2e.toLocaleString()} tCO2e of Scope 1\n` +
        `2. Install on-site renewable generation (solar PV) where feasible\n` +
        `3. Engage top suppliers on emissions disclosure and reduction targets\n` +
        `4. Implement internal carbon pricing at $50-75/tCO2e to drive behavioral change\n` +
        `\nLONG-TERM VISION (3-5 years):\n` +
        `1. Achieve 50% reduction from ${req.reporting_year} baseline by ${req.reporting_year + 5}\n` +
        `2. Obtain SBTi validation for net-zero commitment by 2050\n` +
        `3. Transition to fully circular operations where possible\n` +
        `4. Invest in high-quality carbon removal credits for residual emissions\n` +
        `\nTARGET: Reduce total emissions from ${total.toLocaleString()} tCO2e to ${Math.round(total * 0.5).toLocaleString()} tCO2e by ${req.reporting_year + 5}.`,
    ],
  };
}

function stringifyValue(val: unknown): string {
  if (typeof val === "string") return val;
  if (typeof val === "object" && val !== null) {
    return JSON.stringify(val, null, 2);
  }
  return String(val);
}

function extractStrategies(parsed: Record<string, unknown>): string[] | null {
  // Direct match
  if (Array.isArray(parsed.strategies) && parsed.strategies.length === 3) {
    return parsed.strategies.map(stringifyValue);
  }
  // Find the first array with 3 items
  for (const val of Object.values(parsed)) {
    if (Array.isArray(val) && val.length === 3) {
      return val.map(stringifyValue);
    }
  }
  return null;
}

export async function generateStrategies(
  req: StrategyRequest
): Promise<StrategyResponse> {
  // Try OpenAI if API key is available
  if (process.env.OPENAI_API_KEY) {
    try {
      const { default: OpenAI } = await import("openai");
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const prompt = `You are an ESG consultant. Given the following emissions data for ${req.company_name} (${req.reporting_year}):
- Scope 1: ${req.scope1_tco2e} tCO2e
- Scope 2: ${req.scope2_tco2e} tCO2e
${req.scope3_tco2e ? `- Scope 3: ${req.scope3_tco2e} tCO2e` : ""}
${req.energy_consumption_kwh ? `- Energy Consumption: ${req.energy_consumption_kwh} kWh` : ""}

Generate exactly 3 decarbonization strategy variants as plain text strings. Each MUST reference the specific numbers provided above.
1. SHORT: 2-4 sentences, executive summary style
2. NEUTRAL: 5-8 sentences, balanced analysis with specific recommendations
3. DETAILED: Multi-section with bullet points, specific measures and targets

IMPORTANT: Each strategy must be a single plain text string, NOT a nested object.
Return ONLY this exact JSON structure: { "strategies": ["short text string", "neutral text string", "detailed text string"] }`;

      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 2000,
      });

      const parsed = JSON.parse(
        completion.choices[0].message.content || "{}"
      );
      const strategies = extractStrategies(parsed);
      if (strategies) {
        return { strategies: strategies as [string, string, string] };
      }
    } catch (err) {
      console.warn("OpenAI call failed, falling back to mock:", err);
    }
  }

  return generateMockStrategies(req);
}
