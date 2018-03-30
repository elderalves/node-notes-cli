// Core modules
const fs = require("fs");

// vendor modules
const _ = require("lodash");
const yargs = require("yargs");

// local modules
const notes = require("./notes.js");
const { argDocs } = require("./helpers/argDocs");

const argv = argDocs(yargs);

let command = argv._[0];

switch (command) {
  case "add":
    let noteAdded = notes.addNote(argv.title, argv.body);
    if (note) {
      console.log("Note created");
      notes.logNote(note);
    } else {
      console.log("Note title taken");
    }
    break;
  case "list":
    let allNotes = notes.getAll();
    console.log(`Printing ${allNotes.length} note(s)`);
    allNotes.forEach(note => notes.logNote(note));
    break;
  case "read":
    let note = notes.getNote(argv.title);
    if (note.length > 0) {
      console.log("Note found");
      notes.logNote(note);
    } else {
      console.log("Note not found");
    }
    break;
  case "remove":
    let noteRemoved = notes.removeNote(argv.title);
    let message = noteRemoved ? "Note was removed" : "Note not found";
    console.log(message);
  default:
    console.log("Command not recognized");
}
