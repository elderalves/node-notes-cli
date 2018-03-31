# Node Notes CLI

This a simple CLI APP made on top of NODE.js that simulates a note taking app.

### Getting Start

Run the command `--help` to see the commands

```sh
$ node app.js --help
Commands:
  app.js add     Add a new note
  app.js list    List all notes
  app.js read    Read a note
  app.js remove  Remove a note

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

### Using the commands

* Adding a new note use `--title` to insert the title and `--body` to insert the content:

```sh
$ node app.js add --title "New Note" --body "This is my brand new note"
```

* List all saved notes:

```sh
$ node app.js list
```

* Read a single note, use `--title` to make the search:

```sh
$ node app.js read --title "New Note"  
```

* Remove a single note, use `--title` to make the search:

```sh
$ node app.js remove --title "New Note"
```
