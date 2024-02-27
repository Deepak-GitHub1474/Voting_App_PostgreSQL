const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const  connectToDb  = require('../config/db');

// User dashboard access control
exports.userActionController = async (req, res) => {
    
    try {
        const { email } = req;

        const client = await connectToDb();

        const query = 'SELECT email, name, isadmin, isvoted FROM users WHERE email = $1';
        const result = await client.query(query, [email]);

        if (result.rows.length === 0) {
            res.status(404).json({ responseMsg: "User not found" });
            return;
        }

        const userData = result.rows[0];
        res.status(200).json(userData);

        await client.end();
    } catch (error) {
        console.error("Error while fetching user details:", error);
        res.status(500).json({ responseMsg: "Error while fetching user details" });
    }
};

// Register
exports.userRegister = async (req, res) => {
    
    try {
        const { name, email, password, phone } = req.body;
        const client = await connectToDb();

        const existingUser = 'SELECT * FROM users WHERE email = $1';
        const user = await client.query(existingUser, [email]);

        if (user.rows.length > 0) {
            res.status(400).json({ responseMsg: "Email already exists" });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const insertUser = 'INSERT INTO users (name, email, password, phone) VALUES ($1, $2, $3, $4) RETURNING *';
            const insertUserResult = await client.query(insertUser, [name, email, hashedPassword, phone]);
            const newUser = insertUserResult.rows[0];

            res.status(200).json({ responseMsg: "Successfully registered", user: newUser });
        }

        await client.end();
    } catch (error) {
        console.error("Error while registering user:", error);
        res.status(500).json({ responseMsg: "Error while registering user" });
    }
};

// Login
exports.userLogin = async (req, res) => {
    
    try {
        const { email, password } = req.body;
        const client = await connectToDb();

        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await client.query(query, [email]);

        if (result.rows.length === 0) {
            res.status(404).json({ responseMsg: "No Account associated with this email" });
            return;
        }

        const user = result.rows[0];

        bcrypt.compare(password, user.password, (err, response) => {
            if (response) {
                const token = jwt.sign(
                    {
                        email: user.email,
                        name: user.name,
                        isadmin: user.isadmin,
                        isvoted: user.isvoted
                    },
                    process.env.JWT_SECRET, { expiresIn: "1d" });

                res.cookie("token", token, {
                    httpOnly: true,
                    sameSite: process.env.CORS_SAME_SITE,
                    secure: true,
                    path: '/'
                });

                res.status(200).json({ responseMsg: "Success", user: user });
            } else {
                res.status(401).json({ responseMsg: "Wrong Password" });
            }
        });

        await client.end();
    } catch (error) {
        console.error("Error while logging in:", error);
        res.status(500).json({ responseMsg: "Error while logging in" });
    }
};

// User Logout
exports.userLogout = (req, res) => {

    res.cookie("token", "", {
        expires: new Date(0),
        httpOnly: true,
        sameSite: process.env.CORS_SAME_SITE,
        secure: true,
        path: '/'
    });
    return res.status(200).json({ responseMsg: "Success" });
};

// Get All User List
exports.getAllUserList = async (req, res) => {
    try {
        const client = await connectToDb();

        const query = 'SELECT * FROM users';
        const result = await client.query(query);
        const userList = result.rows;
        res.status(200).json({ responseMsg: "Fetched all user list", userList: userList });
        await client.end();

    } catch (error) {
        console.error("Error while accessing user list:", error);
        res.status(500).json({ responseMsg: "Error while accessing user list" });
    }
};

// User Voting
exports.userVoting = async (req, res) => {
    
    try {
        const { user_email, candidate } = req.body;
        const client = await connectToDb();

        const checkExistingVoter = 'SELECT * FROM votings WHERE user_email = $1';
        const result = await client.query(checkExistingVoter, [user_email]);

        if (result.rows.length > 0) {
            res.status(200).json({ responseMsg: "You already voted" });
        } else {

            const insertVoting = 'INSERT INTO votings (user_email, candidate) VALUES ($1, $2) RETURNING *';
            const insertVotingResult = await client.query(insertVoting, [user_email, candidate]);

            // Update user's voting status
            const updateUser = 'UPDATE users SET isvoted = true WHERE email = $1';
            await client.query(updateUser, [user_email]);

            res.status(200).json({ responseMsg: "Successfully voted", votingInfo: insertVotingResult.rows[0] });
        }

        await client.end();
    } catch (error) {
        console.error("Error while voting:", error);
        res.status(500).json({ responseMsg: "Error while voting" });
    }
};

// Get Voting Status
exports.getVotingStatus = async (req, res) => {
    try {
        const client = await connectToDb();

        const query = 'SELECT * FROM voting_controls';
        const result = await client.query(query);
        const votingStatus = result.rows;

        res.status(200).json({ responseMsg: "Fetched voting status", votingStatus });

        await client.end();
    } catch (error) {
        console.error("Error while fetching voting status:", error);
        res.status(500).json({ responseMsg: "Error while fetching voting status" });
    }
};

// Get All Voting List
exports.getAllVotingList = async (req, res) => {
    try {
        const client = await connectToDb();

        const query = 'SELECT * FROM votings';
        const result = await client.query(query);

        const votingList = result.rows;
        res.status(200).json({ responseMsg: "Fetched all voting list", votingList });

        await client.end();
    } catch (error) {
        console.error("Error while accessing voting list:", error);
        res.status(500).json({ responseMsg: "Error while accessing voting list" });
    }
};

// Live Voting Result
exports.liveVotingResult = async (req, res) => {

    try {
        const { is_voting_result_live, is_voting_on, winner_candidate } = req.body;

        const client = await connectToDb();

        const query = 'UPDATE voting_controls SET is_voting_result_live = $1, is_voting_on = $2, winner_candidate = $3';
        const values = [is_voting_result_live, is_voting_on, winner_candidate];
        const result = await client.query(query, values);

        res.status(200).json({ responseMsg: "Voting status updated successfully", votingResult: result.rows });

        await client.end();
    } catch (error) {
        console.error("Error while updating voting status:", error);
        res.status(500).json({ responseMsg: "Error while updating voting status" });
    }
};

// Voting Restart
exports.votingRestart = async (req, res) => {
    try {
        const { is_voting_result_live, is_voting_on, winner_candidate } = req.body;

        const client = await connectToDb();

        const query = 'UPDATE voting_controls SET is_voting_result_live = $1, is_voting_on = $2, winner_candidate = $3';
        const values = [is_voting_result_live, is_voting_on, winner_candidate];
        const result = await client.query(query, values);

        res.status(200).json({ responseMsg: "Voting status updated successfully", votingResult: result.rows });

        await client.end();
    } catch (error) {
        console.error("Error while updating voting status:", error);
        res.status(500).json({ responseMsg: "Error while updating voting status" });
    }
};
