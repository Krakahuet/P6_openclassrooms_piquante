/* import d'express  */
const express = require('express');


/* import de mongoose */
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/users');

const app = express();
/* connexion de mongoose à la base de données mongoDB */
mongoose.connect('mongodb+srv://spolit:MFQZxVYYkDaFTRES@cluster0.tivsjeo.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

/* Express prend toutes les requêtes qui ont comme Content-Type application/json
et met à disposition leur body directement sur l'objet req, 
ce qui nous permet d'écrire le middleware POST suivant */
app.use(express.json());

/* CORS => Ces headers permettent :
d'accéder à notre API depuis n'importe quelle origine ( '*' ),
d'ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With...),
d'envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.). */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

/* Début générique des routes pour les sauces et l'authentification */
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);


app.use(bodyParser.json());


/* export de la constante app afin de pouvoir l'utiliser dans d'autres */
module.exports = app;