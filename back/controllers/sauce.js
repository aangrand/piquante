const fs = require('fs');
const sauce = require('../models/sauce');

//Récuperation de toutes les sauces 
//http://localhost:3000/api/sauces/

exports.getAllSauces = (req, res, next) => {
    sauce.find()
        .then(Sauce => res.status(200).json(Sauce))
        .catch(error => res.status(400).json({ error }));
};

// Récuperation d'une sauce 
//http://localhost:3000/api/sauces/6352d509cfb76ca1c04e58cc

exports.getOneSauce = (req, res, next) => {
    console.log(req.params.id, " getOne")
    sauce.findOne({ _id: req.params.id })
        .then((Sauce) => { res.status(200).json(Sauce); })
        .catch(error => res.status(404).json({ error }));
};

// Creation d'une sauce {json}

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const newSauce = new sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [''],
        usersDisliked: ['']
    });
    newSauce.save()
        .then(() => res.status(201).json({ message: 'Nouvelle sauce insérée avec succès !' }))
        .catch(error => res.status(400).json({ error }));
};

// Mise a jour d'une sauce {sauce}

exports.updateSauce = (req, res, next) => {
    if (req.file) {
        sauce.findOne({ _id: req.params.id })
            .then(newSauce => {
                const last_filename = newSauce.imageUrl.split('/images/')[1];
                fs.unlink('images/' + last_filename, () => { });
            })
            .catch(error => console.log('Echec de la suppression de l\'ancienne image.'));
    }
    setTimeout(() => {
        const sauceObject = req.file ? {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
        sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet modifié !' }))
            .catch(error => res.status(400).json({ error }));
    }, 250);
};

// suppression d'une sauce

exports.deleteSauce = (req, res, next) => {
    sauce.findOne({ _id: req.params.id })
        .then(newSauce => {
            const filename = newSauce.imageUrl.split('/images/')[1];
            fs.unlink('images/' + filename, () => {
                sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

//systeme de like/dislike

exports.likeSauce = (req, res, next) => {

    let i = 0;
    let tabLikes = [''];
    let tabDislikes = [''];
    let liked = 0;
    let unliked = 0;
    let type_like = req.body.like;
    let user_id = req.body.userId;

    console.log('\nid =', req.params.id)
    console.log('like type =', req.body.like)
    sauce.findOne({ _id: req.params.id })
        .then(newSauce => {
            let indiceLike = 0
            let indiceDislike = 0
            switch (type_like) {
                case 1:
                    if (newSauce.usersLiked.includes(req.body.userId)) {
                        res.status(401).json({ error: 'Sauce déja liké' });
                    }
                    else {
                        sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
                            .then((newSauce) => res.status(200).json({ message: 'Like ajouté !' }))
                            .catch(error => res.status(400).json({ error }))
                    }
                    break;

                case -1:
                    if (newSauce.usersDisliked.includes(req.body.userId)) {
                        res.status(401).json({ error: 'Sauce déja disliké' });
                    }
                    else {
                        sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } })
                            .then((newSauce) => res.status(200).json({ message: 'Dislike ajouté !' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                    break;

                case 0:
                    if (newSauce.usersLiked.includes(req.body.userId)) {
                        sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                            .then((newSauce) => { res.status(200).json({ message: 'Like supprimé !' }) })
                            .catch(error => res.status(400).json({ error }));
                    }
                    else if (newSauce.usersDisliked.includes(req.body.userId)) {
                        sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                            .then((newSauce) => { res.status(200).json({ message: 'Dislike supprimé !' }) })
                            .catch(error => res.status(400).json({ error }));
                    }
                    break;

                default:
                    console.log('error case')
            }
            console.log('liked =', liked)
            console.log('like end')
        })
        .catch(error => res.status(500).json({ error }));
}; 