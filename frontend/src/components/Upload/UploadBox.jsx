import { useEffect, useRef, useState } from "react";

import {
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import api from "../../services/api";

function UploadBox({ onUploadSuccess }) {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // ============================================================
  // OPEN PICKER FROM ANYWHERE IN APP
  // ============================================================

  useEffect(() => {
    const handleGlobalUpload = () => {
      if (loading) return;

      fileInputRef.current?.click();
    };

    window.addEventListener(
      "studysphere:open-upload",
      handleGlobalUpload
    );

    return () => {
      window.removeEventListener(
        "studysphere:open-upload",
        handleGlobalUpload
      );
    };
  }, [loading]);

  // ============================================================
  // VALIDATE PDF
  // ============================================================

  const isPDFFile = (selectedFile) => {
    if (!selectedFile) {
      return false;
    }

    return (
      selectedFile.type === "application/pdf" ||
      selectedFile.name
        .toLowerCase()
        .endsWith(".pdf")
    );
  };

  // ============================================================
  // SELECT FILE
  // ============================================================

  const selectFile = (selectedFile) => {
    if (!selectedFile) {
      return;
    }

    if (!isPDFFile(selectedFile)) {
      setFile(null);
      setMessage("Please select a PDF file.");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    setFile(selectedFile);
    setMessage("");
  };

  // ============================================================
  // FILE INPUT
  // ============================================================

  const handleFileChange = (event) => {
    const selectedFile =
      event.target.files?.[0];

    if (selectedFile) {
      selectFile(selectedFile);
    }
  };

  // ============================================================
  // OPEN PICKER
  // ============================================================

  const openPicker = () => {
    if (loading) {
      return;
    }

    fileInputRef.current?.click();
  };

  // ============================================================
  // DRAG ENTER
  // ============================================================

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (loading) {
      return;
    }

    setIsDragging(true);
  };

  // ============================================================
  // DRAG OVER
  // ============================================================

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (loading) {
      return;
    }

    setIsDragging(true);
  };

  // ============================================================
  // DRAG LEAVE
  // ============================================================

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (
      event.currentTarget.contains(
        event.relatedTarget
      )
    ) {
      return;
    }

    setIsDragging(false);
  };

  // ============================================================
  // DROP
  // ============================================================

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setIsDragging(false);

    if (loading) {
      return;
    }

    const droppedFile =
      event.dataTransfer.files?.[0];

    if (droppedFile) {
      selectFile(droppedFile);
    }
  };

  // ============================================================
  // REMOVE FILE
  // ============================================================

  const removeFile = (event) => {
    event?.stopPropagation();

    setFile(null);
    setMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ============================================================
  // UPLOAD
  // ============================================================

  const handleUpload = async () => {
    if (!file) {
      setMessage(
        "Please select a PDF first."
      );
      return;
    }

    if (loading) {
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const formData = new FormData();

      formData.append(
        "file",
        file
      );

      await api.post(
        "/upload",
        formData
      );

      setMessage(
        "PDF uploaded successfully."
      );

      if (onUploadSuccess) {
        await onUploadSuccess();
      }

      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error(
        "Upload Error:",
        error
      );

      const detail =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Unable to upload PDF.";

      const cleanMessage =
        Array.isArray(detail)
          ? detail
              .map(
                (item) =>
                  item?.msg ||
                  "Unable to upload PDF."
              )
              .join(", ")
          : String(detail);

      setMessage(cleanMessage);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // FILE SIZE
  // ============================================================

  const fileSize = file
    ? `${(
        file.size /
        1024 /
        1024
      ).toFixed(2)} MB`
    : "";

  const uploadSuccess =
    message ===
    "PDF uploaded successfully.";

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="w-full">

      {/* ========================================================
          FILE INPUT
      ======================================================== */}

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        hidden
        onChange={handleFileChange}
      />

      {/* ========================================================
          DROP ZONE
      ======================================================== */}

      <button
        type="button"
        onClick={openPicker}
        disabled={loading}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          group
          relative
          block
          w-full
          overflow-hidden
          rounded-2xl
          border
          border-dashed
          p-4
          text-left
          transition-all
          duration-300

          ${
            isDragging
              ? `
                border-violet-400/50
                bg-violet-500/[0.09]
                shadow-[0_0_45px_rgba(124,58,237,0.15)]
                scale-[1.01]
              `
              : `
                border-white/[0.08]
                bg-white/[0.02]
                hover:border-violet-400/20
                hover:bg-violet-500/[0.035]
              `
          }

          disabled:cursor-not-allowed
          disabled:opacity-60
        `}
      >

        <div
          className={`
            pointer-events-none
            absolute
            -right-12
            -top-12
            h-28
            w-28
            rounded-full
            blur-[55px]
            transition-all

            ${
              isDragging
                ? "bg-violet-500/25"
                : "bg-violet-500/[0.08]"
            }
          `}
        />

        <div className="relative">

          <div className="flex items-center justify-between">

            <div
              className={`
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border
                transition-all

                ${
                  isDragging
                    ? "border-violet-300/30 bg-violet-500/15 text-violet-200 scale-105"
                    : "border-violet-400/15 bg-violet-500/[0.08] text-violet-300"
                }
              `}
            >
              <UploadCloud
                size={17}
                className={
                  isDragging
                    ? "animate-bounce"
                    : ""
                }
              />
            </div>

            <span
              className="
                rounded-full
                border
                border-white/[0.06]
                bg-white/[0.025]
                px-2
                py-1
                text-[7px]
                font-medium
                uppercase
                tracking-[0.14em]
                text-slate-700
              "
            >
              PDF
            </span>

          </div>

          <div className="mt-3">

            <h3 className="text-[11px] font-semibold text-white">
              {isDragging
                ? "Drop your PDF here"
                : "Add study material"}
            </h3>

            <p className="mt-1 text-[8px] leading-4 text-slate-700">
              {isDragging
                ? "Release to select this document."
                : "Drag & drop or click to browse."}
            </p>

          </div>

          <div
            className={`
              mt-3
              inline-flex
              items-center
              gap-1.5
              rounded-lg
              border
              px-2
              py-1.5
              text-[8px]
              font-medium

              ${
                isDragging
                  ? "border-violet-400/20 bg-violet-500/[0.08] text-violet-300"
                  : "border-white/[0.06] bg-white/[0.02] text-slate-600"
              }
            `}
          >

            <Sparkles size={9} />

            {isDragging
              ? "Release to select"
              : "Browse files"}

          </div>

        </div>
      </button>

      {/* ========================================================
          SELECTED FILE
      ======================================================== */}

      {file && (
        <div className="
          mt-2.5
          overflow-hidden
          rounded-xl
          border
          border-white/[0.07]
          bg-[#0b1426]
        ">

          <div className="flex items-center gap-2.5 p-3">

            <div className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-red-500/[0.08]
              text-red-400
            ">
              <FileText size={15} />
            </div>

            <div className="min-w-0 flex-1">

              <p
                title={file.name}
                className="
                  truncate
                  text-[9px]
                  font-medium
                  text-slate-300
                "
              >
                {file.name}
              </p>

              <p className="mt-1 text-[8px] text-slate-700">
                {fileSize} • PDF • Ready
              </p>

            </div>

            <button
              type="button"
              onClick={removeFile}
              disabled={loading}
              aria-label="Remove selected PDF"
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-lg
                text-slate-700
                transition
                hover:bg-red-500/10
                hover:text-red-400
              "
            >
              <X size={13} />
            </button>

          </div>

          <div className="border-t border-white/[0.06] p-2.5">

            <button
              type="button"
              onClick={handleUpload}
              disabled={loading}
              className="
                flex
                h-9
                w-full
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-gradient-to-r
                from-blue-600
                to-cyan-500
                text-[9px]
                font-semibold
                text-white
                shadow-[0_8px_22px_rgba(37,99,235,0.16)]
                transition
                hover:-translate-y-[1px]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >

              {loading ? (
                <>
                  <Loader2
                    size={12}
                    className="animate-spin"
                  />

                  Processing...
                </>
              ) : (
                <>
                  <UploadCloud size={12} />

                  Upload PDF
                </>
              )}

            </button>

          </div>

        </div>
      )}

      {/* ========================================================
          STATUS
      ======================================================== */}

      {message && (
        <div
          role={
            uploadSuccess
              ? "status"
              : "alert"
          }
          className={`
            mt-2.5
            flex
            items-start
            gap-2
            rounded-xl
            border
            px-2.5
            py-2

            ${
              uploadSuccess
                ? "border-emerald-400/10 bg-emerald-500/[0.05]"
                : "border-red-400/10 bg-red-500/[0.04]"
            }
          `}
        >

          {uploadSuccess ? (
            <CheckCircle2
              size={12}
              className="mt-0.5 shrink-0 text-emerald-400"
            />
          ) : (
            <AlertCircle
              size={12}
              className="mt-0.5 shrink-0 text-red-400"
            />
          )}

          <p
            className={`
              text-[8px]
              leading-4
              ${
                uploadSuccess
                  ? "text-emerald-300"
                  : "text-red-300"
              }
            `}
          >
            {message}
          </p>

        </div>
      )}

      {/* Security */}

      <div className="
        mt-2.5
        flex
        items-center
        justify-center
        gap-1
        text-center
        text-[7px]
        text-slate-800
      ">
        <ShieldCheck
          size={9}
          className="text-emerald-500/60"
        />

        Secure document handling
      </div>

    </div>
  );
}

export default UploadBox;