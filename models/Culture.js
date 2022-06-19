const mongoose = require("mongoose");

const CultureSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        year: { type: Number },
        img: { type: String },
        type: { type: String },
        reg_num: { type: String },
        desc: { type: String },
        videos: { type: [String] },
        imgs: { type: [String] },
        province: {
            type: mongoose.Types.ObjectId,
            ref: "Province",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Culture", CultureSchema);
