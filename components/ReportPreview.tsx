import { useState, useMemo } from "react";
import {
  pdf,
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Svg,
  Rect,
  Line,
  Path,
  G,
  BlobProvider,
} from "@react-pdf/renderer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { EsgData } from "@/lib/types";

const PAPER_SIZES = [
  { label: "A4", value: "a4", ratio: 210 / 297 },
  { label: "Letter", value: "letter", ratio: 215.9 / 279.4 },
  { label: "A3", value: "a3", ratio: 297 / 420 },
  { label: "Legal", value: "legal", ratio: 215.9 / 355.6 },
] as const;

type PaperValue = (typeof PAPER_SIZES)[number]["value"];

/* ------------------------------------------------------------------ */
/*  Shared PDF document – used for both preview and download          */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#000" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  logoWrap: { marginBottom: 2 },
  title: { fontSize: 20, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  subtitle: { fontSize: 9, color: "#666", marginBottom: 16 },
  sectionTitle: { fontSize: 13, fontFamily: "Helvetica-Bold", marginBottom: 8 },
  hr: { borderBottomWidth: 1, borderBottomColor: "#e5e5e5", marginBottom: 16 },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 6,
  },
  tableLabel: { flex: 1, fontSize: 10 },
  tableValue: { width: 120, fontSize: 10, textAlign: "right" },
  tableBold: { fontFamily: "Helvetica-Bold" },
  chartSection: { marginTop: 20, marginBottom: 20 },
  chartTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 8 },
  legendRow: { flexDirection: "row", gap: 12, marginTop: 8 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 2 },
  legendText: { fontSize: 8, color: "#555" },
  strategyTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginTop: 20,
    marginBottom: 8,
  },
  strategyText: { fontSize: 10, color: "#333", lineHeight: 1.6 },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#999",
  },
});

