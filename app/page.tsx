"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { usePlayerStore } from "@/lib/playerStore";
import { departments, getDepartmentById, getAlternativesFor } from "@/lib/departments";
import { hostels, getHostelsByType, getHostelById, getRandomRoommates, offCampusOptions } from "@/lib/hostels";

export default function Home() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const { 
    money, needs, setPosition, 
    preferredDepartment, offeredDepartment, enrolledDepartment, admissionStatus,
    setPreferredDepartment, receiveOffer, setNoOffer, acceptOffer, declineOffer,
    canApply, getCooldownRemaining,
    preferredHostel, allocatedHostel, hostelStatus, roomNumber, roommates,
    applyForHostel, allocateHostel, chooseOffCampus, accommodationType, offCampusId
  } = usePlayerStore();

  const [showAdmission, setShowAdmission] = useState(true);
  const [showHostel, setShowHostel] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [playerGender] = useState<"boys" | "girls">("boys");

  useEffect(() => {
    const interval = setInterval(() => setCooldown(getCooldownRemaining()), 1000);
    return () => clearInterval(interval);
  }, [getCooldownRemaining]);

  useEffect(() => {
    if (admissionStatus === "accepted" && hostelStatus === "none") setShowHostel(true);
  }, [admissionStatus, hostelStatus]);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [7.4085, 6.8673],
      zoom: 14.5,
    });
    map.current.addControl(new maplibregl.NavigationControl(), "top-right");
    const pois = [
      { name: "Abuja Building", lng: 7.405, lat: 6.868 },
      { name: "Chitis", lng: 7.41, lat: 6.866 },
      { name: "Alvan Ikoku Hostel", lng: 7.412, lat: 6.865 },
      { name: "Shuttle Park", lng: 7.407, lat: 6.87 },
    ];
    pois.forEach((poi) => {
      new maplibregl.Marker({ color: "#1F4E79" })
        .setLngLat([poi.lng, poi.lat])
        .setPopup(new maplibregl.Popup().setHTML(`<b>${poi.name}</b>`))
        .addTo(map.current!);
    });
    map.current.on("click", (e) => setPosition(e.lngLat.lng, e.lngLat.lat));
  }, [setPosition]);

  const applyForCourse = (deptId: string) => {
    if (!canApply()) return;
    setPreferredDepartment(deptId);
    const preferred = getDepartmentById(deptId);
    if (!preferred) return;

    const roll = Math.random();
    const isHard = preferred.isProfessional || preferred.competition === "very_high";

    if (isHard && roll < 0.25) {
      // No offer this cycle
      setNoOffer();
      return;
    }
    if (isHard && roll < 0.70) {
      const alts = getAlternativesFor(deptId);
      if (alts.length > 0) {
        receiveOffer(alts[Math.floor(Math.random() * alts.length)].id);
        return;
      }
    }
    receiveOffer(deptId);
  };

  const applyHostel = (hostelId: string) => {
    applyForHostel(hostelId);
    const roll = Math.random();
    const preferred = getHostelById(hostelId);
    if (!preferred) return;

    if (roll < 0.35) {
      const mates = getRandomRoommates(preferred.simulatedOccupancy - 1);
      allocateHostel(hostelId, `Room ${Math.floor(Math.random() * 40) + 1}`, mates);
    } else if (roll < 0.70) {
      const others = getHostelsByType(playerGender).filter(h => h.id !== hostelId);
      if (others.length) {
        const alt = others[Math.floor(Math.random() * others.length)];
        const mates = getRandomRoommates(alt.simulatedOccupancy - 1);
        allocateHostel(alt.id, `Room ${Math.floor(Math.random() * 40) + 1}`, mates);
      } else {
        allocateHostel(null, null, []);
      }
    } else {
      allocateHostel(null, null, []);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <main style={{ height: "100vh", position: "relative" }}>
      <div ref={mapContainer} style={{ height: "100%", width: "100%" }} />
      
      <div style={{
        position: "absolute", top: 16, left: 16, background: "rgba(0,0,0,0.8)",
        padding: "12px 16px", borderRadius: 8, fontSize: 14, minWidth: 200, zIndex: 10,
      }}>
        <div style={{ fontWeight: "bold", marginBottom: 8 }}>UNN Life</div>
        <div>₦ {money.toLocaleString()}</div>
        <div style={{ marginTop: 6 }}>Hunger: {needs.hunger}</div>
        <div>Energy: {needs.energy}</div>
        <div>Fun: {needs.fun}</div>
        <div>Social: {needs.social}</div>
        {enrolledDepartment && (
          <div style={{ marginTop: 8, color: "#4ade80" }}>
            Dept: {getDepartmentById(enrolledDepartment)?.name}
          </div>
        )}
        {allocatedHostel && (
          <div style={{ marginTop: 4, color: "#60a5fa" }}>
            Hostel: {getHostelById(allocatedHostel)?.name}
            {roomNumber && <div style={{ fontSize: 12 }}>{roomNumber}</div>}
          </div>
        )}
        {accommodationType === "off_campus" && offCampusId && (
          <div style={{ marginTop: 4, color: "#fbbf24" }}>
            Off-campus: {offCampusOptions.find(o => o.id === offCampusId)?.name}
          </div>
        )}
      </div>

      {/* Admission Panel */}
      {showAdmission && admissionStatus !== "accepted" && (
        <div style={{
          position: "absolute", top: 16, right: 16, background: "rgba(15, 23, 42, 0.95)",
          padding: "16px", borderRadius: 12, width: 340, maxHeight: "75vh", overflowY: "auto",
          zIndex: 10, border: "1px solid #334155",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 16 }}>Admission</h3>
            <button onClick={() => setShowAdmission(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}>✕</button>
          </div>

          {!canApply() && cooldown > 0 && (
            <div style={{ background: "#422006", padding: "10px", borderRadius: 8, marginBottom: 12, fontSize: 13 }}>
              😂 Next application opens in {formatTime(cooldown)}
            </div>
          )}

          {(admissionStatus === "none" || admissionStatus === "no_offer" || (admissionStatus === "declined" && canApply())) && (
            <>
              <p style={{ fontSize: 13, color: "#cbd5e1", marginBottom: 12 }}>
                Choose your preferred course. Outcomes: preferred, alternative, or no offer.
              </p>
              {departments.filter(d => d.isProfessional || ["zoology", "computer_science", "economics"].includes(d.id)).slice(0, 10).map(dept => (
                <button
                  key={dept.id}
                  onClick={() => applyForCourse(dept.id)}
                  disabled={!canApply()}
                  style={{
                    display: "block", width: "100%", textAlign: "left",
                    background: canApply() ? "#1e293b" : "#334155",
                    border: "1px solid #334155", color: "#e2e8f0",
                    padding: "8px 12px", borderRadius: 6, marginBottom: 6,
                    cursor: canApply() ? "pointer" : "not-allowed", fontSize: 13,
                    opacity: canApply() ? 1 : 0.6,
                  }}
                >
                  {dept.name} {dept.isProfessional && "⭐"}
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>{dept.faculty} • {dept.competition}</div>
                </button>
              ))}
            </>
          )}

          {admissionStatus === "offered" && offeredDepartment && (
            <div>
              <p style={{ fontSize: 14, marginBottom: 8 }}>
                Offer received for:<br />
                <strong>{getDepartmentById(offeredDepartment)?.name}</strong>
              </p>
              {preferredDepartment && preferredDepartment !== offeredDepartment && (
                <p style={{ fontSize: 12, color: "#fbbf24", marginBottom: 12 }}>
                  You applied for {getDepartmentById(preferredDepartment)?.name} but received an alternative.
                  <br />Chai! Anyway, we move. 😂
                </p>
              )}
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={acceptOffer} style={{ flex: 1, background: "#16a34a", color: "white", border: "none", padding: "8px", borderRadius: 6, cursor: "pointer" }}>Accept</button>
                <button onClick={declineOffer} style={{ flex: 1, background: "#dc2626", color: "white", border: "none", padding: "8px", borderRadius: 6, cursor: "pointer" }}>Decline</button>
              </div>
            </div>
          )}

          {admissionStatus === "no_offer" && (
            <div>
              <p style={{ fontSize: 14, marginBottom: 8 }}>Chai! 😭 Admission no show this time.</p>
              <p style={{ fontSize: 12, color: "#cbd5e1" }}>
                No panic, abeg. You fit prepare, explore campus, and try again when applications reopen.
              </p>
            </div>
          )}

          {admissionStatus === "declined" && !canApply() && (
            <p style={{ fontSize: 13, color: "#cbd5e1" }}>Offer declined. Explore campus while you wait.</p>
          )}
        </div>
      )}

      {/* Hostel Panel */}
      {showHostel && admissionStatus === "accepted" && hostelStatus !== "allocated" && hostelStatus !== "off_campus" && (
        <div style={{
          position: "absolute", top: 16, right: 16, background: "rgba(15, 23, 42, 0.95)",
          padding: "16px", borderRadius: 12, width: 340, maxHeight: "75vh", overflowY: "auto",
          zIndex: 10, border: "1px solid #334155",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 16 }}>🏠 Hostel Allocation</h3>
            <button onClick={() => setShowHostel(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}>✕</button>
          </div>

          {hostelStatus === "none" && (
            <>
              <p style={{ fontSize: 13, color: "#cbd5e1", marginBottom: 12 }}>
                Apply for a hostel. You might get preferred, something else, or miss this round.
              </p>
              {getHostelsByType(playerGender).map(hostel => (
                <button
                  key={hostel.id}
                  onClick={() => applyHostel(hostel.id)}
                  style={{
                    display: "block", width: "100%", textAlign: "left",
                    background: "#1e293b", border: "1px solid #334155", color: "#e2e8f0",
                    padding: "8px 12px", borderRadius: 6, marginBottom: 6, cursor: "pointer", fontSize: 13,
                  }}
                >
                  {hostel.name}
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>
                    Official {hostel.officialCapacityPerRoom}/room • Simulated ~{hostel.simulatedOccupancy}
                  </div>
                </button>
              ))}
              <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid #334155" }}>
                <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>Or consider off-campus:</p>
                {offCampusOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => chooseOffCampus(opt.id)}
                    style={{
                      display: "block", width: "100%", textAlign: "left",
                      background: "#1e293b", border: "1px solid #334155", color: "#e2e8f0",
                      padding: "8px 12px", borderRadius: 6, marginBottom: 6, cursor: "pointer", fontSize: 12,
                    }}
                  >
                    {opt.name} — ₦{opt.monthlyRent.toLocaleString()}/mo
                  </button>
                ))}
              </div>
            </>
          )}

          {hostelStatus === "missed" && (
            <div>
              <p style={{ fontSize: 14, marginBottom: 8 }}>You missed this allocation round. 😂</p>
              <p style={{ fontSize: 12, color: "#cbd5e1", marginBottom: 12 }}>
                Explore campus or pick an off-campus option.
              </p>
              {offCampusOptions.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => chooseOffCampus(opt.id)}
                  style={{
                    display: "block", width: "100%", textAlign: "left",
                    background: "#1e293b", border: "1px solid #334155", color: "#e2e8f0",
                    padding: "8px 12px", borderRadius: 6, marginBottom: 6, cursor: "pointer", fontSize: 12,
                  }}
                >
                  {opt.name} — ₦{opt.monthlyRent.toLocaleString()}/mo
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {allocatedHostel && roommates.length > 0 && (
        <div style={{
          position: "absolute", top: 380, right: 16, background: "rgba(15, 23, 42, 0.95)",
          padding: "12px", borderRadius: 12, width: 340, zIndex: 10,
          border: "1px solid #334155", fontSize: 13,
        }}>
          <strong>Roommates in {roomNumber}</strong>
          {roommates.map((m) => (
            <div key={m.id} style={{ marginTop: 6, color: "#cbd5e1" }}>
              {m.name} — {m.personality}
              <div style={{ fontSize: 11, color: "#94a3b8" }}>{m.department} • {m.financialSituation}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{
        position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
        background: "rgba(0,0,0,0.75)", padding: "8px 16px", borderRadius: 20, fontSize: 13, zIndex: 10,
      }}>
        Click map to move • Prototype v0.5
      </div>
    </main>
  );
}
