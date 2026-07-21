import { useEffect, useState } from "react";

import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import Workspace from "../../components/Workspace/Workspace";

import api from "../../services/api";

function Home() {

  // ======================================================
  // GLOBAL FILE STATE
  // ======================================================

  const [uploadedFiles, setUploadedFiles] = useState([]);

  // ======================================================
  // FETCH FILES
  // ======================================================

  const fetchFiles = async () => {

    try {

      const response = await api.get("/files");

      if (response.data.success) {

        setUploadedFiles(response.data.files);

      }

    }

    catch (error) {

      console.error("Unable to fetch files", error);

    }

  };

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {

    fetchFiles();

  }, []);

  // ======================================================
  // UI
  // ======================================================

  return (

    <div className="h-screen bg-[#0B1120] overflow-hidden">

      <div className="flex h-full">

        {/* ================= Sidebar ================= */}

        <Sidebar
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
          fetchFiles={fetchFiles}
        />

        {/* ================= Right ================= */}

        <div className="flex flex-1 flex-col min-w-0">

          <Navbar />

          <main className="flex-1 min-h-0 overflow-hidden">

            <Workspace
              uploadedFiles={uploadedFiles}
              fetchFiles={fetchFiles}
            />

          </main>

        </div>

      </div>

    </div>

  );

}

export default Home;