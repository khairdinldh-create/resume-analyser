from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
import pytesseract
from pdf2image import convert_from_bytes
import io
import os
import json
from dotenv import load_dotenv
import anthropic

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

claude = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

POPPLER_PATH = r"C:\Users\msi\Desktop\Release-24.08.0-0\Library\bin"

def extract_text(file):
    text = ""
    file_bytes = file.read()

    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""

    if not text.strip():
        print("No text found, trying OCR...")
        images = convert_from_bytes(file_bytes, poppler_path=POPPLER_PATH)
        for img in images:
            text += pytesseract.image_to_string(img)

    return text.strip()


@app.route("/")
def home():
    return "Backend is running"


@app.route("/upload", methods=["POST"])
def upload_file():
    try:
        file = request.files.get("resume")

        if not file:
            return jsonify({"error": "No file uploaded"}), 400

        text = extract_text(file)

        if not text:
            return jsonify({"error": "Could not extract text from PDF"}), 400

        response = claude.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=1000,
            messages=[
                {
                    "role": "user",
                    "content": f"""
You are an HR expert. Analyze this CV and return JSON with exactly these keys:
{{
  "score": number between 0-100,
  "strengths": ["..."],
  "weaknesses": ["..."],
  "suggestions": ["..."]
}}
Return JSON only, no markdown, no extra text.

CV:
{text}
"""
                }
            ]
        )

        clean = response.content[0].text.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        result = json.loads(clean)
        return jsonify({"analysis": result})

    except Exception as e:
        print(f"ERROR: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5000, debug=True)