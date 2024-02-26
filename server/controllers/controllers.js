// const User = require("../models/user-model");
// const Voting = require("../models/voting-model");
// const VotingControl = require("../models/voting-control");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// User dashboard access control
// exports.userActionController = (req, res) => {
//     return res.status(200).json(
//         {
//             email: req.email,
//             name: req.name,
//             isAdmin: req.isAdmin,
//             isVoted: req.isVoted,
//         }
//     );
// };

// User Register
// exports.userRegister = (req, res) => {
//     const { name, email, password, phone } = req.body;

//     // Check if the email already exists in the database
//     User.findOne({ email: email })
//         .then(existingUser => {
//             if (existingUser) {
//                 res.status(400).json({ responseMsg: "Email already exists" })
//             } else {
//                 bcrypt.hash(password, 10)
//                     .then(hash => {
//                         User.create({ name, email, password: hash, phone })
//                             .then(user => {
//                                 res.status(200).json({ responseMsg: "Successfully registered", user: user });
//                             })
//                             .catch(err => res.json(err))
//                     })
//                     .catch(err => console.log(err));
//             }
//         })
//         .catch(err => console.log(err));
// };

// User login controller
// exports.userLogin = (req, res) => {
//     const { email, password } = req.body;
//     User.findOne({ email: email })
//         .then(user => {
//             if (user) {
//                 bcrypt.compare(password, user.password, (err, response) => {
//                     if (response) {
//                         const token = jwt.sign(
//                             { 
//                                 email: user.email, 
//                                 name: user.name, 
//                                 isAdmin: user.isAdmin, 
//                                 isVoted: user.isVoted 
//                             },
//                             process.env.JWT_SECRET, { expiresIn: "1d" })
//                         res.cookie("token", token, {
//                             httpOnly: true,
//                             sameSite: process.env.CORS_SAME_SITE,
//                             secure: true,
//                             path: '/'
//                         });
//                         res.status(200).json({ responseMsg: "Success", user: user })

//                     } else {
//                         res.status(401).json({ responseMsg: "Wrong Password" })
//                     }
//                 })
//             } else {
//                 res.status(404).json({ responseMsg: "No Account associated with this email" })
//             }
//         })
// };

// User Logout
// exports.userLogout = (req, res) => {

//     res.cookie("token", "", {
//         expires: new Date(0),
//         httpOnly: true,
//         sameSite: process.env.CORS_SAME_SITE,
//         secure: true,
//         path: '/'
//     });
//     return res.status(200).json({ responseMsg: "Success" });
// };

// Get all user list
// exports.getAllUserList = async (req, res) => {

//     try {
//         const userList = await User.find({});
//         res.status(200).json({ responseMsg: "Fetched all user list", userList: userList });
//     } catch (error) {
//         res.status(500).json({ responseMsg: "Error while accessing user list" });
//     }
// };

// Voting
// exports.userVoting = async (req, res) => {

//     try {
//         const { userEmail, candidate } = req.body;

//         const existingVoter = await Voting.findOne({ userEmail: userEmail });

//         if (existingVoter && existingVoter.userEmail === userEmail) {
//             res.status(200).json({ responseMsg: "You already voted" });
//         } else {
//             const votingInfo = await Voting.create({ userEmail, candidate });
//             const existingUser = await User.findOneAndUpdate({ email: userEmail },
//                 { $set: { isVoted: true } });

//             res.status(200).json({ responseMsg: "Successfully voted", votingInfo: votingInfo });
//         }

//     } catch (error) {
//         res.status(500).json({ responseMsg: "Error while voting" });
//     }
// };

// Get all voting list
// exports.getAllVotingList = async (req, res) => {

//     try {
//         const votingList = await Voting.find({});
//         res.status(200).json({ responseMsg: "Fetched all voting list", votingList: votingList });
//     } catch (error) {
//         res.status(500).json({ responseMsg: "Error while accessing voting list" });
//     }
// };

// Voting Status
// exports.getVotingStatus = async (req, res) => {
//     try {
//         const votingStatus = await VotingControl.find({});
//         res.status(200).json({ responseMsg: "Fetched voting status", votingStatus: votingStatus });
//     } catch (error) {
//         res.status(500).json({ responseMsg: "Error while fetching voting status" });
//     }
// };

// Live Voting Result
// exports.liveVotingResult = async (req, res) => {
//     try {
//         const { isVotingResultLive, isVotingOn, winnerCandidate } = req.body;
//         const votingResult = await VotingControl.updateOne({}, { isVotingResultLive, isVotingOn, winnerCandidate });
//         res.status(200).json({ responseMsg: "Voting status updated successfully", votingResult });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ responseMsg: "Error while updating voting status" });
//     }
// };

// Voting Restart
// exports.votingRestart = async (req, res) => {
//     try {
//         const { isVotingResultLive, isVotingOn, winnerCandidate } = req.body;
//         const votingResult = await VotingControl.updateOne({}, { isVotingResultLive, isVotingOn, winnerCandidate });
//         res.status(200).json({ responseMsg: "Voting status updated successfully", votingResult });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ responseMsg: "Error while updating voting status" });
//     }
// };


