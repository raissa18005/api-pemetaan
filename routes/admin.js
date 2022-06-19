const Admin = require("../models/Admin");
const { verifyTokenAndAuthorization } = require("./verifyToken");
const CryptoJS = require("crypto-js");

const router = require("express").Router();

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString();
    }

    try {
        const updatedAdmin = await Admin.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedAdmin);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await Admin.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET ADMIN
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        const { password, ...others } = admin._doc;

        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET ALL ADMIN
router.get("/", verifyTokenAndAuthorization, async (req, res) => {
    const query = req.query.new;
    try {
        const admins = query
            ? await Admin.find().sort({ _id: -1 }).limit(1)
            : await Admin.find();
        res.status(200).json(admins);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
