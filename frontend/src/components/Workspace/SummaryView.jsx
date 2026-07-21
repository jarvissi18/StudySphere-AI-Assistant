import { useState } from "react";
import {
  FileText,
  Sparkles,
  Copy,
  Download,
  Clock,
  RefreshCw,
  Loader2,
  FileDown,
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import { generateSummary } from "../../services/api";

function SummaryView() {
  const [summary, setSummary] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // Generate Summary
  // =====================================================

  const handleGenerateSummary = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await generateSummary({
        topic: "",
      });

      if (!response.success) {
        setSummary("");
        setSources([]);
        setError(response.message);
        return;
      }

      setSummary(response.summary);
      setSources(response.sources || []);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to generate summary. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // Copy Summary
  // =====================================================

  const copySummary = async () => {
    if (!summary) return;

    await navigator.clipboard.writeText(summary);

    alert("Summary copied successfully.");
  };

  // =====================================================
  // Download TXT
  // =====================================================

  const downloadTXT = () => {
    if (!summary) return;

    const blob = new Blob([summary], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "StudySphere_Summary.txt";

    a.click();

    URL.revokeObjectURL(url);
  };

  // =====================================================
  // Download PDF
  // =====================================================

  const downloadPDF = async () => {
    if (!summary) return;

    const { jsPDF } = await import("jspdf");

    const doc = new jsPDF();

    const lines = doc.splitTextToSize(summary, 180);

    doc.text(lines, 15, 20);

    doc.save("StudySphere_Summary.pdf");
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0B1120] text-white px-6 py-8">
      <div className="mx-auto max-w-5xl space-y-8">

        {/* Header */}

        <div className="rounded-3xl border border-slate-700/50 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-8 shadow-2xl">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div className="flex items-start gap-4">

              <div className="rounded-2xl bg-blue-500/10 p-4">

                <FileText className="h-8 w-8 text-blue-400" />

              </div>

              <div>

                <div className="flex items-center gap-2">

                  <h1 className="text-3xl font-bold tracking-tight">
                    AI Summary
                  </h1>

                  <Sparkles className="h-5 w-5 text-yellow-400" />

                </div>

                <p className="mt-2 max-w-2xl text-slate-400">

                  Generate concise AI-powered summaries from your
                  uploaded study material for faster learning and
                  quick revision.

                </p>

              </div>

            </div>

            <div className="flex flex-wrap gap-3">

              <button
                onClick={handleGenerateSummary}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-medium transition hover:bg-blue-500 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Sparkles size={18} />
                )}

                {loading
                  ? "Generating..."
                  : "Generate Summary"}
              </button>

              <button
                onClick={copySummary}
                disabled={!summary}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 transition hover:bg-slate-700 disabled:opacity-50"
              >
                <Copy size={18} />
                Copy
              </button>

              <button
                onClick={downloadTXT}
                disabled={!summary}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 transition hover:bg-slate-700 disabled:opacity-50"
              >
                <Download size={18} />
                TXT
              </button>

              <button
                onClick={downloadPDF}
                disabled={!summary}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 transition hover:bg-slate-700 disabled:opacity-50"
              >
                <FileDown size={18} />
                PDF
              </button>

              {summary && (
                <button
                  onClick={handleGenerateSummary}
                  className="flex items-center gap-2 rounded-xl border border-blue-500 px-4 py-2 text-blue-300 transition hover:bg-blue-500/10"
                >
                  <RefreshCw size={18} />
                  Regenerate
                </button>
              )}

            </div>

          </div>

        </div>

                {/* Summary Card */}

        <div className="rounded-3xl border border-slate-700/50 bg-slate-900/80 p-8 shadow-xl backdrop-blur-md">

          <div className="mb-6 flex items-center justify-between">

            <h2 className="text-xl font-semibold">
              Generated Summary
            </h2>

            <div className="flex items-center gap-2 text-sm text-slate-400">

              <Clock size={16} />

              {loading
                ? "Generating..."
                : summary
                ? "Completed"
                : "Ready"}

            </div>

          </div>

          {/* Loading */}

          {loading && (

            <div className="space-y-4 animate-pulse">

              <div className="h-8 w-1/3 rounded bg-slate-700"></div>

              <div className="h-4 w-full rounded bg-slate-700"></div>

              <div className="h-4 w-11/12 rounded bg-slate-700"></div>

              <div className="h-4 w-10/12 rounded bg-slate-700"></div>

              <div className="h-4 w-full rounded bg-slate-700"></div>

              <div className="h-4 w-9/12 rounded bg-slate-700"></div>

              <div className="h-4 w-full rounded bg-slate-700"></div>

              <div className="h-4 w-8/12 rounded bg-slate-700"></div>

            </div>

          )}

          {/* Error */}

          {!loading && error && (

            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">

              <h3 className="text-lg font-semibold text-red-400">
                Unable to Generate Summary
              </h3>

              <p className="mt-3 text-slate-300">
                {error}
              </p>

            </div>

          )}

          {/* Empty */}

          {!loading && !summary && !error && (

            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 px-8 py-16 text-center">

              <FileText className="mx-auto mb-5 h-16 w-16 text-slate-500" />

              <h3 className="text-2xl font-semibold">

                No Summary Generated Yet

              </h3>

              <p className="mx-auto mt-4 max-w-2xl leading-8 text-slate-400">

                Upload one or more PDFs and click
                <span className="font-semibold text-blue-400">
                  {" "}
                  Generate Summary
                </span>
                .

                StudySphere AI will analyze your uploaded
                study material and generate a clean,
                structured summary for quick revision.

              </p>

            </div>

          )}

          {/* Summary */}

          {!loading && summary && (

            <div className="space-y-6">

              <div className="rounded-2xl border border-slate-700 bg-slate-950/50 p-8">

                <article className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-blue-300">

                  <ReactMarkdown>

                    {summary}

                  </ReactMarkdown>

                </article>

              </div>

              {/* Sources */}

              {sources.length > 0 && (

                <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">

                  <h3 className="mb-4 text-lg font-semibold">

                    Source PDFs

                  </h3>

                  <div className="flex flex-wrap gap-3">

                    {sources.map((file, index) => (

                      <span
                        key={index}
                        className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300"
                      >
                        📄 {file}
                      </span>

                    ))}

                  </div>

                </div>

              )}

            </div>

          )}

        </div>

                {/* Feature Cards */}

        <div className="grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10">

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">

              <Sparkles className="h-6 w-6 text-blue-400" />

            </div>

            <h3 className="mb-2 text-lg font-semibold">
              AI Generated
            </h3>

            <p className="text-sm leading-6 text-slate-400">
              StudySphere analyzes your uploaded PDFs and produces
              structured, exam-focused summaries for faster learning.
            </p>

          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/10">

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">

              <FileText className="h-6 w-6 text-purple-400" />

            </div>

            <h3 className="mb-2 text-lg font-semibold">
              Structured Notes
            </h3>

            <p className="text-sm leading-6 text-slate-400">
              Important concepts are organized into headings,
              bullet points and revision-friendly sections.
            </p>

          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10">

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">

              <Clock className="h-6 w-6 text-emerald-400" />

            </div>

            <h3 className="mb-2 text-lg font-semibold">
              Quick Revision
            </h3>

            <p className="text-sm leading-6 text-slate-400">
              Revise lengthy study material in minutes with concise,
              AI-powered summaries generated from your own documents.
            </p>

          </div>

        </div>

      </div>

    </div>

  );
}

export default SummaryView;