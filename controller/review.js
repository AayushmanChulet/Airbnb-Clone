const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview =await new Review(req.body.review);
    newReview.author = req.user._id;
    listing.review.push(newReview);
    await listing.save();
    await newReview.save();
    req.flash("success","review added!!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyReview = async (req, res) => {
    const {id, reviewId} =  req.params;
    await Listing.findByIdAndUpdate(id,{$pull : {review : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted!!");
    res.redirect(`/listings/${id}`);
}