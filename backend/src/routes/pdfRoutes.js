const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");

const Signature = require("../models/Signature");
const Document = require("../models/Document");

router.get("/sign/:documentId", async (req, res) => {

  try {

    const { documentId } = req.params;

    const document = await Document.findById(documentId);
    const signature = await Signature.findOne({ documentId });

    if (!document || !signature) {
      return res.status(404).json({
        message: "Signed document not found"
      });
    }

    const pdfPath = path.join(__dirname, "../../uploads", document.fileName);

    const existingPdfBytes = fs.readFileSync(pdfPath);

    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const pages = pdfDoc.getPages();
    const page = pages[signature.page - 1];

    const signatureBase64 = signature.signatureImage.split(",")[1];

    const pngImage = await pdfDoc.embedPng(
      Buffer.from(signatureBase64, "base64")
    );

    const { width, height } = page.getSize();

    page.drawImage(pngImage, {
      x: signature.x * width,
      y: height - signature.y * height,
      width: 150,
      height: 70
    });

    const pdfBytes = await pdfDoc.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=signed-document.pdf"
    );

    res.send(Buffer.from(pdfBytes));

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Failed to generate signed PDF"
    });

  }

});

module.exports = router;