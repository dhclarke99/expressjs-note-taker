const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./public/assets/uuid')
// const api = require('./public/assets/js/index');
const PORT = process.env.PORT || 3001;

const app = express();

// Import custom middleware, "cLog"


// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/api', api);

app.use(express.static('public'));


// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    console.info(`${req.method} /api/notes`);

    fs.readFile('./db/db.json', "utf8", (err, data)=>{
        if (err) {
            console.error(err);
        } else {
            const notes = JSON.parse(data);

            return res.status(200).json(notes);

        }
    })
    
  });

  app.delete('/api/notes/:id', (req, res) => {
    console.info(`req params`, req.params.id);

    fs.readFile('./db/db.json', "utf8", (err, data)=>{
        if (err){
            console.error(err);
        } else {
    const notes = JSON.parse(data);
    const itemIndex = notes.findIndex(({id}) => id === req.params.id);
    if (itemIndex >= 0) {
        notes.splice(itemIndex, 1);
        fs.writeFile(
            './db/db.json',
            JSON.stringify(notes, null, 4),
            (writeErr) =>
            writeErr
             ? console.error(writeErr)
             : console.info('Successfully updated Notes!')
        );
    } else {
        res.status(200).json('error');
    }
}});
    
  });

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} /api/notes`);

    const { title, text } = req.body
    const newNote = {
        title,
        text,
        id: uuid(),
    };

    fs.readFile('./db/db.json', "utf8", (err, data)=>{
        if (err) {
            console.error(err);
        } else {
            const parsedNotes = JSON.parse(data);

            parsedNotes.push(newNote);

            fs.writeFile(
                './db/db.json',
                JSON.stringify(parsedNotes, null, 4),
                (writeErr) =>
                writeErr
                 ? console.error(writeErr)
                 : console.info('Successfully updated Notes!')
            );
        }
    });
    res.status(200).json('error');
  });

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);