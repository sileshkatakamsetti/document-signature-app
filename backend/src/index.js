const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve uploaded PDFs
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/docs", require("./routes/documentRoutes"));
app.use("/api/signatures", require("./routes/signatureRoutes"));
app.use("/api/signers", require("./routes/signerRoutes"));

// ⭐ Route for generating signed PDF
app.use("/api/pdf", require("./routes/pdfRoutes"));


// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});