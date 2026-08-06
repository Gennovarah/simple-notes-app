const API_URL = "https://simple-notes-app-backend-v736.onrender.com";

async function loadNotes() {
    try {
        const response = await fetch(`${API_URL}/notes`);
        const notes = await response.json();

        const notesList = document.getElementById("notes-list");
        notesList.innerHTML = "";

        notes.forEach(note => {
            const li = document.createElement("li");

            li.innerHTML = `
                ${note.text}
                <button onclick="deleteNote(${note.id})">Delete</button>
            `;

            notesList.appendChild(li);
        });
    } catch (error) {
        console.error("Error loading notes:", error);
    }
}

async function addNote() {
    const input = document.getElementById("note-input");
    const text = input.value.trim();

    if (!text) {
        alert("Please enter a note.");
        return;
    }

    try {
        await fetch(`${API_URL}/notes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text
            })
        });

        input.value = "";
        loadNotes();
    } catch (error) {
        console.error("Error adding note:", error);
    }
}

async function deleteNote(id) {
    try {
        await fetch(`${API_URL}/notes/${id}`, {
            method: "DELETE"
        });

        loadNotes();
    } catch (error) {
        console.error("Error deleting note:", error);
    }
}

window.onload = loadNotes;