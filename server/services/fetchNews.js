import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fetchNews = async (topic) => {
  try {
    const API_KEY = process.env.NEWS_API_KEY;

    const formattedTopic = topic.replace(/\s+/g, " AND ");

    const url = `https://newsapi.org/v2/everything?q="${formattedTopic}"&language=en&sortBy=relevancy&pageSize=10&apiKey=${API_KEY}`;

    const response = await axios.get(url);

    const articles = response.data.articles;

    return articles
      .filter(a =>
        a.title &&
        a.title.toLowerCase().includes(topic.split(" ")[0])
      )
      .map(a => a.title)
      .slice(0, 10);

  } catch (error) {
    console.log("API failed, using fallback data...");

    // Correct fallback path
    const filePath = path.join(__dirname, "../data/sampleData.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const key = topic.toLowerCase();

    return data[key] || data["default"];
  }
};

export default fetchNews;