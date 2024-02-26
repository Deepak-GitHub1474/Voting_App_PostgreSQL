const jwt = require("jsonwebtoken");

// Register Validation
exports.registerValidation = (req, res, next) => {
    const { name, email, password, phone } = req.body;

    if (req.body && name && email && password && phone) {
        next()
    } else {
        res.status(404).send({ msg: "All input fields are required" });
    }
}

// Login Validation
exports.loginValidation = (req, res, next) => {
    const { email, password } = req.body;

    if (req.body && email && password) {
        next()
    } else {
        res.status(404).send({ msg: "All input fields are required" });
    }
}

// User Validation
exports.verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json("The token is missing")
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.json("The token is wrong")
            } else {
                req.email = decoded.email;
                req.name = decoded.name;
                req.isadmin = decoded.isadmin;
                req.isvoted = decoded.isvoted;
                next()
            }
        })
    }
}


