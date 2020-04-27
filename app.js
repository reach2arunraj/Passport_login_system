const express= require ("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport")


//Passport Config
require("./config/passport")(passport);    

// DB Config
const db = require("./config/keys").MongoURI;

//Connect Mongo
mongoose.connect(db, {useNewUrlParser:true, useUnifiedTopology: true })
.then(()=> console.log("Mongoo DB Connected..."))
.catch(err => console.log(err))

//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

//Bodyparser
app.use(express.urlencoded ({extended:false}));

//Express Session MiddleWare
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }));

  //Passport Middlewar

  app.use(passport.initialize());
  app.use(passport.session());

  //Connect Flash
  app.use(flash());

  //Global Variables
  app.use((req,res,next)=>{
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
  })

// Routes
app.use("/", require("./routes/index"))
app.use("/users", require("./routes/users"))


const PORT = process.env.PORT || 3000
app.listen(PORT , console.log (`Server is listining in ${PORT}`))