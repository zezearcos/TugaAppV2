var mongoose = require("mongoose");

var superlativeSchema = mongoose.Schema({
	name: {type: String, unique: true, required: true},
	example: String,
	comment:String,
	screenshot1: String,
	screenshot2: String,
	screenshot3: String,
	author: {
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		username: String
	}
});

module.exports = mongoose.model("Superlative", superlativeSchema);