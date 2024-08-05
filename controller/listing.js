const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//index page
module.exports.index = async(req, res)=>{
    const allListings = await Listing.find({});
    res.render("listing/index", {allListings});
};

//new listing page 
module.exports.renderNewForm = (req, res) => {
    res.render("listing/new");
  };

module.exports.createNewListing = async (req, res) => {
    const result = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()
    const filename = req.file.filename;
    const url = req.file.path;
    const listingDetails = req.body.listing;
    const addListing = new Listing(listingDetails);
    addListing.owner = req.user._id;
    addListing.image = { url , filename };
    addListing.geometry = result.body.features[0].geometry;
    await addListing.save();
    console.log(addListing);
    req.flash("success","Listing created!!");
    res.redirect("/listings");
  };

// render particular listing
module.exports.renderListing =  async (req, res)=>{
    const {id} = req.params;
    const user = await Listing.findById(id).populate({path : "review", populate : {
        path : "author",
    }}).populate("owner");
    if(!user){
        req.flash("error", "Page you are looking for doesn't exists!");
        res.redirect("/listings");
    }
    console.log(req.user);
    res.render("listing/show", {user});
};

//handles updates 
module.exports.renderUpdateForm = async (req, res) => {
    const { id } = req.params;
    const user = await Listing.findById(id);
    if(!user){
        req.flash("error", "Page you are looking for doesn't exists!");
        res.redirect("/listings/");
    }
    let originalUrl = user.image.url;
    originalUrl = originalUrl.replace("/upload/", "/upload/h_250,w_300/")
    res.render("listing/edit", {user , originalUrl});
};
    
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined"){
        const filename = req.file.filename;
        const url = req.file.path;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success","Listing Updated!!");
    res.redirect("/listings");
};

//delete a listing
module.exports.deleteListing =  async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted!!");
    res.redirect("/listings");
};