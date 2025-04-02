const express = require('express');
const { removeBgImage } = require('../controllers/ImageController');
const upload = require('../middlewares/multer').upload;;
const authUser=require('../middlewares/auth').authUser;

const imageRouter = express.Router();

imageRouter.post('/remove-bg', upload.single('image'), authUser, removeBgImage);

module.exports = imageRouter;
