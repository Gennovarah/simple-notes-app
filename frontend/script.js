const API_URL = "http://13.53.201.163:5000";

const notesList = document.getElementById("notesList");
const noteForm = document.getElementById("noteForm");
const noteInput = document.getElementById("noteInput");

async function loadNotes() {
    try {
        const response = await fetch(`${API_URL}/notes`);

        if (!response.ok) {
            throw new Error("Failed to load notes");
        }

        const notes = await response.json();

        notesList.innerHTML = "";

        notes.forEach(note => {
            const noteElement = document.createElement("div");
            noteElement.className = "note";

            noteElement.innerHTML = `
                <span>${escapeHtml(note.text)}</span>
                <button onclick="deleteNote(${note.id})">Delete</button>
            `;

            notesList.appendChild(noteElement);
        });
    } catch (error) {
        console.error("Error loading notes:", error);
    }
}

async function addNote(event) {
    event.preventDefault();

    const text = noteInput.value.trim();

    if (!text) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/notes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text })
        });

        if (!response.ok) {
            throw new Error("Failed to add note");
        }

        noteInput.value = "";

        await loadNotes();
    } catch (error) {
        console.error("Error adding note:", error);
    }
}

async function deleteNote(id) {
    try {
        const response = await fetch(`${API_URL}/notes/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to delete note");
        }

        await loadNotes();
    } catch (error) {
        console.error("Error deleting note:", error);
    }
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

noteForm.addEventListener("submit", addNote);

loadNotes();