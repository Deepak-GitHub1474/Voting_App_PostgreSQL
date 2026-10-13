const { pool } = require("../config/db");

const PUBLIC_USER = `name, email, isadmin AS "isAdmin", isvoted AS "isVoted"`;

const CONTROL = `is_voting_on AS "isVotingOn", is_voting_result_live AS "isVotingResultLive", winner_candidate AS "winnerCandidate"`;

const CONTROL_COLUMNS = {
    isVotingOn: "is_voting_on",
    isVotingResultLive: "is_voting_result_live",
    winnerCandidate: "winner_candidate",
};

const one = async (sql, params) => (await pool.query(sql, params)).rows[0] || null;

exports.findPublicUser = (email) => one(`SELECT ${PUBLIC_USER} FROM users WHERE email = $1`, [email]);

exports.findUserWithPassword = (email) => one(`SELECT ${PUBLIC_USER}, password FROM users WHERE LOWER(email) = LOWER($1)`, [email]);

exports.userExists = async (email) => Boolean(await one("SELECT 1 FROM users WHERE LOWER(email) = LOWER($1)", [email]));

exports.isAdmin = async (email) => Boolean((await one("SELECT isadmin FROM users WHERE email = $1", [email]))?.isadmin);

exports.createUser = ({ name, email, passwordHash, phone }) =>
    one(`INSERT INTO users (name, email, password, phone) VALUES ($1, $2, $3, $4) RETURNING ${PUBLIC_USER}`, [name, email, passwordHash, phone]);

exports.countVoters = async () => (await one("SELECT COUNT(*)::int AS count FROM users WHERE isadmin IS NOT TRUE")).count;

exports.getControl = async () => {
    await pool.query("INSERT INTO voting_controls DEFAULT VALUES ON CONFLICT DO NOTHING");
    return one(`SELECT ${CONTROL} FROM voting_controls LIMIT 1`);
};

exports.updateControl = async (changes) => {
    await exports.getControl();
    const keys = Object.keys(changes);
    const assignments = keys.map((key, index) => `${CONTROL_COLUMNS[key]} = $${index + 1}`).join(", ");
    return one(`UPDATE voting_controls SET ${assignments} RETURNING ${CONTROL}`, keys.map((key) => changes[key]));
};

exports.findVote = (email) => one(`SELECT candidate, created_at AS "votedAt" FROM votings WHERE user_email = $1`, [email]);

exports.recordVote = async (email, candidate) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        await client.query("INSERT INTO votings (user_email, candidate) VALUES ($1, $2)", [email, candidate]);
        await client.query("UPDATE users SET isvoted = TRUE WHERE email = $1", [email]);
        await client.query("COMMIT");
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

exports.isDuplicateError = (error) => error?.code === "23505";

exports.countVotesByCandidate = async () => {
    const { rows } = await pool.query("SELECT candidate, COUNT(*)::int AS votes FROM votings GROUP BY candidate");
    return Object.fromEntries(rows.map((row) => [row.candidate, row.votes]));
};
