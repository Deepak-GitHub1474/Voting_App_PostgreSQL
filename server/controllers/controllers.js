const store = require("../db/store");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ok, fail } = require("../utils/respond");

const CANDIDATES = ["Candidate-1", "Candidate-2", "Candidate-3", "Candidate-4"];

const cookieOptions = () => ({
    httpOnly: true,
    sameSite: process.env.CORS_SAME_SITE,
    secure: true,
    path: "/",
});

const tally = async () => {
    const stored = await store.countVotesByCandidate();
    const counts = Object.fromEntries(CANDIDATES.map((name) => [name, stored[name] || 0]));
    const total = Object.values(counts).reduce((sum, value) => sum + value, 0);
    const top = Math.max(...Object.values(counts));
    const leaders = top > 0 ? CANDIDATES.filter((name) => counts[name] === top) : [];
    return {
        total,
        candidates: CANDIDATES.map((name) => ({ name, votes: counts[name] })),
        winner: leaders.join(" and "),
    };
};

const startSession = (res, user) => {
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, { ...cookieOptions(), maxAge: 24 * 60 * 60 * 1000 });
    return { name: user.name, email: user.email, isAdmin: user.isAdmin, isVoted: user.isVoted };
};

exports.userActionController = async (req, res) => {
    try {
        if (!req.email) return ok(res, "Not signed in", null);
        const user = await store.findPublicUser(req.email);
        return ok(res, user ? "Signed in" : "Not signed in", user || null);
    } catch (error) {
        return fail(res, 500, "Could not load your account");
    }
};

exports.userRegister = async (req, res) => {
    try {
        const name = req.body.name.trim();
        const email = req.body.email.trim().toLowerCase();
        const phone = req.body.phone.trim();

        if (await store.userExists(email)) {
            return fail(res, 409, "An account with this email already exists");
        }
        const passwordHash = await bcrypt.hash(req.body.password, 10);
        const user = await store.createUser({ name, email, passwordHash, phone });
        return ok(res, "Account created", startSession(res, user), 201);
    } catch (error) {
        if (store.isDuplicateError(error)) return fail(res, 409, "An account with this email already exists");
        return fail(res, 500, "Could not create the account, please try again");
    }
};

exports.userLogin = async (req, res) => {
    try {
        const email = req.body.email.trim().toLowerCase();
        const user = await store.findUserWithPassword(email);
        if (!user) return fail(res, 404, "No account is associated with this email");
        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid) return fail(res, 401, "Incorrect password");
        return ok(res, "Signed in", startSession(res, user));
    } catch (error) {
        return fail(res, 500, "Could not sign you in, please try again");
    }
};

exports.userLogout = (req, res) => {
    res.cookie("token", "", { ...cookieOptions(), expires: new Date(0) });
    return ok(res, "Signed out");
};

exports.userVoting = async (req, res) => {
    try {
        const { candidate } = req.body || {};
        if (!CANDIDATES.includes(candidate)) return fail(res, 400, "Please choose a valid candidate");
        const control = await store.getControl();
        if (!control.isVotingOn) return fail(res, 403, "Voting is closed");
        const user = await store.findPublicUser(req.email);
        if (!user) return fail(res, 401, "Account not found");
        if (user.isAdmin) return fail(res, 403, "Admins cannot vote");
        if (await store.findVote(req.email)) return fail(res, 409, "You have already voted");
        await store.recordVote(req.email, candidate);
        return ok(res, "Your vote has been recorded", { candidate }, 201);
    } catch (error) {
        if (store.isDuplicateError(error)) return fail(res, 409, "You have already voted");
        return fail(res, 500, "Could not record your vote, please try again");
    }
};

exports.getMyVote = async (req, res) => {
    try {
        const candidate = await store.findVote(req.email);
        return ok(res, candidate ? "Vote found" : "No vote yet", { candidate });
    } catch (error) {
        return fail(res, 500, "Could not load your vote");
    }
};

const publicControl = (control) => ({
    isVotingOn: Boolean(control.isVotingOn),
    isVotingResultLive: Boolean(control.isVotingResultLive),
    winnerCandidate: control.winnerCandidate || "",
});

exports.getVotingStatus = async (req, res) => {
    try {
        return ok(res, "Voting status", publicControl(await store.getControl()));
    } catch (error) {
        return fail(res, 500, "Could not load the voting status");
    }
};

exports.getResults = async (req, res) => {
    try {
        const control = await store.getControl();
        if (!control.isVotingResultLive) return ok(res, "Results are not published yet", { published: false });
        return ok(res, "Results", { published: true, ...(await tally()) });
    } catch (error) {
        return fail(res, 500, "Could not load results");
    }
};

exports.getAdminSummary = async (req, res) => {
    try {
        const [results, voters] = await Promise.all([tally(), store.countVoters()]);
        return ok(res, "Summary", { ...results, voters });
    } catch (error) {
        return fail(res, 500, "Could not load the summary");
    }
};

exports.liveVotingResult = async (req, res) => {
    try {
        const { winner } = await tally();
        const control = await store.updateControl({ isVotingResultLive: true, isVotingOn: false, winnerCandidate: winner });
        return ok(res, "Results published", publicControl(control));
    } catch (error) {
        return fail(res, 500, "Could not publish the results");
    }
};

exports.votingRestart = async (req, res) => {
    try {
        const control = await store.updateControl({ isVotingResultLive: false, isVotingOn: true, winnerCandidate: "" });
        return ok(res, "Voting reopened", publicControl(control));
    } catch (error) {
        return fail(res, 500, "Could not reopen voting");
    }
};
