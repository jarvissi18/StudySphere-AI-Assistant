import { useRef, useState } from "react";
import api from "../../services/api";

function UploadBox({ onUploadSuccess }) {

  // ======================================================
  // STATES
  // ======================================================

  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ======================================================
  // SELECT FILE
  // ======================================================

  const handleFileChange = (e) => {

    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {

      setMessage("❌ Please select a PDF file.");

      return;

    }

    setFile(selectedFile);
    setMessage("");

  };

  // ======================================================
  // OPEN PICKER
  // ======================================================

  const openPicker = () => {

    fileInputRef.current?.click();

  };

  // ======================================================
  // REMOVE FILE
  // ======================================================

  const removeFile = () => {

    setFile(null);

    if (fileInputRef.current) {

      fileInputRef.current.value = "";

    }

  };

  // ======================================================
  // UPLOAD
  // ======================================================

  const handleUpload = async () => {

    if (!file) {

      setMessage("❌ Please select a PDF first.");

      return;

    }

    try {

      setLoading(true);

      setMessage("");

      const formData = new FormData();

      formData.append("file", file);

      const response = await api.post("/upload", formData);

      console.log(response.data);

      setMessage("✅ PDF uploaded successfully.");

      if (onUploadSuccess) {

        onUploadSuccess();

      }

      setFile(null);

      if (fileInputRef.current) {

        fileInputRef.current.value = "";

      }

    }

    catch (error) {

      console.error(error);

      setMessage("❌ Upload failed.");

    }

    finally {

      setLoading(false);

    }

  };

  // ======================================================
  // UI
  // ======================================================

  return (

    <div className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-xl">

      {/* Header */}

      <div className="px-6 py-5 border-b border-slate-700">

        <h2 className="text-xl font-bold text-white">

          Upload PDF

        </h2>

        <p className="text-slate-400 text-sm mt-1">

          Upload your study material and chat with AI.

        </p>

      </div>

      <div className="p-6">

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          hidden
          onChange={handleFileChange}
        />

        <div
          onClick={openPicker}
          className="
          cursor-pointer
          rounded-2xl
          border-2
          border-dashed
          border-slate-600
          hover:border-blue-500
          bg-[#0F172A]          
          hover:bg-slate-800
          transition-all
          duration-300
          text-center
          p-8
        "
        >

          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 mx-auto flex items-center justify-center text-5xl shadow-lg">

            📄

          </div>

          <h3 className="text-white text-lg font-semibold mt-6">

            Choose PDF

          </h3>

          <p className="text-slate-400 text-sm mt-2">

            Click here to browse your PDF

          </p>

        </div>

        {file && (

          <div className="mt-6 rounded-2xl bg-[#111827] border-b border-slate-700 p-4">

            <div className="flex justify-between items-center gap-3">

              <div className="flex gap-3 items-center flex-1 min-w-0">

                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-2xl">

                  📄

                </div>

                <div className="min-w-0">

                  <p className="text-white truncate font-medium">

                    {file.name}

                  </p>

                  <p className="text-slate-400 text-sm">

                    {(file.size / 1024 / 1024).toFixed(2)} MB

                  </p>

                </div>

              </div>

              <button
                onClick={(e) => {

                  e.stopPropagation();

                  removeFile();

                }}
                className="w-10 h-10 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition"
              >

                ✕

              </button>

            </div>

          </div>

        )}

                {/* ======================================================
            UPLOAD BUTTON
        ====================================================== */}

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="
            w-full
            mt-6
            h-14
            rounded-2xl
            bg-gradient-to-r
            from-blue-600
            to-cyan-500
            hover:from-blue-700
            hover:to-cyan-600
            disabled:opacity-40
            disabled:cursor-not-allowed
            transition-all
            duration-300
            text-white
            font-semibold
            text-lg
            shadow-lg
          "
        >

          {loading ? (

            <div className="flex items-center justify-center gap-3">

              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

              <span>Uploading...</span>

            </div>

          ) : (

            "Upload PDF"

          )}

        </button>

        {/* ======================================================
            STATUS MESSAGE
        ====================================================== */}

        {message && (

          <div
            className={`mt-6 rounded-2xl p-4 border text-center text-sm font-medium ${
              message.startsWith("✅")
                ? "bg-green-500/10 border-green-500/30 text-green-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >

            {message}

          </div>

        )}

      </div>

    </div>

  );

}

export default UploadBox;