import { useState } from "react";

function App() {

    const [notes, setNotes] = useState("");
    const [summary, setSummary] = useState("");

    const handleSummarize = async () => {

        if (!notes.trim()) {
            alert("Please enter some notes.");
            return;
        }

        try {

            const response = await fetch(
                "http://localhost:5000/api/summarize",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        notes: notes
                    })
                }
            );

            const data = await response.json();

            setSummary(data.summary);

        } catch (error) {

            console.error(error);

            alert("Could not connect to backend.");

        }
    };

    return (
        <div style={{ padding: "40px" }}>

            <h1>AI Notes Summarizer</h1>

            <textarea
                rows="15"
                cols="70"
                placeholder="Paste your notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
            />

            <br />
            <br />

            <button onClick={handleSummarize}>
                Summarize
            </button>

            <h2>Summary</h2>

            <p>{summary}</p>

        </div>
    );
}

export default App;