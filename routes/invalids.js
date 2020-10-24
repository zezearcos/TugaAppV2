var express    = require("express"),
    Invalid       = require("../models/invalid"),
    middleware = require("../middleware");

var router = express.Router();

router.get("/", function(req,res){
	
	var perPage = 25;
	var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
	
	if(req.query.search){
		
		var regex = middleware.formatText(req.query.search);	
		
		Invalid.find({$or:[{website:regex},{category:regex},{comment:regex}]}).skip((perPage * pageNumber) - perPage).limit(perPage).exec()
		.then(allInvalids => {
			Invalid.find({$or:[{website:regex},{category:regex},{comment:regex}]}).count().exec()
			.then(count => {
				res.render("invalids/invalids", {
                    invalids: allInvalids,
                    current: pageNumber,
					page:"invalids",
					search:req.query.search,
                    pages: Math.ceil(count / perPage)
                });
			})
			.catch(err => console.log(err.message));
		})
		.catch(err => console.log(err.message));		
	} else{
		Invalid.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec()
		.then(allInvalids => {
			Invalid.count().exec()
			.then(count => {
				res.render("invalids/invalids", {
                    invalids: allInvalids,
                    current: pageNumber,
					page:"invalids",
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

	req.body.invalid.author = {
		id: req.user._id,
		username: req.user.username
	}

	Invalid.create(req.body.invalid)
	.then(() => {
		req.flash("success", "Invalid page created");
		res.redirect("/invalids");
	})
	.catch(err => {
		req.flash("error", "Error create invalid page");
		console.log(err.message)
	})
})

router.get("/new", middleware.isLoggedIn, function(req,res){
	res.render("invalids/new");
})

router.get("/:id/edit", function(req,res){
	Invalid.findById(req.params.id)
	.then(foundInvalid => {
		if(!foundInvalid){
			req.flash("error", "Invalid page not found");
			return res.redirect("back");
		}
		
		res.render("invalids/edit", {invalid:foundInvalid})
	})
	.catch(err =>{
		req.flash("error", "Invalid page not found" + err.message);
		return res.redirect("back");
	});
})

router.put("/:id", middleware.isLoggedIn, function(req,res){
	Invalid.findById(req.params.id)
	.then(invalidFound => {
		if(!invalidFound){
			console.log(err.message);
			req.flash("error", "Error edit invalid page");
			res.redirect("/invalids");
		}
		
		Invalid.findByIdAndUpdate(req.params.id,req.body.invalid)
		.then(() => {
			req.flash("success", "Invalid page edited");
			res.redirect("/invalids")
		})
		.catch(err => {
			console.log(err.message);
			req.flash("error", "Error edit invalid page");
			res.redirect("/invalids");
		})		
	})
	.catch(err => {
		console.log(err.message);
		req.flash("error", "Error edit invalid page");
		res.redirect("/invalids");
	})	
})

router.delete("/:id", middleware.isLoggedIn, function(req,res){
	Invalid.findByIdAndRemove(req.params.id)
	.then(() => {
		req.flash("success", "Invalid page deleted");
		res.redirect("/invalids")	
  	})
  	.catch(err => {
		console.log(err.message);
		req.flash("error", "Error trying delete invalid page");
		res.redirect("/invalids")
  	})		  	
})

module.exports = router;