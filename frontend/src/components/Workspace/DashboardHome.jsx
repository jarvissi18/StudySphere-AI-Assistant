import {
  ArrowRight,
  File,
  FileText,
  FolderOpen,
  Sparkles,
  Trash2,
  UploadCloud,
} from "lucide-react";

import UploadBox from "../Upload/UploadBox";
import api from "../../services/api";

function DashboardHome({
  uploadedFiles = [],
  fetchFiles,
  setActiveTab,
}) {
  // ============================================================
  // RECENT DOCUMENTS
  // ============================================================

  const recentFiles = [...uploadedFiles]
    .sort(
      (a, b) =>
        new Date(b.uploaded_at || 0) -
        new Date(a.uploaded_at || 0)
    )
    .slice(0, 5);

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (value) => {
    if (!value) return "Recently uploaded";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Recently uploaded";
    }

    const diff = Math.max(
      0,
      Date.now() - date.getTime()
    );

    const hours = Math.floor(
      diff / (1000 * 60 * 60)
    );

    if (hours < 1) {
      return "Just now";
    }

    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);

    if (days === 1) {
      return "Yesterday";
    }

    return `${days}d ago`;
  };

  // ============================================================
  // DELETE DOCUMENT
  // ============================================================

  const deleteFile = async (filename) => {
    const confirmed = window.confirm(
      `Delete "${filename}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/delete-file/${encodeURIComponent(filename)}`
      );

      await fetchFiles?.();
    } catch (error) {
      console.error(
        "Unable to delete PDF:",
        error
      );

      window.alert(
        "Unable to delete PDF."
      );
    }
  };

  // ============================================================
  // OPEN CHAT
  // ============================================================

  const openChat = () => {
    setActiveTab?.("chat");
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div
      className="
        h-full
        min-h-0
        w-full
        overflow-y-auto
        overflow-x-hidden
        bg-[#070d1a]
        [scrollbar-width:thin]
        [scrollbar-color:rgba(255,255,255,0.10)_transparent]
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1380px]
          px-4
          py-5
          sm:px-6
          sm:py-6
          lg:px-7
          lg:py-7
          xl:px-8
        "
      >
        {/* ======================================================
            PAGE HEADER
        ====================================================== */}

        <header
          className="
            mb-5
            flex
            items-center
            justify-between
            gap-4
          "
        >
          <div className="min-w-0">
            <div
              className="
                mb-1.5
                flex
                items-center
                gap-2
              "
            >
              <span className="text-base">
                👋
              </span>

              <span
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  text-violet-400
                "
              >
                StudySphere Workspace
              </span>
            </div>

            <h1
              className="
                text-[26px]
                font-bold
                tracking-[-0.04em]
                text-white
                sm:text-[30px]
                lg:text-[34px]
              "
            >
              Welcome back!
            </h1>

            <p
              className="
                mt-1.5
                max-w-[620px]
                text-[10px]
                leading-5
                text-slate-600
                sm:text-[11px]
              "
            >
              Your intelligent study workspace is
              ready. Upload your material and let
              StudySphere AI help you learn faster.
            </p>
          </div>

          {/* AI STATUS */}

          <div
            className="
              hidden
              shrink-0
              items-center
              gap-2
              rounded-full
              border
              border-emerald-400/10
              bg-emerald-400/[0.035]
              px-3
              py-2
              sm:flex
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-emerald-400
                shadow-[0_0_9px_rgba(52,211,153,0.7)]
              "
            />

            <span
              className="
                text-[8px]
                font-medium
                text-emerald-300
              "
            >
              AI Workspace Ready
            </span>
          </div>
        </header>

        {/* ======================================================
            HERO + UPLOAD
        ====================================================== */}

        <section
          className="
            grid
            gap-4
            xl:grid-cols-[minmax(0,1fr)_390px]
          "
        >
          {/* ====================================================
              HERO
          ==================================================== */}

          <div
            className="
              relative
              min-h-[255px]
              overflow-hidden
              rounded-2xl
              border
              border-white/[0.07]
              bg-gradient-to-br
              from-[#111a32]
              via-[#0b1427]
              to-[#080f1d]
              p-5
              shadow-[0_20px_65px_rgba(0,0,0,0.18)]
              sm:p-7
              lg:p-8
            "
          >
            {/* Ambient glow */}

            <div
              className="
                pointer-events-none
                absolute
                -right-24
                -top-28
                h-64
                w-64
                rounded-full
                bg-violet-500/[0.10]
                blur-[95px]
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -bottom-32
                -left-24
                h-64
                w-64
                rounded-full
                bg-indigo-500/[0.055]
                blur-[90px]
              "
            />

            {/* Decorative grid */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                opacity-[0.025]
                [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)]
                [background-size:32px_32px]
              "
            />

            <div
              className="
                relative
                flex
                h-full
                flex-col
                justify-between
              "
            >
              <div>
                {/* Badge */}

                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-violet-400/10
                    bg-violet-500/[0.055]
                    px-2.5
                    py-1.5
                  "
                >
                  <Sparkles
                    size={10}
                    className="text-violet-400"
                  />

                  <span
                    className="
                      text-[7px]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-violet-300
                    "
                  >
                    Intelligent Learning
                  </span>
                </div>

                {/* Main title */}

                <h2
                  className="
                    mt-5
                    max-w-[620px]
                    text-[25px]
                    font-bold
                    leading-tight
                    tracking-[-0.04em]
                    text-white
                    sm:text-[31px]
                    lg:text-[35px]
                  "
                >
                  Turn your study material
                  <span className="text-violet-400">
                    {" "}into knowledge.
                  </span>
                </h2>

                <p
                  className="
                    mt-3
                    max-w-[590px]
                    text-[10px]
                    leading-5
                    text-slate-500
                    sm:text-[11px]
                  "
                >
                  Upload your PDFs once and build
                  your personalized AI-powered study
                  workspace around them.
                </p>
              </div>

              {/* Bottom status */}

              <div
                className="
                  mt-6
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >
                <StatusPill
                  icon={<FileText size={11} />}
                  label={`${uploadedFiles.length} ${
                    uploadedFiles.length === 1
                      ? "document"
                      : "documents"
                  }`}
                />

                <StatusPill
                  dot
                  label="AI ready"
                  green
                />

                {uploadedFiles.length > 0 && (
                  <button
                    type="button"
                    onClick={openChat}
                    className="
                      group
                      flex
                      h-8
                      items-center
                      gap-1.5
                      rounded-lg
                      border
                      border-violet-400/10
                      bg-violet-500/[0.06]
                      px-3
                      text-[8px]
                      font-medium
                      text-violet-300
                      transition
                      hover:border-violet-400/20
                      hover:bg-violet-500/[0.10]
                    "
                  >
                    Open AI Chat

                    <ArrowRight
                      size={11}
                      className="
                        transition-transform
                        group-hover:translate-x-0.5
                      "
                    />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ====================================================
              UPLOAD PANEL
          ==================================================== */}

          <div
            className="
              relative
              overflow-hidden
              rounded-2xl
              border
              border-white/[0.07]
              bg-gradient-to-br
              from-[#111a31]
              via-[#0b1426]
              to-[#09111f]
              p-4
              shadow-[0_18px_55px_rgba(0,0,0,0.18)]
              sm:p-5
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                -right-20
                -top-20
                h-40
                w-40
                rounded-full
                bg-violet-500/[0.10]
                blur-[75px]
              "
            />

            <div className="relative">
              {/* Header */}

              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-2.5
                  "
                >
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-violet-500/10
                      text-violet-300
                    "
                  >
                    <UploadCloud size={15} />
                  </div>

                  <div className="min-w-0">
                    <h2
                      className="
                        text-[11px]
                        font-semibold
                        text-white
                      "
                    >
                      Add study material
                    </h2>

                    <p
                      className="
                        mt-0.5
                        text-[7px]
                        text-slate-600
                      "
                    >
                      Upload a PDF to get started
                    </p>
                  </div>
                </div>

                <span
                  className="
                    shrink-0
                    rounded-full
                    border
                    border-white/[0.06]
                    bg-white/[0.025]
                    px-2
                    py-1
                    text-[7px]
                    uppercase
                    tracking-[0.12em]
                    text-slate-600
                  "
                >
                  PDF
                </span>
              </div>

              {/* Upload box */}

              <div className="mt-4">
                <UploadBox
                  onUploadSuccess={fetchFiles}
                />
              </div>

             
            </div>
          </div>
        </section>

        {/* ======================================================
            DOCUMENTS SECTION
        ====================================================== */}

        <section className="mt-5">
          <div
            className="
              mb-3
              flex
              items-end
              justify-between
              gap-4
            "
          >
            <div>
              <p
                className="
                  text-[7px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-slate-700
                "
              >
                Your Library
              </p>

              <h2
                className="
                  mt-1
                  text-[14px]
                  font-semibold
                  text-white
                "
              >
                Recent documents
              </h2>
            </div>

            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <span
                className="
                  rounded-full
                  border
                  border-white/[0.06]
                  bg-white/[0.02]
                  px-2.5
                  py-1
                  text-[7px]
                  text-slate-600
                "
              >
                {uploadedFiles.length} total
              </span>
            </div>
          </div>

          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-white/[0.07]
              bg-[#0a1324]
              shadow-[0_15px_45px_rgba(0,0,0,0.12)]
            "
          >
            {recentFiles.length === 0 ? (
              <EmptyDocuments />
            ) : (
              <div
                className="
                  grid
                  gap-0
                  sm:grid-cols-2
                  xl:grid-cols-3
                "
              >
                {recentFiles.map(
                  (file, index) => (
                    <DocumentCard
                      key={
                        file.id ??
                        file.filename ??
                        index
                      }
                      file={file}
                      index={index}
                      total={recentFiles.length}
                      formatDate={formatDate}
                      onDelete={deleteFile}
                    />
                  )
                )}
              </div>
            )}
          </div>
        </section>

             </div>
    </div>
  );
}

// ============================================================
// STATUS PILL
// ============================================================

function StatusPill({
  icon,
  dot = false,
  label,
  green = false,
}) {
  return (
    <div
      className={`
        flex
        h-8
        items-center
        gap-2
        rounded-lg
        border
        px-2.5
        ${
          green
            ? `
              border-emerald-400/10
              bg-emerald-500/[0.025]
            `
            : `
              border-white/[0.06]
              bg-white/[0.02]
            `
        }
      `}
    >
      {dot ? (
        <span
          className="
            h-1.5
            w-1.5
            rounded-full
            bg-emerald-400
            shadow-[0_0_8px_rgba(52,211,153,0.6)]
          "
        />
      ) : (
        <span className="text-blue-400">
          {icon}
        </span>
      )}

      <span
        className={`
          text-[8px]
          ${
            green
              ? "text-emerald-300"
              : "text-slate-500"
          }
        `}
      >
        {label}
      </span>
    </div>
  );
}

// ============================================================
// DOCUMENT CARD
// ============================================================

function DocumentCard({
  file,
  index,
  total,
  formatDate,
  onDelete,
}) {
  const size =
    file.size
      ? `${(
          file.size /
          1024 /
          1024
        ).toFixed(1)} MB`
      : "PDF";

  return (
    <div
      className={`
        group
        relative
        flex
        min-w-0
        items-center
        gap-3
        px-4
        py-3.5
        transition
        hover:bg-white/[0.025]
        ${
          index < total - 1
            ? `
              border-b
              border-white/[0.045]
              sm:border-b-0
              xl:border-b-0
            `
            : ""
        }
        ${
          index % 2 === 0
            ? "sm:border-r sm:border-white/[0.045]"
            : ""
        }
        ${
          index % 3 !== 2
            ? "xl:border-r xl:border-white/[0.045]"
            : ""
        }
      `}
    >
      {/* PDF ICON */}

      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-red-500/[0.07]
          text-red-400
        "
      >
        <File size={15} />
      </div>

      {/* INFO */}

      <div className="min-w-0 flex-1">
        <p
          title={file.filename}
          className="
            truncate
            text-[9px]
            font-medium
            text-slate-300
          "
        >
          {file.filename}
        </p>

        <div
          className="
            mt-1
            flex
            min-w-0
            items-center
            gap-1.5
            text-[7px]
            text-slate-700
          "
        >
          <span className="shrink-0">
            {size}
          </span>

          <span>•</span>

          <span className="truncate">
            {formatDate(
              file.uploaded_at
            )}
          </span>
        </div>
      </div>

      {/* DELETE */}

      <button
        type="button"
        onClick={() =>
          onDelete(file.filename)
        }
        aria-label={`Delete ${file.filename}`}
        className="
          flex
          h-7
          w-7
          shrink-0
          items-center
          justify-center
          rounded-lg
          text-slate-700
          opacity-100
          transition
          hover:bg-red-500/10
          hover:text-red-400
          sm:opacity-0
          sm:group-hover:opacity-100
        "
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}

// ============================================================
// EMPTY DOCUMENTS
// ============================================================

function EmptyDocuments() {
  return (
    <div
      className="
        flex
        min-h-[145px]
        flex-col
        items-center
        justify-center
        px-5
        py-8
        text-center
      "
    >
      <div
        className="
          mb-3
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          border
          border-white/[0.05]
          bg-white/[0.018]
          text-slate-700
        "
      >
        <FolderOpen size={17} />
      </div>

      <p
        className="
          text-[9px]
          font-medium
          text-slate-500
        "
      >
        Your study library is empty
      </p>

      <p
        className="
          mt-1
          text-[7px]
          text-slate-700
        "
      >
        Upload a PDF above to start building
        your workspace.
      </p>
    </div>
  );
}

export default DashboardHome;