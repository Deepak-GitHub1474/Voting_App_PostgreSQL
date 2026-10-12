const jwt = require("jsonwebtoken");
const store = require("../db/store");
const { fail } = require("../utils/respond");

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.registerValidation = (req, res, next) => {
    const { name, email, password, phone } = req.body || {};

    if (!name?.trim() || !email?.trim() || !password || !phone?.trim()) {
        return fail(res, 400, "All fields are required");
    }
    if (!EMAIL.test(email.trim())) {
        return fail(res, 400, "Enter a valid email address");
    }
    if (password.length < 6) {
        return fail(res, 400, "Password must be at least 6 characters");
    }
    if (!/^\+?[0-9\s-]{7,15}$/.test(phone.trim())) {
        return fail(res, 400, "Enter a valid phone number");
    }
    next();
};

exports.loginValidation = (req, res, next) => {
    const { email, password } = req.body || {};

    if (!email?.trim() || !password) {
        return fail(res, 400, "Email and password are required");
    }
    next();
};

exports.verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return fail(res, 401, "Not signed in");
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return fail(res, 401, "Session expired, please sign in again");
        }
        req.email = decoded.email;
        next();
    });
};

exports.optionalUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return next();
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (!err) req.email = decoded.email;
        next();
    });
};

exports.requireAdmin = async (req, res, next) => {
    if (!(await store.isAdmin(req.email))) {
        return fail(res, 403, "Admin access only");
    }
    next();
};
