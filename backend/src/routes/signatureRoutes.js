const express = require("express");
const mongoose = require("mongoose");
const Signature = require("../models/Signature");
const Signer = require("../models/Signer");
const Document = require("../models/Document");

const router = express.Router();


// =============================
// SAVE SIGNATURE
// =============================
router.post("/", async (req, res) => {

  try {

    const { documentId, page, x, y, signatureImage } = req.body;

    console.log("Signature request received:", req.body);

    // validate document id
    if (!documentId || !mongoose.Types.ObjectId.isValid(documentId)) {
      return res.status(400).json({
        message: "Invalid document ID"
      });
    }

    const docId = new mongoose.Types.ObjectId(documentId);

    // check signature image
    if (!signatureImage) {
      return res.status(400).json({
        message: "Signature image missing"
      });
    }

    // check document exists
    const document = await Document.findById(docId);

    if (!document) {
      return res.status(404).json({
        message: "Document not found"
      });
    }

    // check signer exists
    const signer = await Signer.findOne({
      documentId: docId
    });

    if (!signer) {
      return res.status(403).json({
        message: "No signer assigned for this document"
      });
    }

    // check if signer already signed
    if (signer.signed === true) {
      return res.status(400).json({
        message: "Document already signed"
      });
    }

    // save signature
    const signature = await Signature.create({
      documentId: docId,
      page: page || 1,
      x: x || 0.5,
      y: y || 0.5,
      signatureImage
    });

    // mark signer signed
    await Signer.updateOne(
      { documentId: docId },
      { signed: true }
    );

    // update document status
    await Document.findByIdAndUpdate(
      docId,
      { status: "Completed" }
    );

    res.json({
      message: "Signature saved successfully",
      signature
    });

  } catch (err) {

    console.error("Signature save error:", err);

    res.status(500).json({
      message: "Failed to save signature"
    });

  }

});


// =============================
// GET SIGNATURE
// =============================
router.get("/:documentId", async (req, res) => {

  try {

    const { documentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return res.status(400).json({
        message: "Invalid document ID"
      });
    }

    const docId = new mongoose.Types.ObjectId(documentId);

    const signature = await Signature.findOne({
      documentId: docId
    });

    res.json(signature);

  } catch (err) {

    console.error("Signature fetch error:", err);

    res.status(500).json({
      message: "Failed to fetch signature"
    });

  }

});

module.exports = router;