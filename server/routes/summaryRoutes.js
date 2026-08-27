const express = require("express");

const router = express.Router();

router.post("/summarize", (req, res) => {

    const { notes } = req.body;

    console.log("Notes received:", notes);

    res.json({
        message: "Notes received successfully!",
        summary: "This is a test summary."
    });

});

module.exports = router;