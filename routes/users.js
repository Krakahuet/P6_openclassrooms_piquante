const express = require('express');
/* création d'un router avec express */
const router = express.Router();

const userCtrl = require('../controllers/users');

/* liste des routes concernant la gestion utilisateur */
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;