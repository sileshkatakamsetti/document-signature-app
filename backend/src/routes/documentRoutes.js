const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const Document = require("../models/Document");
const Signer = require("../models/Signer");
const mongoose = require("mongoose");

const router = express.Router();

/**
 * =========================
 * UPLOAD PDF DOCUMENT
 * =========================
 */
router.post(
  "/upload",
  authMiddleware,
  upload.single("document"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const newDocument = new Document({
        user: req.user.id,
        originalName: req.file.originalname,
        fileName: req.file.filename,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        status: "Pending",
      });

      await newDocument.save();

      res.status(201).json({
        message: "Document uploaded successfully",
        document: newDocument,
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

/**
 * =========================
 * GET USER DOCUMENTS
 * =========================
 */
router.get("/my-docs", authMiddleware, async (req, res) => {
  try {

    const documents = await Document.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: documents.length,
      documents,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch documents" });
  }
});

/**
 * =========================
 * GET DOCUMENTS ASSIGNED TO SIGNER
 * =========================
 */
router.get("/to-sign", authMiddleware, async (req, res) => {
  try {

    const userEmail = req.user.email.trim().toLowerCase();

    const signers = await Signer.find({
      email: userEmail,
    });

    const documentIds = signers.map((s) => s.documentId);

    const documents = await Document.find({
      _id: { $in: documentIds },
    });

    res.status(200).json({
      count: documents.length,
      documents,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch signer documents" });
  }
});

/**
 * =========================
 * PUBLIC DOCUMENT ACCESS
 * Used for email signing link
 * =========================
 */
router.get("/public/:id", async (req, res) => {
  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid document ID" });
    }

    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.status(200).json(document);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch document" });
  }
});

/**
 * =========================
 * GET SINGLE DOCUMENT
 * =========================
 */
router.get("/:id", async (req, res) => {
  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid document ID" });
    }

    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.status(200).json(document);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch document" });
  }
});

module.exports = router;