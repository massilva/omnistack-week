const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();
const dbUrl = 'mongodb+srv://massilva:gratis@cluster0-bo5ev.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(express.json());
app.use(routes);
app.listen(3333);
