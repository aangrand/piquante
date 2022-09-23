const express = require('express');
const User = require('./models/user.js');
const Sauce = require('./models/Sauce.js');
const dotenv = require("dotenv").config();

var mongoose = require('mongoose');

const app = express();

mongoose.connect(process.env.MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


app.post('/api/sauce', (req, res, next) => {
    console.log("coucou")
    const sauce = new Sauce({
        ...req.body
    });
    console.log(parse(req.body))
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
});

app.use((req, res) => {
    res.json({ message: 'Votre requête a bien été reçue !' });
});



// app.get('/api/user/:id', (req, res, next) => {
//     User.findOne({ _id: req.params.id })
//         .then(user => res.status(200).json(user))
//         .catch(error => res.status(404).json({ error }));
// });

module.exports = app;