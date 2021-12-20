const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')
const Ganisrael = require('../models/ganisrael')
const Review = require('../models/review');
const reviews = require('../controllers/reviews')
const ExpressError = require('../helpers/ExpressError')
const catchAsync = require('../helpers/wrapAsync')



router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;