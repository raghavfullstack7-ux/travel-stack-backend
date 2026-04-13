const mongoose = require("mongoose");

const translationSchema = new mongoose.Schema({
  originalText: {
    type: String,
    required: true
  },
  translatedText: {
    type: String,
    required: true
  },
  targetLang: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true,
    index: true // Indexed for fast lookups
  }
}, {
  timestamps: true
});

// Compound index to ensure uniqueness per language
translationSchema.index({ hash: 1, targetLang: 1 }, { unique: true });

module.exports = mongoose.model("Translation", translationSchema);
