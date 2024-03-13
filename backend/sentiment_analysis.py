from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification

# Load pre-trained model and tokenizer outside the request handler function for efficiency
tokenizer = DistilBertTokenizer.from_pretrained("distilbert-base-uncased-finetuned-sst-2-english")
model = DistilBertForSequenceClassification.from_pretrained("distilbert-base-uncased-finetuned-sst-2-english")

# Define the Flask app outside the request handler function
app = Flask(__name__)

CORS(app, origins=["http://localhost:5173"])  # Allow requests from React app

def analyze_text(text):
    """
    Analyzes a given text paragraph or page, returning aggregated sentiment
    and potentially stopping early if sentiment is strongly positive or negative.

    Args:
        text (str): The text to be analyzed.
    Returns:
        dict: A dictionary containing the following keys:
            - num_positive: The number of positive sentences.
            - num_negative: The number of negative sentences.
            - aggregated_sentiment: The aggregated sentiment ("POSITIVE" or "NEGATIVE").
            - is_partial (bool): Whether the analysis stopped early due to strong sentiment.
    """

    positive_count = 0
    negative_count = 0
    analyzed_sentences = 0

    # Split text into sentences
    sentences = text.split(".")

    for sentence in sentences:
        if not sentence.strip():
            continue  # Skip empty sentences

        analyzed_sentences += 1

        # Tokenize and convert to tensors
        inputs = tokenizer(sentence, return_tensors="pt")

        # Run model inference with no gradient calculation
        with torch.no_grad():
            logits = model(**inputs).logits

        # Get predicted class and convert to label
        predicted_class_id = logits.argmax().item()
        label = model.config.id2label[predicted_class_id]

        if label == "POSITIVE":
            positive_count += 1
        elif label == "NEGATIVE":
            negative_count += 1


    # Determine aggregated sentiment
    if positive_count > negative_count:
        aggregated_sentiment = "POSITIVE"
    elif negative_count > positive_count:
        aggregated_sentiment = "NEGATIVE"
    else:
        aggregated_sentiment = "NEUTRAL"

    return {
        "num_positive": positive_count,
        "num_negative": negative_count,
        "aggregated_sentiment": aggregated_sentiment,

    }

@app.route('/analyze', methods=['POST'])
def handle_analysis_request():
    """
    Handles POST requests from the React app, performs sentiment analysis,
    and returns the results as JSON.
    """

    try:
        # Get the text data from the request body
        data = request.get_json()
        text = data.get('text')

        if not text:
            return jsonify({'error': 'Missing "text" field in request body'}), 400

        # Perform sentiment analysis
        result = analyze_text(text)
        return jsonify(result), 200

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
