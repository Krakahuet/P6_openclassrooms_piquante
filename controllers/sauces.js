/* import du schéma de données des sauces (dossier models fichier Sauces) */
const sauce = require('../models/Sauces');

/* Création et enregistrement (save) d'une sauce dans la base de données */
exports.createSauce = (req, res, next) => {
  const sauce = new sauce({
    userId: req.body.userId,
    manufacturer: req.body.manufacturer,
    description: req.body.description,
    mainPepper: req.body.mainPepper,
    imageUrl: req.body.imageUrl,
    heat: req.body.heat,
    likes: req.body.likes,
    dislikes: req.body.dislikes,
    userslikes: req.body.userslikes,
    usersdislikes: req.body.usersdislikes, 
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
  sauce.findOne({
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
  const sauce = new sauce ({
    _id: req.params.id,
    userId: req.body.userId,
    manufacturer: req.body.manufacturer,
    description: req.body.description,
    mainPepper: req.body.mainPepper,
    imageUrl: req.body.imageUrl,
    heat: req.body.heat,
    likes: req.body.likes,
    dislikes: req.body.dislikes,
    userslikes: req.body.userslikes,
    usersdislikes: req.body.usersdislikes, 
  });
  sauce.updateOne({_id: req.params.id}, sauce).then(
    () => {
      res.status(201).json({
        message: 'Sauce modifiée avec succès !'
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

/* Suppression d'une sauce dans la base de données */
exports.deleteSauce = (req, res, next) => {
  sauce.deleteOne({_id: req.params.id}).then(
    () => {
      res.status(200).json({
        message: 'Sauce supprimée !'
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

/* Affichage de l'ensemble des sauces présentes dans la base de données */
exports.getAllSauces = (req, res, next) => {
  sauce.find().then(
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