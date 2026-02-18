import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EsgData } from "@/lib/types";

interface Props {
  data: EsgData;
  forReport?: boolean;
}

export default function EmissionsChart({ data, forReport }: Props) {
  const chartData = [
    { name: "Scope 1", value: data.scope1_tco2e, fill: "#ef4444" },
    { name: "Scope 2", value: data.scope2_tco2e, fill: "#f59e0b" },
    ...(data.scope3_tco2e != null
      ? [{ name: "Scope 3", value: data.scope3_tco2e, fill: "#3b82f6" }]
      : []),
  ];

  const total =
    data.scope1_tco2e +
    data.scope2_tco2e +
    (data.scope3_tco2e ?? 0);

  const tickColor = forReport ? "#000" : undefined;
  const gridColor = forReport ? "#ccc" : undefined;

  const barChart = (
    <BarChart
      data={chartData}
      width={forReport ? 500 : undefined}
      height={forReport ? 300 : undefined}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
      <XAxis dataKey="name" tick={{ fill: tickColor }} />
      <YAxis
        tick={{ fill: tickColor }}
        label={{
          value: "tCO2e",
          angle: -90,
          position: "insideLeft",
          fill: tickColor,
        }}
      />
      <Tooltip
        formatter={(value) => [
          `${Number(value).toLocaleString()} tCO2e`,
        ]}
      />
      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
        {chartData.map((entry) => (
          <Cell key={entry.name} fill={entry.fill} />
        ))}
      </Bar>
    </BarChart>
  );

  if (forReport) return <div style={{ width: 500, height: 300 }}>{barChart}</div>;

  const chart = (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        {barChart}
      </ResponsiveContainer>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emissions Breakdown</CardTitle>
        <p className="text-sm text-muted-foreground">
          Total: {total.toLocaleString()} tCO2e
        </p>
      </CardHeader>
      <CardContent>{chart}</CardContent>
    </Card>
  );
}
