// server/services/aiService.js

import axios from "axios";

const sendToAI = async (texts) => {
  try {
    const AI_URL = process.env.AI_SERVICE_URL;

    const response = await axios.post(`${AI_URL}/analyze`, {
      texts
    });

    return response.data.results;

  } catch (error) {
    console.error("AI Service Error:", error.message);
    throw new Error("AI service failed");
  }
};

export default sendToAI;