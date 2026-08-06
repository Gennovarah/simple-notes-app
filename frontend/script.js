const API_URL = "https://simple-notes-app-ovh6.onrender.com";

async function loadNotes() {
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
}

async function addNote() {
    const input = document.getElementById("note-input");
    const text = input.value.trim();

    if (!text) {
        alert("Please enter a note.");
        return;
    }

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
}

async function deleteNote(id) {
    await fetch(`${API_URL}/notes/${id}`, {
        method: "DELETE"
    });

    loadNotes();
}

window.onload = loadNotes;