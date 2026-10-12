const express = require("express");
const { ok, fail } = require("../utils/respond");
const {
    userRegister,
    userLogin,
    userActionController,
    userLogout,
    userVoting,
    getMyVote,
    getVotingStatus,
    getResults,
    getAdminSummary,
    liveVotingResult,
    votingRestart,
} = require("../controllers/controllers");
const { registerValidation, loginValidation, verifyUser, optionalUser, requireAdmin } = require("../middlewares/middlewares");

const route = express.Router();

route.get("/health", (req, res) => ok(res, "OK", { status: "up" }));

route.get("/", optionalUser, userActionController);
route.post("/register", registerValidation, userRegister);
route.post("/login", loginValidation, userLogin);
const requireJson = (req, res, next) => (req.is("application/json") ? next() : fail(res, 415, "Expected a JSON request"));

route.post("/logout", requireJson, userLogout);
route.get("/logout", userLogout);

route.get("/voting/status", getVotingStatus);
route.get("/voting/results", getResults);
route.get("/voting/me", verifyUser, getMyVote);
route.post("/voting", verifyUser, userVoting);

route.get("/admin/summary", verifyUser, requireAdmin, getAdminSummary);
route.patch("/voting/result/live", verifyUser, requireAdmin, liveVotingResult);
route.patch("/voting/restart", verifyUser, requireAdmin, votingRestart);

module.exports = route;
