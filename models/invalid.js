var mongoose = require("mongoose");

var invalidSchema = mongoose.Schema({
	website: {type: String, unique: true, required: true},
	category: {type: String, unique: true, required: true},
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

module.exports = mongoose.model("Invalid", invalidSchema);