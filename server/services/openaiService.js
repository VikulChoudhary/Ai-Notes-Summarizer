const OpenAI = require("openai");

const STYLES = {
    short: "Write a concise summary in 2–3 sentences.",
    medium: "Write a clear summary in 1–2 short paragraphs covering the main points.",
    detailed:
        "Write a structured summary. Cover the main ideas, important details, and any action items. Use short paragraphs or bullets where it helps readability."
};

function getClient() {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        const error = new Error("OPENAI_API_KEY is not set.");
        error.code = "MISSING_API_KEY";
        throw error;
    }

    return new OpenAI({ apiKey });
}

async function summarizeNotes(notes, style = "medium") {
    const client = getClient();
    const instruction = STYLES[style] || STYLES.medium;

    const completion = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.3,
        max_tokens: 900,
        messages: [
            {
                role: "system",
                content:
                    "You are a careful notes summarizer. Do not invent facts. " +
                    "If the notes are incomplete or unclear, say so briefly. " +
                    instruction
            },
            {
                role: "user",
                content: notes
            }
        ]
    });

    const summary = completion.choices[0]?.message?.content?.trim();

    if (!summary) {
        throw new Error("The model returned an empty summary.");
    }

    return summary;
}

module.exports = { summarizeNotes };
