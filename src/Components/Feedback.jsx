import { useState } from "react";
import "./Feedback.css";
import { Link } from "react-router-dom";

const categories = [
  { name: "Tone & Style", score: 70, badge: "Good Start", badgeType: "good" },
  { name: "Content",      score: 65, badge: "Good Start", badgeType: "good" },
  { name: "Structure",    score: 80, badge: "Strong",     badgeType: "strong" },
  { name: "Skills",       score: 70, badge: "Good Start", badgeType: "good" },
];

const atsData = {
  score: 75,
  headline: "Great Job!",
  description:
    "This score represents how well your resume is likely to perform in Applicant Tracking Systems used by employers.",
  passed: [
    "Clean formatting with clear section headers",
    "Consistent bullet point structure",
  ],
  warnings: [
    "Add more relevant keywords from job description",
    "Include a professional summary section",
  ],
};

function DonutChart({ score }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="rr-donut-wrap">
      <svg viewBox="0 0 100 100" className="rr-donut-svg">
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke="var(--rr-track)"
          strokeWidth="8"
        />
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke="var(--rr-accent)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
        />
      </svg>
      <div className="rr-donut-label">
        <span className="rr-donut-num">{score}</span>
        <span className="rr-donut-denom">/100</span>
      </div>
    </div>
  );
}

function CategoryRow({ name, score, badge, badgeType }) {
  return (
    <div className="rr-cat-row">
      <span className="rr-cat-name">{name}</span>
      <span className={`rr-badge rr-badge--${badgeType}`}>{badge}</span>
      <div className="rr-bar-track">
        <div
          className="rr-bar-fill"
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="rr-cat-score">
        {score}<span className="rr-cat-denom">/100</span>
      </span>
    </div>
  );
}

export default function ResumeReview({ onBack }) {
  const [showDetails, setShowDetails] = useState(false);
  const overall = Math.round(
    categories.reduce((s, c) => s + c.score, 0) / categories.length
  );

  return (
    <div className="rr-root">
      <button className="rr-back" onClick={onBack}>
       
      </button>

      <h1 className="rr-title">Resume Review</h1>

      {/* Score header */}
      <div className="rr-score-header">
        <DonutChart score={overall} />
        <div className="rr-score-desc">
          <h2 className="rr-score-heading">Your Resume Score</h2>
          <p className="rr-score-sub">
            This score is calculated based on the variables listed below.
          </p>
        </div>
      </div>

      {/* Category rows */}
      <div className="rr-categories">
        {categories.map((cat) => (
          <CategoryRow key={cat.name} {...cat} />
        ))}
      </div>

      {/* ATS card */}
      <div className="rr-ats-card">
        <div className="rr-ats-header">
          <div className="rr-ats-icon">📋</div>
          <span className="rr-ats-title">
            ATS Score — {atsData.score}/100
          </span>
        </div>
        <p className="rr-ats-headline">{atsData.headline}</p>
        <p className="rr-ats-desc">{atsData.description}</p>

        <ul className="rr-ats-list">
          {atsData.passed.map((item) => (
            <li key={item} className="rr-ats-item rr-ats-item--pass">
              <span className="rr-ats-icon-dot rr-ats-icon-dot--pass">✓</span>
              {item}
            </li>
          ))}
          {atsData.warnings.map((item) => (
            <li key={item} className="rr-ats-item rr-ats-item--warn">
              <span className="rr-ats-icon-dot rr-ats-icon-dot--warn">△</span>
              {item}
            </li>
          ))}
        </ul>

        <p className="rr-ats-footer">
          Keep refining your resume to improve your chances of getting past ATS
          filters and into the hands of recruiters.
        </p>
      </div>

      {/* Details toggle */}
      <button
        className="rr-details-btn"
        onClick={() => setShowDetails((v) => !v)}
      >
        {showDetails ? "Hide Details ↑" : "View Detailed Suggestions ↓"}
      </button>

      {showDetails && (
        <div className="rr-details">
          <h3 className="rr-details-heading">Detailed Suggestions</h3>
          <div className="rr-details-grid">
            {categories.map((cat) => (
              <div key={cat.name} className="rr-details-card">
                <div className="rr-details-card-top">
                  <span className="rr-details-name">{cat.name}</span>
                  <span className="rr-details-score">{cat.score}/100</span>
                </div>
                <div className="rr-details-bar-track">
                  <div
                    className="rr-details-bar-fill"
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
                <p className="rr-details-tip">
                  {cat.score >= 80
                    ? "Excellent! This section is well-optimized."
                    : cat.score >= 70
                    ? "Good foundation. Consider adding more specific examples."
                    : "Needs improvement. Focus on clarity and relevant details."}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}