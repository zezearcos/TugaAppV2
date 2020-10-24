var mongoose = require("mongoose");

var brandSchema = mongoose.Schema({
	name: {type: String, unique: true, required: true},
	abbreviation: String,
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

module.exports = mongoose.model("Brand", brandSchema);