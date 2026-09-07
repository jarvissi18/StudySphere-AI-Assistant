import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AlertCircle,
  BookOpen,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  Download,
  FileDown,
  FileText,
  GraduationCap,
  Layers3,
  Lightbulb,
  Loader2,
  NotebookPen,
  RefreshCw,
  Sparkles,
  Target,
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { generateNotes } from "../../services/api";

function NotesView() {
  const containerRef = useRef(null);

  const [notes, setNotes] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  const documentTitle = useMemo(() => {
    const match = notes.match(/^#\s+(.+)$/m);
    return match
      ? cleanHeading(match[1])
      : "Study Notes";
  }, [notes]);

  const metrics = useMemo(() => {
    if (!notes) {
      return {
        words: 0,
        sections: 0,
        readTime: 0,
        sources: sources.length,
      };
    }

    const plainText = notes
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/[#*_>`~|]/g, " ")
      .trim();

    const words = plainText
      .split(/\s+/)
      .filter(Boolean).length;

    const sections =
      notes.match(/^##\s+.+$/gm)?.length || 0;

    return {
      words,
      sections,
      readTime: Math.max(
        1,
        Math.ceil(words / 200)
      ),
      sources: sources.length,
    };
  }, [notes, sources.length]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const handleScroll = () => {
      const max =
        container.scrollHeight -
        container.clientHeight;

      if (max <= 0) {
        setReadingProgress(100);
        return;
      }

      const progress =
        (container.scrollTop / max) * 100;

      setReadingProgress(
        Math.min(
          100,
          Math.max(0, progress)
        )
      );
    };

    container.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    handleScroll();

    return () => {
      container.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, [notes]);

  const generate = async () => {
    try {
      setLoading(true);
      setError("");
      setCopied(false);

      const response =
        await generateNotes({
          topic: "",
        });

      if (!response?.success) {
        setNotes("");
        setSources([]);
        setError(
          response?.message ||
            "Unable to generate notes."
        );
        return;
      }

      setNotes(response.notes || "");

      setSources(
        Array.isArray(response.sources)
          ? response.sources
          : []
      );

    } catch (err) {
      console.error(
        "[NOTES GENERATION ERROR]",
        err
      );

      setNotes("");
      setSources([]);
      setDiagrams([]);
      setError(
        "Unable to generate notes. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyNotes = async () => {
    if (!notes) return;

    try {
      await navigator.clipboard.writeText(
        notes
      );

      setCopied(true);

      window.setTimeout(
        () => setCopied(false),
        2200
      );
    } catch (err) {
      console.error(
        "[COPY ERROR]",
        err
      );
    }
  };

  const downloadTXT = () => {
    if (!notes) return;

    const blob = new Blob([notes], {
      type: "text/plain;charset=utf-8",
    });

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      "StudySphere_Notes.txt";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const downloadPDF = async () => {
    if (!notes) return;

    try {
      const { jsPDF } =
        await import("jspdf");

      const pdf = new jsPDF({
        unit: "mm",
        format: "a4",
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 16;
      const contentWidth =
        pageWidth - margin * 2;

      const text = notes
        .replace(/^#{1,6}\s+/gm, "")
        .replace(
          /\*\*(.*?)\*\*/g,
          "$1"
        )
        .replace(
          /\*(.*?)\*/g,
          "$1"
        )
        .replace(
          /`(.*?)`/g,
          "$1"
        )
        .replace(
          /^[-*+]\s+/gm,
          "• "
        )
        .trim();

      const lines =
        pdf.splitTextToSize(
          text,
          contentWidth
        );

      let y = 20;

      pdf.setFont(
        "helvetica",
        "normal"
      );
      pdf.setFontSize(10);

      lines.forEach((line) => {
        if (
          y >
          pageHeight - margin
        ) {
          pdf.addPage();
          y = margin;
        }

        pdf.text(
          line,
          margin,
          y
        );

        y += 5;
      });

      pdf.save(
        "StudySphere_Notes.pdf"
      );
    } catch (err) {
      console.error(
        "[PDF EXPORT ERROR]",
        err
      );
    }
  };

  const scrollToTop = () => {
    containerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      ref={containerRef}
      data-notes-container="true"
      className="h-full min-h-0 overflow-y-auto bg-[#050a12] text-white"
    >
      <div className="pointer-events-none fixed left-0 right-0 top-0 z-[80] h-[2px]">
        <div
          className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-violet-400 transition-[width] duration-150"
          style={{
            width: `${readingProgress}%`,
          }}
        />
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-4 py-4 sm:px-5 lg:px-6 lg:py-5 xl:px-7">
        <header className="relative overflow-hidden rounded-[22px] border border-[#1c2b42] bg-[#091321] shadow-[0_20px_65px_rgba(0,0,0,0.22)]">
          <div className="pointer-events-none absolute -right-28 -top-32 h-80 w-80 rounded-full bg-violet-600/[0.09] blur-[110px]" />

          <div className="pointer-events-none absolute -bottom-40 left-1/3 h-72 w-72 rounded-full bg-indigo-600/[0.05] blur-[100px]" />

          <div className="relative flex flex-col gap-5 p-5 sm:p-6 xl:flex-row xl:items-center xl:justify-between xl:p-7">
            <div className="flex min-w-0 items-start gap-4">
              <div className="relative flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl border border-violet-400/15 bg-gradient-to-br from-violet-500/20 to-indigo-500/10 text-violet-300">
                <NotebookPen
                  size={24}
                  strokeWidth={1.8}
                />

                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-violet-500 text-white ring-2 ring-[#091321]">
                  <Sparkles size={8} />
                </span>
              </div>

              <div className="min-w-0">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-400">
                    AI Study Workspace
                  </span>

                  <StatusBadge
                    loading={loading}
                    notes={notes}
                    error={error}
                  />
                </div>

                <h1 className="text-[27px] font-bold tracking-[-0.045em] text-white sm:text-[30px]">
                  Smart Notes
                </h1>

                <p className="mt-1.5 max-w-[620px] text-[13px] leading-6 text-slate-400">
                  Transform your uploaded study
                  material into a clean, structured
                  and exam-ready knowledge workspace.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={generate}
                disabled={loading}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 text-xs font-semibold text-white shadow-[0_10px_30px_rgba(124,58,237,0.24)] transition-all hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                ) : (
                  <Sparkles size={15} />
                )}

                {loading
                  ? "Generating..."
                  : notes
                  ? "Generate Again"
                  : "Generate Notes"}
              </button>

              <ActionButton
                icon={
                  copied ? (
                    <Check size={14} />
                  ) : (
                    <Copy size={14} />
                  )
                }
                label={
                  copied ? "Copied" : "Copy"
                }
                onClick={copyNotes}
                disabled={!notes}
                success={copied}
              />

              <ActionButton
                icon={
                  <Download size={14} />
                }
                label="TXT"
                onClick={downloadTXT}
                disabled={!notes}
              />

              <ActionButton
                icon={
                  <FileDown size={14} />
                }
                label="PDF"
                onClick={downloadPDF}
                disabled={!notes}
              />
            </div>
          </div>
        </header>

        {notes && !loading && (
          <div className="mt-3 grid grid-cols-2 overflow-hidden rounded-[18px] border border-[#1b2a40] bg-[#091321] sm:grid-cols-4">
            <MetricCard
              icon={
                <FileText size={15} />
              }
              value={metrics.words.toLocaleString()}
              label="Words"
            />

            <MetricCard
              icon={
                <Layers3 size={15} />
              }
              value={metrics.sections}
              label="Sections"
            />

            <MetricCard
              icon={
                <Clock3 size={15} />
              }
              value={`${metrics.readTime} min`}
              label="Read time"
            />

            <MetricCard
              icon={
                <BookOpen size={15} />
              }
              value={metrics.sources}
              label="Sources"
              last
            />
          </div>
        )}

        {!loading &&
          !notes &&
          !error && (
            <section className="mt-3 overflow-hidden rounded-[22px] border border-[#1b2a40] bg-[#091321]">
              <EmptyState
                onGenerate={generate}
              />
            </section>
          )}

        {!loading && error && (
          <section className="mt-3 rounded-[22px] border border-[#1b2a40] bg-[#091321]">
            <ErrorState
              error={error}
              onRetry={generate}
            />
          </section>
        )}

        {loading && (
          <section className="mt-3 overflow-hidden rounded-[22px] border border-[#1b2a40] bg-[#091321]">
            <NotesSkeleton />
          </section>
        )}

        {notes &&
          !loading &&
          !error && (
            <>
              <main className="mt-3 min-w-0">
                <section className="overflow-hidden rounded-[20px] border border-[#1b2a40] bg-[#091321] shadow-[0_20px_60px_rgba(0,0,0,0.16)]">
                  <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#1b2a40] bg-[#091321]/95 px-4 py-3 backdrop-blur-xl sm:px-5">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300">
                        <NotebookPen size={15} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">
                          Notes
                        </p>

                        <p className="truncate text-xs font-medium text-slate-300">
                          AI Generated Study Notes
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="hidden items-center gap-1.5 rounded-full border border-emerald-400/10 bg-emerald-500/[0.05] px-2.5 py-1 text-[9px] font-semibold text-emerald-300 sm:inline-flex">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Ready
                      </span>

                      <span className="hidden text-[9px] text-slate-700 md:inline">
                        {Math.round(
                          readingProgress
                        )}
                        %
                      </span>

                      <button
                        type="button"
                        onClick={scrollToTop}
                        className="hidden rounded-lg border border-white/[0.05] bg-white/[0.018] px-2.5 py-1.5 text-[9px] font-medium text-slate-500 transition hover:border-violet-400/15 hover:bg-violet-500/[0.04] hover:text-slate-300 sm:inline-flex"
                        title="Back to top"
                      >
                        Top
                      </button>
                    </div>
                  </div>

                  <div className="px-5 py-7 sm:px-7 lg:px-10 xl:px-12 xl:py-9">
                    <div className="mb-9 border-b border-[#1b2a40] pb-7">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />

                        <span className="text-[10px] font-bold uppercase tracking-[0.17em] text-violet-400">
                          Study Document
                        </span>
                      </div>

                      <h2 className="max-w-4xl text-[28px] font-bold leading-[1.14] tracking-[-0.045em] text-white sm:text-[34px]">
                        {documentTitle}
                      </h2>

                      <p className="mt-3 max-w-3xl text-[13px] leading-6 text-slate-500">
                        AI-generated notes organized
                        for understanding, revision
                        and examination preparation.
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <DocumentTag
                          icon={
                            <Sparkles size={11} />
                          }
                        >
                          AI Generated
                        </DocumentTag>

                        <DocumentTag
                          icon={
                            <Layers3 size={11} />
                          }
                        >
                          Structured
                        </DocumentTag>

                        <DocumentTag
                          icon={
                            <Target size={11} />
                          }
                        >
                          Exam Focused
                        </DocumentTag>
                      </div>
                    </div>

                    <div className="notes-prose">
                      <ReactMarkdown
                        remarkPlugins={[
                          remarkGfm,
                        ]}
                        components={{
                          h1() {
                            return null;
                          },

                          h2({ children }) {
                            const title =
                              cleanHeading(
                                flattenText(
                                  children
                                )
                              );

                            const lower =
                              title.toLowerCase();

                            const specialClass =
                              lower.includes(
                                "quick revision"
                              )
                                ? " notes-revision-section"
                                : lower.includes(
                                    "practice questions"
                                  )
                                ? " notes-practice-section"
                                : lower.includes(
                                    "exam"
                                  )
                                ? " notes-exam-section"
                                : "";

                            return (
                              <section
                                className={`notes-section${specialClass}`}
                              >
                                <div className="notes-section-heading">
                                  <h2>
                                    {children}
                                  </h2>
                                </div>

                                <div className="notes-section-line" />
                              </section>
                            );
                          },

                          h3({ children }) {
                            return (
                              <h3 className="notes-subheading">
                                <span>/</span>
                                {children}
                              </h3>
                            );
                          },

                          p({ children }) {
                            return (
                              <p>
                                {children}
                              </p>
                            );
                          },

                          strong({
                            children,
                          }) {
                            return (
                              <strong>
                                {children}
                              </strong>
                            );
                          },

                          code({
                            inline,
                            children,
                          }) {
                            if (inline) {
                              return (
                                <code className="notes-value">
                                  {children}
                                </code>
                              );
                            }

                            return (
                              <code>
                                {children}
                              </code>
                            );
                          },

                          ul({ children }) {
                            return (
                              <ul>
                                {children}
                              </ul>
                            );
                          },

                          ol({ children }) {
                            return (
                              <ol>
                                {children}
                              </ol>
                            );
                          },

                          li({ children }) {
                            return (
                              <li>
                                {children}
                              </li>
                            );
                          },

                          blockquote({
                            children,
                          }) {
                            return (
                              <div className="notes-callout">
                                <div className="notes-callout-icon">
                                  <Lightbulb
                                    size={16}
                                  />
                                </div>

                                <div className="notes-callout-content">
                                  <div className="notes-callout-label">
                                    Key Idea
                                  </div>

                                  <div>
                                    {children}
                                  </div>
                                </div>
                              </div>
                            );
                          },

                          table({ children }) {
                            return (
                              <div className="notes-table-wrap">
                                <table>
                                  {children}
                                </table>
                              </div>
                            );
                          },

                          thead({
                            children,
                          }) {
                            return (
                              <thead>
                                {children}
                              </thead>
                            );
                          },

                          tbody({
                            children,
                          }) {
                            return (
                              <tbody>
                                {children}
                              </tbody>
                            );
                          },

                          tr({ children }) {
                            return (
                              <tr>
                                {children}
                              </tr>
                            );
                          },

                          th({ children }) {
                            return (
                              <th>
                                {children}
                              </th>
                            );
                          },

                          td({ children }) {
                            return (
                              <td>
                                {children}
                              </td>
                            );
                          },

                          hr() {
                            return (
                              <div className="notes-divider" />
                            );
                          },

                          pre({ children }) {
                            return (
                              <pre>
                                {children}
                              </pre>
                            );
                          },
                        }}
                      >
                        {notes}
                      </ReactMarkdown>
                    </div>
                  </div>
                </section>

                {sources.length > 0 && (
                  <SourcePanel
                    sources={sources}
                  />
                )}
              </main>

              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <FeatureCard
                  icon={
                    <Layers3 size={17} />
                  }
                  title="Clear Structure"
                  description="Major concepts, sub-topics and lists remain easy to scan."
                  tone="violet"
                />

                <FeatureCard
                  icon={
                    <BookOpen size={17} />
                  }
                  title="Study Friendly"
                  description="Important definitions, values and concepts receive stronger visual emphasis."
                  tone="blue"
                />

                <FeatureCard
                  icon={
                    <GraduationCap
                      size={17}
                    />
                  }
                  title="Exam Focused"
                  description="Quick Revision and Practice Questions stay easy to locate."
                  tone="emerald"
                />
              </div>
            </>
          )}

        <div className="h-6" />
      </div>

      <style>{`
        .notes-prose {
          color: #cbd5e1;
          font-size: 14px;
          line-height: 1.85;
        }

        .notes-prose p {
          margin: 14px 0;
          color: #cbd5e1;
          line-height: 1.85;
        }

        .notes-prose strong {
          color: #f8fafc;
          font-weight: 650;
        }

        .notes-prose > ol,
        .notes-prose > ul {
          padding-left: 30px;
        }

        .notes-prose li > ul,
        .notes-prose li > ol {
          padding-left: 28px;
        }

        .notes-prose a {
          color: #a78bfa;
          text-decoration: none;
        }

        .notes-prose a:hover {
          text-decoration: underline;
        }

        .notes-section {
          position: relative;
          margin-top: 42px;
        }

        .notes-section:first-child {
          margin-top: 0;
        }

        .notes-section-heading {
          display: block;
        }

        .notes-section-heading h2 {
          margin: 0;
          color: #f8fafc;
          font-size: 21px;
          font-weight: 650;
          line-height: 1.35;
          letter-spacing: -0.027em;
        }

        .notes-section-line {
          height: 1px;
          margin-top: 13px;
          background: linear-gradient(
            90deg,
            rgba(139,92,246,.28),
            rgba(36,52,76,.95),
            transparent
          );
        }

        .notes-subheading {
          margin: 29px 0 9px;
          color: #ddd6fe;
          font-size: 15px;
          font-weight: 650;
          line-height: 1.5;
        }

        .notes-subheading > span {
          margin-right: 8px;
          color: #8b5cf6;
          font-weight: 750;
        }

        .notes-prose ul,
        .notes-prose ol {
          margin: 17px 0;
          padding-left: 30px;
        }

        /* Ordered lists:
           1. Main point
              a. Sub-point
                 i. Detail
                    A. Further detail
        */
        .notes-prose ol {
          list-style-type: decimal;
        }

        .notes-prose ol > li {
          padding-left: 5px;
        }

        .notes-prose ol > li::marker {
          color: #a78bfa;
          font-weight: 700;
        }

        .notes-prose ol > li > ol {
          margin-top: 7px;
          margin-bottom: 8px;
          list-style-type: lower-alpha;
        }

        .notes-prose ol > li > ol > li::marker {
          color: #8b5cf6;
          font-weight: 650;
        }

        .notes-prose ol > li > ol > li > ol {
          margin-top: 7px;
          margin-bottom: 8px;
          list-style-type: lower-roman;
        }

        .notes-prose ol > li > ol > li > ol > li::marker {
          color: #818cf8;
          font-weight: 650;
        }

        .notes-prose ol > li > ol > li > ol > li > ol {
          margin-top: 7px;
          margin-bottom: 8px;
          list-style-type: upper-alpha;
        }

        .notes-prose ol > li > ol > li > ol > li > ol > li::marker {
          color: #6366f1;
          font-weight: 650;
        }

        /* Unordered lists:
           • Main point
             ◦ Sub-point
               ▪ Detail
        */
        .notes-prose ul {
          list-style-type: disc;
        }

        .notes-prose ul > li::marker {
          color: #8b5cf6;
        }

        .notes-prose ul > li > ul {
          margin-top: 7px;
          margin-bottom: 8px;
          list-style-type: circle;
        }

        .notes-prose ul > li > ul > li::marker {
          color: #818cf8;
        }

        .notes-prose ul > li > ul > li > ul {
          margin-top: 7px;
          margin-bottom: 8px;
          list-style-type: square;
        }

        .notes-prose ul > li > ul > li > ul > li::marker {
          color: #6366f1;
        }

        .notes-prose li {
          margin: 7px 0;
          padding-left: 5px;
          color: #cbd5e1;
          line-height: 1.75;
        }

        .notes-prose li > p {
          margin: 0;
        }

        .notes-value {
          display: inline-block;
          margin: 0 2px;
          padding: 2px 6px;
          border: 1px solid rgba(139,92,246,.17);
          border-radius: 6px;
          background: linear-gradient(
            135deg,
            rgba(139,92,246,.10),
            rgba(99,102,241,.05)
          );
          color: #c4b5fd;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: .87em;
          font-weight: 550;
          line-height: 1.5;
        }

        .notes-callout {
          display: flex;
          gap: 13px;
          margin: 24px 0;
          padding: 15px 16px;
          border: 1px solid rgba(139,92,246,.16);
          border-radius: 15px;
          background: linear-gradient(
            100deg,
            rgba(139,92,246,.075),
            rgba(99,102,241,.025),
            transparent
          );
        }

        .notes-callout-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          flex-shrink: 0;
          border-radius: 10px;
          background: rgba(139,92,246,.12);
          color: #a78bfa;
        }

        .notes-callout-content {
          min-width: 0;
          color: #cbd5e1;
          font-size: 13px;
          line-height: 1.75;
        }

        .notes-callout-content p {
          margin: 0;
        }

        .notes-callout-label {
          margin-bottom: 3px;
          color: #a78bfa;
          font-size: 9px;
          font-weight: 750;
          text-transform: uppercase;
          letter-spacing: .13em;
        }

        .notes-table-wrap {
          width: 100%;
          margin: 25px 0;
          overflow-x: auto;
          border: 1px solid #23344d;
          border-radius: 15px;
          background: #07111e;
        }

        .notes-table-wrap table {
          width: 100%;
          min-width: 620px;
          border-collapse: collapse;
          margin: 0;
        }

        .notes-table-wrap th {
          padding: 12px 14px;
          border-bottom: 1px solid #263751;
          background: #0d1a2c;
          color: #e2e8f0;
          font-size: 11px;
          font-weight: 700;
          text-align: left;
        }

        .notes-table-wrap td {
          padding: 11px 14px;
          border-bottom: 1px solid #192940;
          color: #aebdce;
          font-size: 12px;
          line-height: 1.65;
          vertical-align: top;
        }

        .notes-table-wrap tr:last-child td {
          border-bottom: none;
        }

        .notes-table-wrap tbody tr:hover {
          background: rgba(139,92,246,.025);
        }

        .notes-prose pre {
          margin: 24px 0;
          overflow-x: auto;
          padding: 17px;
          border: 1px solid #1e3048;
          border-radius: 15px;
          background: #040a12;
          color: #cbd5e1;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 12px;
          line-height: 1.75;
        }

        .notes-prose pre code {
          background: transparent;
          padding: 0;
          color: inherit;
        }

        .notes-divider {
          height: 1px;
          margin: 32px 0;
          background: linear-gradient(
            90deg,
            transparent,
            #263650,
            transparent
          );
        }

        @media (max-width: 640px) {
          .notes-prose {
            font-size: 13px;
          }

          .notes-prose p {
            line-height: 1.8;
          }

          .notes-section-heading h2 {
            font-size: 18px;
          }

          .notes-prose li {
            line-height: 1.7;
          }

          .notes-callout {
            padding: 13px;
          }
        }
      `}</style>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  disabled,
  accent = false,
  success = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex h-10 items-center justify-center gap-1.5 rounded-xl
        border px-3.5 text-xs font-medium transition-all duration-200
        disabled:cursor-not-allowed disabled:opacity-30
        ${
          success
            ? "border-emerald-400/20 bg-emerald-500/[0.07] text-emerald-300"
            : accent
            ? "border-violet-400/20 bg-violet-500/[0.06] text-violet-300"
            : "border-[#263650] bg-[#0b1728] text-slate-400 hover:border-violet-400/20 hover:bg-[#0e1a2e] hover:text-white"
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}

function MetricCard({
  icon,
  value,
  label,
  last = false,
}) {
  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3.5 sm:px-5
        ${
          !last
            ? "border-b border-[#1b2a40] sm:border-b-0 sm:border-r"
            : ""
        }
      `}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/[0.08] text-violet-300">
        {icon}
      </div>

      <div>
        <p className="text-[15px] font-semibold tracking-[-0.015em] text-white">
          {value}
        </p>

        <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-600">
          {label}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({
  loading,
  notes,
  error,
}) {
  if (loading) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/15 bg-violet-500/[0.06] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-violet-300">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400" />
        Generating
      </span>
    );
  }

  if (error) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-400/15 bg-red-500/[0.05] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-red-300">
        <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
        Error
      </span>
    );
  }

  if (notes) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-500/[0.05] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-emerald-300">
        <CheckCircle2 size={11} />
        Ready
      </span>
    );
  }

  return null;
}

function DocumentTag({
  children,
  icon,
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#263650] bg-[#0b1728] px-2.5 py-1 text-[9px] font-medium text-slate-500">
      {icon}
      {children}
    </span>
  );
}

function SourcePanel({ sources }) {
  return (
    <section className="mt-3 rounded-[20px] border border-[#1b2a40] bg-[#091321] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
            <FileText size={16} />
          </div>

          <div>
            <p className="text-xs font-semibold text-white">
              Source Material
            </p>

            <p className="mt-0.5 text-[10px] text-slate-600">
              Documents used to generate these notes.
            </p>
          </div>
        </div>

        <span className="rounded-full border border-[#263650] bg-[#0c1728] px-2.5 py-1 text-[9px] font-medium text-slate-500">
          {sources.length}{" "}
          {sources.length === 1
            ? "file"
            : "files"}
        </span>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {sources.map((file, index) => (
          <div
            key={`${file}-${index}`}
            className="flex min-w-0 items-center gap-3 rounded-xl border border-[#1d2d45] bg-[#07111f] px-3.5 py-3 transition hover:border-violet-400/20 hover:bg-[#091525]"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/[0.08] text-violet-300">
              <FileText size={15} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-slate-300">
                {file}
              </p>

              <p className="mt-0.5 text-[9px] uppercase tracking-[0.08em] text-slate-700">
                PDF Source
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function EmptyState({ onGenerate }) {
  return (
    <div className="relative overflow-hidden px-5 py-16 text-center sm:py-20">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/[0.045] blur-[90px]" />

      <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/10 bg-violet-500/[0.07] text-violet-300">
        <NotebookPen
          size={28}
          strokeWidth={1.7}
        />
      </div>

      <h2 className="relative mt-5 text-xl font-semibold tracking-[-0.025em] text-white">
        Your notes workspace is ready
      </h2>

      <p className="relative mx-auto mt-2 max-w-[520px] text-[13px] leading-6 text-slate-500">
        Generate structured notes from your
        uploaded study material and turn lengthy
        PDFs into a focused revision document.
      </p>

      <button
        type="button"
        onClick={onGenerate}
        className="relative mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-[0_10px_30px_rgba(124,58,237,0.22)] transition hover:-translate-y-px"
      >
        <Sparkles size={14} />
        Generate Notes
      </button>
    </div>
  );
}

function ErrorState({
  error,
  onRetry,
}) {
  return (
    <div className="px-5 py-16 text-center sm:py-20">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
        <AlertCircle size={25} />
      </div>

      <h2 className="mt-5 text-lg font-semibold text-white">
        Unable to generate notes
      </h2>

      <p className="mx-auto mt-2 max-w-[500px] text-[13px] leading-6 text-slate-500">
        {error}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-400/15 bg-red-500/[0.06] px-4 py-2.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/[0.10]"
      >
        <RefreshCw size={14} />
        Try Again
      </button>
    </div>
  );
}

function NotesSkeleton() {
  return (
    <div className="animate-pulse px-5 py-8 sm:px-8 lg:px-11 lg:py-10">
      <div className="h-8 w-[45%] rounded-lg bg-white/[0.06]" />

      <div className="mt-4 h-3 w-[65%] rounded bg-white/[0.035]" />

      <div className="mt-7 h-px bg-white/[0.05]" />

      <div className="mt-9 h-6 w-[34%] rounded-lg bg-white/[0.06]" />

      <div className="mt-5 space-y-3">
        <div className="h-3 w-full rounded bg-white/[0.04]" />
        <div className="h-3 w-[94%] rounded bg-white/[0.04]" />
        <div className="h-3 w-[82%] rounded bg-white/[0.04]" />
      </div>

      <div className="mt-10 h-6 w-[39%] rounded-lg bg-white/[0.06]" />

      <div className="mt-5 rounded-xl border border-white/[0.04] p-4">
        <div className="space-y-3">
          <div className="h-3 w-[96%] rounded bg-white/[0.035]" />
          <div className="h-3 w-[87%] rounded bg-white/[0.035]" />
          <div className="h-3 w-[74%] rounded bg-white/[0.035]" />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  tone,
}) {
  const tones = {
    violet:
      "bg-violet-500/10 text-violet-300",
    blue:
      "bg-blue-500/10 text-blue-300",
    emerald:
      "bg-emerald-500/10 text-emerald-300",
  };

  return (
    <div className="rounded-[18px] border border-[#1b2a40] bg-[#091321] p-4 transition duration-200 hover:border-[#293b57] hover:bg-[#0b1627]">
      <div
        className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${tones[tone]}`}
      >
        {icon}
      </div>

      <h3 className="text-sm font-semibold text-white">
        {title}
      </h3>

      <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function cleanHeading(text = "") {
  return String(text)
    .replace(/\*\*/g, "")
    .replace(/[`*_]/g, "")
    .trim();
}

function flattenText(node) {
  if (
    node === null ||
    node === undefined
  ) {
    return "";
  }

  if (typeof node === "string") {
    return node;
  }

  if (typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node
      .map(flattenText)
      .join("");
  }

  if (
    typeof node === "object" &&
    "props" in node
  ) {
    return flattenText(
      node.props?.children
    );
  }

  return "";
}

export default NotesView;
