const { PDFDocument } = require("pdf-lib");
const fs = require("fs");
const path = require("path");
const Signature = require("../models/Signature");
const Document = require("../models/Document");

exports.signPdf = async (req, res) => {

  try {

    const documentId = req.params.documentId;

    const signatures = await Signature.find({ documentId });

    if (!signatures || signatures.length === 0) {
      return res.status(404).json({
        message: "Signature not found",
      });
    }

    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    const pdfPath = path.join(
      __dirname,
      "../../uploads",
      document.fileName
    );

    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({
        message: "PDF file not found on server",
      });
    }

    const existingPdfBytes = fs.readFileSync(pdfPath);

    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const pages = pdfDoc.getPages();

    for (const signature of signatures) {

      const pageIndex = signature.page - 1;

      if (!pages[pageIndex]) continue;

      const page = pages[pageIndex];

      const { width, height } = page.getSize();

      const x = signature.x * width;

      const y = height - (signature.y * height);

      if (
        signature.signatureImage &&
        typeof signature.signatureImage === "string" &&
        signature.signatureImage.includes("base64")
      ) {

        const base64Image = signature.signatureImage.split(",")[1];

        const imageBuffer = Buffer.from(base64Image, "base64");

        const image = await pdfDoc.embedPng(imageBuffer);

        const imgWidth = 160;
        const imgHeight = 70;

        page.drawImage(image, {
          x,
          y: y - imgHeight,
          width: imgWidth,
          height: imgHeight,
        });

      }

      else {

        page.drawText("Signed", {
          x,
          y,
          size: 18,
        });

      }

    }

    const pdfBytes = await pdfDoc.save();

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=signed.pdf"
    );

    res.send(Buffer.from(pdfBytes));

  } catch (error) {

    console.error("PDF SIGN ERROR:", error);

    res.status(500).json({
      message: "Failed to sign PDF",
    });

  }

};