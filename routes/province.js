const Province = require("../models/Province");
const { verifyTokenAndAuthorization } = require("./verifyToken");

const router = require("express").Router();

// CREATE
router.post("/", verifyTokenAndAuthorization, async (req, res) => {
    const newProvince = new Province(req.body);
    try {
        const savedProvince = await newProvince.save();
        res.status(200).json(savedProvince);
    } catch (err) {
        res.status(500).json(err);
    }
});

// router.get("/seed", async (req, res) => {
//     const newProvince = await Province.create(data);

//     res.json({ newProvince });
// });

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const updateProvince = await Province.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updateProvince);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await Province.findByIdAndDelete(req.params.id);
        res.status(200).json("Province has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET PROVINCE
router.get("/find/:id", async (req, res) => {
    try {
        const province = await Province.findById(req.params.id);

        res.status(200).json(province);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET ALL PROVINCE
router.get("/", async (req, res) => {
    try {
        let provinces;

        provinces = await Province.find();

        res.status(200).json(provinces);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
