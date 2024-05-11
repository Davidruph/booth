// Import necessary components and hooks
import { useState, useRef } from "react";
import { useUser, UserButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { showAlert } from "../static/alert";
import UploadedItem from "./UploadedItem";

const BASE_URL = "https://booth-server.vercel.app/api/v1";

function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();

  if (!user) {
    navigate("/");
  }

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const fileInputRef = useRef(null);

  const handleRemove = (item) => {
    setSelectedFiles(selectedFiles.filter((image) => image !== item));
  };

  // Handle item selection
  const handleItemSelect = (item) => {
    setSelectedItem(item);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const handleFileUpload = async () => {
    if (!selectedFiles.length) return;

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.text();
      showAlert("", "files uploaded successfully", "success");
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const handleSelectFilesClick = () => {
    fileInputRef.current.click();
  };

  return (
    <section className="h-screen bg-black text-white">
      <header className="flex justify-between items-center w-full px-5 py-5">
        <div className="text-white">{user?.fullName}</div>
        <UserButton />
      </header>

      <h1 className="flex justify-center text-[40px] pb-5 pt-10">
        Upload Images here
      </h1>

      <div className="flex justify-center flex-col items-center gap-4">
        <div className="flex justify-center">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          {/* Button to trigger file selection */}
          <button
            onClick={handleSelectFilesClick}
            className="border p-2 rounded-md w-auto cursor-pointer"
          >
            Select Files
          </button>
        </div>
        <div className="uploaded-items-container p-4 border border-gray-200 rounded-md max-h-80 overflow-y-auto mt-4 flex flex-wrap">
          {/* Render UploadedItem components */}
          {selectedFiles.map((item, index) => (
            <UploadedItem
              key={index}
              item={item}
              onRemove={handleRemove}
              onItemSelect={handleItemSelect}
            />
          ))}
        </div>
        {/* Button to trigger file upload */}
        <button
          onClick={handleFileUpload}
          className="btn-primary mt-4 border p-3 w-auto rounded-md"
        >
          Upload
        </button>
      </div>
    </section>
  );
}

export default Dashboard;
