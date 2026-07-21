import {
  BrainCircuit,
  FolderOpen,
  FileText,
  Trash2,
} from "lucide-react";


import UploadBox from "../Upload/UploadBox";
import api from "../../services/api";

function Sidebar({
  uploadedFiles,
  fetchFiles,
}) {

  
  
 
  // ======================================================
  // DELETE FILE
  // ======================================================

  const deleteFile = async (filename) => {

    const confirmDelete = window.confirm(
      `Delete "${filename}" ?`
    );

    if (!confirmDelete) return;

    try {

      await api.delete(
        `/delete-file/${filename}`
      );

      await fetchFiles();

    } catch (error) {

      console.error(error);

      alert("Unable to delete PDF.");

    }

  };


  // ======================================================
  // UI
  // ======================================================

  return (

    <aside
      className="
        w-80
        shrink-0
        h-full
        min-h-0
        flex
        flex-col
        overflow-hidden
        border-r
        border-slate-800
        bg-[#111827]
      "
    >
    
          {/* ================= BRAND ================= */}

      <div className="border-b border-slate-800 px-6 py-5">

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 shadow-lg shadow-violet-900/30">

            <BrainCircuit className="h-6 w-6 text-white" />

          </div>

          <div className="min-w-0 flex-1">

            <div className="flex items-center justify-between">

              <h1 className="text-2xl font-bold tracking-tight text-white">
                StudySphere AI
              </h1>

              <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-violet-300">
                AI
              </span>

            </div>

            <p className="mt-1 text-sm text-slate-400">
              Your Intelligent Study Companion
            </p>

          </div>

        </div>

      </div>

      {/* ================= DOCUMENT HEADER ================= */}

      <div className="border-b border-slate-800 px-6 py-5">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-xl font-semibold text-white">
              Documents
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Upload PDFs and chat with AI
            </p>

          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg">

            <FolderOpen className="h-6 w-6 text-white" />

          </div>

        </div>

      </div>

      <div className="flex-1 overflow-y-auto">

        {/* ================= UPLOAD ================= */}

                  <UploadBox
            onUploadSuccess={fetchFiles}
          />

      
        {/* ================= PDF LIST ================= */}

                <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6">

          <div className="mb-5 flex items-center justify-between">

            <h2 className="text-lg font-semibold text-white">
              Uploaded PDFs
            </h2>

            <span className="rounded-full bg-slate-800 px-5 py-1 text-xs text-slate-400">

              {uploadedFiles.length} File{uploadedFiles.length !== 1 ? "s" : ""}

            </span>

          </div>

          {uploadedFiles.length === 0 ? (

            <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-800 p-8 text-center">

              <div className="mb-4 text-5xl">

                📂

              </div>

              <h3 className="text-lg font-semibold text-white">

                No PDFs Uploaded

              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">

                Upload your study material to start chatting with
                StudySphere AI.

              </p>

            </div>

          ) : (

            <div className="space-y-4">

              {uploadedFiles.map((file) => (

                <div
                  key={file.id}
                  className="
                    group
                    rounded-2xl
                    border
                    border-slate-700
                    bg-slate-800
                    p-4
                    transition-all
                    duration-300
                    hover:border-violet-500
                    hover:shadow-lg
                    hover:shadow-violet-900/20
                  "
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex min-w-0 flex-1 items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10">

                        <FileText
                          className="h-5 w-5 text-red-400"
                        />

                      </div>

                      <div className="min-w-0 flex-1">

                        <p
                          className="truncate font-medium text-white"
                          title={file.filename}
                        >

                          {file.filename}

                        </p>

                        <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">

                          <span>

                            {file.size
                              ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                              : "Unknown Size"}

                          </span>

                          <span>•</span>

                          <span>

                            PDF Document

                          </span>

                        </div>

                      </div>

                    </div>

                    <button
                      onClick={() => deleteFile(file.filename)}
                      className="
                        rounded-xl
                        p-2
                        text-slate-500
                        transition-all
                        duration-300
                        hover:bg-red-500
                        hover:text-white
                      "
                      title="Delete PDF"
                    >

                      <Trash2 size={18} />

                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

          </aside>

  );

}

export default Sidebar;