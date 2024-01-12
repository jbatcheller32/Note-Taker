const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./public/helpers/uuid')
const notes = require('./db/db.json');
const { prototype } = require('module');
const app = express();
const PORT = process.env.PORT || 3001;

//middleware for static assets 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// get request to return the notes.html file 

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});


// GET request for the /api/notes route

app.get('/api/notes', (req, res) => res.status(201).json(notes));


// POST resquest to read and save the added notes then send to the client


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

        fs.readFile('./db/db.json', 'utf-8', (err, data) => {
            if (err) {
                console.error(err);
            } else {

                const parsedNotes = JSON.parse(data);

                parsedNotes.push(savedNotes);


                // write the updated notes from the front end
                fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4), (writeError) => {
                    if (writeError) {
                        console.error(writeError);
                        res.status(500).json('Error in updating notes');
                    } else {
                        console.info('Successfully updated notes');

                        // Update the 'notes' variable with the latest data
                        notes.push(savedNotes);

                        const finalNote = {
                            status: 'Success!',
                            body: savedNotes,
                        };
                        console.log(finalNote);
                        res.status(201).json(finalNote);
                    }
                });
            }
        });
    } else {
        res.status(500).json('Error in adding note');
    }
});
                



// get request to return the index.html file

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});


// server spin up 



app.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`);
});

