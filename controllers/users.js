const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

exports.signup = (req, res, next) => {
    /* La fonction de hachage de bcrypt permet de « saler » le mot de passe 10 fois. */
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        /* Création et enregistrement d'un utilisateur, succès : code 201, échec : code 400 */
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        /* Recherche de l'adresse mail dans la base de données */
        .then(user => {
            /* S'il n'y est pas : message d'erreur */
            if (user === null) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            } else {
                /* S'il y est : comparaison des mdp */
                bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    /* Si le mdp fourni par le front n'est pas le bon : message d'erreur */
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    /* Si le mdp fourni par le front est bon : génération du token de connexion */
                    res.status(200).json({
                        userId: user._id,
                        /* Chiffrement de la clé secrète et attribution d'une durée de vie au token*/
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));   
            }
        })
        .catch(error => res.status(500).json({ error }));
    };