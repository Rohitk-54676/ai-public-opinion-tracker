from flask import Flask, request, jsonify
from flask_cors import CORS
from sentiment.analyzer import analyze_sentiments
import os
app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
def home():
    return "AI Service Running"

@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.get_json()
        texts = data.get("texts", [])

        if not texts:
            return jsonify({"error": "No texts provided"}), 400

        results = analyze_sentiments(texts)

        return jsonify({"results": results})

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": "AI processing failed"}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)