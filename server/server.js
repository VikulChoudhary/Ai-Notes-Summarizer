const express = require("express");
const cors = require("cors");

const summaryRoutes = require("./routes/summaryRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "AI Notes Summarizer Backend is running!"
    });
});

app.use("/api", summaryRoutes);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});