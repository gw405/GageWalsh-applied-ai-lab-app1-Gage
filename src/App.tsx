import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { UploadModal } from './components/UploadModal.tsx';
import { AIExecutiveSummary } from './components/AIExecutiveSummary.tsx';
import { RevenueChart } from './components/RevenueChart.tsx';
import { RevenueTable } from './components/RevenueTable.tsx';
import { RawDataDrawer } from './components/RawDataDrawer.tsx';
import { SalesOrder } from './types.ts';
import { getSampleOrders } from './utils/sampleData.ts';
import { aggregateSales, parseSalesCSV } from './utils/calculator.ts';
import { FileSpreadsheet, Sparkles, UploadCloud, Layers } from 'lucide-react';

export default function App() {
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [fileName, setFileName] = useState<string>('Lab_1_-_Regional_Sales.csv');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isRawDataOpen, setIsRawDataOpen] = useState(false);

  // Automatically load the user's provided regional sales data
  const handleLoadUserData = async () => {
    try {
      const res = await fetch('/assets/aistudio/Lab_1_-_Regional_Sales__1__de1de499.csv');
      if (res.ok) {
        const text = await res.text();
        const parsed = parseSalesCSV(text);
        if (parsed.orders.length > 0) {
          setOrders(parsed.orders);
          setFileName('Lab_1_-_Regional_Sales.csv');
          return;
        }
      }
    } catch (e) {
      console.warn('Could not load user data file, falling back to sample:', e);
    }
    const sample = getSampleOrders();
    setOrders(sample);
    setFileName('sample_sales_orders.csv');
  };

  useEffect(() => {
    handleLoadUserData();
  }, []);

  const aggregation = useMemo(() => {
    if (orders.length === 0) return null;
    return aggregateSales(orders);
  }, [orders]);

  const handleLoadSample = () => {
    const sample = getSampleOrders();
    setOrders(sample);
    setFileName('sample_sales_orders.csv');
  };

  const handleDataLoaded = (newOrders: SalesOrder[], name: string) => {
    setOrders(newOrders);
    setFileName(name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ff007f] via-[#ff0055] to-[#ffe600] bg-fixed text-slate-100 flex flex-col selection:bg-yellow-300 selection:text-slate-950 relative overflow-x-hidden">
      {/* Ambient Neon Pink & Electric Yellow Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#ff007f] rounded-full blur-[120px] opacity-80" />
        <div className="absolute top-1/3 -right-24 w-[32rem] h-[32rem] bg-[#ffe600] rounded-full blur-[140px] opacity-75" />
        <div className="absolute -bottom-20 left-1/4 w-[28rem] h-[28rem] bg-[#ff1493] rounded-full blur-[130px] opacity-70" />
      </div>

      {/* Top Navigation & Actions Bar (includes Soccer Ball Logo in top right) */}
      <Header
        aggregation={aggregation}
        onLoadSample={handleLoadSample}
        onLoadUserData={handleLoadUserData}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenRawData={() => setIsRawDataOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        {/* Dataset Status Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-950/85 backdrop-blur-md border border-pink-500/30 text-xs shadow-xl shadow-pink-950/20">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 rounded-lg bg-pink-500/20 text-yellow-300 border border-pink-500/40">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-300">Active Dataset: </span>
              <span className="font-semibold text-white font-mono">{fileName}</span>
              <span className="text-yellow-300/80 ml-2">
                ({orders.length.toLocaleString()} sales order rows parsed)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRawDataOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-850 border border-slate-700/80 rounded-lg transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              View Orders Table
            </button>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-yellow-200 hover:text-white bg-pink-950/70 hover:bg-pink-900/80 border border-pink-500/50 rounded-lg transition-colors font-medium"
            >
              <UploadCloud className="w-3.5 h-3.5 text-yellow-300" />
              Replace with Custom CSV
            </button>
          </div>
        </div>

        {aggregation ? (
          <>
            {/* Section 1: AI 3-Sentence Summary & Q2 vs Q3 Attributed Variance */}
            <section aria-label="AI Executive Summary">
              <AIExecutiveSummary aggregation={aggregation} />
            </section>

            {/* Section 2: Interactive Revenue Chart */}
            <section aria-label="Revenue Chart">
              <RevenueChart aggregation={aggregation} />
            </section>

            {/* Section 3: Revenue Cross-Tabulation Pivot Table */}
            <section aria-label="Revenue Pivot Table">
              <RevenueTable aggregation={aggregation} />
            </section>
          </>
        ) : (
          /* Empty state if user cleared data */
          <div className="text-center py-20 bg-slate-950/85 backdrop-blur-md rounded-2xl border border-dashed border-pink-500/40 p-8 space-y-4 shadow-2xl">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-pink-500/20 text-yellow-300 flex items-center justify-center border border-pink-500/40">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No sales orders loaded yet</h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Upload your sales CSV with columns quarter, region, channel, product, units, discount_pct, and revenue, or load the realistic sample dataset.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleLoadSample}
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-300 hover:to-yellow-200 rounded-xl shadow-lg transition-colors"
              >
                Load Sample Dataset
              </button>
              <button
                onClick={() => setIsUploadOpen(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors"
              >
                Upload CSV File
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDataLoaded={handleDataLoaded}
        onLoadSample={handleLoadSample}
        onLoadUserData={handleLoadUserData}
      />

      {/* Raw Data Drawer */}
      <RawDataDrawer
        isOpen={isRawDataOpen}
        onClose={() => setIsRawDataOpen(false)}
        orders={orders}
        fileName={fileName}
      />

      {/* Footer */}
      <footer className="border-t border-pink-500/30 bg-slate-950/90 backdrop-blur-md py-6 mt-12 text-center text-xs text-slate-400 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span className="font-medium text-slate-200">Quarterly Sales Performance &amp; AI Region Analyst</span>
          </div>
          <p>Strict numerical grounding &bull; All summary numbers computed in-app &bull; Powered by Gemini 3.8 Flash</p>
        </div>
      </footer>
    </div>
  );
}
