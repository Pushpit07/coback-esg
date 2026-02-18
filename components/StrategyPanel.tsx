import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { EsgData } from "@/lib/types";

interface Props {
  data: EsgData;
  onUpdate: (data: EsgData) => void;
}

const LABELS = [
  "Short (Executive Summary)",
  "Neutral (Balanced Analysis)",
  "Detailed (Full Strategy)",
];

const DESCRIPTIONS = [
  "2-4 sentences, quick overview",
  "5-8 sentences, balanced analysis",
  "Structured with specific measures and targets",
];

export default function StrategyPanel({ data, onUpdate }: Props) {
  const [loading, setLoading] = useState(false);
  const [strategies, setStrategies] = useState<string[]>(
    data.strategies || []
  );
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(
    data.selected_strategy_index
  );
  const [error, setError] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate" }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Failed to generate strategies");
        setLoading(false);
        return;
      }

      const result = await res.json();
      setStrategies(result.strategies);
      setSelectedIndex(undefined);
      onUpdate({
        ...data,
        strategies: result.strategies,
        selected_strategy_index: undefined,
      });
    } catch {
      setError("Network error. Please try again.");
    }

    setLoading(false);
  }

  async function handleSelect(index: number) {
    setSelectedIndex(index);

    await fetch("/api/strategy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "select", index }),
    });

    onUpdate({
      ...data,
      strategies,
      selected_strategy_index: index,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Decarbonization Strategy</CardTitle>
        <p className="text-sm text-muted-foreground">
          Generate AI-powered strategy recommendations based on your emissions
          data
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate Strategy"}
        </Button>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {strategies.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Click a variant to select it:
            </p>
            {strategies.map((text, i) => (
              <div
                key={i}
                onClick={() => handleSelect(i)}
                className={`cursor-pointer rounded-lg border-2 p-4 transition-colors ${
                  selectedIndex === i
                    ? "border-[#02F789] bg-[#02F789]/10"
                    : "border-border hover:border-[#02F789]/50"
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold">{LABELS[i]}</span>
                  <span className="text-xs text-muted-foreground">
                    {DESCRIPTIONS[i]}
                  </span>
                </div>
                {selectedIndex === i && (
                  <span className="mb-2 inline-block rounded-full bg-[#02F789] px-2 py-0.5 text-xs text-black font-medium">
                    Selected
                  </span>
                )}
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {text}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
