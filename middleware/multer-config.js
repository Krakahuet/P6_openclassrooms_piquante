const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  /* La fonction destination indique à multer d'enregistrer les fichiers dans le dossier images */
  destination: (req, file, callback) => {
    callback(null, 'Images');
  },
  filename: (req, file, callback) => {
    /* Nom d'origine du fichier en remplaçant les espace par des _ */
    const name = file.originalname.split(' ').join('_');
    /* Construction de l'extension à partir du mime_types d'origine du fichier */
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

/* Export de l'élément multer avec storage en constante.
La méthode single crée un middleware qui capture les fichiers d'un certain type (passé en argument)
et les enregistre au système de fichiers du serveur à l'aide du storage configuré. */
module.exports = multer({storage: storage}).single('image');