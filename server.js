//Establishing the dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');

//Setting the asynchronous processes
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

//Setting up the express server
const app = express();
const port = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//Setting up the static Middleware
app.use(express.static('public'));


// Setting up the API routes

//GET route
app.get("/api/notes", (req, res) => {
  readFileAsync("./db/db.json", "utf8").then((data) => {
    notes = [].concat(JSON.parse(data))
    res.json(notes);
  })
});


//POST route
app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  readFileAsync("./db/db.json", "utf8").then((data) => {
    const notes = [].concat(JSON.parse(data));
    newNote.id = notes.length + 1;
    notes.push(newNote);
    return notes;
  }).then((notes) => {
    writeFileAsync("./db/db.json", JSON.stringify(notes))
    res.json(newNote);
  })
});

//DELETE route
app.delete("/api/notes/:id", (req, res) => {
  const deleteId = req.params.id;
  readFileAsync("./db/db.json", "utf8").then((data) => {
    const notes = [].concat(JSON.parse(data));
    const newNotesData = notes.filter((note) => note.id != deleteId);
    return newNotesData;
  }).then((notes) => {
    writeFileAsync("./db/db.json", JSON.stringify(notes))
    res.json(notes);
  })
});

//Routes to the HTML pages
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});


//Starting the server, use nodemon server.js to start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});