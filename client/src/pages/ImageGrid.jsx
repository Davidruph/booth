import React, { useEffect, useState } from "react";

function ImageGrid() {
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    fetchImageUrls(); // Fetch image URLs when component mounts
  }, []);

  const fetchImageUrls = async () => {
    try {
      const response = await fetch("http://localhost:3001/images"); // Endpoint to fetch image URLs
      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }
      const data = await response.json();
      setImageUrls(data); // Set image URLs in state
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  return (
    <div className="image-grid">
      {imageUrls.map((imageUrl, index) => (
        <img
          key={index}
          src={imageUrl}
          alt={`Image ${index}`}
          className="grid-item"
        />
      ))}
    </div>
  );
}

export default ImageGrid;
