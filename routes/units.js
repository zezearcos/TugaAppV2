var express    = require("express"),
    Unit       = require("../models/unit"),
    middleware = require("../middleware");

var router = express.Router();

router.get("/", function(req,res){
	
	var perPage = 25;
	var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
	
	if(req.query.search){
		
		var regex = middleware.formatText(req.query.search);	
		
		Unit.find({$or:[{name:regex},{symbol:regex},{comment:regex}]}).skip((perPage * pageNumber) - perPage).limit(perPage).exec()
		.then(allUnits => {
			Unit.find({$or:[{name:regex},{symbol:regex},{comment:regex}]}).count().exec()
			.then(count => {
				res.render("units/units", {
                    units: allUnits,
                    current: pageNumber,
					page:"units",
					search:req.query.search,
                    pages: Math.ceil(count / perPage)
                });
			})
			.catch(err => console.log(err.message));
		})
		.catch(err => console.log(err.message));		
	} else{
		Unit.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec()
		.then(allUnits => {
			Unit.count().exec()
			.then(count => {
				res.render("units/units", {
                    units: allUnits,
                    current: pageNumber,
					page:"units",
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

	req.body.unit.author = {
		id: req.user._id,
		username: req.user.username
	}

	Unit.create(req.body.unit)
	.then(() => {
		req.flash("success", "Unit of measure created");
		res.redirect("/units");
	})
	.catch(err => {
		req.flash("error", "Error create unit of measure");
		console.log(err.message)
	})
})

router.get("/new", middleware.isLoggedIn, function(req,res){
	res.render("units/new");
})

router.get("/:id/edit", function(req,res){
	Unit.findById(req.params.id)
	.then(foundUnit => {
		if(!foundUnit){
			req.flash("error", "Unit of measure not found");
			return res.redirect("back");
		}
		
		res.render("units/edit", {unit:foundUnit})
	})
	.catch(err =>{
		req.flash("error", "Unit of measure not found" + err.message);
		return res.redirect("back");
	});
})

router.put("/:id", middleware.isLoggedIn, function(req,res){
	Unit.findById(req.params.id)
	.then(unitFound => {
		if(!unitFound){
			console.log(err.message);
			req.flash("error", "Error edit unit of measure");
			res.redirect("/units");
		}
		
		Unit.findByIdAndUpdate(req.params.id,req.body.unit)
		.then(() => {
			req.flash("success", "Unit of measure edited");
			res.redirect("/units")
		})
		.catch(err => {
			console.log(err.message);
			req.flash("error", "Error edit unit of measure");
			res.redirect("/units");
		})		
	})
	.catch(err => {
		console.log(err.message);
		req.flash("error", "Error edit unit of measure");
		res.redirect("/units");
	})	
})

router.delete("/:id", middleware.isLoggedIn, function(req,res){
	Unit.findByIdAndRemove(req.params.id)
	.then(() => {
		req.flash("success", "Unit of measure deleted");
		res.redirect("/units")	
  	})
  	.catch(err => {
		console.log(err.message);
		req.flash("error", "Error trying delete unit of measure");
		res.redirect("/units")
  	})		  	
})

module.exports = router;