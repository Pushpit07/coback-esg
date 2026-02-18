import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EsgData } from "@/lib/types";

interface Props {
  data: EsgData;
}

export default function DataSummary({ data }: Props) {
  const total =
    data.scope1_tco2e +
    data.scope2_tco2e +
    (data.scope3_tco2e ?? 0);

  const rows: { label: string; value: string }[] = [
    { label: "Company", value: data.company_name },
    { label: "Reporting Year", value: String(data.reporting_year) },
    { label: "Scope 1", value: `${data.scope1_tco2e.toLocaleString()} tCO2e` },
    { label: "Scope 2", value: `${data.scope2_tco2e.toLocaleString()} tCO2e` },
  ];

  if (data.scope3_tco2e != null) {
    rows.push({ label: "Scope 3", value: `${data.scope3_tco2e.toLocaleString()} tCO2e` });
  }

  if (data.energy_consumption_kwh != null) {
    rows.push({ label: "Energy", value: `${data.energy_consumption_kwh.toLocaleString()} kWh` });
  }

  rows.push({ label: "Total Emissions", value: `${total.toLocaleString()} tCO2e` });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Data Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-3">
          {rows.map((row) => (
            <div key={row.label} className="flex justify-between gap-4">
              <dt className="text-sm text-muted-foreground">{row.label}</dt>
              <dd className="text-sm font-medium text-right">{row.value}</dd>
            </div>
          ))}
        </dl>
        {data.notes && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-1">Notes</p>
            <p className="text-sm">{data.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
