const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")

const listingSchema = new Schema({
    title : {
        type : String, 
        required : true,
    }, 
    description : String, 
    image : {
        url : String,
        filename : String,
    }, 
    price : Number, 
    location : {
        type : String,
        required : true,
    }
    ,
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    country : String, 
    review : [{
        type : Schema.Types.ObjectId,
        ref : "reviews",
    }],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "user",
    },
    category : {
        type : String,
        enum : ['Trending', 'Amazing_pools', 'Farms', 'Iconic_cities', 'Mountains', 'Beaches', 'Castle', 'Artic', 'Camping', 'Play', 'Dome']
    },
})

listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing){
        await Review.deleteMany({_id : {$in : listing.review}});
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;