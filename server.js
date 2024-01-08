const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;

//middleware for static assets 
app.use(express.json());
app.use(express.static('public'));

// get request to return the notes.html file 

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// get request to return the index.html file

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// get and post resquests to read and save the added notes

app.get('/api/notes', (req, res) => {

    res.json(`${req.method}`)
});

app.post('/api/notes', (req, res) => {

    console.info(`${req.method}`);

    // deconstructing the bd.json properties

    const { title, text } = req.body;

    if (title && text) {

        const savedNotes = {
            title,
            text
        };

        // get the existing notes from the db.json file

        fs.readFile('./db/db.json', 'utf-8', (err, data) => {
            if (err) {
                console.error(err);
            } else {

                const parsedNotes = JSON.parse(data);

                parsedNotes.push(savedNotes);


                // write the updated notes from the front end

                fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4), (writeErr) =>
                    writeErr
                        ? console.error(writeErr)
                        : console.info('Successfully updated notes')
                );
            }
        });

        const finalNote = {
            status: 'Success!',
            body: savedNotes,
        }

        console.log(finalNote); 
        res.status(201).json(finalNote); 
    } else {
        res.status(500).json('Error in adding note');
    }

    });


    app.listen(port, () => {
        console.log(`App listening on http://localhost:${port}`);
    });

