import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { EsgData } from "@/lib/types";
import EsgForm from "@/components/EsgForm";

// Dynamic imports to avoid SSR issues with Recharts/html2pdf
const EmissionsChart = dynamic(() => import("@/components/EmissionsChart"), {
  ssr: false,
});
const StrategyPanel = dynamic(() => import("@/components/StrategyPanel"), {
  ssr: false,
});
const ReportPreview = dynamic(() => import("@/components/ReportPreview"), {
  ssr: false,
});

export default function Home() {
  const [data, setData] = useState<EsgData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/esg")
      .then((r) => r.json())
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function handleSave(saved: EsgData) {
    setData(saved);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          ESG Report Pipeline
        </h1>
        <p className="text-muted-foreground">
          Enter emissions data, visualize, generate strategies, and download
          reports.
        </p>
      </div>

      <EsgForm initialData={data} onSave={handleSave} />

      {data && (
        <>
          <EmissionsChart data={data} />
          <StrategyPanel data={data} onUpdate={setData} />
          <ReportPreview data={data} />
        </>
      )}
    </main>
  );
}
