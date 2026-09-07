import { useState } from "react";

import {
  AlertCircle,
  AlertTriangle,
  ArrowUp,
  Award,
  BookOpen,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Copy,
  Download,
  FileDown,
  FileText,
  FlaskConical,
  GraduationCap,
  Info,
  Lightbulb,
  Loader2,
  MessageCircleQuestion,
  Pin,
  RefreshCw,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { generateSummary } from "../../services/api";


// ============================================================
// SUMMARY VIEW
// ============================================================

function SummaryView() {
  const [summary, setSummary] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showTop, setShowTop] = useState(false);

  // ============================================================
  // GENERATE SUMMARY
  // ============================================================

  const handleGenerateSummary = async () => {
    try {
      setLoading(true);
      setError("");
      setCopied(false);

      const response = await generateSummary({
        topic: "",
      });

      if (!response?.success) {
        setSummary("");
        setSources([]);
        setError(
          response?.message ||
            "Unable to generate summary."
        );
        return;
      }

      setSummary(response.summary || "");
      setSources(response.sources || []);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error(
        "[SUMMARY ERROR]",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to generate summary. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // COPY
  // ============================================================

  const copySummary = async () => {
    if (!summary) return;

    try {
      await navigator.clipboard.writeText(summary);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (err) {
      console.error(
        "[COPY ERROR]",
        err
      );
    }
  };

  // ============================================================
  // DOWNLOAD TXT
  // ============================================================

  const downloadTXT = () => {
    if (!summary) return;

    const blob = new Blob(
      [summary],
      {
        type: "text/plain;charset=utf-8",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const anchor =
      document.createElement("a");

    anchor.href = url;
    anchor.download =
      "StudySphere_Summary.txt";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  };

  // ============================================================
  // DOWNLOAD PDF
  // ============================================================

  const downloadPDF = async () => {
    if (!summary) return;

    try {
      const { jsPDF } =
        await import("jspdf");

      const doc = new jsPDF({
        unit: "mm",
        format: "a4",
      });

      const pageWidth =
        doc.internal.pageSize.getWidth();

      const pageHeight =
        doc.internal.pageSize.getHeight();

      const margin = 15;

      const contentWidth =
        pageWidth - margin * 2;

      const lines =
        doc.splitTextToSize(
          summary,
          contentWidth
        );

      let y = 20;

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(10);

      for (const line of lines) {
        if (
          y >
          pageHeight - 15
        ) {
          doc.addPage();
          y = 20;
        }

        doc.text(
          line,
          margin,
          y
        );

        y += 5;
      }

      doc.save(
        "StudySphere_Summary.pdf"
      );
    } catch (err) {
      console.error(
        "[PDF ERROR]",
        err
      );
    }
  };

  // ============================================================
  // CONTENT METRICS
  // ============================================================

  const wordCount = summary
    ? summary
        .trim()
        .split(/\s+/)
        .filter(Boolean).length
    : 0;

  const estimatedMinutes =
    wordCount > 0
      ? Math.max(
          1,
          Math.ceil(wordCount / 180)
        )
      : 0;

  // ============================================================
  // UI
  // ============================================================

  return (
    <div
      className="
        relative
        h-full
        min-h-0
        overflow-y-auto
        overflow-x-hidden
        bg-[#060b16]
        text-white
      "
      onScroll={(event) => {
        setShowTop(
          event.currentTarget.scrollTop > 500
        );
      }}
    >

      {/* ======================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-600/[0.035] blur-[140px]" />

        <div className="absolute left-[35%] top-[35%] h-[400px] w-[400px] rounded-full bg-indigo-600/[0.025] blur-[140px]" />

      </div>

      <div className="relative mx-auto w-full max-w-[1240px] px-4 py-5 sm:px-5 lg:px-7 lg:py-7">

        <div className="space-y-4">

          {/* ==================================================
              HERO
          ================================================== */}

          <section
            className="
              relative
              overflow-hidden
              rounded-[28px]
              border
              border-white/[0.07]
              bg-gradient-to-br
              from-[#111a30]
              via-[#0c1528]
              to-[#080f1d]
              shadow-[0_25px_90px_rgba(0,0,0,0.28)]
            "
          >

            {/* Ambient glow */}

            <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-blue-500/[0.09] blur-[110px]" />

            <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-indigo-500/[0.055] blur-[100px]" />

            <div className="relative p-5 sm:p-6 lg:p-7">

              <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

                {/* ==================================================
                    TITLE
                ================================================== */}

                <div className="flex min-w-0 items-start gap-4">

                  <div
                    className="
                      relative
                      flex
                      h-13
                      w-13
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-blue-400/15
                      bg-gradient-to-br
                      from-blue-500/20
                      to-indigo-500/10
                      text-blue-300
                      shadow-[0_10px_35px_rgba(59,130,246,0.12)]
                    "
                  >

                    <div className="absolute inset-0 rounded-2xl bg-blue-500/10 blur-xl" />

                    <FileText
                      size={23}
                      className="relative"
                    />

                  </div>

                  <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-2">

                      <span className="text-[8px] font-semibold uppercase tracking-[0.24em] text-blue-400">
                        AI Study Tool
                      </span>

                      <span className="flex items-center gap-1 rounded-full border border-blue-400/15 bg-blue-500/[0.06] px-2 py-0.5 text-[7px] font-semibold uppercase tracking-[0.12em] text-blue-300">

                        <Sparkles size={8} />

                        Smart

                      </span>

                    </div>

                    <h1
                      className="
                        mt-1
                        text-[25px]
                        font-bold
                        tracking-[-0.04em]
                        text-white
                        sm:text-[29px]
                      "
                    >
                      Smart Summary
                    </h1>

                    <p
                      className="
                        mt-1.5
                        max-w-2xl
                        text-[10px]
                        leading-5
                        text-slate-500
                        sm:text-[11px]
                      "
                    >
                      Transform your study material into a
                      focused, structured revision guide with AI.
                    </p>

                  </div>

                </div>

                {/* ==================================================
                    ACTIONS
                ================================================== */}

                <div className="flex flex-wrap items-center gap-2">

                  <PrimaryButton
                    icon={
                      loading ? (
                        <Loader2
                          size={14}
                          className="animate-spin"
                        />
                      ) : (
                        <Sparkles size={14} />
                      )
                    }
                    label={
                      loading
                        ? "Generating..."
                        : summary
                        ? "Regenerate"
                        : "Generate Summary"
                    }
                    onClick={
                      handleGenerateSummary
                    }
                    disabled={loading}
                  />

                  <ActionButton
                    icon={
                      copied ? (
                        <Check size={13} />
                      ) : (
                        <Copy size={13} />
                      )
                    }
                    label={
                      copied
                        ? "Copied"
                        : "Copy"
                    }
                    onClick={copySummary}
                    disabled={!summary}
                    success={copied}
                  />

                  <ActionButton
                    icon={
                      <Download size={13} />
                    }
                    label="TXT"
                    onClick={downloadTXT}
                    disabled={!summary}
                  />

                  <ActionButton
                    icon={
                      <FileDown size={13} />
                    }
                    label="PDF"
                    onClick={downloadPDF}
                    disabled={!summary}
                  />

                </div>

              </div>

              {/* ==================================================
                  METRICS
              ================================================== */}

              {summary && !loading && (
                <div
                  className="
                    mt-6
                    flex
                    flex-wrap
                    items-center
                    gap-2
                    border-t
                    border-white/[0.06]
                    pt-5
                  "
                >

                  <Metric
                    icon={
                      <CheckCircle2 size={11} />
                    }
                    label="Status"
                    value="Ready"
                  />

                  <Metric
                    icon={
                      <FileText size={11} />
                    }
                    label="Words"
                    value={wordCount}
                  />

                  <Metric
                    icon={
                      <ClockIcon />
                    }
                    label="Read time"
                    value={`${estimatedMinutes} min`}
                  />

                  <Metric
                    icon={
                      <BookOpen size={11} />
                    }
                    label="Sources"
                    value={sources.length}
                  />

                </div>
              )}

            </div>

          </section>


          {/* ==================================================
              STATUS
          ================================================== */}

          <StatusBar
            loading={loading}
            summary={summary}
          />


          {/* ==================================================
              MAIN DOCUMENT
          ================================================== */}

          <section
            className="
              rounded-[28px]
              border
              border-white/[0.07]
              bg-[#0a1221]/90
              p-2
              shadow-[0_20px_70px_rgba(0,0,0,0.20)]
              sm:p-3
              lg:p-4
            "
          >

            {/* LOADING */}

            {loading && (
              <LoadingDocument />
            )}


            {/* ERROR */}

            {!loading && error && (
              <StateCard
                type="error"
                icon={
                  <AlertCircle size={23} />
                }
                title="Unable to generate summary"
                description={error}
                actionLabel="Try Again"
                onAction={
                  handleGenerateSummary
                }
              />
            )}


            {/* EMPTY */}

            {!loading &&
              !summary &&
              !error && (
                <StateCard
                  icon={
                    <GraduationCap size={25} />
                  }
                  title="Your study summary starts here"
                  description="Generate a structured AI summary from your uploaded study material. Important concepts, definitions, examples and revision points will be organized for easier studying."
                  actionLabel="Generate Summary"
                  onAction={
                    handleGenerateSummary
                  }
                />
              )}


            {/* ==================================================
                GENERATED CONTENT
            ================================================== */}

            {!loading && summary && (

              <div className="space-y-3">

                {/* DOCUMENT BAR */}

                <DocumentBar
                  wordCount={wordCount}
                  sources={sources.length}
                />


                {/* ==================================================
                    ACTUAL DOCUMENT
                ================================================== */}

                <article
                  className="
                    summary-document
                    overflow-hidden
                    rounded-[24px]
                    border
                    border-white/[0.055]
                    bg-[#080f1c]
                    px-5
                    py-7
                    sm:px-8
                    sm:py-9
                    lg:px-12
                    lg:py-11
                  "
                >

                  <ReactMarkdown
                    remarkPlugins={[
                      remarkGfm,
                    ]}
                    components={{

                      /* ==================================================
                          H1
                      ================================================== */

                      h1: ({
                        children,
                      }) => (
                        <SummaryTitle>
                          {children}
                        </SummaryTitle>
                      ),


                      /* ==================================================
                          H2
                      ================================================== */

                      h2: ({
                        children,
                      }) => (
                        <SectionHeading
                          title={children}
                        />
                      ),


                      /* ==================================================
                          H3
                      ================================================== */

                      h3: ({
                        children,
                      }) => (
                        <SubHeading>
                          {children}
                        </SubHeading>
                      ),


                      /* ==================================================
                          PARAGRAPH
                      ================================================== */

                      p: ({
                        children,
                      }) => (
                        <p
                          className="
                            my-4
                            text-[12px]
                            leading-[1.9]
                            text-slate-300
                            sm:text-[13px]
                            sm:leading-[1.9]
                          "
                        >
                          {children}
                        </p>
                      ),


                      /* ==================================================
                          STRONG
                      ================================================== */

                      strong: ({
                        children,
                      }) => (
                        <strong
                          className="
                            font-semibold
                            text-blue-300
                          "
                        >
                          {children}
                        </strong>
                      ),


                      /* ==================================================
                          UNORDERED LIST
                      ================================================== */

                      ul: ({
                        children,
                      }) => (
                        <ul
                          className="
                            my-5
                            space-y-2.5
                            pl-0
                          "
                        >
                          {children}
                        </ul>
                      ),


                      /* ==================================================
                          ORDERED LIST
                      ================================================== */

                      ol: ({
                        children,
                      }) => (
                        <ol
                          className="
                            my-5
                            space-y-3
                            pl-0
                            [counter-reset:item]
                          "
                        >
                          {children}
                        </ol>
                      ),


                      /* ==================================================
                          LIST ITEM
                      ================================================== */

                      li: ({
                        children,
                        node,
                      }) => {
                        const ordered =
                          node?.parent?.tagName ===
                          "ol";

                        return (
                          <li
                            className={`
                              relative
                              list-none
                              ${
                                ordered
                                  ? "pl-11"
                                  : "pl-7"
                              }
                              text-[11px]
                              leading-6
                              text-slate-300
                              sm:text-[12px]
                            `}
                          >

                            {ordered ? (
                              <span
                                className="
                                  absolute
                                  left-0
                                  top-0.5
                                  flex
                                  h-6
                                  w-6
                                  items-center
                                  justify-center
                                  rounded-lg
                                  border
                                  border-blue-400/10
                                  bg-blue-500/[0.07]
                                  text-[9px]
                                  font-semibold
                                  text-blue-300
                                "
                              >
                                <span
                                  className="
                                    before:content-[counter(list-item)]
                                  "
                                />
                              </span>
                            ) : (
                              <span
                                className="
                                  absolute
                                  left-1
                                  top-[11px]
                                  h-1.5
                                  w-1.5
                                  rounded-full
                                  bg-blue-400
                                  shadow-[0_0_10px_rgba(96,165,250,0.45)]
                                "
                              />
                            )}

                            {children}

                          </li>
                        );
                      },


                      /* ==================================================
                          BLOCKQUOTE
                      ================================================== */

                      blockquote: ({
                        children,
                      }) => (
                        <div
                          className="
                            my-6
                            rounded-2xl
                            border
                            border-blue-400/10
                            bg-blue-500/[0.035]
                            p-4
                            sm:p-5
                          "
                        >

                          <div className="flex gap-3">

                            <div
                              className="
                                flex
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-500/10
                                text-blue-300
                              "
                            >
                              <Info size={14} />
                            </div>

                            <div className="min-w-0 flex-1">
                              {children}
                            </div>

                          </div>

                        </div>
                      ),


                      /* ==================================================
                          CODE
                      ================================================== */

                      code: ({
                        children,
                        className,
                      }) => {

                        const isBlock =
                          className?.includes(
                            "language-"
                          );

                        if (isBlock) {
                          return (
                            <code
                              className="
                                block
                                overflow-x-auto
                                text-[11px]
                                leading-6
                                text-slate-300
                              "
                            >
                              {children}
                            </code>
                          );
                        }

                        return (
                          <code
                            className="
                              rounded-md
                              border
                              border-white/[0.06]
                              bg-white/[0.045]
                              px-1.5
                              py-0.5
                              font-mono
                              text-[11px]
                              text-blue-300
                            "
                          >
                            {children}
                          </code>
                        );
                      },


                      /* ==================================================
                          PRE
                      ================================================== */

                      pre: ({
                        children,
                      }) => (
                        <pre
                          className="
                            my-6
                            overflow-x-auto
                            rounded-2xl
                            border
                            border-white/[0.06]
                            bg-[#050a13]
                            p-4
                            sm:p-5
                          "
                        >
                          {children}
                        </pre>
                      ),


                      /* ==================================================
                          TABLE
                      ================================================== */

                      table: ({
                        children,
                      }) => (
                        <div className="my-7 overflow-x-auto rounded-2xl border border-white/[0.07]">

                          <table
                            className="
                              w-full
                              min-w-[600px]
                              border-collapse
                            "
                          >
                            {children}
                          </table>

                        </div>
                      ),


                      thead: ({
                        children,
                      }) => (
                        <thead className="bg-white/[0.035]">
                          {children}
                        </thead>
                      ),


                      th: ({
                        children,
                      }) => (
                        <th
                          className="
                            border-b
                            border-white/[0.07]
                            px-4
                            py-3
                            text-left
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.08em]
                            text-slate-300
                          "
                        >
                          {children}
                        </th>
                      ),


                      td: ({
                        children,
                      }) => (
                        <td
                          className="
                            border-b
                            border-white/[0.05]
                            px-4
                            py-3
                            text-[10px]
                            leading-5
                            text-slate-400
                          "
                        >
                          {children}
                        </td>
                      ),


                      hr: () => (
                        <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
                      ),

                    }}
                  >
                    {summary}
                  </ReactMarkdown>

                </article>


                {/* ==================================================
                    SOURCES
                ================================================== */}

                {sources.length > 0 && (
                  <SourcePanel
                    sources={sources}
                  />
                )}

              </div>
            )}

          </section>

        </div>

      </div>


      {/* ======================================================
          BACK TO TOP
      ====================================================== */}

      {showTop && (
        <button
          type="button"
          onClick={() => {
            const container =
              document.querySelector(
                ".overflow-y-auto"
              );

            container?.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
          className="
            fixed
            bottom-6
            right-6
            z-40
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            border-white/[0.10]
            bg-[#101a2d]/95
            text-slate-300
            shadow-[0_12px_35px_rgba(0,0,0,0.30)]
            backdrop-blur-xl
            transition
            hover:-translate-y-1
            hover:border-blue-400/20
            hover:text-blue-300
          "
          aria-label="Back to top"
        >
          <ArrowUp size={16} />
        </button>
      )}

    </div>
  );
}


// ============================================================
// SUMMARY TITLE
// ============================================================

function SummaryTitle({
  children,
}) {
  return (
    <div
      className="
        mb-9
        rounded-2xl
        border
        border-blue-400/10
        bg-gradient-to-r
        from-blue-500/[0.055]
        via-indigo-500/[0.025]
        to-transparent
        px-5
        py-5
        sm:px-6
      "
    >

      <div className="flex items-center gap-3">

        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-blue-400/10
            bg-blue-500/10
            text-blue-300
          "
        >
          <GraduationCap size={18} />
        </div>

        <h1
          className="
            m-0
            text-[21px]
            font-bold
            tracking-[-0.03em]
            text-white
            sm:text-[25px]
          "
        >
          {children}
        </h1>

      </div>

    </div>
  );
}


// ============================================================
// SECTION HEADING
// ============================================================

function SectionHeading({
  title,
}) {
  const {
    icon: Icon,
    color,
    description,
  } = getSectionIcon(title);

  return (
    <div className="mt-10 mb-5">

      <div className="flex items-center gap-3">

        <div
          className={`
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            ${color}
          `}
        >
          <Icon size={17} />
        </div>

        <div className="min-w-0">

          <div className="flex items-center gap-2">

            <h2
              className="
                m-0
                text-[17px]
                font-bold
                tracking-[-0.025em]
                text-white
                sm:text-[19px]
              "
            >
              {title}
            </h2>

          </div>

          {description && (
            <p className="mt-0.5 text-[8px] text-slate-600">
              {description}
            </p>
          )}

        </div>

      </div>

      <div className="mt-4 h-px bg-gradient-to-r from-white/[0.08] via-white/[0.04] to-transparent" />

    </div>
  );
}


// ============================================================
// SUB HEADING
// ============================================================

function SubHeading({
  children,
}) {
  return (
    <div className="mt-7 mb-3 flex items-center gap-2.5">

      <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.45)]" />

      <h3
        className="
          m-0
          text-[14px]
          font-semibold
          tracking-[-0.015em]
          text-slate-100
        "
      >
        {children}
      </h3>

    </div>
  );
}


// ============================================================
// SECTION ICON MAPPING
// ============================================================

function getSectionIcon(
  title
) {
  const text =
    String(title || "")
      .toLowerCase()
      .trim();


  // KEY POINTS

  if (
    text.includes("key point") ||
    text.includes("key takeaway") ||
    text.includes("takeaway") ||
    text.includes("highlight") ||
    text.includes("main point")
  ) {
    return {
      icon: Lightbulb,
      color:
        "border-amber-400/10 bg-amber-500/[0.08] text-amber-300",
      description:
        "The most important ideas to remember",
    };
  }


  // OVERVIEW

  if (
    text.includes("overview") ||
    text.includes("introduction") ||
    text === "summary"
  ) {
    return {
      icon: BookOpen,
      color:
        "border-blue-400/10 bg-blue-500/[0.08] text-blue-300",
      description:
        "A concise view of the topic",
    };
  }


  // CONCEPTS

  if (
    text.includes("important concept") ||
    text.includes("core concept") ||
    text.includes("concept")
  ) {
    return {
      icon: Target,
      color:
        "border-violet-400/10 bg-violet-500/[0.08] text-violet-300",
      description:
        "Core concepts you should understand",
    };
  }


  // DEFINITIONS

  if (
    text.includes("definition") ||
    text.includes("terminology") ||
    text.includes("terms")
  ) {
    return {
      icon: Pin,
      color:
        "border-cyan-400/10 bg-cyan-500/[0.08] text-cyan-300",
      description:
        "Important terms and their meanings",
    };
  }


  // ADVANTAGES

  if (
    text.includes("advantage") ||
    text.includes("benefit") ||
    text.includes("strength")
  ) {
    return {
      icon: TrendingUp,
      color:
        "border-emerald-400/10 bg-emerald-500/[0.08] text-emerald-300",
      description:
        "Benefits and positive aspects",
    };
  }


  // DISADVANTAGES

  if (
    text.includes("disadvantage") ||
    text.includes("limitation") ||
    text.includes("drawback") ||
    text.includes("weakness")
  ) {
    return {
      icon: TrendingDown,
      color:
        "border-rose-400/10 bg-rose-500/[0.08] text-rose-300",
      description:
        "Limitations and challenges",
    };
  }


  // APPLICATIONS

  if (
    text.includes("application") ||
    text.includes("use case") ||
    text.includes("uses")
  ) {
    return {
      icon: BriefcaseBusiness,
      color:
        "border-indigo-400/10 bg-indigo-500/[0.08] text-indigo-300",
      description:
        "Where the concept is applied",
    };
  }


  // EXAMPLES

  if (
    text.includes("example") ||
    text.includes("illustration")
  ) {
    return {
      icon: FlaskConical,
      color:
        "border-fuchsia-400/10 bg-fuchsia-500/[0.08] text-fuchsia-300",
      description:
        "Examples for better understanding",
    };
  }


  // INTERVIEW

  if (
    text.includes("interview") ||
    text.includes("viva")
  ) {
    return {
      icon: MessageCircleQuestion,
      color:
        "border-purple-400/10 bg-purple-500/[0.08] text-purple-300",
      description:
        "Questions you may be asked",
    };
  }


  // COMMON MISTAKES

  if (
    text.includes("common mistake") ||
    text.includes("mistake") ||
    text.includes("error")
  ) {
    return {
      icon: AlertTriangle,
      color:
        "border-orange-400/10 bg-orange-500/[0.08] text-orange-300",
      description:
        "Things students commonly get wrong",
    };
  }


  // QUICK REVISION

  if (
    text.includes("quick revision") ||
    text.includes("revision") ||
    text.includes("cheat sheet")
  ) {
    return {
      icon: Zap,
      color:
        "border-yellow-400/10 bg-yellow-500/[0.08] text-yellow-300",
      description:
        "Fast revision before an exam",
    };
  }


  // PRACTICE

  if (
    text.includes("practice") ||
    text.includes("questions")
  ) {
    return {
      icon: CircleHelp,
      color:
        "border-sky-400/10 bg-sky-500/[0.08] text-sky-300",
      description:
        "Test your understanding",
    };
  }


  // DEFAULT

  return {
    icon: ClipboardCheck,
    color:
      "border-blue-400/10 bg-blue-500/[0.08] text-blue-300",
    description:
      "Structured study material",
  };
}


// ============================================================
// DOCUMENT BAR
// ============================================================

function DocumentBar({
  wordCount,
  sources,
}) {
  return (
    <div
      className="
        flex
        flex-col
        gap-3
        rounded-2xl
        border
        border-white/[0.055]
        bg-[#080f1b]
        px-4
        py-3.5
        sm:flex-row
        sm:items-center
        sm:justify-between
        sm:px-5
      "
    >

      <div className="flex items-center gap-3">

        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-blue-500/10
            text-blue-300
          "
        >
          <BookOpen size={15} />
        </div>

        <div>

          <p className="text-[10px] font-semibold text-white">
            Generated Summary
          </p>

          <p className="mt-0.5 text-[8px] text-slate-600">
            AI-structured revision material
          </p>

        </div>

      </div>

      <div className="flex flex-wrap items-center gap-2">

        <DocumentMeta
          label={`${wordCount} words`}
        />

        <DocumentMeta
          label={`${sources} ${sources === 1 ? "source" : "sources"}`}
        />

        <span
          className="
            flex
            items-center
            gap-1.5
            rounded-lg
            border
            border-emerald-400/10
            bg-emerald-500/[0.05]
            px-2.5
            py-1.5
            text-[8px]
            font-semibold
            text-emerald-300
          "
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          AI Generated
        </span>

      </div>

    </div>
  );
}


// ============================================================
// DOCUMENT META
// ============================================================

function DocumentMeta({
  label,
}) {
  return (
    <span
      className="
        rounded-lg
        border
        border-white/[0.055]
        bg-white/[0.02]
        px-2.5
        py-1.5
        text-[8px]
        text-slate-500
      "
    >
      {label}
    </span>
  );
}


// ============================================================
// STATUS BAR
// ============================================================

function StatusBar({
  loading,
  summary,
}) {
  return (
    <div
      className="
        flex
        flex-col
        gap-3
        rounded-2xl
        border
        border-white/[0.055]
        bg-white/[0.015]
        px-4
        py-3
        sm:flex-row
        sm:items-center
        sm:justify-between
      "
    >

      <div className="flex items-center gap-2.5">

        <div
          className={`
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-lg
            ${
              loading
                ? "bg-blue-500/10 text-blue-300"
                : summary
                ? "bg-emerald-500/10 text-emerald-300"
                : "bg-slate-500/10 text-slate-500"
            }
          `}
        >

          {loading ? (
            <Loader2
              size={14}
              className="animate-spin"
            />
          ) : summary ? (
            <CheckCircle2 size={14} />
          ) : (
            <BookOpen size={14} />
          )}

        </div>

        <div>

          <p className="text-[10px] font-semibold text-slate-300">

            {loading
              ? "Creating your summary"
              : summary
              ? "Summary generated successfully"
              : "Ready to generate"}

          </p>

          <p className="mt-0.5 text-[8px] text-slate-600">

            {loading
              ? "AI is analyzing your uploaded study material."
              : summary
              ? "Your revision material is ready to study."
              : "Generate a structured summary from your study material."}

          </p>

        </div>

      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">

        <span
          className={`
            h-1.5
            w-1.5
            rounded-full
            ${
              loading
                ? "animate-pulse bg-blue-400"
                : summary
                ? "bg-emerald-400"
                : "bg-slate-600"
            }
          `}
        />

        <span className="text-[8px] font-semibold uppercase tracking-[0.15em] text-slate-600">

          {loading
            ? "Processing"
            : summary
            ? "Completed"
            : "Idle"}

        </span>

      </div>

    </div>
  );
}


// ============================================================
// PRIMARY BUTTON
// ============================================================

function PrimaryButton({
  icon,
  label,
  onClick,
  disabled,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="
        group
        flex
        h-9
        items-center
        gap-2
        rounded-xl
        border
        border-blue-400/20
        bg-gradient-to-r
        from-blue-600
        to-indigo-600
        px-3.5
        text-[10px]
        font-semibold
        text-white
        shadow-[0_8px_25px_rgba(37,99,235,0.20)]
        transition-all
        duration-200
        hover:-translate-y-[1px]
        hover:shadow-[0_12px_32px_rgba(37,99,235,0.28)]
        disabled:cursor-not-allowed
        disabled:opacity-50
        disabled:hover:translate-y-0
      "
    >
      {icon}
      {label}
    </button>
  );
}


// ============================================================
// ACTION BUTTON
// ============================================================

function ActionButton({
  icon,
  label,
  onClick,
  disabled,
  success = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        flex
        h-9
        items-center
        gap-1.5
        rounded-xl
        border
        px-3
        text-[10px]
        font-medium
        transition-all
        duration-200
        disabled:cursor-not-allowed
        disabled:opacity-25

        ${
          success
            ? "border-emerald-400/15 bg-emerald-500/[0.07] text-emerald-300"
            : "border-white/[0.07] bg-white/[0.025] text-slate-500 hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-slate-300"
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}


// ============================================================
// METRIC
// ============================================================

function Metric({
  icon,
  label,
  value,
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-2
        rounded-xl
        border
        border-white/[0.055]
        bg-white/[0.02]
        px-2.5
        py-1.5
      "
    >

      <span className="text-blue-400">
        {icon}
      </span>

      <span className="text-[8px] text-slate-600">
        {label}
      </span>

      <span className="text-[9px] font-semibold text-slate-300">
        {value}
      </span>

    </div>
  );
}


// ============================================================
// CLOCK ICON
// ============================================================

function ClockIcon() {
  return (
    <span className="text-[10px]">
      ◷
    </span>
  );
}


// ============================================================
// LOADING DOCUMENT
// ============================================================

function LoadingDocument() {
  return (
    <div
      className="
        rounded-[24px]
        border
        border-white/[0.055]
        bg-[#080f1c]
        p-6
        sm:p-8
        lg:p-10
      "
    >

      <div className="mb-8 flex items-center gap-3">

        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-blue-500/10
            text-blue-400
          "
        >
          <Sparkles
            size={16}
            className="animate-pulse"
          />
        </div>

        <div className="space-y-2">

          <div className="h-3.5 w-36 animate-pulse rounded bg-white/[0.07]" />

          <div className="h-2.5 w-52 animate-pulse rounded bg-white/[0.035]" />

        </div>

      </div>

      <div className="animate-pulse space-y-6">

        <Skeleton
          width="40%"
          height="h-7"
        />

        <div className="space-y-3">

          <Skeleton width="100%" />
          <Skeleton width="94%" />
          <Skeleton width="87%" />
          <Skeleton width="70%" />

        </div>

        <Skeleton
          width="28%"
          height="h-6"
        />

        <div className="space-y-3">

          <Skeleton width="96%" />
          <Skeleton width="91%" />
          <Skeleton width="82%" />

        </div>

        <Skeleton
          width="34%"
          height="h-6"
        />

        <div className="space-y-3">

          <Skeleton width="100%" />
          <Skeleton width="88%" />
          <Skeleton width="75%" />

        </div>

      </div>

      <div className="mt-9 flex items-center justify-center gap-2">

        <Loader2
          size={13}
          className="animate-spin text-blue-400"
        />

        <span className="text-[9px] text-slate-600">
          Analyzing your study material...
        </span>

      </div>

    </div>
  );
}


// ============================================================
// SKELETON
// ============================================================

function Skeleton({
  width = "100%",
  height = "h-2.5",
}) {
  return (
    <div
      className={`
        ${height}
        animate-pulse
        rounded
        bg-white/[0.035]
      `}
      style={{
        width,
      }}
    />
  );
}


// ============================================================
// STATE CARD
// ============================================================

function StateCard({
  icon,
  title,
  description,
  type,
  actionLabel,
  onAction,
}) {
  const isError =
    type === "error";

  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-[24px]
        border
        px-6
        py-20
        text-center
        ${
          isError
            ? "border-red-400/10 bg-red-500/[0.025]"
            : "border-dashed border-white/[0.08] bg-white/[0.01]"
        }
      `}
    >

      <div
        className={`
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-40
          w-40
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          blur-[90px]
          ${
            isError
              ? "bg-red-500/[0.07]"
              : "bg-blue-500/[0.05]"
          }
        `}
      />

      <div className="relative">

        <div
          className={`
            mx-auto
            mb-5
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            border
            ${
              isError
                ? "border-red-400/10 bg-red-500/10 text-red-400"
                : "border-blue-400/10 bg-blue-500/10 text-blue-400"
            }
          `}
        >
          {icon || (
            <GraduationCap size={25} />
          )}
        </div>

        <h3
          className="
            text-[18px]
            font-semibold
            tracking-[-0.025em]
            text-white
          "
        >
          {title}
        </h3>

        <p
          className="
            mx-auto
            mt-2.5
            max-w-lg
            text-[10px]
            leading-5
            text-slate-600
          "
        >
          {description}
        </p>

        {actionLabel && (
          <button
            type="button"
            onClick={onAction}
            className="
              mx-auto
              mt-6
              flex
              h-9
              items-center
              gap-2
              rounded-xl
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
              px-4
              text-[10px]
              font-semibold
              text-white
              shadow-[0_8px_25px_rgba(37,99,235,0.18)]
              transition
              hover:-translate-y-[1px]
            "
          >
            <Sparkles size={13} />
            {actionLabel}
          </button>
        )}

      </div>

    </div>
  );
}


// ============================================================
// SOURCE PANEL
// ============================================================

function SourcePanel({
  sources,
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-white/[0.055]
        bg-white/[0.012]
        p-4
        sm:p-5
      "
    >

      <div className="flex items-center justify-between gap-3">

        <div className="flex items-center gap-2.5">

          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              bg-blue-500/10
              text-blue-300
            "
          >
            <BookOpen size={13} />
          </div>

          <div>

            <p
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-slate-500
              "
            >
              Source Documents
            </p>

            <p className="mt-0.5 text-[8px] text-slate-700">
              Material used to generate this summary
            </p>

          </div>

        </div>

        <span
          className="
            rounded-full
            border
            border-white/[0.06]
            bg-white/[0.025]
            px-2
            py-1
            text-[8px]
            font-medium
            text-slate-600
          "
        >
          {sources.length}{" "}
          {sources.length === 1
            ? "source"
            : "sources"}
        </span>

      </div>

      <div className="mt-4 flex flex-wrap gap-2">

        {sources.map(
          (file, index) => (
            <div
              key={`${file}-${index}`}
              className="
                flex
                max-w-full
                items-center
                gap-2
                rounded-xl
                border
                border-blue-400/10
                bg-blue-500/[0.035]
                px-3
                py-2
              "
            >

              <FileText
                size={12}
                className="shrink-0 text-blue-400"
              />

              <span className="truncate text-[9px] text-slate-400">
                {file}
              </span>

            </div>
          )
        )}

      </div>

    </div>
  );
}


export default SummaryView;