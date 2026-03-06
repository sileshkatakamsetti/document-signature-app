const mongoose = require("mongoose");

const signatureSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    page: {
      type: Number,
      default: 1,
    },

    x: {
      type: Number,
      default: 0.5,
    },

    y: {
      type: Number,
      default: 0.5,
    },

    // store handwritten signature image
    signatureImage: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Signature", signatureSchema);