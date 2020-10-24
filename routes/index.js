var express    = require("express"),
    passport   = require("passport"),
    User       = require("../models/user");

var router = express.Router();

router.get("/", function(req,res){
	res.render("landing");
})

//Authenticate
//Register
router.get("/register",function(req,res){
	res.render("register",{page:"register"});
})

router.post("/register", function(req,res){
	User.register(new User(
		{
			username:req.body.username,
			isAdmin: req.body.adminCode === "adm!n?*_123"?true:false,
		}),req.body.password)
	.then(() => passport.authenticate("local")(req,res,function(){
		req.flash("success", "Sign Up successfully");
		res.redirect("/words");
	}))
	.catch(err => {
		console.log(err.message)
		req.flash("error", err.message);
		res.redirect("/register");
	})
})

//Login
router.get("/login", function(req,res){
	if(req.query.fail){
		req.flash("error", "User or password wrong...");
		res.redirect("/login");
	} else{
		res.render("login",{page:"login"});
	}
})

router.post("/login", passport.authenticate("local",{
	successRedirect:"/words?successLogin=true",
	failureRedirect:"/login?fail=true"
	}), function(req,res){
});

router.get("/logout",function(req,res){
	req.logout();
	req.flash("success", "Log out successfully, Good bye");
	res.redirect("/");
})

module.exports = router;