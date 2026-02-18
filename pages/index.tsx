import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { EsgData } from "@/lib/types";
import EsgForm from "@/components/EsgForm";
import DataSummary from "@/components/DataSummary";

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
  const [showResults, setShowResults] = useState(false);

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
    <main className={`mx-auto space-y-6 px-4 pt-20 pb-8 ${showResults ? "max-w-5xl" : "max-w-3xl"}`}>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          ESG Report Pipeline
        </h1>
        <p className="text-muted-foreground">
          Enter emissions data, visualize, generate strategies, and download
          reports.
        </p>
      </div>

      {!showResults ? (
        <EsgForm
          initialData={data}
          onSave={handleSave}
          onViewResults={() => setShowResults(true)}
          hasData={!!data}
        />
      ) : (
        <>
          <button
            onClick={() => setShowResults(false)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Form
          </button>
          {data && (
            <>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.5fr]">
                <DataSummary data={data} />
                <EmissionsChart data={data} />
              </div>
              <StrategyPanel data={data} onUpdate={setData} />
              <ReportPreview data={data} />
            </>
          )}
        </>
      )}
    </main>
  );
}
