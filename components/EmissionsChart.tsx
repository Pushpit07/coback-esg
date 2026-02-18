import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EsgData } from "@/lib/types";

interface Props {
  data: EsgData;
}

export default function EmissionsChart({ data }: Props) {
  const chartData = [
    {
      name: `${data.company_name} (${data.reporting_year})`,
      "Scope 1": data.scope1_tco2e,
      "Scope 2": data.scope2_tco2e,
      ...(data.scope3_tco2e != null ? { "Scope 3": data.scope3_tco2e } : {}),
    },
  ];

  const total =
    data.scope1_tco2e +
    data.scope2_tco2e +
    (data.scope3_tco2e ?? 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emissions Breakdown</CardTitle>
        <p className="text-sm text-muted-foreground">
          Total: {total.toLocaleString()} tCO2e
        </p>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                label={{
                  value: "tCO2e",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                formatter={(value) => [
                  `${Number(value).toLocaleString()} tCO2e`,
                ]}
              />
              <Legend />
              <Bar dataKey="Scope 1" stackId="emissions" fill="#ef4444" />
              <Bar dataKey="Scope 2" stackId="emissions" fill="#f59e0b" />
              {data.scope3_tco2e != null && (
                <Bar dataKey="Scope 3" stackId="emissions" fill="#3b82f6" />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
