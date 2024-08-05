if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressErrors = require("./util/ExpressError.js");
const port = 8080;
const Session = require("express-session");
const MongoStore = require('connect-mongo');
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const flash = require('connect-flash');

const dbUrl = process.env.MONGODB_URL;
//routes
const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");

main().then(()=>{
    console.log("Connected to database succesfully!");
    }).catch((error)=>{
        console.log(error);
    });

async function main(){
    mongoose.connect(dbUrl);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, ("/public"))));

//session
const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SESSION_SECRET,
    },
    touchAfter : 60*60*24*2,
})
const sessionOption = { 
    store,
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: true,
    cookie : {
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7,
        httpOnly : true,
    }}
app.use(Session(sessionOption));
app.use(flash());

//passport initization
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curUser = req.user ;
    next();
})

app.use("/listings", listingRoute);
app.use("/listings/:id/review", reviewRoute);
app.use("/", userRoute);

//home\\
app.get("/", (req, res) => {
    res.redirect("/listings");
});

//demo
app.get("/demouser",async (req, res) => {
    let fakeUser = new User({
        email : "testDrive@test", 
        username : "test user",
    })
    let result = await User.register(fakeUser, "helloWorld");
    console.log(result);
    res.send(result);
})

// page not found
app.all("*", (req, res, next) => {
    next(new ExpressErrors(404, "Page not found!"));
});


//error handler - middleware
app.use((err, req, res, next) => {
    const { status = 500 , message = "Something went wrong!" } = err;
    res.status(status).render("Error", {message});
});

app.listen(port, ()=>{
    console.log(`Listening at port ${port}`);
});
