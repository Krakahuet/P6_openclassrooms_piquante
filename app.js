/* import d'express  */
const express = require('express');
const app = express();

/* import de mongoose */
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/users');

/* connexion de mongoose à la base de données mongoDB */
mongoose.connect('mongodb+srv://spolit:MFQZxVYYkDaFTRES@cluster0.tivsjeo.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

app.use(express.json());
app.use(bodyParser.json());


/* export du fichier app.js afin de pouvoir l'utiliser dans d'autres */
module.exports = app;