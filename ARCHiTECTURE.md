# Application Architecture & Business Guide

## Business Overview

The **Quarterly Sales Performance & AI Region Analyst** is an executive-grade financial intelligence application designed to turn raw transactional sales spreadsheets into instant, boardroom-ready commercial insights. Sales leadership and financial controllers can upload CSV order data or inspect existing corporate records to generate multi-quarter revenue pivot tables, interactive visual breakdowns across territories, and granular unit volume and discount rate analyses. The application automatically detects the region undergoing the most substantial performance variance between Quarter 2 and Quarter 3, isolates underlying business drivers—including volume fluctuations, discounting shifts, and channel- or product-level shifts—and synthesizes an auditor-grounded, three-sentence executive briefing powered by Google Gemini AI with zero mathematical hallucination.

---

## File Inventory

The following table catalogs every file in the repository alongside a one-sentence summary of its functional role:

| File Path | Functional Purpose |
| :--- | :--- |
| `ARCHiTECTURE.md` | Comprehensive system architecture document detailing technical design, data flows, and component responsibilities. |
| `ARCHITECTURE.md` | Business guide and architectural reference containing high-level summaries and codebase inventories. |
| `.env.example` | Configuration template defining required environment variables such as the server listener port and optional Gemini API credentials. |
| `.gitignore` | Directs Git to omit local build directories, temporary artifacts, and external dependency caches from source control. |
| `index.html` | Client entry-point HTML file hosting the DOM mount element, typography imports, and Open Graph social metadata. |
| `metadata.json` | Platform manifest configuring applet permissions, operational capabilities, and executive system descriptors. |
| `package.json` | Dependency manifest defining required Node.js libraries, TypeScript type definitions, and automation scripts. |
| `public/assets/aistudio/Lab_1_-_Regional_Sales__1__de1de499.csv` | Default corporate sales order dataset providing realistic multi-quarter regional sales records for immediate analysis. |
| `server.ts` | Node.js Express server that serves client assets and hosts the server-side Gemini AI variance analysis endpoint. |
| `src/App.tsx` | Root React component orchestrating data loading, filter states, modal visibility, and top-level dashboard layout. |
| `src/components/AIExecutiveSummary.tsx` | Dashboard card displaying the 3-sentence AI variance findings, metric focus toggles, and calculation audit drawer. |
| `src/components/Header.tsx` | Top navigation header rendering high-level KPI summaries, sample dataset loaders, and CSV upload triggers. |
| `src/components/RawDataDrawer.tsx` | Slide-over drawer providing a paginated, searchable, and sortable inspection view of every parsed sales order record. |
| `src/components/RevenueChart.tsx` | High-performance custom SVG chart visualizing regional and quarterly revenues across four interactive viewing modes. |
| `src/components/RevenueTable.tsx` | Interactive cross-tabulation table computing regional quarterly revenues, expandable volume metrics, and CSV export capabilities. |
| `src/components/UploadModal.tsx` | Drag-and-drop modal dialog enabling users to upload custom sales order CSV files with automatic header mapping. |
| `src/index.css` | Global stylesheet configuring Tailwind CSS utility layers, base dark-mode theme colors, and custom scrollbars. |
| `src/main.tsx` | Client application entry point that instantiates the React root and renders the App hierarchy into the DOM. |
| `src/types.ts` | Central TypeScript interface definitions declaring data structures for orders, aggregations, driver metrics, and AI payloads. |
| `src/utils/calculator.ts` | Computational engine responsible for CSV parsing, header normalization, mathematical rollups, and variance calculations. |
| `src/utils/sampleData.ts` | Fallback sales order generator supplying demonstration transactions across multiple regions, quarters, and sales channels. |
| `tsconfig.json` | TypeScript configuration file establishing compilation targets, bundler resolution rules, and strict type verification. |
| `vite.config.ts` | Build tool configuration configuring Vite development server options, React plugins, and Tailwind integration. |

---

## Technical Architecture

