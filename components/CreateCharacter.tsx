"use client";

export default function CreateCharacter({ onPick }: { onPick: (g: "boys" | "girls") => void }) {
  return (
    <div className="create">
      <div className="create-card">
        <div className="create-badge">🎓</div>
        <h1>UNN Life</h1>
        <p>Create your student. You can't change this later, and it decides your hostel and roommates.</p>
        <div className="create-row">
          <button onClick={() => onPick("boys")}>
            <span>👨🏾‍🎓</span>
            Male
          </button>
          <button onClick={() => onPick("girls")}>
            <span>👩🏾‍🎓</span>
            Female
          </button>
        </div>
      </div>
    </div>
  );
}
