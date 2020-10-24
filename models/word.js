var mongoose = require("mongoose");

var wordSchema = mongoose.Schema({
	abbreviation: String,
	portuguese: {type: String, unique: true, required: true},
	brazilian: String,
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

module.exports = mongoose.model("Word", wordSchema);