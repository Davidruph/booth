import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { isAuthenticated, signout } from "../api/server";
import { showAlert } from "../static/alert";
import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { FaSpinner } from "react-icons/fa";

function ImageGrid() {
  const authenticatedUser = isAuthenticated();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(-1);
  const [selectedTag, setSelectedTag] = useState("");
  const [filteredPhotos, setFilteredPhotos] = useState([]);

  const onSignout = () => {
    signout();
    console.log("Signed out");
    showAlert("", "Ended current session", "success");
    navigate("/login");
  };

  const jwtToken = JSON.parse(localStorage.getItem("jwt")).token || "";
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    async function getImages() {
      try {
        const response = await fetch(`${API_BASE_URL}/media-files`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwtToken}`, // Include the token in the request headers
          },
        });

        if (response.status === 401) {
          showAlert("Session expired", "Please log in again", "error");
          navigate("/login");
          return;
        }

        const data = await response.json();
        setImages(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error getting files:", error);
        setIsLoading(false);
      }
    }

    getImages();
  }, [jwtToken, API_BASE_URL, navigate]);

  useEffect(() => {
    if (selectedTag === "") {
      setFilteredPhotos(
        images.flatMap((photo) => {
          const width = breakpoints[0];
          const height = (photo.height / photo.width) * width || 2000; // Set a default height if not provided

          return photo.images.map((imgSrc) => ({
            src: imgSrc,
            width,
            height,
            srcSet: breakpoints.map((breakpoint) => {
              const height =
                Math.round((photo.height / photo.width) * breakpoint) || 2000;
              return {
                src: imgSrc,
                width: breakpoint,
                height,
              };
            }),
          }));
        })
      );
    } else {
      const filtered = images
        .filter((photo) => photo.tags && photo.tags.includes(selectedTag))
        .flatMap((photo) => {
          const width = breakpoints[0];
          const height = (photo.height / photo.width) * width || 2000; // Set a default height if not provided

          return photo.images.map((imgSrc) => ({
            src: imgSrc,
            width,
            height,
            srcSet: breakpoints.map((breakpoint) => {
              const height =
                Math.round((photo.height / photo.width) * breakpoint) || 2000;
              return {
                src: imgSrc,
                width: breakpoint,
                height,
              };
            }),
          }));
        });

      if (filtered.length > 0) {
        setFilteredPhotos(filtered);
      } else {
        setFilteredPhotos([]);
      }
    }
  }, [selectedTag, images]);

  const breakpoints = [3840, 2400, 1080, 640, 384, 256, 128, 96, 64, 48];

  return !authenticatedUser ? (
    <Navigate to="/login" />
  ) : (
    <section className="min-h-screen bg-black text-white">
      <header className="py-3 flex justify-between px-5">
        <button
          className="border p-2 text-white border-white bg-black rounded-md"
          onClick={onSignout}
        >
          Logout
        </button>
        <Link
          to="/"
          className="border p-2 text-white border-white bg-black rounded-md"
        >
          Upload More
        </Link>
      </header>
      <h1 className="flex justify-center text-[40px] pb-5 pt-5">
        Image Gallery
      </h1>

      <div className="px-5">
        <div className="flex justify-center gap-4 items-center mb-5 mt-3">
          <label htmlFor="">Filter Tag</label>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="border-white bg-black text-white h-150 border"
          >
            <option value="">All Tags</option>
            {images
              .flatMap((photo) => photo.tags)
              .filter((tag, index, self) => self.indexOf(tag) === index)
              .map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
          </select>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <FaSpinner />
          </div>
        ) : (
          <div>
            {filteredPhotos.length === 0 ? (
              <div>No results found.</div>
            ) : (
              <div className="px-5">
                <PhotoAlbum
                  photos={filteredPhotos}
                  layout="rows"
                  targetRowHeight={150}
                  onClick={({ index }) => setIndex(index)}
                />
                <Lightbox
                  slides={filteredPhotos}
                  open={index >= 0}
                  index={index}
                  close={() => setIndex(-1)}
                  plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default ImageGrid;
