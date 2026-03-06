const express = require("express");
const Signer = require("../models/Signer");
const authMiddleware = require("../middleware/authMiddleware");

// import email service
const sendSignerEmail = require("../../services/emailService");

const router = express.Router();


// =============================
// Add signer
// =============================
router.post("/", authMiddleware, async (req, res) => {

  try {

    const { documentId, email } = req.body;

    console.log("Add signer request:", req.body);

    if (!documentId || !email) {
      return res.status(400).json({
        message: "Document ID and email are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Prevent duplicate signer
    const existingSigner = await Signer.findOne({
      documentId,
      email: normalizedEmail,
    });

    if (existingSigner) {
      return res.status(400).json({
        message: "Signer already exists",
      });
    }

    const signer = await Signer.create({
      documentId,
      email: normalizedEmail,
    });

    console.log("Signer created:", signer);

    // send email invitation
    await sendSignerEmail(normalizedEmail, documentId);

    res.json(signer);

  } catch (error) {

    console.error("Add signer error:", error);

    res.status(500).json({
      message: "Failed to add signer",
    });

  }

});


// =============================
// Get signers
// =============================
router.get("/:documentId", authMiddleware, async (req, res) => {

  try {

    console.log("Fetching signers for document:", req.params.documentId);

    const signers = await Signer.find({
      documentId: req.params.documentId,
    });

    res.json(signers);

  } catch (error) {

    console.error("Fetch signers error:", error);

    res.status(500).json({
      message: "Failed to fetch signers",
    });

  }

});

module.exports = router;