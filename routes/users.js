const express = require ("express")
const router = express.Router();
const bcrypt = require("bcryptjs")
const passport = require("passport")

//User model
const User = require("../models/User");

//Login Page
router.get("/login", (req,res) => res.render("login"));

// Register Page
router.get("/register", (req,res) => res.render("register"));




//Register Handler
router.post("/register", (req,res) =>{
    const { name, email, password, password2 } = req.body;
    let errors = [];

    //check required fields filled
    if (!name || !email || !password || !password2 ){
        errors.push({msg:"Please fill in all fields"})
    } 
    // Check Password Match
    if (password !== password2){
        errors.push({msg:"Password dosen't Matches"})
    }
    // check Password Length
    if(password.length<6){
        errors.push({msg:"Password should be atleast six character"})
    }
    if (errors.length>0){
        res.render("register", {
            errors,
            name,
            email,
            password,
            password2 
        })
    }else{
        // Validation Pass
        User.findOne({email:email})
        .then(user => {
            if(user){
                //User Exist
                errors.push({msg:"user email is already registerred"})
                res.render("register", {
                    errors,
                    name,
                    email,
                    password,
                    password2 
                })
            }else{
                const newUser = new User({
                    name,
                    email,
                    password
                })
                // Hash password
                bcrypt.genSalt(10, (err, salt)=>{
                    bcrypt.hash(newUser.password, salt, (err, hash)=>{
                        if(err) throw err
                        //Set Password to Hash
                        newUser.password = hash;
                        // Save the suer
                        newUser.save()
                        .then(user => {
                            req.flash("success_msg", "you are now registered and can login");
                            res.redirect("/users/login");
                        })
                        .catch(err => console.log(err))
                    })
                })
            }
        })
        .catch(); 
    }
}); 

// Login Handle 
router.post("/login", (req,res,next)=>{
    passport.authenticate("local", {
        successRedirect: "/dashboard", 
        failureRedirect:"/users/login",
        failureFlash : true
    })(req,res,next);
});

//Logout Handler
router.get("/logout", (req,res) =>{
    req.logOut();
    req.flash("success_msg", "you are logged out");
    res.redirect("/users/login");
})

module.exports = router