var express    = require("express"),
    Word       = require("../models/word"),
    middleware = require("../middleware");

var router = express.Router();

router.get("/", function(req,res){
	if(req.query.successLogin){
		req.flash("success", "Welcome "+req.user.username);
		return res.redirect("/words");
	}
	
	var perPage = 25;
	var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
	
	if(req.query.search){
		
		var regex = middleware.formatText(req.query.search);	
		
		Word.find({$or:[{portuguese:regex},{brazilian:regex},{abbreviation:regex},{comment:regex}]}).skip((perPage * pageNumber) - perPage).limit(perPage).exec()
		.then(allWords => {
			Word.find({$or:[{portuguese:regex},{brazilian:regex},{abbreviation:regex},{comment:regex}]}).count().exec()
			.then(count => {
				res.render("words/words", {
                    words: allWords,
                    current: pageNumber,
					page:"words",
					search:req.query.search,
                    pages: Math.ceil(count / perPage)
                });
			})
			.catch(err => console.log(err.message));
		})
		.catch(err => console.log(err.message));		
	} else{
		Word.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec()
		.then(allWords => {
			Word.count().exec()
			.then(count => {
				res.render("words/words", {
                    words: allWords,
                    current: pageNumber,
					page:"words",
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

	req.body.word.author = {
		id: req.user._id,
		username: req.user.username
	}

	Word.create(req.body.word)
	.then(() => {
		req.flash("success", "Word created");
		res.redirect("/words");
	})
	.catch(err => {
		req.flash("error", "Error create word");
		console.log(err.message)
	})
})

router.get("/new", middleware.isLoggedIn, function(req,res){
	res.render("words/new");
})

router.get("/:id/edit", function(req,res){
	Word.findById(req.params.id)
	.then(foundWord => {
		if(!foundWord){
			req.flash("error", "Word not found");
			return res.redirect("back");
		}
		
		res.render("words/edit", {word:foundWord})
	})
	.catch(err =>{
		req.flash("error", "Word not found" + err.message);
		return res.redirect("back");
	});
})

router.put("/:id", middleware.isLoggedIn, function(req,res){
	Word.findById(req.params.id)
	.then(wordFound => {
		if(!wordFound){
			console.log(err.message);
			req.flash("error", "Error edit word");
			res.redirect("/words");
		}
		
		Word.findByIdAndUpdate(req.params.id,req.body.word)
		.then(() => {
			req.flash("success", "Word edited");
			res.redirect("/words")
		})
		.catch(err => {
			console.log(err.message);
			req.flash("error", "Error edit word");
			res.redirect("/words");
		})		
	})
	.catch(err => {
		console.log(err.message);
		req.flash("error", "Error edit word");
		res.redirect("/words");
	})	
})

router.delete("/:id", middleware.isLoggedIn, function(req,res){
	Word.findByIdAndRemove(req.params.id)
	.then(() => {
		req.flash("success", "Word deleted");
		res.redirect("/words")	
  	})
  	.catch(err => {
		console.log(err.message);
		req.flash("error", "Error trying delete word");
		res.redirect("/words")
  	})		  	
})

module.exports = router;