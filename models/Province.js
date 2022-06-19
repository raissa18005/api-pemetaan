const mongoose = require("mongoose");

const ProvinceSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        lat: { type: Number, required: true },
        long: { type: Number, required: true },
        geojson: { type: Object, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Province", ProvinceSchema);
