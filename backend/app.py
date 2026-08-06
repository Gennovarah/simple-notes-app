from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Store notes in memory
notes = []

# Counter to ensure every note has a unique ID
next_id = 1


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
    global next_id

    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({"error": "Note text is required"}), 400

    note = {
        "id": next_id,
        "text": data["text"]
    }

    notes.append(note)
    next_id += 1

    return jsonify(note), 201


@app.route("/notes/<int:note_id>", methods=["DELETE"])
def delete_note(note_id):
    global notes

    notes = [note for note in notes if note["id"] != note_id]

    return jsonify({"message": "Note deleted"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)