### 1. High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Client Browser                                 │
│  React 19 + Tailwind CSS + Lucide Icons + Motion                            │
│                                                                             │
│  ┌──────────────────┐  ┌────────────────────┐  ┌─────────────────────────┐  │
│  │   Header & KPI   │  │ AI Executive Card  │  │ Interactive SVG Chart   │  │
│  │   Status Strip   │  │ (3-Sentence Synth) │  │ (4 Mode Territorial View)│  │
│  └──────────────────┘  └────────────────────┘  └─────────────────────────┘  │
│  ┌──────────────────────────────────────────┐  ┌─────────────────────────┐  │
│  │ Revenue Cross-Tabulation Pivot Table     │  │ Orders Drawer & Modal   │  │
│  │ (Sort, Filter, Drill-down, CSV Export)   │  │ (Validation & Parsing)  │  │
│  └──────────────────────────────────────────┘  └─────────────────────────┘  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                         HTTP REST API │ /api/analyze-q2-q3
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Express Application Server                         │
│                         (Node.js 22 + TypeScript)                           │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Vite Middlewares (Dev Mode) / Express Static Bundle (Prod Mode)       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ /api/analyze-q2-q3 Controller                                         │  │
│  │  - Input Validation & Payload Normalization                           │  │
│  │  - Prompt Construction with Pre-Computed Facts                        │  │
│  │  - Primary: Gemini 3.8 Flash via @google/genai SDK                    │  │
│  │  - Fallback: Deterministic Rule-Based Calculation Engine               │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                   HTTPS API Request   │ (Telemetric User-Agent: aistudio-build)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Google Gemini API                                 │
│                           (models/gemini-3.8-flash)                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 2. Data Processing & Calculation Pipeline

#### Ingestion & Header Normalization (`src/utils/calculator.ts`)
1. **Fuzzy Header Matcher**: Accommodates varying corporate CSV schemas (`territory`/`geo` → `region`, `qty`/`quantity` → `units`, `sales`/`amount` → `revenue`).
2. **Data Cleansing**:
   - Strips non-numeric characters, currency symbols (`$`, `€`, `£`), and thousand commas.
   - Standardizes fractional discount percentages (`0.05` → `5.0%`).
   - Normalizes quarter formats (e.g., `2024-Q2` → `Q2`).
3. **Data Verification**: Enforces minimum required columns while discarding malformed records without halting the parse run.

#### Aggregation Model
All calculations are deterministic and executed client-side:
- **Revenue Matrix**: Aggregated total net sales by region and quarter.
- **Unit Volume Matrix**: Total units ordered per region and quarter.
- **Weighted Average Discount Rate**:
  $$\text{Weighted Discount} = \frac{\sum (\text{discount\_pct} \times \text{units})}{\sum \text{units}}$$
- **Variance Attribution**:
  - Net revenue dollar change ($\Delta\$$) and percentage change ($\Delta\%$).
  - Primary driver identification across channels (e.g., Direct, Retail, Wholesale) and product lines.

---

### 3. AI Grounding & Strict 3-Sentence Synthesis

To eliminate generative hallucination:
1. **Fact Injection**: The backend formats calculated numbers into an audit ledger passed to the model.
2. **Three-Sentence Constraint**:
   - **Sentence 1**: Identifies the focus region and states exact Q2 revenue, Q3 revenue, and net dollar/percent variance.
   - **Sentence 2**: Outlines underlying volume, discount rate shifts, and primary channel/product drivers.
   - **Sentence 3**: Benchmarks this change against overall company total revenue.
3. **Deterministic Fallback Engine**: If no Gemini API key is configured or the upstream network request times out, the built-in calculation engine deterministically constructs the exact same three sentences from calculated metrics.

---

### 4. Operational Environment

- **Runtime**: Node.js 22 LTS
- **Network Interface**: Host `0.0.0.0`, Port `3000`
- **Security**: Zero client-side API keys; all generative calls route through `/api/analyze-q2-q3`
