const Admin = require("../models/Admin");
const router = require("express").Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
    const newAdmin = new Admin({
        username: req.body.username,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString(),
    });

    try {
        const savedAdmin = await newAdmin.save();
        res.status(201).json(savedAdmin);
    } catch (err) {
        res.status(500).json(err);
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const admin = await Admin.findOne({ username: req.body.username });
        if (!admin) {
            return res.status(401).json("Wrong Credentials!");
        }

        const hashedPassword = CryptoJS.AES.decrypt(
            admin.password,
            process.env.PASS_SEC
        );

        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        if (originalPassword !== req.body.password) {
            return res.status(401).json("Wrong credentials!");
        }

        const accessToken = jwt.sign(
            {
                id: admin._id,
            },
            process.env.JWT_SEC,
            { expiresIn: "3d" }
        );
        const { password, ...others } = admin._doc;

        return res.status(200).json({ ...others, accessToken });
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;
