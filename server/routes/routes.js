const express = require("express");
const { 
        userRegister, 
        userLogin, 
        userActionController, 
        userLogout, userVoting, 
        getAllVotingList, 
        getAllUserList,
        getVotingStatus,
        liveVotingResult,
        votingRestart
    } = require("../controllers/controllers")
const { registerValidation, loginValidation, verifyUser } = require("../middlewares/middlewares");

const route = express.Router();

route.get("/", verifyUser, userActionController)
route.post("/register", registerValidation, userRegister)
route.post("/login", loginValidation, userLogin)
route.get("/logout", userLogout)
route.post("/voting", userVoting)
route.get("/voting/list", getAllVotingList)
route.get("/user/list", getAllUserList)
route.get("/voting/status", getVotingStatus)
route.patch("/voting/result/live", liveVotingResult)
route.patch("/voting/restart", votingRestart)

module.exports = route