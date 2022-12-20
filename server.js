const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const util = require("util");
const readFromFile = util.promisify(fs.readFile);
const writeToFile = util.promisify(fs.writeFile);
const getNotes = () => {
  return readFromFile("db/db.json", "utf-8").then((rawNotes) =>
    [].concat(JSON.parse(rawNotes))
  );
};
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  getNotes()
    .then((notes) => res.json(notes))
    .catch((err) => res.status(500).json(err));
});
app.post("/api/notes", (req, res) => {
  getNotes().then((oldNotes) => {
    var newArray = [
      ...oldNotes,
      { title: req.body.title, text: req.body.text, id: uuidv4() },
    ];
    writeToFile("db/db.json", JSON.stringify(newArray))
      .then(() => res.json({ msg: "okay" }))
      .catch((err) => res.status(500).json(err));
  });
});
//app.delete("/api/notes/:id", (req, res) => {});
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
