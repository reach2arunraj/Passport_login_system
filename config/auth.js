module.exports = {
    ensureAuthenticated: function (req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error_msg", "Please loggin in to the view this resource ");
        res.redirect("/users/login");
    }
} 