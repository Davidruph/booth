const express = require("express");
const router = express.Router();
const multer = require("multer");
const Gallery = require("../models/GalleryModel");
const authenticate = require("../middleware/middleware");
const { check } = require("express-validator");
const {
  signin,
  signup,
  signout,
  isSignedIn,
} = require("../controllers/authController");

const cloudinary = require("../config/cloudinaryConfig");

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadFilesAndGetUrls = async (files) => {
  const urls = [];

  for (const file of files) {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "auto" }, (error, result) => {
          if (error) reject(error);
          resolve(result);
        })
        .end(file.buffer);
    });

    urls.push(result.secure_url);
  }

  return urls;
};

router.post(
  "/upload",
  isSignedIn,
  authenticate,
  upload.array("files"),
  async (req, res) => {
    try {
      const tags = req.body["tags[]"] || req.body.tags; // Handle both array and single tag cases
      const files = req.files;

      if (!files.length) {
        return res.status(400).send("No files uploaded.");
      }

      const imageUrls = await uploadFilesAndGetUrls(files);

      const newGalleryEntry = new Gallery({
        images: imageUrls,
        tags: Array.isArray(tags) ? tags : [tags], // Ensure tags is an array
        createdBy: req.user._id, // Attach user ID from authenticated user
      });

      await newGalleryEntry.save();
      res.status(201).send("Files uploaded and saved to gallery.");
    } catch (error) {
      console.error("Error uploading files:", error);
      res.status(500).send("Error uploading files.");
    }
  }
);

router.get("/media-files", isSignedIn, authenticate, async (req, res) => {
  try {
    // Find all Gallery documents
    const galleries = await Gallery.find({});

    res.json(galleries); // Send all Gallery documents as a JSON response
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST request for user signup
router.post(
  "/signup",
  [
    // Validation for name, email, and password
    check("name", "Name must be 3+ chars long").isLength({ min: 3 }),
    check("email", "Email is required").isEmail(),
    check("password", "Password must contain 8+ chars").isLength({ min: 8 }),
  ],
  signup // Call the signup function from the authController
);

// POST request for user signin
router.post(
  "/signin",
  [
    // Validation for email and password
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").isLength({ min: 1 }),
  ],
  signin // Call the signin function from the authController
);

// GET request for user signout
router.get("/signout", signout);

// Protected Route for testing
router.get("/testroute", isSignedIn, (req, res) => {
  res.send("A protected route");
});

module.exports = router;
