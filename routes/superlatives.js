var express    = require("express"),
    Superlative       = require("../models/superlative"),
    middleware = require("../middleware");

var router = express.Router();

router.get("/", function(req,res){
	
	var perPage = 25;
	var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
	
	if(req.query.search){
		
		var regex = middleware.formatText(req.query.search);	
		
		Superlative.find({$or:[{name:regex},{example:regex},{comment:regex}]}).skip((perPage * pageNumber) - perPage).limit(perPage).exec()
		.then(allSuperlatives => {
			Superlative.find({$or:[{name:regex},{example:regex},{comment:regex}]}).count().exec()
			.then(count => {
				res.render("superlatives/superlatives", {
                    superlatives: allSuperlatives,
                    current: pageNumber,
					page:"superlatives",
					search:req.query.search,
                    pages: Math.ceil(count / perPage)
                });
			})
			.catch(err => console.log(err.message));
		})
		.catch(err => console.log(err.message));		
	} else{
		Superlative.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec()
		.then(allSuperlatives => {
			Superlative.count().exec()
			.then(count => {
				res.render("superlatives/superlatives", {
                    superlatives: allSuperlatives,
                    current: pageNumber,
					page:"superlatives",
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

	req.body.superlative.author = {
		id: req.user._id,
		username: req.user.username
	}

	Superlative.create(req.body.superlative)
	.then(() => {
		req.flash("success", "Superlative created");
		res.redirect("/superlatives");
	})
	.catch(err => {
		req.flash("error", "Error create superlative");
		console.log(err.message)
	})
})

router.get("/new", middleware.isLoggedIn, function(req,res){
	res.render("superlatives/new");
})

router.get("/:id/edit", function(req,res){
	Superlative.findById(req.params.id)
	.then(foundSuperlative => {
		if(!foundSuperlative){
			req.flash("error", "Superlative not found");
			return res.redirect("back");
		}
		
		res.render("superlatives/edit", {superlative:foundSuperlative})
	})
	.catch(err =>{
		req.flash("error", "Superlative not found" + err.message);
		return res.redirect("back");
	});
})

router.put("/:id", middleware.isLoggedIn, function(req,res){
	Superlative.findById(req.params.id)
	.then(superlativeFound => {
		if(!superlativeFound){
			console.log(err.message);
			req.flash("error", "Error edit superlative");
			res.redirect("/superlatives");
		}
		
		Superlative.findByIdAndUpdate(req.params.id,req.body.superlative)
		.then(() => {
			req.flash("success", "Superlative edited");
			res.redirect("/superlatives")
		})
		.catch(err => {
			console.log(err.message);
			req.flash("error", "Error edit superlative");
			res.redirect("/superlatives");
		})		
	})
	.catch(err => {
		console.log(err.message);
		req.flash("error", "Error edit superlative");
		res.redirect("/superlatives");
	})	
})

router.delete("/:id", middleware.isLoggedIn, function(req,res){
	Superlative.findByIdAndRemove(req.params.id)
	.then(() => {
		req.flash("success", "Superlative deleted");
		res.redirect("/superlatives")	
  	})
  	.catch(err => {
		console.log(err.message);
		req.flash("error", "Error trying delete superlative");
		res.redirect("/superlatives")
  	})		  	
})

module.exports = router;