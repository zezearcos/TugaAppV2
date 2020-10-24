var express    = require("express"),
    Prohibit       = require("../models/prohibit"),
    middleware = require("../middleware");

var router = express.Router();

router.get("/", function(req,res){
	
	var perPage = 25;
	var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
	
	if(req.query.search){
		
		var regex = middleware.formatText(req.query.search);	
		
		Prohibit.find({$or:[{name:regex},{example:regex},{comment:regex}]}).skip((perPage * pageNumber) - perPage).limit(perPage).exec()
		.then(allProhibits => {
			Prohibit.find({$or:[{name:regex},{example:regex},{comment:regex}]}).count().exec()
			.then(count => {
				res.render("prohibits/prohibits", {
                    prohibits: allProhibits,
                    current: pageNumber,
					page:"prohibits",
					search:req.query.search,
                    pages: Math.ceil(count / perPage)
                });
			})
			.catch(err => console.log(err.message));
		})
		.catch(err => console.log(err.message));		
	} else{
		Prohibit.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec()
		.then(allProhibits => {
			Prohibit.count().exec()
			.then(count => {
				res.render("prohibits/prohibits", {
                    prohibits: allProhibits,
                    current: pageNumber,
					page:"prohibits",
					search:"",
                    pages: Math.ceil(count / perPage)
                });
			})
			.catch(err => console.log(err.message));
		})
		.catch(err => console.log(err.message));	
	}
})

router.post("/", middleware.isLoggedIn, function(req,res){

	req.body.prohibit.author = {
		id: req.user._id,
		username: req.user.username
	}

	Prohibit.create(req.body.prohibit)
	.then(() => {
		req.flash("success", "Prohibit created");
		res.redirect("/prohibits");
	})
	.catch(err => {
		req.flash("error", "Error create prohibit");
		console.log(err.message)
	})
})

router.get("/new", middleware.isLoggedIn, function(req,res){
	res.render("prohibits/new");
})

router.get("/:id/edit", function(req,res){
	Prohibit.findById(req.params.id)
	.then(foundProhibit => {
		if(!foundProhibit){
			req.flash("error", "Prohibit not found");
			return res.redirect("back");
		}
		
		res.render("prohibits/edit", {prohibit:foundProhibit})
	})
	.catch(err =>{
		req.flash("error", "Prohibit not found" + err.message);
		return res.redirect("back");
	});
})

router.put("/:id", middleware.isLoggedIn, function(req,res){
	Prohibit.findById(req.params.id)
	.then(prohibitFound => {
		if(!prohibitFound){
			console.log(err.message);
			req.flash("error", "Error edit prohibit");
			res.redirect("/prohibits");
		}
		
		Prohibit.findByIdAndUpdate(req.params.id,req.body.prohibit)
		.then(() => {
			req.flash("success", "Prohibit edited");
			res.redirect("/prohibits")
		})
		.catch(err => {
			console.log(err.message);
			req.flash("error", "Error edit prohibit");
			res.redirect("/prohibits");
		})		
	})
	.catch(err => {
		console.log(err.message);
		req.flash("error", "Error edit prohibit");
		res.redirect("/prohibits");
	})	
})

router.delete("/:id", middleware.isLoggedIn, function(req,res){
	Prohibit.findByIdAndRemove(req.params.id)
	.then(() => {
		req.flash("success", "Prohibit deleted");
		res.redirect("/prohibits")	
  	})
  	.catch(err => {
		console.log(err.message);
		req.flash("error", "Error trying delete prohibit");
		res.redirect("/prohibits")
  	})		  	
})

module.exports = router;