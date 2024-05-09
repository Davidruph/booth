const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors"); // Import cors package
const fs = require("fs");

const app = express();
const port = 3001;
const bodyParser = require("body-parser");

// Parse application/json
app.use(bodyParser.json());

// Middleware to enable CORS
app.use(cors());

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Handle file upload endpoint
app.post("/upload", upload.array("files"), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  console.log(req.files);
  res.send("Files uploaded successfully");
});

// Serve static files from the 'upload' folder
app.use("/uploads", express.static(path.join(__dirname, "upload")));

// Endpoint to list image files in the 'upload' folder
app.get("/images", async (req, res) => {
  try {
    const files = await fs.readdir(path.join(__dirname, "upload"));
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
