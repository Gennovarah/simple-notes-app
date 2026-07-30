const input = document.getElementById("noteInput");
const button = document.getElementById("addButton");
const list = document.getElementById("noteList");

button.addEventListener("click", function () {

    const note = input.value;

    if (note === "") {
        alert("Please enter a note.");
        return;
    }

    const item = document.createElement("li");

const deleteButton = document.createElement("button");

deleteButton.textContent = "Delete";

deleteButton.onclick = function () {
    item.remove();
};

item.textContent = note + " ";

item.appendChild(deleteButton);

list.appendChild(item);

input.value = "";

});