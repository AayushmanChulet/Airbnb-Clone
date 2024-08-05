const Listing = require("./models/listing.js");
const ExpressErrors = require("./util/ExpressError.js");
const { listingSchema , reviewSchema } = require("./Schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectURL = req.originalUrl;
        req.flash("error", "you must be signned in to manipulate listing!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectURL = (req, res, next)=>{
    if(req.session.redirectURL){
        res.locals.redirectURL = req.session.redirectURL ;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    const { id }= req.params;
    const listing = await Listing.findById(id);
    if(!(listing.owner.equals(res.locals.curUser._id) && res.locals.curUser)){
        req.flash("error", "You don't have permission to update listing!");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId }= req.params;
    const review = await Review.findById(reviewId);
    if(!(review.author.equals(res.locals.curUser._id) && res.locals.curUser)){
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMessage = error.details.map((el) => el.message).join(",");
        throw new ExpressErrors(400, errMessage);
    }else{
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if(error){
        let errMessage = error.details.map((el)=> el.message).join(",");
        throw new ExpressErrors(400, errMessage);
    }else{
        next();
    }
}