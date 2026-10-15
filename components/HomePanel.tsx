"use client";

import { usePlayerStore } from "@/lib/playerStore";
import { getDepartmentById } from "@/lib/departments";
import { getHostelById, offCampusOptions } from "@/lib/hostels";
import type { RoomAction } from "@/lib/roomActions";
import RoomView from "@/components/RoomView";

interface Props {
  onClose: () => void;
  onPhone: () => void;
  /** false when the player is out on campus, away from their hostel */
  atHome: boolean;
  onGoHome: () => void;
  onAct: (a: RoomAction) => void;
}

export default function HomePanel({ onClose, onPhone, atHome, onGoHome, onAct }: Props) {
  const {
    enrolledDepartment, allocatedHostel, roomNumber, roommates, accommodationType,
    offCampusId, gender, gameMinutes, money, needs,
  } = usePlayerStore();
  const hostel = allocatedHostel ? getHostelById(allocatedHostel) : null;
  const off = offCampusId ? offCampusOptions.find((o) => o.id === offCampusId) : null;

  const hour = Math.floor((gameMinutes % 1440) / 60);
  const night = hour < 6 || hour >= 19;
  // roommates are all in at night; in the daytime about half are in class
  const present = roommates.filter((_, i) => night || i % 2 === 0).length;
  const bunks = Math.max(1, Math.min(4, Math.ceil((roommates.length + 1) / 2)));
  const theme = hostel ? (gender === "girls" ? "girls" : "boys") : "flat";
  const hasRoom = !!hostel || (accommodationType === "off_campus" && !!off);

  return (
    <div className="sheet tall">
      <button className="x" onClick={onClose} aria-label="Close">✕</button>
      <div className="sheet-head">
        <div className="badge">🏠</div>
        <div>
          <h2>Home</h2>
          <div className="sub">
            {hostel ? `${hostel.name}${roomNumber ? ` • ${roomNumber}` : ""}` : off ? off.name : "No room yet"}
          </div>
        </div>
      </div>

      {hasRoom && atHome && (
        <RoomView
          theme={theme}
          bunks={bunks}
          people={hostel ? Math.min(3, present) : 0}
          night={night}
          money={money}
          needs={needs}
          onAct={onAct}
          onOutside={onClose}
        />
      )}
      {hasRoom && !atHome && (
        <div className="card">
          You are not in your room. Walk or ride back to {hostel?.name} first.
          <button className="opt center" style={{ marginTop: 8 }} onClick={onGoHome}>Show my hostel on the map</button>
        </div>
      )}

      <div className="card">🎓 {enrolledDepartment ? getDepartmentById(enrolledDepartment)?.name : "Not admitted yet"}</div>

      {hostel && roommates.length > 0 && (
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
      {accommodationType === "off_campus" && off && (
        <div className="card">🏘️ {off.name} • ₦{off.monthlyRent.toLocaleString()}/mo<small>{off.description}</small></div>
      )}
      {!hasRoom && (
        <div className="card">
          No accommodation yet.
          <button className="opt center" style={{ marginTop: 8 }} onClick={onPhone}>Open UNN Portal</button>
        </div>
      )}
    </div>
  );
}
