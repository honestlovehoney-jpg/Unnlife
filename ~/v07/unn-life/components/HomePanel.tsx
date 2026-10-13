"use client";

import { usePlayerStore } from "@/lib/playerStore";
import { getDepartmentById } from "@/lib/departments";
import { getHostelById, offCampusOptions } from "@/lib/hostels";

export default function HomePanel({ onClose, onPhone }: { onClose: () => void; onPhone: () => void }) {
  const { enrolledDepartment, allocatedHostel, roomNumber, roommates, accommodationType, offCampusId } = usePlayerStore();
  const hostel = allocatedHostel ? getHostelById(allocatedHostel) : null;
  const off = offCampusId ? offCampusOptions.find((o) => o.id === offCampusId) : null;

  return (
    <div className="sheet tall">
      <button className="x" onClick={onClose} aria-label="Close">✕</button>
      <div className="sheet-head">
        <div className="badge">🏠</div>
        <div><h2>Home</h2><div className="sub">Your room and your people</div></div>
      </div>

      <div className="card">🎓 {enrolledDepartment ? getDepartmentById(enrolledDepartment)?.name : "Not admitted yet"}</div>

      {hostel && (
        <>
          <div className="card">🛏️ {hostel.name}{roomNumber ? ` • ${roomNumber}` : ""}</div>
          {roommates.length > 0 && (
            <>
              <h3>Roommates</h3>
              {roommates.map((m) => (
                <div key={m.id} className="mate">
                  <strong>{m.name}</strong> — {m.personality}
                  <small>{m.department} • {m.financialSituation}</small>
                </div>
              ))}
            </>
          )}
        </>
      )}
      {accommodationType === "off_campus" && off && (
        <div className="card">🏘️ {off.name} • ₦{off.monthlyRent.toLocaleString()}/mo<small>{off.description}</small></div>
      )}
      {!hostel && !off && (
        <div className="card">
          No accommodation yet.
          <button className="opt center" style={{ marginTop: 8 }} onClick={onPhone}>Open UNN Portal</button>
        </div>
      )}
    </div>
  );
}
