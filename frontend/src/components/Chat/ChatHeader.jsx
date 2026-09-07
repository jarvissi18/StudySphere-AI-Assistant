import {
  BrainCircuit,
  FileText,
  Plus,
} from "lucide-react";

function ChatHeader({ pdfCount }) {
  const hasDocuments = pdfCount > 0;

  const openUpload = () => {
    const trigger = document.querySelector(
      "[data-study-upload-trigger]"
    );

    trigger?.click();
  };

  return (
    <header
      className="
        flex
        min-h-[78px]
        items-center
        justify-between
        gap-4
        border-b
        border-white/[0.06]
        bg-[#070d1a]
        px-5
        py-3.5
        sm:px-7
        lg:px-10
      "
    >

      
      {/* ======================================================
          RIGHT
      ====================================================== */}

      <div className="flex shrink-0 items-center gap-2">

        {/* Documents */}

        <div
          className="
            hidden
            h-12
            items-center
            gap-2.5
            rounded-xl
            border
            border-white/[0.06]
            bg-white/[0.02]
            px-3
            sm:flex
          "
        >

          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              bg-blue-500/[0.08]
              text-blue-400
            "
          >
            <FileText size={15} />
          </div>

          <div>

            <p className="text-[7px] uppercase tracking-[0.16em] text-slate-700">
              Documents
            </p>

            <p className="mt-0.5 text-[10px] font-semibold text-slate-300">
              {pdfCount} PDFs
            </p>

          </div>

        </div>

        {/* Add document */}

        <button
          type="button"
          onClick={openUpload}
          className="
            flex
            h-11
            items-center
            gap-2
            rounded-xl
            border
            border-violet-400/15
            bg-violet-500/[0.07]
            px-3.5
            text-[10px]
            font-semibold
            text-violet-300
            transition-all
            hover:border-violet-400/25
            hover:bg-violet-500/[0.11]
            hover:text-violet-200
          "
        >
          <Plus size={14} />

          <span className="hidden sm:inline">
            Add Document
          </span>

          <span className="sm:hidden">
            Add
          </span>
        </button>

      </div>

    </header>
  );
}

export default ChatHeader;