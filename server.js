const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./public/helpers/uuid')
const notes = require('./db/db.json');
const app = express();
const port = 3001;

//middleware for static assets 
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));

// get request to return the notes.html file 

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => res.status(201).json(notes));

// get request to return the index.html file

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// get and post resquests to read and save the added notes



   

app.post('/api/notes', (req, res) => {

    console.info(`${req.method}`);

    // deconstructing the bd.json properties

    const { title, text } = req.body;

    if (title && text) {

        const savedNotes = {
            title,
            text, 
            id: uuid(),
        };

        // get the existing notes from the db.json file

       readAndAppend(savedNotes, './db/db.json'); 
       res.json('Note Successfully Added!');  
    } else {
        res.status(500).json('Error in adding note');
    }

});




app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
});




















// const finalNote = {
//     status: 'Success!',
//     body: savedNotes,
// }
// console.log(finalNote);
//         res.status(201).json(finalNote);



// fs.readFile('./db/db.json', 'utf-8', (err, data) => {
//     if (err) {
//         console.error(err);
//     } else {

//         const parsedNotes = JSON.parse(data);

//         parsedNotes.push(savedNotes);


//         // write the updated notes from the front end

//         fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4), (writeError) =>
//             writeError
//                 ? console.error(writeError)
//                 : console.info('Successfully updated notes')
//         );
//     }
// });
