import fetchNews from "../services/fetchNews.js";
import sendToAI from "../services/aiService.js";
import generateAIData from "../services/aiGenerator.js";
import generateSummary from "../services/geminiSummary.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const analyzeTopic = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const cleanTopic = topic.toLowerCase().trim();

    let articles;

    // 🔥 SMART ROUTING
    if (cleanTopic.includes("vs") || cleanTopic.split(" ").length > 1) {
      console.log("Using AI-generated data...");
      articles = await generateAIData(topic);
    } else {
      console.log("Using News API...");
      articles = await fetchNews(topic);
    }

    // ⚠️ Safety fallback (never let it break)
    if (!articles || articles.length === 0) {
      console.log("Using fallback data...");
      const filePath = path.join(__dirname, "../data/sampleData.json");
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      articles = data["default"];
    }

    // 🔹 Sentiment Analysis
    const aiResponse = await sendToAI(articles);

    // 🔹 AI Summary
    const summary = await generateSummary(aiResponse);

    // 🔹 Keyword Extraction
    const wordCount = {};

    aiResponse.forEach(r => {
      r.text.split(" ").forEach(w => {
        w = w.toLowerCase().replace(/[^a-z]/g, "");
        if (w.length > 3) {
          wordCount[w] = (wordCount[w] || 0) + 1;
        }
      });
    });

    const keywords = Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(k => k[0]);

    // 🔥 FINAL RESPONSE
    res.json({
      topic,
      total: aiResponse.length,
      summary,
      keywords,
      results: aiResponse
    });

  } catch (error) {
    console.error("Error in analyzeTopic:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};