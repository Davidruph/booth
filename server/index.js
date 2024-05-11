const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3001; // Use PORT environment variable for Vercel

// Middleware
app.use(cors());
app.use(express.json());

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Adjust destination path
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Handle file upload endpoint
app.post("api/v1/upload", upload.array("files"), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  console.log(req.files);
  res.send("Files uploaded successfully");
});

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Endpoint to list image files in the 'uploads' folder
app.get("api/v1/images", async (req, res) => {
  try {
    const files = await fs.readdir(path.join(__dirname, "public/uploads"));
    const imageUrls = files
      .filter((file) => file.match(/\.(jpg|jpeg|png|gif)$/i))
      .map((file) => `/uploads/${file}`);
    res.json(imageUrls);
  } catch (error) {
    console.error("Error reading directory:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
