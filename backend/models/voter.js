const mongoose = require('mongoose');

const voterSchema = mongoose.Schema({
	name: { type: String, required: true},
	propertyAddress: { type: String },
	houseNum: { type: String },
	streetSuffex: { type: String },
	streetName: { type: String },
	streetType: { type: String },
	aptNum: { type: String },
	city: { type: String },
	support: { type: String },
	answers: [{
		questionID: { type: String },
		response: [{ type: String }]
	}],
	canvassedBy: { type: String /*mongoose.Schema.Types.ObjectId, ref: "User"*/ },	//TODO: change back to "user" when ready
	canvassedDate: { type: Date },

	electorId: { type: String },
	rc: { type: String },
	voted: { type: Boolean },
	locationName: { type: String },
	recordedDate: { type: String },
	votingChannel: { type: String },

	status: { type: String, default: "4uncanvassed" },
	
});

module.exports = mongoose.model('Voter', voterSchema); 