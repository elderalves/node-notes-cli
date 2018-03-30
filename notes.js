const fs = require("fs");

const logNote = note => {
  debugger;
  console.log("--");
  console.log(`Title: ${note.title}`);
  console.log(`Body: ${note.body}`);
};

const fetchNotes = () => {
  try {
    var notesString = fs.readFileSync("notes-data.json");
    return JSON.parse(notesString);
  } catch (e) {
    return [];
  }
};
const saveNotes = notes => {
  fs.writeFileSync("notes-data.json", JSON.stringify(notes));
};

const addNote = (title, body) => {
  var notes = fetchNotes();

  var note = {
    title,
    body
  };

  var duplicateNotes = notes.filter(note => note.title === title);

  if (duplicateNotes.length === 0) {
    notes.push(note);
    saveNotes(notes);
    return note;
  }
};

const getAll = () => {
  return fetchNotes();
};

const getNote = title => {
  let notes = fetchNotes();
  let note = notes.filter(note => note.title === title);
  return note;
};

const removeNote = title => {
  var notes = fetchNotes();
  var newNotes = notes.filter(note => note.title !== title);
  saveNotes(newNotes);

  return newNotes.length !== notes.length;
};

module.exports = {
  addNote,
  getAll,
  getNote,
  removeNote,
  logNote
};
