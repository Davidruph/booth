// Defining the Gallery Schema
const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    images: [
      {
        type: String, // Assuming you store image URLs, adjust as needed
        required: true,
      },
    ],
    tags: [String],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
    },
  },
  { timestamps: true, collection: "gallery" } // Specify collection name for Gallery
);

// Export the Gallery model
module.exports = mongoose.model("Gallery", gallerySchema);
