const { json } = require('express');
const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;


fs.readFile('pets.json', 'utf8', (error, data) => {
    pets = JSON.parse(data);
app.get('/pets', (req, res) => {
        res.type('application/json');
        res.send(pets)
    })
    
    app.get('/pets/:petIndex', (req, res, next) => {
        let index = req.params.petIndex
        if (index === undefined || (index >= 0 && index < pets.length)) {
            res.status(200);
            res.type('application/json');
            res.send(pets[index]);
        } else {
            res.status(404);
            res.type('text/plain');
            res.send('Not Found');
        }
    })
})

app.listen(port, () => {
    console.log(`server is listening on port:${port}`);
})