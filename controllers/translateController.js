const axios = require("axios");
const crypto = require("crypto");
const Translation = require("../models/Translation");

/**
 * Generates a SHA256 hash for a given text
 */
const getHash = (text) => {
  return crypto.createHash("sha256").update(text).digest("hex");
};

/**
 * Dynamic Translation Controller
 * Integrates Langbly API with a local MongoDB cache
 */
exports.translateText = async (req, res) => {
  try {
    const { texts, targetLang } = req.body;

    if (!texts || !Array.isArray(texts) || !targetLang) {
      return res.status(400).json({ error: "Invalid request. 'texts' (array) and 'targetLang' required." });
    }

    // 1. Hash all input texts
    const textHashes = texts.map(t => ({ original: t, hash: getHash(t) }));
    const hashes = textHashes.map(item => item.hash);

    // 2. Lookup existing translations in DB
    const cachedTranslations = await Translation.find({
      hash: { $in: hashes },
      targetLang: targetLang
    });

    const cacheMap = {};
    cachedTranslations.forEach(tr => {
      cacheMap[tr.hash] = tr.translatedText;
    });

    // 3. Identify texts that are NOT in cache
    const misses = textHashes.filter(item => !cacheMap[item.hash]);

    if (misses.length > 0) {
      const textsToTranslate = misses.map(m => m.original);

      try {
        // 4. Batch request to Langbly API (Google v2 compatible)
        const response = await axios.post("https://api.langbly.com/v2", {
          q: textsToTranslate,
          target: targetLang,
          format: "text"
        }, {
          headers: {
            "Authorization": `Bearer ${process.env.LANGLY_API_KEY}`,
            "Content-Type": "application/json"
          }
        });

        const translatedResults = response.data.data.translations;

        // 5. Save new translations to DB Cache
        const newDocPromises = translatedResults.map((tr, index) => {
          const original = textsToTranslate[index];
          const hash = getHash(original);
          
          // Add to map for the final response
          cacheMap[hash] = tr.translatedText;

          return Translation.findOneAndUpdate(
            { hash, targetLang },
            { originalText: original, translatedText: tr.translatedText, targetLang, hash },
            { upsert: true, new: true }
          );
        });

        await Promise.all(newDocPromises);

      } catch (apiError) {
        console.error("Langbly API Error:", apiError.response?.data || apiError.message);
        // Fallback: Use original text for misses if API fails
        misses.forEach(m => {
          cacheMap[m.hash] = m.original;
        });
      }
    }

    // 6. Return translations in original order
    const result = textHashes.map(item => cacheMap[item.hash]);

    res.json({ translations: result });

  } catch (error) {
    console.error("Translation Controller Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