// -------------------------------------------------------- //

const { Client } = require('pg');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// User dashboard access control
exports.userActionController = async (req, res) => {
    const { email } = req;

    try {
        const client = new Client({
            host: process.env.POSTGRESQL_HOST,
            port: process.env.POSTGRESQL_PORT,
            database: process.env.POSTGRESQL_DATABASE,
            user: process.env.POSTGRESQL_USER,
            password: process.env.POSTGRESQL_PASSWORD,
        });

        await client.connect();

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
    const { name, email, password, phone } = req.body;

    try {
        const client = new Client({
            host: process.env.POSTGRESQL_HOST,
            port: process.env.POSTGRESQL_PORT,
            database: process.env.POSTGRESQL_DATABASE,
            user: process.env.POSTGRESQL_USER,
            password: process.env.POSTGRESQL_PASSWORD,
        });

        await client.connect();

        // Check if the email already exists in the database
        const emailCheckQuery = 'SELECT * FROM users WHERE email = $1';
        const emailCheckResult = await client.query(emailCheckQuery, [email]);

        if (emailCheckResult.rows.length > 0) {
            res.status(400).json({ responseMsg: "Email already exists" });
        } else {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert new user into the database
            const insertUserQuery = 'INSERT INTO users (name, email, password, phone) VALUES ($1, $2, $3, $4) RETURNING *';
            const insertUserResult = await client.query(insertUserQuery, [name, email, hashedPassword, phone]);
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
    const { email, password } = req.body;

    try {
        const client = new Client({
            host: process.env.POSTGRESQL_HOST,
            port: process.env.POSTGRESQL_PORT,
            database: process.env.POSTGRESQL_DATABASE,
            user: process.env.POSTGRESQL_USER,
            password: process.env.POSTGRESQL_PASSWORD,
        });

        await client.connect();

        // Check if the email exists in the database
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await client.query(query, [email]);

        if (result.rows.length === 0) {
            res.status(404).json({ responseMsg: "No Account associated with this email" });
            return;
        }

        const user = result.rows[0];

        // Compare password hash
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
        const client = new Client({
            host: process.env.POSTGRESQL_HOST,
            port: process.env.POSTGRESQL_PORT,
            database: process.env.POSTGRESQL_DATABASE,
            user: process.env.POSTGRESQL_USER,
            password: process.env.POSTGRESQL_PASSWORD,
        });

        await client.connect();

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

        const client = new Client({
            host: process.env.POSTGRESQL_HOST,
            port: process.env.POSTGRESQL_PORT,
            database: process.env.POSTGRESQL_DATABASE,
            user: process.env.POSTGRESQL_USER,
            password: process.env.POSTGRESQL_PASSWORD,
        });

        await client.connect();

        // Check if the user has already voted
        const checkVoterQuery = 'SELECT * FROM votings WHERE user_email = $1';
        const checkVoterResult = await client.query(checkVoterQuery, [user_email]);

        if (checkVoterResult.rows.length > 0) {
            res.status(200).json({ responseMsg: "You already voted" });
        } else {
            // Insert voting information
            const insertVotingQuery = 'INSERT INTO votings (user_email, candidate) VALUES ($1, $2) RETURNING *';
            const insertVotingResult = await client.query(insertVotingQuery, [user_email, candidate]);

            // Update user's voting status
            const updateUserQuery = 'UPDATE users SET isvoted = true WHERE email = $1';
            await client.query(updateUserQuery, [user_email]);

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
        const client = new Client({
            host: process.env.POSTGRESQL_HOST,
            port: process.env.POSTGRESQL_PORT,
            database: process.env.POSTGRESQL_DATABASE,
            user: process.env.POSTGRESQL_USER,
            password: process.env.POSTGRESQL_PASSWORD,
        });

        await client.connect();

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
        const client = new Client({
            host: process.env.POSTGRESQL_HOST,
            port: process.env.POSTGRESQL_PORT,
            database: process.env.POSTGRESQL_DATABASE,
            user: process.env.POSTGRESQL_USER,
            password: process.env.POSTGRESQL_PASSWORD,
        });

        await client.connect();

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

        const client = new Client({
            host: process.env.POSTGRESQL_HOST,
            port: process.env.POSTGRESQL_PORT,
            database: process.env.POSTGRESQL_DATABASE,
            user: process.env.POSTGRESQL_USER,
            password: process.env.POSTGRESQL_PASSWORD,
        });

        await client.connect();

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

        const client = new Client({
            host: process.env.POSTGRESQL_HOST,
            port: process.env.POSTGRESQL_PORT,
            database: process.env.POSTGRESQL_DATABASE,
            user: process.env.POSTGRESQL_USER,
            password: process.env.POSTGRESQL_PASSWORD,
        });

        await client.connect();

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
