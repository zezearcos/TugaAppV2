var express        = require("express"),
    bodyParser     = require("body-parser"),
 	mongoose       = require("mongoose"),
 	passport       = require("passport"),
 	localStrategy  = require("passport-local"),
 	expressSession = require("express-session"),
 	methodOverride = require("method-override"),
 	flash          = require("connect-flash"),
	User           = require("./models/user"),
	Brand          = require("./models/brand"),
	Unit          = require("./models/unit"),
	Invalid          = require("./models/invalid"),
	Prohibit          = require("./models/prohibit"),
	Superlative          = require("./models/superlative");

//Routes
var indexRoutes      = require("./routes/index"),
    wordRoutes       = require("./routes/words"),
	brandRoutes       = require("./routes/brands"),
	unitRoutes       = require("./routes/units"),
	invalidRoutes       = require("./routes/invalids"),
	prohibitRoutes       = require("./routes/prohibits"),
	superlativeRoutes       = require("./routes/superlatives");

var app = express();

//Connect BD
mongoose.connect('mongodb://localhost/tuga_app_v2', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(expressSession({
	secret:"cognizant app portuguese team",
	resave:false,
	saveUninitialized:false
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.success     = req.flash("success");
	res.locals.error       = req.flash("error");
	next();
});

app.use(indexRoutes);
app.use("/words", wordRoutes);
app.use("/brands", brandRoutes);
app.use("/units", unitRoutes);
app.use("/prohibits", prohibitRoutes);
app.use("/superlatives", superlativeRoutes);
app.use("/invalids", invalidRoutes);

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("Server start...");
})