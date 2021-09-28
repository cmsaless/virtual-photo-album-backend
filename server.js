require('dotenv').config('./.env');
const cors = require('cors');

const DatabaseService = require('./services/databaseService');

const express = require('express')

const app = express()
const port = 4444;

const databaseService = new DatabaseService();

app.use(cors());

app.get('/hello', (req, res) => {
    res.send('hello world')
});

app.get('/config', (req, res) => {
    console.log(process.env.DB_HOST);
    res.send(process.env.DB_HOST);
});

app.get('/SearchForAlbum', (req, res) => {

    let searchValue = req.query['searchValue'];

    databaseService.searchForAlbum(searchValue).then(retval => {
        res.send(retval);
    });
});

app.listen(port);