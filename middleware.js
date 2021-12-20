const { ganisraelSchema, reviewSchema } = require('./schemas.js')
const ExpressError = require('./helpers/ExpressError');
const Ganisrael = require('./models/ganisrael');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed in');
        return res.redirect('/login')
    }
    next();
}

module.exports.validateGanisrael = (req, res, next) => {
    const { error } = ganisraelSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const ganisrael = await Ganisrael.findById(id);
    if (!ganisrael.author.equals(req.user._id)) {
        req.flash('error', 'You dont have permission to do that');
        return res.redirect(`/ganisraels/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You dont have permission to do that');
        return res.redirect(`/ganisraels/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    console.log(error)
    if (error) {
        console.log(error)
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}