function EsgReportDoc({
  data,
  paperSize,
}: {
  data: EsgData;
  paperSize: PaperValue;
}) {
  const total =
    data.scope1_tco2e + data.scope2_tco2e + (data.scope3_tco2e ?? 0);

  const selectedStrategy =
    data.strategies && data.selected_strategy_index != null
      ? data.strategies[data.selected_strategy_index]
      : null;

  const scopes = [
    { name: "Scope 1", value: data.scope1_tco2e, fill: "#ef4444" },
    { name: "Scope 2", value: data.scope2_tco2e, fill: "#f59e0b" },
    ...(data.scope3_tco2e != null
      ? [{ name: "Scope 3", value: data.scope3_tco2e, fill: "#3b82f6" }]
      : []),
  ];
  const maxVal = Math.max(...scopes.map((s) => s.value), 1);
  const chartW = 460;
  const chartH = 160;
  const barW = 60;
  const gap = 30;
  const totalBarsW = scopes.length * barW + (scopes.length - 1) * gap;
  const startX = (chartW - totalBarsW) / 2;

  return (
    <Document>
      <Page size={paperSize.toUpperCase() as "A4"} style={styles.page}>
        {/* Header — COBACK logo */}
        <View style={styles.header}>
          <View style={styles.logoWrap}>
            <Svg width={120} height={22} viewBox="0 0 181.56 32.27">
              <G>
                <Path fill="#04f87f" d="M14.34 14.3H6.87L0 7.43 7.42 0l.2.1 6.72 6.73z" />
                <Path fill="#04f87f" d="M18.05 14.3V6.83L24.78.1l.2-.1 7.42 7.43-6.87 6.87z" />
                <Path fill="#04f87f" d="M18.05 18.02h7.48l6.87 6.87-7.27 7.29-.2.09-.21-.09-6.67-6.68z" />
                <Path fill="#04f87f" d="M14.34 18.02v7.48l-6.66 6.68-.19.08-7.3-7.16-.1-.21.1-.2 6.68-6.67z" />
                <Path fill="#000000" d="M47.35 20.63c4.52-.02 9.05-.37 13.54-.9.08 1.42-.13 2.81-.1 4.22-2.32.24-4.64.25-6.98.3-3.31.07-8.36.53-10.48-2.65-1.54-2.3-1.53-7.55-.52-10.06 1.98-4.89 9.34-3.53 13.51-3.65l4.36.3.1 4.22-13.44-1v9.23Z" />
                <Path fill="#000000" d="M68 9.03c-3.13 1.61-3.45 5.44-3.18 8.61.32 3.63 2.16 5.54 5.68 6.26 3.55.72 11.19.86 14.05-1.61 2.88-2.49 2.83-10.18-.15-12.59-3.06-2.48-12.99-2.42-16.4-.66Zm13.45 3.07v7.93H70.01V12.1z" />
                <Path fill="#000000" d="M91.98 8.18v15.76h14.7c2.04-.16 4.49-.65 5.13-2.89.65-2.29-.18-4.6-2.68-5.04.32-.36.81-.46 1.19-.76 1.5-1.19 1.46-3.99.31-5.41-1.04-1.27-2.94-1.47-4.46-1.66h-14.2Zm15.15 9.44v2.61H96.7v-2.61zm-.6-5.72v2.51H96.7V11.9z" />
                <Path fill="#000000" d="M114.35 23.94h5.12c.2-.42 1.25-3.02 1.47-3.1 2.95 0 5.95-.09 8.87.05l1.44 3.05h5.17l-7.57-15.66-6.83-.11-7.67 15.76Zm13.75-6.62h-5.52l2.76-5.92z" />
                <Path fill="#000000" d="M144.35 20.63c4.52-.03 9.05-.36 13.54-.9.05 1.41-.17 2.8-.1 4.22-1.25.14-2.51.14-3.76.2-6.06.29-14.33 1.67-14.9-6.58-.39-5.59.75-9.06 6.77-9.68 3.87-.21 7.76 0 11.62.32l.17.23.1 3.96-13.44-1z" />
                <Path fill="#000000" d="M162.7 8.18h4.71v6.02l7.47-6.02h6.37l-8.22 6.79 8.52 8.97h-6.27l-5.77-6.08c-.16-.07-1.79 1.45-2.11 1.61v4.47h-4.71V8.18Z" />
              </G>
            </Svg>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>ESG Report: {data.company_name}</Text>
        <Text style={styles.subtitle}>
          Reporting Year: {data.reporting_year} | Generated:{" "}
          {new Date().toLocaleDateString()}
        </Text>
        <View style={styles.hr} />

        {/* Emissions table */}
        <Text style={styles.sectionTitle}>Emissions Summary</Text>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Scope 1 (Direct)</Text>
          <Text style={styles.tableValue}>
            {data.scope1_tco2e.toLocaleString()} tCO2e
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Scope 2 (Indirect)</Text>
          <Text style={styles.tableValue}>
            {data.scope2_tco2e.toLocaleString()} tCO2e
          </Text>
        </View>
        {data.scope3_tco2e != null && (
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Scope 3 (Value Chain)</Text>
            <Text style={styles.tableValue}>
              {data.scope3_tco2e.toLocaleString()} tCO2e
            </Text>
          </View>
        )}
        {data.energy_consumption_kwh != null && (
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Energy Consumption</Text>
            <Text style={styles.tableValue}>
              {data.energy_consumption_kwh.toLocaleString()} kWh
            </Text>
          </View>
        )}
        <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
          <Text style={[styles.tableLabel, styles.tableBold]}>
            Total Emissions
          </Text>
          <Text style={[styles.tableValue, styles.tableBold]}>
            {total.toLocaleString()} tCO2e
          </Text>
        </View>

        {/* Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Emissions Breakdown</Text>
          <Svg
            width={chartW}
            height={chartH + 30}
            viewBox={`0 0 ${chartW} ${chartH + 30}`}
          >
            {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
              const y = chartH - frac * chartH;
              return (
                <Line
                  key={frac}
                  x1={0}
                  y1={y}
                  x2={chartW}
                  y2={y}
                  stroke="#eee"
                  strokeWidth={1}
                />
              );
            })}
            {scopes.map((scope, i) => {
              const barH = (scope.value / maxVal) * chartH;
              const x = startX + i * (barW + gap);
              return (
                <Rect
                  key={scope.name}
                  x={x}
                  y={chartH - barH}
                  width={barW}
                  height={barH}
                  fill={scope.fill}
                  rx={4}
                />
              );
            })}
          </Svg>
          <View style={styles.legendRow}>
            {scopes.map((scope) => (
              <View key={scope.name} style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: scope.fill }]}
                />
                <Text style={styles.legendText}>
                  {scope.name}: {scope.value.toLocaleString()} tCO2e
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Strategy */}
        {selectedStrategy && (
          <>
            <Text style={styles.strategyTitle}>Selected Strategy</Text>
            <Text style={styles.strategyText}>{selectedStrategy}</Text>
          </>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>COBACK ESG Report</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

interface Props {
  data: EsgData;
}

export default function ReportPreview({ data }: Props) {
  const [downloading, setDownloading] = useState(false);
  const [paperSize, setPaperSize] = useState<PaperValue>("a4");

  const doc = useMemo(
    () => <EsgReportDoc data={data} paperSize={paperSize} />,
    [data, paperSize],
  );

  async function handleDownload() {
    setDownloading(true);
    try {
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.company_name.replace(/\s+/g, "_")}_ESG_Report_${data.reporting_year}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setDownloading(false);
    }
  }

  const currentRatio =
    PAPER_SIZES.find((s) => s.value === paperSize)?.ratio ?? 0.707;

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
        <div className="flex items-end gap-4">
          <div className="space-y-2">
            <Label>Paper Size</Label>
            <Select
              value={paperSize}
              onValueChange={(v) => setPaperSize(v as PaperValue)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                {PAPER_SIZES.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleDownload} disabled={downloading}>
            {downloading ? "Generating PDF..." : "Download PDF Report"}
          </Button>
        </div>

        {/* Live PDF preview — same document used for download */}
        <div
          className="rounded-lg border border-border/50"
          style={{ aspectRatio: currentRatio, width: "100%" }}
        >
          <BlobProvider document={doc}>
            {({ url, loading }) =>
              loading || !url ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  Rendering preview...
                </div>
              ) : (
                <iframe
                  src={`${url}#toolbar=0&navpanes=0&view=Fit`}
                  title="PDF Preview"
                  className="h-full w-full border-0"
                />
              )
            }
          </BlobProvider>
        </div>
      </CardContent>
    </Card>
  );
}
