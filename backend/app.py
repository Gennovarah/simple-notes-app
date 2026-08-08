import os

import psycopg2
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


def get_db_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "db"),
        database=os.getenv("DB_NAME", "notesdb"),
        user=os.getenv("DB_USER", "notesuser"),
        password=os.getenv("DB_PASSWORD"),
    )


@app.route("/")
def home():
    return "Simple Notes API is running!"


@app.route("/health")
def health():
    try:
        conn = get_db_connection()
        conn.close()
        return jsonify({
            "status": "healthy",
            "database": "connected"
        })
    except Exception:
        return jsonify({
            "status": "unhealthy",
            "database": "disconnected"
        }), 503


@app.route("/notes", methods=["GET"])
def get_notes():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id, text FROM notes ORDER BY id"
    )

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    notes = [
        {
            "id": row[0],
            "text": row[1]
        }
        for row in rows
    ]

    return jsonify(notes)


@app.route("/notes", methods=["POST"])
def add_note():
    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({
            "error": "Note text is required"
        }), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO notes (text) VALUES (%s) RETURNING id, text",
        (data["text"],)
    )

    row = cursor.fetchone()

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "id": row[0],
        "text": row[1]
    }), 201


@app.route("/notes/<int:note_id>", methods=["DELETE"])
def delete_note(note_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM notes WHERE id = %s",
        (note_id,)
    )

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "message": "Note deleted"
    }), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)