const Ganisrael = require('../models/ganisrael')
const Review = require('../models/review');

module.exports.createReview = async(req, res) => {
    const ganisrael = await Ganisrael.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    ganisrael.reviews.push(review);
    await review.save();
    await ganisrael.save();
    req.flash('success', 'Created new review')
    res.redirect(`/ganisraels/${ganisrael._id}`);

}

module.exports.deleteReview = async(req, res) => {
    const { id, reviewId } = req.params;
    await Ganisrael.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'successfuly deleted woooohhooohohoho')
    res.redirect(`/ganisraels/${id}`)
}