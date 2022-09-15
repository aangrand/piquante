const express = require('express');
const User = require('./models/user.js');
var mongoose = require('mongoose');

const app = express();

mongoose.connect(`mongodb+srv://root:7ONOAhtdIrHJC1RP@cluster000.hdagdvk.mongodb.net`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.post('/api/user', (req, res, next) => {
    delete req.body._id;
    const user = new User({
        ...req.body
    });
    console.log("coucou")
    user.save()
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