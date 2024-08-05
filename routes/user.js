const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../util/wrapAsync.js");
const ExpressErrors = require("../util/ExpressError.js");
const passport = require("passport");
const { saveRedirectURL } = require("../middleware.js");
const { signupForm, createUser, logout, signInForm, signInUser } = require("../controller/user.js");

//signup route
router.route("/signup")
.get(signupForm)
.post(wrapAsync(createUser));


//logout
router.route("/logout")
.get(logout);


//login route
router.route("/login")
.get(signInForm)
.post(saveRedirectURL,passport.authenticate('local', { failureRedirect: '/login', failureFlash : true }), signInUser);


module.exports = router;
