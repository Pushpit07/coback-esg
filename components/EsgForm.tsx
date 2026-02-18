import { useState, useEffect, FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { EsgData } from "@/lib/types";

interface Props {
  initialData: EsgData | null;
  onSave: (data: EsgData) => void;
}

export default function EsgForm({ initialData, onSave }: Props) {
  const [companyName, setCompanyName] = useState("");
  const [reportingYear, setReportingYear] = useState<number | "">(2024);
  const [scope1, setScope1] = useState<number | "">("");
  const [scope2, setScope2] = useState<number | "">("");
  const [scope3, setScope3] = useState<number | "">("");
  const [energy, setEnergy] = useState<number | "">("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setCompanyName(initialData.company_name);
      setReportingYear(initialData.reporting_year);
      setScope1(initialData.scope1_tco2e);
      setScope2(initialData.scope2_tco2e);
      if (initialData.scope3_tco2e != null) setScope3(initialData.scope3_tco2e);
      if (initialData.energy_consumption_kwh != null)
        setEnergy(initialData.energy_consumption_kwh);
      if (initialData.notes) setNotes(initialData.notes);
    }
  }, [initialData]);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!companyName.trim()) errs.companyName = "Company name is required";
    if (
      reportingYear === "" ||
      reportingYear < 2000 ||
      reportingYear > 2030
    )
      errs.reportingYear = "Enter a valid year (2000–2030)";
    if (scope1 === "" || scope1 < 0) errs.scope1 = "Scope 1 tCO2e is required and must be ≥ 0";
    if (scope2 === "" || scope2 < 0) errs.scope2 = "Scope 2 tCO2e is required and must be ≥ 0";
    if (scope3 !== "" && scope3 < 0) errs.scope3 = "Scope 3 must be ≥ 0";
    if (energy !== "" && energy < 0) errs.energy = "Energy consumption must be ≥ 0";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaveSuccess(false);
    if (!validate()) return;

    setSaving(true);
    const payload = {
      company_name: companyName.trim(),
      reporting_year: Number(reportingYear),
      scope1_tco2e: Number(scope1),
      scope2_tco2e: Number(scope2),
      scope3_tco2e: scope3 === "" ? undefined : Number(scope3),
      energy_consumption_kwh: energy === "" ? undefined : Number(energy),
      notes: notes.trim() || undefined,
    };

    try {
      const res = await fetch("/api/esg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        setErrors({ form: err.error || "Failed to save" });
        setSaving(false);
        return;
      }

      const result = await res.json();
      setSaving(false);
      setSaveSuccess(true);
      onSave(result.data);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setErrors({ form: "Network error. Please try again." });
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ESG Data Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.form && (
            <Alert variant="destructive">
              <AlertDescription>{errors.form}</AlertDescription>
            </Alert>
          )}

          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="companyName">
              Company Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Acme Corp"
            />
            {errors.companyName && (
              <p className="text-sm text-destructive">{errors.companyName}</p>
            )}
          </div>

          {/* Reporting Year */}
          <div className="space-y-2">
            <Label htmlFor="reportingYear">
              Reporting Year <span className="text-destructive">*</span>
            </Label>
            <Input
              id="reportingYear"
              type="number"
              value={reportingYear}
              onChange={(e) =>
                setReportingYear(e.target.value === "" ? "" : Number(e.target.value))
              }
              placeholder="e.g. 2024"
              min={2000}
              max={2030}
            />
            {errors.reportingYear && (
              <p className="text-sm text-destructive">{errors.reportingYear}</p>
            )}
          </div>

          {/* Scope 1 & 2 side by side */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="scope1">
                Scope 1 tCO2e <span className="text-destructive">*</span>
              </Label>
              <Input
                id="scope1"
                type="number"
                value={scope1}
                onChange={(e) =>
                  setScope1(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="Direct emissions"
                min={0}
                step="any"
              />
              {errors.scope1 && (
                <p className="text-sm text-destructive">{errors.scope1}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="scope2">
                Scope 2 tCO2e <span className="text-destructive">*</span>
              </Label>
              <Input
                id="scope2"
                type="number"
                value={scope2}
                onChange={(e) =>
                  setScope2(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="Indirect emissions"
                min={0}
                step="any"
              />
              {errors.scope2 && (
                <p className="text-sm text-destructive">{errors.scope2}</p>
              )}
            </div>
          </div>

          {/* Optional fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="scope3">Scope 3 tCO2e (optional)</Label>
              <Input
                id="scope3"
                type="number"
                value={scope3}
                onChange={(e) =>
                  setScope3(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="Value chain emissions"
                min={0}
                step="any"
              />
              {errors.scope3 && (
                <p className="text-sm text-destructive">{errors.scope3}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="energy">Energy Consumption kWh (optional)</Label>
              <Input
                id="energy"
                type="number"
                value={energy}
                onChange={(e) =>
                  setEnergy(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="Total energy"
                min={0}
                step="any"
              />
              {errors.energy && (
                <p className="text-sm text-destructive">{errors.energy}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional context or comments..."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              rows={3}
            />
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Data"}
            </Button>
            {saveSuccess && (
              <span className="text-sm font-medium" style={{ color: "#02F789" }}>
                Data saved successfully!
              </span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
