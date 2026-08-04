from flask import Flask, jsonify, request

app = Flask(__name__)

# Temporary storage for notes
notes = []


@app.route("/")
def home():
    return "Simple Notes API is running!"


@app.route("/health")
def health():
    return jsonify({"status": "healthy"})


@app.route("/notes", methods=["GET"])
def get_notes():
    return jsonify(notes)


@app.route("/notes", methods=["POST"])
def add_note():
    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({"error": "Note text is required"}), 400

    note = {
        "id": len(notes) + 1,
        "text": data["text"]
    }

    notes.append(note)

    return jsonify(note), 201


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
    