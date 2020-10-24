var express    = require("express"),
    Brand      = require("../models/brand"),
    middleware = require("../middleware");

var router = express.Router();

router.get("/", function(req,res){
	var perPage = 25;
	var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
	
	if(req.query.search){
		
		var regex = middleware.formatText(req.query.search);	
		
		Brand.find({$or:[{name:regex},{abbreviation:regex},{comment:regex}]}).skip((perPage * pageNumber) - perPage).limit(perPage).exec()
		.then(allBrands => {
			Brand.find({$or:[{name:regex},{abbreviation:regex},{comment:regex}]}).count().exec()
			.then(count => {
				res.render("brands/brands", {
                    brands: allBrands,
                    current: pageNumber,
					page:"brands",
					search:req.query.search,
                    pages: Math.ceil(count / perPage)
                });
			})
			.catch(err => console.log(err.message));
		})
		.catch(err => console.log(err.message));		
	} else{
		Brand.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec()
		.then(allBrands => {
			Brand.count().exec()
			.then(count => {
				res.render("brands/brands", {
                    brands: allBrands,
                    current: pageNumber,
					page:"brands",
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

	req.body.brand.author = {
		id: req.user._id,
		username: req.user.username
	}

	Brand.create(req.body.brand)
	.then(() => {
		req.flash("success", "Brand created");
		res.redirect("/brands");
	})
	.catch(err => {
		req.flash("error", "Error create brand");
		console.log(err.message)
	})
})

router.get("/new", middleware.isLoggedIn, function(req,res){
	res.render("brands/new");
})

router.get("/:id/edit", function(req,res){
	Brand.findById(req.params.id)
	.then(foundBrand => {
		if(!foundBrand){
			req.flash("error", "Brand not found");
			return res.redirect("back");
		}
		
		res.render("brands/edit", {brand:foundBrand})
	})
	.catch(err =>{
		req.flash("error", "Brand not found" + err.message);
		return res.redirect("back");
	});
})

router.put("/:id", middleware.isLoggedIn, function(req,res){
	Brand.findById(req.params.id)
	.then(brandFound => {
		if(!brandFound){
			console.log(err.message);
			req.flash("error", "Error edit brand");
			res.redirect("/brands");
		}
		
		Brand.findByIdAndUpdate(req.params.id,req.body.brand)
		.then(() => {
			req.flash("success", "Brand edited");
			res.redirect("/brands")
		})
		.catch(err => {
			console.log(err.message);
			req.flash("error", "Error edit brand");
			res.redirect("/brands");
		})		
	})
	.catch(err => {
		console.log(err.message);
		req.flash("error", "Error edit brand");
		res.redirect("/brands");
	})	
})

router.delete("/:id", middleware.isLoggedIn, function(req,res){
	Brand.findByIdAndRemove(req.params.id)
	.then(() => {
		req.flash("success", "Brand deleted");
		res.redirect("/brands")	
  	})
  	.catch(err => {
		console.log(err.message);
		req.flash("error", "Error trying delete brand");
		res.redirect("/brands")
  	})		  	
})

module.exports = router;