const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../util/wrapAsync.js");
const { validateListing, isLoggedIn , isOwner} = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer  = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//index route\\
router.get("/", wrapAsync(listingController.index));

//new listing\\
router.route("/new")
.get(isLoggedIn , listingController.renderNewForm)
.post(isLoggedIn,upload.single('listing[image]'), validateListing, wrapAsync(listingController.createNewListing));



router.route("/:id")
.get(wrapAsync(listingController.renderListing ))
.put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

//update listing form
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.renderUpdateForm));

module.exports = router;
