const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

/* schéma de données qui contient les champs souhaités pour chaque utilisateur (méthode Schema de mongoose) */
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

/* mongoose-unique-validator  améliore les messages d'erreur lors de l'enregistrement de données uniques */
userSchema.plugin(uniqueValidator);

/* La méthode model transforme ce modèle en un modèle utilisable */
module.exports = mongoose.model('User', userSchema);