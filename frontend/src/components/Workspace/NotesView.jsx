import { useState } from "react";
import {
  NotebookPen,
  Sparkles,
  Copy,
  Download,
  Bookmark,
  Layers,
  CheckCircle2,
  Loader2,
  RefreshCw,
  FileDown,
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import { generateNotes } from "../../services/api";

function NotesView() {

  const [notes, setNotes] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // Generate Notes
  // =====================================================

  const handleGenerateNotes = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await generateNotes({
        topic: "",
      });

      if (!response.success) {

        setNotes("");
        setSources([]);
        setError(response.message);

        return;
      }

      setNotes(response.notes);
      setSources(response.sources || []);

    } catch (err) {

      console.error(err);

      setError(
        "Unable to generate notes. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };

  // =====================================================
  // Copy Notes
  // =====================================================

  const copyNotes = async () => {

    if (!notes) return;

    await navigator.clipboard.writeText(notes);

    alert("Notes copied successfully.");

  };

  // =====================================================
  // Download TXT
  // =====================================================

  const downloadTXT = () => {

    if (!notes) return;

    const blob = new Blob([notes], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "StudySphere_Notes.txt";

    a.click();

    URL.revokeObjectURL(url);

  };

  // =====================================================
  // Download PDF
  // =====================================================

  const downloadPDF = async () => {

    if (!notes) return;

    const { jsPDF } = await import("jspdf");

    const doc = new jsPDF();

    const lines = doc.splitTextToSize(notes, 180);

    doc.text(lines, 15, 20);

    doc.save("StudySphere_Notes.pdf");

  };

  return (

    <div className="flex-1 overflow-y-auto bg-[#0B1120] text-white px-6 py-8">

      <div className="mx-auto max-w-6xl space-y-8">

        {/* Header */}

        <div className="rounded-3xl border border-slate-700/50 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-8 shadow-2xl">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-start gap-4">

              <div className="rounded-2xl bg-violet-500/10 p-4">

                <NotebookPen className="h-8 w-8 text-violet-400" />

              </div>

              <div>

                <div className="flex items-center gap-2">

                  <h1 className="text-3xl font-bold tracking-tight">
                    AI Notes
                  </h1>

                  <Sparkles className="h-5 w-5 text-yellow-400" />

                </div>

                <p className="mt-2 max-w-2xl text-slate-400">

                  Generate structured, exam-ready notes from
                  your uploaded study material.

                </p>

              </div>

            </div>

            <div className="flex flex-wrap gap-3">

              <button
                onClick={handleGenerateNotes}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 font-medium transition hover:bg-violet-500 disabled:opacity-60"
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
                  : "Generate Notes"}

              </button>

              <button
                onClick={copyNotes}
                disabled={!notes}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 transition hover:bg-slate-700 disabled:opacity-50"
              >

                <Copy size={18} />

                Copy

              </button>

              <button
                onClick={downloadTXT}
                disabled={!notes}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 transition hover:bg-slate-700 disabled:opacity-50"
              >

                <Download size={18} />

                TXT

              </button>

              <button
                onClick={downloadPDF}
                disabled={!notes}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 transition hover:bg-slate-700 disabled:opacity-50"
              >

                <FileDown size={18} />

                PDF

              </button>

              {notes && (

                <button
                  onClick={handleGenerateNotes}
                  className="flex items-center gap-2 rounded-xl border border-violet-500 px-4 py-2 text-violet-300 transition hover:bg-violet-500/10"
                >

                  <RefreshCw size={18} />

                  Regenerate

                </button>

              )}

            </div>

          </div>

        </div>

              {/* Notes Container */}

        <div className="rounded-3xl border border-slate-700/50 bg-slate-900/80 p-8 shadow-xl backdrop-blur-md">

          <div className="mb-6 flex items-center justify-between">

            <h2 className="text-xl font-semibold">
              Generated Notes
            </h2>

            <div className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">

              {loading
                ? "Generating..."
                : notes
                ? "AI Generated"
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

                Unable to Generate Notes

              </h3>

              <p className="mt-3 text-slate-300">

                {error}

              </p>

            </div>

          )}

          {/* Empty */}

          {!loading && !notes && !error && (

            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 px-8 py-16 text-center">

              <NotebookPen className="mx-auto mb-5 h-14 w-14 text-slate-500" />

              <h3 className="text-xl font-semibold">

                No Notes Generated Yet

              </h3>

              <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-slate-400">

                Upload one or more PDFs and click

                <span className="font-semibold text-violet-400">

                  {" "}Generate Notes

                </span>

                .

                StudySphere AI will generate clean,

                structured notes with headings,

                bullet points and revision-friendly

                sections.

              </p>

            </div>

          )}

          {/* Generated Notes */}

          {!loading && notes && (

            <div className="space-y-6">

              <div className="rounded-2xl border border-slate-700 bg-slate-950/50 p-8">

                <article className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-violet-300">

                  <ReactMarkdown>

                    {notes}

                  </ReactMarkdown>

                </article>

              </div>

              {/* Source PDFs */}

              {sources.length > 0 && (

                <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">

                  <h3 className="mb-4 text-lg font-semibold">

                    Source PDFs

                  </h3>

                  <div className="flex flex-wrap gap-3">

                    {sources.map((file, index) => (

                      <span
                        key={index}
                        className="rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300"
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

                {/* Features */}

        <div className="grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500">

            <Bookmark className="mb-4 h-8 w-8 text-violet-400" />

            <h3 className="mb-2 text-lg font-semibold">
              Organized Topics
            </h3>

            <p className="text-sm leading-6 text-slate-400">
              AI automatically groups related concepts into
              well-structured sections for faster learning and
              revision.
            </p>

          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500">

            <Layers className="mb-4 h-8 w-8 text-blue-400" />

            <h3 className="mb-2 text-lg font-semibold">
              Smart Formatting
            </h3>

            <p className="text-sm leading-6 text-slate-400">
              Automatically formats headings, bullet points,
              definitions and important keywords for maximum
              readability.
            </p>

          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500">

            <CheckCircle2 className="mb-4 h-8 w-8 text-emerald-400" />

            <h3 className="mb-2 text-lg font-semibold">
              Exam Ready
            </h3>

            <p className="text-sm leading-6 text-slate-400">
              Designed for quick revision before quizzes,
              assignments, interviews and semester exams.
            </p>

          </div>

        </div>

      </div>

    </div>

  );

}

export default NotesView;