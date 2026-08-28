import { useMemo, useState } from "react";

const STYLES = [
    { id: "short", label: "Short" },
    { id: "medium", label: "Medium" },
    { id: "detailed", label: "Detailed" }
];

const MAX_NOTES_LENGTH = 15000;

function App() {
    const [notes, setNotes] = useState("");
    const [style, setStyle] = useState("medium");
    const [summary, setSummary] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const charCount = notes.length;
    const canSummarize = notes.trim().length > 0 && !loading && charCount <= MAX_NOTES_LENGTH;

    const statusLabel = useMemo(() => {
        if (loading) {
            return "Generating summary…";
        }
        if (summary) {
            return "Summary ready";
        }
        return "Paste notes to get started";
    }, [loading, summary]);

    const handleSummarize = async () => {
        if (!notes.trim()) {
            setError("Please enter some notes.");
            return;
        }

        if (charCount > MAX_NOTES_LENGTH) {
            setError(`Notes are too long. Maximum is ${MAX_NOTES_LENGTH.toLocaleString()} characters.`);
            return;
        }

        setLoading(true);
        setError("");
        setCopied(false);

        try {
            const response = await fetch("/api/summarize", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    notes,
                    style
                })
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.error || "Could not generate a summary.");
            }

            setSummary(data.summary || "");
        } catch (err) {
            console.error(err);
            setSummary("");
            setError(
                err.message === "Failed to fetch"
                    ? "Could not connect to the backend. Start the server on port 5000."
                    : err.message
            );
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
            event.preventDefault();
            if (canSummarize) {
                handleSummarize();
            }
        }
    };

    const handleCopy = async () => {
        if (!summary) {
            return;
        }

        try {
            await navigator.clipboard.writeText(summary);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
        } catch {
            setError("Could not copy the summary.");
        }
    };

    const handleClear = () => {
        setNotes("");
        setSummary("");
        setError("");
        setCopied(false);
    };

    return (
        <div className="app">
            <header className="hero-bar">
                <div>
                    <p className="eyebrow">Study helper</p>
                    <h1>AI Notes Summarizer</h1>
                    <p className="lede">
                        Paste lecture notes, meeting minutes, or a messy draft. Get a clean summary you can copy and keep.
                    </p>
                </div>
                <p className="status" aria-live="polite">
                    {statusLabel}
                </p>
            </header>

            <main className="layout">
                <section className="panel" aria-labelledby="notes-heading">
                    <div className="panel-header">
                        <h2 id="notes-heading">Your notes</h2>
                        <span className={charCount > MAX_NOTES_LENGTH ? "count over" : "count"}>
                            {charCount.toLocaleString()} / {MAX_NOTES_LENGTH.toLocaleString()}
                        </span>
                    </div>

                    <label className="sr-only" htmlFor="notes">
                        Notes to summarize
                    </label>
                    <textarea
                        id="notes"
                        placeholder="Paste your notes here…"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />

                    <div className="toolbar">
                        <fieldset className="styles">
                            <legend className="sr-only">Summary length</legend>
                            {STYLES.map((option) => (
                                <label key={option.id} className={style === option.id ? "chip active" : "chip"}>
                                    <input
                                        type="radio"
                                        name="style"
                                        value={option.id}
                                        checked={style === option.id}
                                        onChange={() => setStyle(option.id)}
                                    />
                                    {option.label}
                                </label>
                            ))}
                        </fieldset>

                        <div className="actions">
                            <button type="button" className="ghost" onClick={handleClear} disabled={!notes && !summary}>
                                Clear
                            </button>
                            <button type="button" onClick={handleSummarize} disabled={!canSummarize}>
                                {loading ? "Summarizing…" : "Summarize"}
                            </button>
                        </div>
                    </div>
                    <p className="hint">Press Ctrl + Enter to summarize</p>
                </section>

                <section className="panel" aria-labelledby="summary-heading">
                    <div className="panel-header">
                        <h2 id="summary-heading">Summary</h2>
                        <button type="button" className="ghost" onClick={handleCopy} disabled={!summary}>
                            {copied ? "Copied" : "Copy"}
                        </button>
                    </div>

                    {error ? (
                        <p className="error" role="alert">
                            {error}
                        </p>
                    ) : null}

                    {loading ? (
                        <p className="placeholder">Reading your notes and writing a summary…</p>
                    ) : summary ? (
                        <p className="summary">{summary}</p>
                    ) : (
                        <p className="placeholder">
                            Your summary will appear here. Choose Short, Medium, or Detailed before you run it.
                        </p>
                    )}
                </section>
            </main>
        </div>
    );
}

export default App;
