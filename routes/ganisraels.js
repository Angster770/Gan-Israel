const express = require('express');
const router = express.Router();
const ganisraels = require('../controllers/ganisraels')
const catchAsync = require('../helpers/wrapAsync')
const { isLoggedIn, isAuthor, validateGanisrael } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.route('/')
    .get(catchAsync(ganisraels.index))
    .post(isLoggedIn, upload.array('image'), validateGanisrael, catchAsync(ganisraels.createGanisrael))


router.get('/new', isLoggedIn, ganisraels.renderNewForm);

router.route('/:id')
    .get(catchAsync(ganisraels.showGanisrael))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateGanisrael, catchAsync(ganisraels.updateGanisrael))
    .delete(isLoggedIn, isAuthor, catchAsync(ganisraels.deleteGanisrael))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(ganisraels.renderEditForm));



module.exports = router;