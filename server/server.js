require("dotenv").config();

const express = require("express");
const cors = require("cors");

const summaryRoutes = require("./routes/summaryRoutes");

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(
    cors({
        origin: clientOrigin
    })
);
app.use(express.json({ limit: "32kb" }));

app.get("/", (req, res) => {
    res.json({
        message: "AI Notes Summarizer Backend is running!"
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        ok: true,
        hasApiKey: Boolean(process.env.OPENAI_API_KEY)
    });
});

app.use("/api", summaryRoutes);

app.use((err, req, res, next) => {
    if (err.type === "entity.too.large") {
        return res.status(413).json({ error: "Request body is too large." });
    }

    console.error(err);
    return res.status(500).json({ error: "Unexpected server error." });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
