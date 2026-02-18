import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EmissionsChart from "./EmissionsChart";
import type { EsgData } from "@/lib/types";

interface Props {
  data: EsgData;
}

export default function ReportPreview({ data }: Props) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const selectedStrategy =
    data.strategies && data.selected_strategy_index != null
      ? data.strategies[data.selected_strategy_index]
      : null;

  const total =
    data.scope1_tco2e +
    data.scope2_tco2e +
    (data.scope3_tco2e ?? 0);

  async function handleDownload() {
    setDownloading(true);
    try {
      // Dynamic import to avoid SSR issues
      const html2pdf = (await import("html2pdf.js")).default;
      const element = reportRef.current;
      if (!element) return;

      const opt = {
        margin: 10,
        filename: `${data.company_name.replace(/\s+/g, "_")}_ESG_Report_${data.reporting_year}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm" as const, format: "a4", orientation: "portrait" as const },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("PDF generation failed:", err);
    }
    setDownloading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Download</CardTitle>
        <p className="text-sm text-muted-foreground">
          Download a PDF report with your emissions data, chart, and selected
          strategy
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleDownload} disabled={downloading}>
          {downloading ? "Generating PDF..." : "Download PDF Report"}
        </Button>

        {/* PDF-ready content */}
        <div
          ref={reportRef}
          className="rounded-lg border bg-white p-6"
          style={{ color: "#000" }}
        >
          <div className="mb-4 flex items-center gap-2 border-b pb-4">
            <div
              className="flex h-8 w-8 items-center justify-center rounded"
              style={{ backgroundColor: "#02F789" }}
            >
              <span className="text-sm font-bold" style={{ color: "#000" }}>C</span>
            </div>
            <span className="text-lg font-bold" style={{ color: "#02F789" }}>
              COBACK
            </span>
          </div>
          <h2 className="mb-1 text-2xl font-bold" style={{ color: "#000" }}>
            ESG Report: {data.company_name}
          </h2>
          <p className="mb-4 text-sm" style={{ color: "#666" }}>
            Reporting Year: {data.reporting_year} | Generated:{" "}
            {new Date().toLocaleDateString()}
          </p>
          <hr className="mb-4" />

          <h3 className="mb-2 text-lg font-semibold" style={{ color: "#000" }}>
            Emissions Summary
          </h3>
          <table className="mb-4 w-full text-sm" style={{ color: "#000" }}>
            <tbody>
              <tr className="border-b">
                <td className="py-2 font-medium">Scope 1 (Direct)</td>
                <td className="py-2 text-right">
                  {data.scope1_tco2e.toLocaleString()} tCO2e
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Scope 2 (Indirect)</td>
                <td className="py-2 text-right">
                  {data.scope2_tco2e.toLocaleString()} tCO2e
                </td>
              </tr>
              {data.scope3_tco2e != null && (
                <tr className="border-b">
                  <td className="py-2 font-medium">Scope 3 (Value Chain)</td>
                  <td className="py-2 text-right">
                    {data.scope3_tco2e.toLocaleString()} tCO2e
                  </td>
                </tr>
              )}
              {data.energy_consumption_kwh != null && (
                <tr className="border-b">
                  <td className="py-2 font-medium">Energy Consumption</td>
                  <td className="py-2 text-right">
                    {data.energy_consumption_kwh.toLocaleString()} kWh
                  </td>
                </tr>
              )}
              <tr className="font-bold">
                <td className="py-2">Total Emissions</td>
                <td className="py-2 text-right">
                  {total.toLocaleString()} tCO2e
                </td>
              </tr>
            </tbody>
          </table>

          <EmissionsChart data={data} />

          {selectedStrategy && (
            <>
              <h3
                className="mb-2 mt-4 text-lg font-semibold"
                style={{ color: "#000" }}
              >
                Selected Strategy
              </h3>
              <p
                className="whitespace-pre-wrap text-sm leading-relaxed"
                style={{ color: "#333" }}
              >
                {selectedStrategy}
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
