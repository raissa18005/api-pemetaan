const express = require("express");
const app = express();
var cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const adminRoute = require("./routes/admin");
const cultureRoute = require("./routes/culture");
const provinceRoute = require("./routes/province");

dotenv.config();

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("DB Connection Successfull!"))
    .catch((err) => {
        console.log(err);
    });

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/admins", adminRoute);
app.use("/api/cultures", cultureRoute);
app.use("/api/provinces", provinceRoute);

app.listen(process.env.PORT || 5000, () => {
    console.log("Backend server is running!");
});
