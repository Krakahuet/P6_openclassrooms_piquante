/* import du schéma de données des sauces (dossier models fichier Sauces) */
const Sauce = require('../models/Sauces');

const fs = require('fs');

/* Création et enregistrement (save) d'une sauce dans la base de données */
exports.createSauce = (req, res, next) => {
  /* Le front envoie des données sous forme "form-data" qu'il faut convertir en JSON à l'aide de la méthode parse */
  const sauceObject = JSON.parse(req.body.sauce);
  /* Suppresion de l'id généré par mongodb et de l'userid en provenance de la requête */
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
    ...sauceObject,
    /* Récupération du userId à partir d'auth pour être sûr qu'on ait le bon utilisateur associé à la bonne sauce */
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/Images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [], 
  });
  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Sauce enregistrée avec succès !'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

/* Recherche d'une sauce dans la base de données */
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (thing) => {
      res.status(200).json(thing);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

/* Modification et enregistrement (updateOne) d'une sauce dans la base de données */
exports.modifySauce = (req, res, next) => {
  /* Est-ce que la requête contient un fichier ? */
  const sauceObject = req.file ? {
    /* Si l'image est présente on la traite */
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/Images/${req.file.filename}`
    /* Si non on traite seulement le corps de la requête */
} : { ...req.body };

delete sauceObject._userId;
/* Nous utilisons l'ID que nous recevons pour accéder à la sauce correspondant */
Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
      /* On compare le userId de l'utilisateur connecté à celui présent dans l'objet sauce présent en base.
      S'ils sont différents => Erreur, s'ils sont identiques => modification validée */
        if (sauce.userId != req.auth.userId) {
          res.status(403).json({message: "unauthorized request."});
        } else {
            Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
            .then(() => res.status(200).json({message : 'Sauce modifiée !'}))
            .catch(error => res.status(401).json({ error }));
        }
    })
    .catch((error) => {
        res.status(400).json({ error });
    });
};

/* Suppression d'une sauce dans la base de données */
exports.deleteSauce = (req, res, next) => {
  /* Nous utilisons l'ID que nous recevons pour accéder à la sauce correspondant */
  Sauce.findOne({ _id: req.params.id})
  .then(sauce => {
      /* On compare le userId de l'utilisateur connecté à celui présent dans l'objet sauce présent en base.
      S'ils sont différents => Erreur, s'ils sont identiques => suppression validée */
      if (sauce.userId != req.auth.userId) {
          res.status(403).json({message: "unauthorized request."});
      } else {
          const filename = sauce.imageUrl.split('/Images/')[1];
          /* La fonction unlink du package fs supprime ce fichier, en lui passant le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé */
          fs.unlink(`Images/${filename}`, () => {
              Sauce.deleteOne({_id: req.params.id})
                  .then(() => { res.status(200).json({message: 'Sauce supprimée !'})})
                  .catch(error => res.status(401).json({ error }));
          });
      }
  })
  .catch( error => {
      res.status(500).json({ error });
  });
};

/* Affichage de l'ensemble des sauces présentes dans la base de données */
exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
        if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
          sauce.updateOne(
            { _id: req.params.id, 
              $inc: {likes: 1}, 
              $push: {usersLiked: req.body.userId},
            })
          .then(() => res.status(200).json({message : 'Vous aimez cette sauce !'}))
          .catch( error => {
            res.status(400).json({ error });
          });
        }

        if (!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
          sauce.updateOne(
            { _id: req.params.id, 
              $inc: {dislikes: 1}, 
              $push: {usersDisliked: req.body.userId},
            })
          .then(() => res.status(200).json({message : 'Vous aimez cette sauce !'}))
          .catch( error => {
            res.status(400).json({ error });
          });
        }

        if (sauce.usersLiked.includes(req.body.userId) && req.body.like === 0) {
          sauce.updateOne(
            { _id: req.params.id, 
              $inc: {likes: -1},
              $pull: {usersLiked: req.body.userId},
            })
          .then(() => res.status(200).json({message : "Vous n'aimez plus cette sauce ?!"}))
          .catch( error => {
            res.status(400).json({ error });
          });
        }

        if (sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0) {
          sauce.updateOne(
            { _id: req.params.id, 
              $inc: {dislikes: -1},
              $pull: {usersDisliked: req.body.userId},
            })
          .then(() => res.status(200).json({message : "Vous n'aimez plus cette sauce ?!"}))
          .catch( error => {
            res.status(400).json({ error });
          });
        }
    })
  .catch( error => {
      res.status(400).json({ error });
  });
};

