const titleOptions = {
  describe: "Title of note",
  demand: true,
  alias: "t"
};

const bodyOptions = {
  describe: "Body of note",
  demand: true,
  alias: "b"
};

const argDocs = yargs => {
  return yargs
    .command("add", "Add a new note", {
      title: titleOptions,
      body: bodyOptions
    })
    .command("list", "List all notes")
    .command("read", "Read a note", {
      title: titleOptions
    })
    .command("remove", "Remove a note", {
      title: titleOptions
    })
    .help().argv;
};

console.log("testing the app");
console.log("testing again");
console.log("testing again 2");

module.exports = {
  argDocs
};
