const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
        /* La fonction split permet de tout récupérer après l'espace dans le header (exclusion de bearer) */
       const token = req.headers.authorization.split(' ')[1];
       /* La fonction verify de jwt permet de décoder le token et voir s'il est valide */
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
       /* Extraction de l'ID utilisateur du token et ajout à l’objet Request afin de le rendre exploitable par nos routes */
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
    next();
   } catch(error) {
       res.status(401).json({ error });
   }
};