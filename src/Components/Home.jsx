import { useState, useRef } from "react";
import "./Home.css";

const stats = [
  { num: "94", suffix: "%", label: "ATS pass rate" },
  { num: "127k", suffix: "+", label: "Resumes analysed" },
  { num: "3.2", suffix: "×", label: "More interviews" },
];

export default function Home() {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const uploadFile = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Server error");
      }

      const data = await res.json();
      setResult(data.analysis); // { score, strengths, weaknesses, suggestions }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const acceptFile = (f) => { if (f) setFile(f); };
  const handleDrag = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); acceptFile(e.dataTransfer.files[0]); };
  const handleClick = () => inputRef.current.click();
  const handleInputChange = (e) => acceptFile(e.target.files[0]);

  return (
    <div className="rm-root">

      {/* HERO */}
      <section className="rm-hero">
        <div className="rm-badge">
          <span className="rm-badge-dot" />
          AI-Powered Resume Intelligence
        </div>
        <h1 className="rm-h1">
          Your resume,<br /><em>brutally honest.</em>
        </h1>
        <p className="rm-sub">
          Upload your CV and get an instant ATS score, skill gap analysis,
          and rewrite suggestions — powered by AI that thinks like a recruiter.
        </p>
        <div className="rm-actions">
          <button
            className="rm-btn-primary"
            onClick={uploadFile}
            disabled={!file || loading}
          >
            {loading ? "Analysing…" : "Analyse My Resume"} <span>↑</span>
          </button>
          <button className="rm-btn-secondary">See a Sample Report</button>
        </div>
      </section>

      {/* UPLOAD */}
      <div className="rm-upload-wrap">
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          style={{ display: "none" }}
          onChange={handleInputChange}
        />
        <div
          className={`rm-upload-card${dragOver ? " drag-over" : ""}`}
          onClick={handleClick}
          onDragOver={handleDrag}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{ cursor: "pointer" }}
        >
          {file ? (
            <>
              <div className="rm-upload-icon">✅</div>
              <div className="rm-upload-title">{file.name}</div>
              <div className="rm-upload-sub">
                {(file.size / 1024).toFixed(1)} KB —{" "}
                <span onClick={(e) => { e.stopPropagation(); setFile(null); setResult(null); }}>
                  remove
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="rm-upload-icon">📄</div>
              <div className="rm-upload-title">Drop your resume here</div>
              <div className="rm-upload-sub">
                or <span>click to browse</span> your files
              </div>
              <div className="rm-formats">
                {["PDF", "DOCX", "TXT", "up to 5MB"].map((f) => (
                  <span key={f} className="rm-fmt-pill">{f}</span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* STATS BAR */}
      <div className="rm-stats-wrap">
        <div className="rm-stats-bar">
          {stats.map(({ num, suffix, label }) => (
            <div key={label} className="rm-stat">
              <div className="rm-stat-num">{num}<span>{suffix}</span></div>
              <div className="rm-stat-lbl">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="rm-error">
          ⚠️ {error}
        </div>
      )}

      {/* RESULT */}
      {result && (
        <div className="rm-result">
          {/* SCORE */}
          <div className="rm-score">
            <div className="rm-score-circle">
              <span>{result.score}</span>
              <small>/100</small>
            </div>
            <div className="rm-score-label">ATS Score</div>
          </div>

          {/* STRENGTHS */}
          <div className="rm-section">
            <h4>✅ Strengths</h4>
            <ul>
              {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>

          {/* WEAKNESSES */}
          <div className="rm-section">
            <h4>⚠️ Weaknesses</h4>
            <ul>
              {result.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>

          {/* SUGGESTIONS */}
          <div className="rm-section">
            <h4>💡 Suggestions</h4>
            <ul>
              {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        </div>
      )}

    </div>
  );
}