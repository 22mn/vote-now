var mongoose = require("mongoose");
var Schema   = mongoose.Schema;
var Poll   = new Schema({
		topic : String,
		voterId : {type:[Number]},
		allVote  : [Schema.Types.Mixed],
		creatorId : String,
		creatorName: String
});

module.exports = mongoose.model("Poll",Poll);