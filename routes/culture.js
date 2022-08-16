const Culture = require("../models/Culture");
const Province = require("../models/Province");
const { verifyTokenAndAuthorization } = require("./verifyToken");
const { std } = require("mathjs");

const router = require("express").Router();

// CREATE
router.post("/", verifyTokenAndAuthorization, async (req, res) => {
    const newCulture = new Culture(req.body);
    try {
        const savedCulture = await newCulture.save();
        res.status(200).json(savedCulture);
    } catch (err) {
        res.status(500).json(err);
    }
});

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const updateCulture = await Culture.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updateCulture);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await Culture.findByIdAndDelete(req.params.id);
        res.status(200).json("Culture has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET CULTURE
router.get("/find/:id", async (req, res) => {
    try {
        const culture = await Culture.findById(req.params.id).populate(
            "province"
        );

        res.status(200).json(culture);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET ALL CULTURE
router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qProvince = req.query.province;
    try {
        let cultures;
        if (qNew) {
            cultures = await Culture.find.sort({ createdAt: -1 }).limit(5);
        } else if (qProvince) {
            cultures = await Culture.find({
                province_id: { $in: [qProvince] },
            });
        } else {
            cultures = await Culture.find().populate("province", "name");
        }

        res.status(200).json(cultures);
    } catch (err) {
        res.status(500).json(err);
    }
});

// COUNT PER PROVINCE
router.get("/count", async (req, res) => {
    const pipeline = [{ $group: { _id: "$province", count: { $sum: 1 } } }];
    const test = [
        {
            $group: {
                _id: "$province",
                count: { $sum: 1 },
            },
        },
        {
            $lookup: {
                from: "provinces",
                localField: "_id",
                foreignField: "_id",
                as: "province",
            },
        },
        { $unwind: "$province" },
    ];

    try {
        cultures = await Culture.aggregate(pipeline);
        // provinces = await Province.aggregate(coba);
        // await Province.populate(cultures, { path: "_id" });

        res.status(200).json(cultures);
    } catch (err) {
        res.status(500).json(err);
    }
});

// CALCULATION

router.get("/calculate", async (req, res) => {
    const qRef = req.query.ref;
    const n = qRef ? qRef : 0.8;
    const pipeline = [{ $group: { _id: "$province", count: { $sum: 1 } } }];

    try {
        cultures = await Culture.aggregate(pipeline);
        jumlahBudaya = await Culture.count();
        jumlahProvinsi = await Province.count();

        counts = cultures.map((item) => item.count);
        average = jumlahBudaya / jumlahProvinsi;
        selisih = counts.map((item) => Math.pow(item - average, 2));
        jumlahSelisih = selisih.reduce((prev, curr) => prev + curr);
        standar = Math.sqrt(jumlahSelisih / (jumlahProvinsi - 1));
        standarDev = std(counts);
        // n = 0.8;
        high = average + n * standarDev;
        low = average - n * standarDev;

        let highProvince = 0;
        let lowProvince = 0;

        cultures.forEach((culture) => {
            if (culture.count > high) {
                highProvince += 1;
            }
            if (culture.count < low) {
                lowProvince += 1;
            }
        });

        let midProvince = jumlahProvinsi - highProvince - lowProvince;

        res.status(200).json({
            jumlahBudaya,
            jumlahProvinsi,
            average,
            standarDev,
            n,
            high,
            low,
            highProvince,
            lowProvince,
            midProvince,
            n,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/calculatemanual", async (req, res) => {
    const pipeline = [{ $group: { _id: "$province", count: { $sum: 1 } } }];

    try {
        cultures = await Culture.aggregate(pipeline);
        jumlahBudaya = await Culture.count();
        jumlahProvinsi = await Province.count();

        counts = cultures.map((item) => item.count);
        average = jumlahBudaya / jumlahProvinsi;
        selisih = counts.map((item) => Math.pow(item - average, 2));
        jumlahSelisih = selisih.reduce((prev, curr) => prev + curr);
        standarDev = Math.sqrt(jumlahSelisih / (jumlahProvinsi - 1));

        n = 0.8;
        high = average + n * standarDev;
        low = average - n * standarDev;

        let highProvince = 0;
        let lowProvince = 0;

        cultures.forEach((culture) => {
            if (culture.count > high) {
                highProvince += 1;
            }
            if (culture.count < low) {
                lowProvince += 1;
            }
        });

        let midProvince = jumlahProvinsi - highProvince - lowProvince;

        res.status(200).json({
            jumlahBudaya,
            jumlahProvinsi,
            average,
            standarDev,
            n,
            high,
            low,
            highProvince,
            lowProvince,
            midProvince,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
