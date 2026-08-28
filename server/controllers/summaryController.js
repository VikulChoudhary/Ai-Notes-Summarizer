const { summarizeNotes } = require("../services/openaiService");

const MAX_NOTES_LENGTH = 15000;
const ALLOWED_STYLES = new Set(["short", "medium", "detailed"]);

async function summarize(req, res) {
    const notes = typeof req.body?.notes === "string" ? req.body.notes.trim() : "";
    const style = ALLOWED_STYLES.has(req.body?.style) ? req.body.style : "medium";

    if (!notes) {
        return res.status(400).json({ error: "Please provide notes to summarize." });
    }

    if (notes.length > MAX_NOTES_LENGTH) {
        return res.status(400).json({
            error: `Notes are too long. Maximum length is ${MAX_NOTES_LENGTH.toLocaleString()} characters.`
        });
    }

    try {
        const summary = await summarizeNotes(notes, style);
        return res.json({ summary, style });
    } catch (err) {
        if (err.code === "MISSING_API_KEY") {
            return res.status(500).json({
                error: "Server is missing OPENAI_API_KEY. Add it to server/.env."
            });
        }

        console.error("Summarize failed:", err.message);
        return res.status(502).json({
            error: "Could not generate a summary. Check the API key and try again."
        });
    }
}

module.exports = { summarize, MAX_NOTES_LENGTH };
