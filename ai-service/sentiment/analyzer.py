import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

# Download once
nltk.download('vader_lexicon')

sia = SentimentIntensityAnalyzer()

def analyze_sentiments(texts):
    results = []

    for text in texts:
        score = sia.polarity_scores(text)
        compound = score['compound']

        if compound >= 0.05:
            sentiment = "positive"
        elif compound <= -0.05:
            sentiment = "negative"
        else:
            sentiment = "neutral"

        results.append({
            "text": text,
            "sentiment": sentiment,
            "score": compound
        })

    return results