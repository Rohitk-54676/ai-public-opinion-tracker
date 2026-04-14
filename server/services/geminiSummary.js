import axios from "axios";

const generateSummary = async (results) => {
  try {
    if (!results || results.length === 0) return "No data available to summarize.";

    const text = results.map(r => r.text || r).join("\n");

    const response = await axios.post(
      // Ensure the model matches the generator for consistency
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: `Summarize public opinion briefly based on these comments:\n${text}` }]
          }
        ]
      }
    );

    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No summary available";

  } catch (err) {
    console.error("Gemini Summary ERROR:", err.response?.data || err.message);
    return "Summary not available";
  }
};

export default generateSummary;