const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const routes = require("./routes/routes");
const connectToDb = require("./config/db");
const { fail } = require("./utils/respond");

const PORT = process.env.PORT || 8000;
const origins = [process.env.HOSTED_ORIGIN, process.env.LOCALHOST_ORIGIN].filter(Boolean);

const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.use(
    cors({
        origin: origins,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
        exposedHeaders: process.env.CORS_EXPOSED_HEADER ? [process.env.CORS_EXPOSED_HEADER] : [],
    })
);

app.use("/", routes);

app.use((req, res) => fail(res, 404, "Not found"));

app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error.type === "entity.parse.failed") return fail(res, 400, "Invalid JSON body");
    console.error(error);
    return fail(res, 500, "Something went wrong");
});

app.listen(PORT, () => {
    connectToDb();
    console.log(`Server is running on http://localhost:${PORT}`);
});
