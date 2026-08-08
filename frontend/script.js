const API_URL = "http://13.53.201.163:5000";

async function loadNotes() {
    try {
        const response = await fetch(`${API_URL}/notes`);

        if (!response.ok) {
            throw new Error(`Failed to load notes: ${response.status}`);
        }

        const notes = await response.json();

        const notesList = document.getElementById("notes-list");

        if (!notesList) {
            console.error("Element with id 'notes-list' was not found.");
            return;
        }

        notesList.innerHTML = "";

        notes.forEach(note => {
            const noteItem = document.createElement("li");

            noteItem.className = "note";

            noteItem.innerHTML = `
                <span>${escapeHtml(note.text)}</span>
                <button onclick="deleteNote(${note.id})">
                    Delete
                </button>
            `;

            notesList.appendChild(noteItem);
        });

    } catch (error) {
        console.error("Error loading notes:", error);
    }
}


async function addNote() {
    const input = document.getElementById("note-input");

    if (!input) {
        console.error("Element with id 'note-input' was not found.");
        return;
    }

    const text = input.value.trim();

    if (!text) {
        alert("Please enter a note.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/notes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to add note: ${response.status}`);
        }

        input.value = "";

        await loadNotes();

    } catch (error) {
        console.error("Error adding note:", error);
        alert("Could not add note. Please try again.");
    }
}


async function deleteNote(id) {
    try {
        const response = await fetch(`${API_URL}/notes/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error(`Failed to delete note: ${response.status}`);
        }

        await loadNotes();

    } catch (error) {
        console.error("Error deleting note:", error);
        alert("Could not delete note. Please try again.");
    }
}


function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}


document.addEventListener("DOMContentLoaded", () => {
    loadNotes();
});