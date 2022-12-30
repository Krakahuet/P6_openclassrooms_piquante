const mongoose = require('mongoose');

/* schéma de données qui contient les champs souhaités pour chaque sauce (méthode Schema de mongoose) */
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    usersLiked: { type: [String], required: true },
    usersDisliked: { type: [String], required: true }, 
});
/* La méthode model transforme ce modèle en un modèle utilisable */
module.exports = mongoose.model('Sauce', sauceSchema);