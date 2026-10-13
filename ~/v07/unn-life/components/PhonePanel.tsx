"use client";

import { useEffect, useState } from "react";
import { usePlayerStore } from "@/lib/playerStore";
import { departments, FACULTY_ORDER, getDepartmentById, getAlternativesFor } from "@/lib/departments";
import {
  getHostelById, getRandomRoommates, offCampusOptions, getDeterministicHostel, hasAvailableBed,
} from "@/lib/hostels";

export default function PhonePanel({ onClose }: { onClose: () => void }) {
  const {
    preferredDepartment, offeredDepartment, enrolledDepartment, admissionStatus,
    setPreferredDepartment, receiveOffer, setNoOffer, acceptOffer, declineOffer,
    canApply, getCooldownRemaining, hostelStatus, allocateHostel, chooseOffCampus, gender: playerGender,
  } = usePlayerStore();
  const [cooldown, setCooldown] = useState(0);
  const gender: "boys" | "girls" = playerGender ?? "boys";

  useEffect(() => {
    const t = setInterval(() => setCooldown(getCooldownRemaining()), 1000);
    setCooldown(getCooldownRemaining());
    return () => clearInterval(t);
  }, [getCooldownRemaining]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const applyForCourse = (deptId: string) => {
    if (!canApply()) return;
    setPreferredDepartment(deptId);
    const preferred = getDepartmentById(deptId);
    if (!preferred) return;
    const roll = Math.random();
    const isHard = preferred.isProfessional || preferred.competition === "very_high";
    if (isHard && roll < 0.25) { setNoOffer(); return; }
    if (isHard && roll < 0.7) {
      const alts = getAlternativesFor(deptId);
      if (alts.length > 0) { receiveOffer(alts[Math.floor(Math.random() * alts.length)].id); return; }
    }
    receiveOffer(deptId);
  };

  const applyHostel = () => {
    if (!enrolledDepartment) return;
    const targetId = getDeterministicHostel(gender, enrolledDepartment, 1);
    if (!targetId) { allocateHostel(null, null, []); return; }
    if (hasAvailableBed(targetId)) {
      const h = getHostelById(targetId);
      const mates = getRandomRoommates((h?.simulatedOccupancy || 4) - 1, gender);
      allocateHostel(targetId, `Room ${Math.floor(Math.random() * 40) + 1}`, mates);
    } else {
      allocateHostel(null, null, []); // full: no silent reassignment
    }
  };

  const ok = canApply();
  const eligible = enrolledDepartment ? getDeterministicHostel(gender, enrolledDepartment, 1) : null;
  const showCourses =
    admissionStatus === "none" || admissionStatus === "no_offer" || (admissionStatus === "declined" && ok);

  return (
    <div className="sheet tall">
      <button className="x" onClick={onClose} aria-label="Close">✕</button>
      <div className="sheet-head">
        <div className="badge">📱</div>
        <div><h2>UNN Portal</h2><div className="sub">Admission and hostel</div></div>
      </div>

      {admissionStatus !== "accepted" && (
        <section>
          <h3>🎓 Admission</h3>
          {!ok && cooldown > 0 && <div className="warn">😂 Next application opens in {fmt(cooldown)}</div>}
          {showCourses && (
            <>
              <p className="blurb">Choose your preferred course. Outcomes: preferred, alternative, or no offer.</p>
              {FACULTY_ORDER.map((fac) => {
                const list = departments.filter((d) => d.faculty === fac);
                if (list.length === 0) return null;
                return (
                  <div key={fac}>
                    <h4 className="fac">{fac}</h4>
                    {list.map((d) => (
                      <button key={d.id} className="opt" disabled={!ok} onClick={() => applyForCourse(d.id)}>
                        {d.name} {d.isProfessional && "⭐"}
                        <small>{d.competition.replace("_", " ")} competition</small>
                      </button>
                    ))}
                  </div>
                );
              })}
            </>
          )}
          {admissionStatus === "offered" && offeredDepartment && (
            <div>
              <p className="blurb">Offer received for:<br /><strong>{getDepartmentById(offeredDepartment)?.name}</strong></p>
              {preferredDepartment && preferredDepartment !== offeredDepartment && (
                <p className="amber">You applied for {getDepartmentById(preferredDepartment)?.name} but received an alternative.<br />Chai! Anyway, we move. 😂</p>
              )}
              <div className="row">
                <button className="ok" onClick={acceptOffer}>Accept</button>
                <button className="no" onClick={declineOffer}>Decline</button>
              </div>
            </div>
          )}
          {admissionStatus === "no_offer" && (
            <div><p className="blurb"><strong>Chai! 😭 Admission no show this time.</strong></p>
              <p className="blurb">No panic, abeg. You fit prepare, explore campus, and try again when applications reopen.</p></div>
          )}
          {admissionStatus === "declined" && !ok && <p className="blurb">Offer declined. Explore campus while you wait.</p>}
        </section>
      )}

      {admissionStatus === "accepted" && hostelStatus !== "allocated" && hostelStatus !== "off_campus" && (
        <section>
          <h3>🏠 Hostel allocation</h3>
          {(hostelStatus === "none" || hostelStatus === "applied") && (
            <>
              <p className="blurb">Hostel allocation follows strict department rules (REPORTED arrangements).</p>
              <button className="opt center" onClick={applyHostel}>Apply for Hostel Allocation</button>
              <p className="hint">Eligible: {eligible ? getHostelById(eligible)?.name : "No specific rule"}</p>
            </>
          )}
          {hostelStatus === "missed" && (
            <div>
              <p className="blurb"><strong>You missed this allocation round. 😂</strong></p>
              <p className="blurb">Explore campus or pick an off-campus option.</p>
              {offCampusOptions.map((o) => (
                <button key={o.id} className="opt" onClick={() => chooseOffCampus(o.id)}>
                  {o.name} — ₦{o.monthlyRent.toLocaleString()}/mo
                  <small>{o.description} • {o.travelTimeMinutes} min away</small>
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {admissionStatus === "accepted" && (hostelStatus === "allocated" || hostelStatus === "off_campus") && (
        <section><h3>✅ All set</h3><p className="blurb">Admission and accommodation done. Check the Home tab for details.</p></section>
      )}
    </div>
  );
}
