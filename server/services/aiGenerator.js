import axios from "axios";

const generateAIData = async (topic) => {
    try {
        const response = await axios.post(
            // Use 'gemini-3-flash-preview' for the v1beta endpoint
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: `Generate 10 short realistic public opinions (mix positive, negative, neutral) about: ${topic}`
                            }
                        ]
                    }
                ]
            }
        );
        const text =
            response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const lines = text.split("\n");

        return lines
            // ❗ remove ONLY the intro line
            .filter(line => !line.toLowerCase().startsWith("here are"))

            // remove numbering like "1. "
            .map(line => line.replace(/^\d+[\).\s-]*/, "").trim())

            // keep valid lines only
            .filter(line => line.length > 10);

        return text
            .split("\n")
            .map(line => line.replace(/^\d+[\).\s-]*/, "").trim())
            .filter(line => line.length > 10);

    } catch (err) {
        const code = err.response?.data?.error?.code;

        if (code === 429) {
            console.log("Gemini quota exceeded → using fallback");
        }

        return [
            `${topic} is getting attention`,
            `People have mixed opinions about ${topic}`,
            `Some support ${topic}, others criticize it`,
            `There are pros and cons of ${topic}`,
            `Public reaction is divided on ${topic}`
        ];
    }
};

export default generateAIData;