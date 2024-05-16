import { useState, useRef } from "react";
import { showAlert } from "../static/alert";
import UploadedItem from "./UploadedItem";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { MdOutlineCancel } from "react-icons/md";
import { IoCloudUploadOutline } from "react-icons/io5";
import { isAuthenticated, signout } from "../api/server";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Dashboard() {
  const authenticatedUser = isAuthenticated();

  const navigate = useNavigate();

  const onSignout = () => {
    signout();
    console.log("Signed out");
    showAlert("", "Ended current session", "success");
    navigate("/login");
  };

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const fileInputRef = useRef(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const handleTagInputChange = (e) => {
    const { value } = e.target;
    if (value.endsWith(",") || value.endsWith(" ")) {
      const newTag = value.trim().replace(",", "");
      if (newTag !== "") {
        setTags([...tags, newTag]);
        setTagInput("");
      }
    } else {
      setTagInput(value);
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleRemove = (item) => {
    setSelectedFiles(selectedFiles.filter((image) => image !== item));
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const handleFileUpload = async () => {
    if (!selectedFiles.length) {
      showAlert("", "Please select at least one image.", "error");
      return;
    }

    if (tags.length === 0) {
      showAlert("", "Please enter at least one tag.", "error");
      return;
    }

    for (const tag of tags) {
      if (!tag.trim()) {
        showAlert("", "Tags cannot be empty.", "error");
        return;
      }
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });
    tags.forEach((tag) => {
      formData.append("tags[]", tag);
    });

    const jwtToken = JSON.parse(localStorage.getItem("jwt")).token;

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${jwtToken}`, // Include the token in the request headers
        },
      });

      if (!response.ok) {
        throw new Error("Failed to upload files.");
      }

      showAlert("", "Files uploaded successfully", "success");
      setSelectedFiles([]);
      setTags([]);
    } catch (error) {
      console.error("Error uploading files:", error);
      showAlert("", "Error uploading files.", "error");
    }
  };

  const handleSelectFilesClick = () => {
    fileInputRef.current.click();
  };

  return !authenticatedUser ? (
    <Navigate to="/login" />
  ) : (
    <section className="min-h-screen bg-black text-white flex flex-col">
      <header className="py-3 flex justify-between px-5">
        <button
          className="border p-2 text-white border-white bg-black rounded-md"
          onClick={onSignout}
        >
          Logout
        </button>
        <Link
          to="/gallery"
          className="border p-2 text-white border-white bg-black rounded-md"
        >
          Go to Gallery
        </Link>
      </header>
      <h1 className="flex justify-center text-4xl pb-5 pt-5 text-center">
        Hello, {authenticatedUser.user.name} <br /> Upload Images here
      </h1>

      <div className="flex flex-col flex-grow justify-center items-center pb-20">
        <div className="flex justify-center">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          <button
            onClick={handleSelectFilesClick}
            className="border p-2 rounded-md w-auto cursor-pointer"
          >
            Click to Select Files
          </button>
        </div>
        <div className="uploaded-items-container p-4 border border-gray-200 rounded-md max-h-80 overflow-x-auto mt-4 flex flex-shrink-0">
          {selectedFiles.map((item, index) => (
            <UploadedItem
              key={index}
              item={item}
              onRemove={handleRemove}
              onItemSelect={handleItemSelect}
            />
          ))}
        </div>
        <div className="px-10 flex flex-col justify-center items-center">
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="bg-dark border-white text-white border px-2 py-1 rounded-md flex items-center"
              >
                <span className="mr-1">{tag}</span>
                <button
                  className="text-red-600"
                  onClick={() => handleRemoveTag(index)}
                >
                  <MdOutlineCancel />
                </button>
              </div>
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={handleTagInputChange}
            placeholder="Enter tags separated by commas"
            className="border border-white rounded-md h-12 w-[390px] p-2 mt-4 text-white bg-black"
          />
        </div>
        <button
          onClick={handleFileUpload}
          className="btn-primary mt-5 border p-3 w-auto rounded-md flex items-center gap-2"
        >
          Upload Images
          <IoCloudUploadOutline />
        </button>
      </div>
    </section>
  );
}

export default Dashboard;
