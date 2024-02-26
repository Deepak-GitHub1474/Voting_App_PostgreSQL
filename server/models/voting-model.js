const mongoose = require("mongoose")

const VotingSchema = new mongoose.Schema({

    userEmail: {
        type: String,
        unique: true,
    },

    candidate: {
        type: String,
        required: true,
    },

});

const Voting = mongoose.model("voting", VotingSchema);

module.exports = Voting;