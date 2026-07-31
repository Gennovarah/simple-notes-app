from flask import Flask, send_from_directory
import os

app = Flask(__name__)

FRONTEND_FOLDER = os.path.join(os.path.dirname(__file__), "..", "frontend")


@app.route("/")
def home():
    return send_from_directory(FRONTEND_FOLDER, "index.html")


@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(FRONTEND_FOLDER, path)


@app.route("/health")
def health():
    return {
        "status": "healthy"
    }


if __name__ == "__main__":
    app.run(debug=True)