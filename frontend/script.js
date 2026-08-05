const apiUrl = "http://localhost:5000/notes";

async function loadNotes() {
    const response = await fetch(apiUrl);
    const notes = await response.json();

    const notesList = document.getElementById("notes-list");
    notesList.innerHTML = "";

    notes.forEach(note => {
        const li = document.createElement("li");

        li.innerHTML = `
            ${note.text}
            <button onclick="deleteNote(${note.id})">
                Delete
            </button>
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

    await fetch(apiUrl, {
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

// NEW FUNCTION
async function deleteNote(id) {
    await fetch(`${apiUrl}/${id}`, {
        method: "DELETE"
    });

    loadNotes();
}

window.onload = loadNotes;