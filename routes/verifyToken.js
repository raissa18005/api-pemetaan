const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err, admin) => {
            if (err) res.status(403).json("Token is not valid!");
            req.admin = admin;
            next();
        });
    } else {
        return res.status(401).json("You are not authenticated!");
    }
};

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.admin.id === req.params.id || req.admin) {
            next();
        } else {
            res.status(403).json("You are not alowed to do that!");
        }
    });
};

module.exports = { verifyToken, verifyTokenAndAuthorization };
