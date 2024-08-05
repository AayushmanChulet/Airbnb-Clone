const User = require("../models/user")


module.exports.signupForm = (req, res) => {
    res.render("user/signup.ejs");
};

module.exports.createUser = async (req, res, next) => {
    try{
        let {email , username, password} = req.body;
        let newUser = new User({email, username});
        let result = await User.register(newUser, password);
        console.log(result);
        req.login(result, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to AirBnb");
            res.redirect("/listings");
        })
        
    }catch (err){
        console.log(err);
        req.flash("error", err.message);
        res.redirect("/signup");
    }  
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "logged you out!");
        res.redirect('/listings');
    });
};

module.exports.signInForm =  (req, res) => {
    res.render("user/login.ejs");
};

module.exports.signInUser = (req, res) => {
    req.flash("success", "Welcome to airBnb");
    let redirectUrl = res.locals.redirectURL || "/listings";
    res.redirect(redirectUrl);
};