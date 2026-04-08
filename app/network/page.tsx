"use client";

import { useEffect, useState, useMemo, FormEvent } from "react";
import { Container, Pill, Button } from "@/components/ui";
import Link from "next/link";

interface NetworkLocation {
  id: string;
  name: string;
  role: string;
  organization: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  type: "team" | "enrolled";
}

interface Cluster {
  locations: NetworkLocation[];
  lat: number;
  lng: number;
  count: number;
}

// US States for filter
const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA",
  "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT",
  "VA", "WA", "WV", "WI", "WY", "DC"
];

const MAP_BOUNDS = {
  north: 49.384358,
  south: 24.396308,
  west: -125.0,
  east: -66.93457,
};

function latLngToPosition(lat: number, lng: number) {
  const x = ((lng - MAP_BOUNDS.west) / (MAP_BOUNDS.east - MAP_BOUNDS.west)) * 100;
  const y = ((MAP_BOUNDS.north - lat) / (MAP_BOUNDS.north - MAP_BOUNDS.south)) * 100;
  return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
}

// Simple clustering algorithm
function clusterLocations(locations: NetworkLocation[], threshold: number = 3): (NetworkLocation | Cluster)[] {
  if (locations.length < 5) return locations;
  
  const clusters: Cluster[] = [];
  const used = new Set<string>();
  
  locations.forEach(loc => {
    if (used.has(loc.id)) return;
    
    const nearby = locations.filter(other => {
      if (used.has(other.id) || other.id === loc.id) return false;
      const dist = Math.sqrt(Math.pow(loc.lat - other.lat, 2) + Math.pow(loc.lng - other.lng, 2));
      return dist < threshold;
    });
    
    if (nearby.length >= 2) {
      const allInCluster = [loc, ...nearby];
      allInCluster.forEach(l => used.add(l.id));
      clusters.push({
        locations: allInCluster,
        lat: allInCluster.reduce((sum, l) => sum + l.lat, 0) / allInCluster.length,
        lng: allInCluster.reduce((sum, l) => sum + l.lng, 0) / allInCluster.length,
        count: allInCluster.length,
      });
    }
  });
  
  const remaining = locations.filter(l => !used.has(l.id));
  return [...remaining, ...clusters];
}

function isCluster(item: NetworkLocation | Cluster): item is Cluster {
  return 'count' in item;
}

