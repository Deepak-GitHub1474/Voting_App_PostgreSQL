const mongoose = require("mongoose")

const VotingControlSchema = new mongoose.Schema({

    isVotingResultLive: {
        type: Boolean,
        default: false
    },

    isVotingOn: {
        type: Boolean,
        default: true
    },
    
    winnerCandidate: {
        type: String,
    },

});

const VotingControl = mongoose.model("voting_control", VotingControlSchema);

module.exports = VotingControl;