export default function NetworkPage() {
  const [locations, setLocations] = useState<NetworkLocation[]>([]);
  const [selectedPin, setSelectedPin] = useState<NetworkLocation | null>(null);
  const [expandedCluster, setExpandedCluster] = useState<Cluster | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [filterType, setFilterType] = useState<"all" | "team" | "enrolled">("all");
  const [filterState, setFilterState] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [enableClustering, setEnableClustering] = useState(true);
  
  // Enrollment form
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [enrollForm, setEnrollForm] = useState({
    practiceName: "", contactName: "", email: "", phone: "", city: "", state: "", specialty: "", message: ""
  });
  const [enrollStatus, setEnrollStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  useEffect(() => {
    fetch("/api/network/locations")
      .then((res) => res.json())
      .then((data) => { setLocations(data.locations || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Filtered locations
  const filteredLocations = useMemo(() => {
    return locations.filter(loc => {
      if (filterType !== "all" && loc.type !== filterType) return false;
      if (filterState !== "all" && loc.state !== filterState) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return loc.name.toLowerCase().includes(query) ||
               loc.city.toLowerCase().includes(query) ||
               loc.organization.toLowerCase().includes(query);
      }
      return true;
    });
  }, [locations, filterType, filterState, searchQuery]);

  // Clustered items
  const displayItems = useMemo(() => {
    if (!enableClustering) return filteredLocations;
    return clusterLocations(filteredLocations);
  }, [filteredLocations, enableClustering]);

  const teamCount = filteredLocations.filter((l) => l.type === "team").length;
  const enrolledCount = filteredLocations.filter((l) => l.type === "enrolled").length;
  const statesWithLocations = [...new Set(locations.map(l => l.state))].sort();

  async function handleEnrollSubmit(e: FormEvent) {
    e.preventDefault();
    setEnrollStatus("submitting");
    try {
      const res = await fetch("/api/crm/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: enrollForm.contactName,
          email: enrollForm.email,
          organization: enrollForm.practiceName,
          message: `NETWORK ENROLLMENT REQUEST\n\nPractice: ${enrollForm.practiceName}\nContact: ${enrollForm.contactName}\nPhone: ${enrollForm.phone}\nLocation: ${enrollForm.city}, ${enrollForm.state}\nSpecialty: ${enrollForm.specialty}\n\nMessage: ${enrollForm.message}`,
        }),
      });
      if (res.ok) {
        setEnrollStatus("success");
        setEnrollForm({ practiceName: "", contactName: "", email: "", phone: "", city: "", state: "", specialty: "", message: "" });
      } else {
        setEnrollStatus("error");
      }
    } catch {
      setEnrollStatus("error");
    }
  }

  return (
    <main>
      <Container className="py-14 md:py-20">
        <div className="mb-4"><Pill>Network</Pill></div>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">MedPACT Network Map</h1>
        <p className="mt-4 max-w-2xl text-base text-black/70 md:text-lg">
          Explore the growing MedPACT network across the United States. Filter by type, state, or search for specific practices.
        </p>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap gap-3 items-center">
          <div className="flex gap-2">
            {(["all", "team", "enrolled"] as const).map(type => (
              <button key={type} onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filterType === type ? "bg-black text-white" : "bg-gray-100 hover:bg-gray-200"}`}>
                {type === "all" ? "All" : type === "team" ? `Team (${locations.filter(l => l.type === "team").length})` : `Enrolled (${locations.filter(l => l.type === "enrolled").length})`}
              </button>
            ))}
          </div>
          <select value={filterState} onChange={(e) => setFilterState(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-black/15 text-sm bg-white">
            <option value="all">All States</option>
            {statesWithLocations.map(state => <option key={state} value={state}>{state}</option>)}
          </select>
          <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-black/15 text-sm w-40" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={enableClustering} onChange={(e) => setEnableClustering(e.target.checked)} className="rounded" />
            Cluster pins
          </label>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="inline-block h-4 w-4 rounded-full bg-[#1e3a5f]"></span>
            <span>Team Members ({teamCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-4 w-4 rounded-full bg-green-500"></span>
            <span>Enrolled Practices ({enrolledCount})</span>
          </div>
          {enableClustering && <div className="flex items-center gap-2">
            <span className="inline-block h-5 w-5 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center font-bold">3+</span>
            <span>Clustered locations</span>
          </div>}
        </div>

        {/* Map Container */}
        <div className="mt-6 relative rounded-3xl border border-black/10 bg-white p-4 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex h-96 items-center justify-center text-black/50">Loading network map...</div>
          ) : (
            <div className="relative w-full" style={{ paddingBottom: "62.5%" }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Map_of_USA_with_state_names.svg/1280px-Map_of_USA_with_state_names.svg.png"
                alt="US Map" className="absolute inset-0 w-full h-full object-contain opacity-90"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />

              {/* Pins and Clusters */}
              {displayItems.map((item, idx) => {
                if (isCluster(item)) {
                  const pos = latLngToPosition(item.lat, item.lng);
                  return (
                    <button key={`cluster-${idx}`}
                      onClick={() => setExpandedCluster(expandedCluster === item ? null : item)}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 transition-transform hover:scale-110"
                      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
                      <div className="w-10 h-10 rounded-full bg-purple-500 text-white font-bold flex items-center justify-center shadow-lg border-2 border-white">
                        {item.count}
                      </div>
                    </button>
                  );
                }
                const loc = item;
                const pos = latLngToPosition(loc.lat, loc.lng);
                const isTeam = loc.type === "team";
                return (
                  <button key={loc.id}
                    onClick={() => setSelectedPin(selectedPin?.id === loc.id ? null : loc)}
                    className={`absolute transform -translate-x-1/2 -translate-y-full transition-all duration-200 hover:scale-125 z-10 ${selectedPin?.id === loc.id ? "scale-125 z-20" : ""}`}
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    title={`${loc.name} - ${loc.city}, ${loc.state}`}>
                    <svg width="24" height="32" viewBox="0 0 24 32" fill="none" className="drop-shadow-md">
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20c0-6.627-5.373-12-12-12z" fill={isTeam ? "#1e3a5f" : "#22c55e"} />
                      <circle cx="12" cy="12" r="5" fill="white" />
                    </svg>
                  </button>
                );
              })}
            </div>
          )}

          {/* Expanded Cluster Modal */}
          {expandedCluster && (
            <div className="mt-4 rounded-2xl bg-purple-50 p-4 border border-purple-200">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">Cluster: {expandedCluster.count} locations</h3>
                <button onClick={() => setExpandedCluster(null)} className="text-black/40 hover:text-black/70">×</button>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {expandedCluster.locations.map(loc => (
                  <button key={loc.id} onClick={() => { setSelectedPin(loc); setExpandedCluster(null); }}
                    className="text-left p-2 rounded-lg bg-white border border-black/10 hover:border-purple-300 text-sm">
                    <div className="font-medium">{loc.name}</div>
                    <div className="text-black/50">{loc.city}, {loc.state}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selected Pin Info */}
          {selectedPin && (
            <div className="mt-4 rounded-2xl bg-black/5 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-lg">{selectedPin.name}</div>
                  {selectedPin.role && <div className="text-sm text-black/60">{selectedPin.role}</div>}
                  {selectedPin.organization && <div className="text-sm text-black/60">{selectedPin.organization}</div>}
                  <div className="mt-1 text-sm">📍 {selectedPin.city}, {selectedPin.state}</div>
                  <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    selectedPin.type === "team" ? "bg-[#1e3a5f] text-white" : "bg-green-500 text-white"}`}>
                    {selectedPin.type === "team" ? "Team Member" : "Enrolled Practice"}
                  </span>
                </div>
                <button onClick={() => setSelectedPin(null)} className="text-black/40 hover:text-black/70 text-xl">×</button>
              </div>
            </div>
          )}
        </div>

        {/* Location List */}
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Network Locations ({filteredLocations.length})</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {filteredLocations.slice(0, 12).map((loc) => (
              <button key={loc.id} onClick={() => setSelectedPin(loc)}
                className={`text-left rounded-2xl border p-4 transition-all hover:shadow-md ${
                  selectedPin?.id === loc.id ? "border-[#1e3a5f] bg-[#1e3a5f]/5" : "border-black/10 bg-white"}`}>
                <div className="font-semibold">{loc.name}</div>
                {loc.role && <div className="text-sm text-black/60">{loc.role}</div>}
                <div className="text-sm text-black/50">{loc.city}, {loc.state}</div>
                <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                  loc.type === "team" ? "bg-[#1e3a5f]/10 text-[#1e3a5f]" : "bg-green-100 text-green-700"}`}>
                  {loc.type === "team" ? "Team" : "Enrolled"}
                </span>
              </button>
            ))}
          </div>
          {filteredLocations.length > 12 && (
            <p className="mt-4 text-sm text-black/50 text-center">Showing 12 of {filteredLocations.length} locations. Use filters to narrow down.</p>
          )}
        </div>

        {/* Enrollment CTA */}
        <div className="mt-12 rounded-3xl bg-[#1e3a5f] p-8 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Join the MedPACT Network</h2>
            <p className="mt-2 text-white/80">Enroll your practice and gain access to payer intelligence, transparency tools, and a network of forward-thinking providers.</p>
            <div className="mt-6">
              <Button onClick={() => setShowEnrollForm(!showEnrollForm)} className="bg-white text-[#1e3a5f] hover:bg-white/90">
                {showEnrollForm ? "Hide Form" : "Enroll Your Practice"}
              </Button>
            </div>
          </div>

          {/* Enrollment Form */}
          {showEnrollForm && (
            <div className="mt-8 max-w-2xl mx-auto">
              {enrollStatus === "success" ? (
                <div className="bg-green-500/20 rounded-2xl p-6 text-center">
                  <div className="text-2xl mb-2">✓</div>
                  <div className="font-semibold">Enrollment Request Submitted!</div>
                  <p className="text-white/80 mt-2">We'll be in touch within 1-2 business days to discuss next steps.</p>
                </div>
              ) : (
                <form onSubmit={handleEnrollSubmit} className="grid gap-4 md:grid-cols-2">
                  <input type="text" placeholder="Practice Name *" required value={enrollForm.practiceName}
                    onChange={(e) => setEnrollForm({...enrollForm, practiceName: e.target.value})}
                    className="rounded-xl px-4 py-3 text-black text-sm" />
                  <input type="text" placeholder="Contact Name *" required value={enrollForm.contactName}
                    onChange={(e) => setEnrollForm({...enrollForm, contactName: e.target.value})}
                    className="rounded-xl px-4 py-3 text-black text-sm" />
                  <input type="email" placeholder="Email *" required value={enrollForm.email}
                    onChange={(e) => setEnrollForm({...enrollForm, email: e.target.value})}
                    className="rounded-xl px-4 py-3 text-black text-sm" />
                  <input type="tel" placeholder="Phone" value={enrollForm.phone}
                    onChange={(e) => setEnrollForm({...enrollForm, phone: e.target.value})}
                    className="rounded-xl px-4 py-3 text-black text-sm" />
                  <input type="text" placeholder="City *" required value={enrollForm.city}
                    onChange={(e) => setEnrollForm({...enrollForm, city: e.target.value})}
                    className="rounded-xl px-4 py-3 text-black text-sm" />
                  <select value={enrollForm.state} onChange={(e) => setEnrollForm({...enrollForm, state: e.target.value})}
                    required className="rounded-xl px-4 py-3 text-black text-sm">
                    <option value="">Select State *</option>
                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input type="text" placeholder="Specialty (e.g., Ophthalmology)" value={enrollForm.specialty}
                    onChange={(e) => setEnrollForm({...enrollForm, specialty: e.target.value})}
                    className="rounded-xl px-4 py-3 text-black text-sm md:col-span-2" />
                  <textarea placeholder="Tell us about your practice..." rows={3} value={enrollForm.message}
                    onChange={(e) => setEnrollForm({...enrollForm, message: e.target.value})}
                    className="rounded-xl px-4 py-3 text-black text-sm md:col-span-2" />
                  <div className="md:col-span-2">
                    <Button type="submit" disabled={enrollStatus === "submitting"} className="w-full bg-white text-[#1e3a5f]">
                      {enrollStatus === "submitting" ? "Submitting..." : "Submit Enrollment Request"}
                    </Button>
                    {enrollStatus === "error" && <p className="text-red-300 text-sm mt-2 text-center">Something went wrong. Please try again.</p>}
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
