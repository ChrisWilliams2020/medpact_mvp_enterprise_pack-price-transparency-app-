"use client";

import { useEffect, useState, FormEvent } from "react";
import { Container, Button } from "@/components/ui";

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
  addedAt: string;
}

export default function AdminNetworkPage() {
  const [locations, setLocations] = useState<NetworkLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [organization, setOrganization] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [type, setType] = useState<"team" | "enrolled">("team");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  async function fetchLocations() {
    try {
      const res = await fetch("/api/network/locations");
      const data = await res.json();
      setLocations(data.locations || []);
    } catch (err) {
      console.error("Failed to fetch locations:", err);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setName("");
    setRole("");
    setOrganization("");
    setCity("");
    setState("");
    setLat("");
    setLng("");
    setType("team");
    setEditingId(null);
  }

  function editLocation(loc: NetworkLocation) {
    setName(loc.name);
    setRole(loc.role);
    setOrganization(loc.organization);
    setCity(loc.city);
    setState(loc.state);
    setLat(loc.lat.toString());
    setLng(loc.lng.toString());
    setType(loc.type);
    setEditingId(loc.id);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const payload = {
        id: editingId || undefined,
        name,
        role,
        organization,
        city,
        state,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        type,
      };

      const res = await fetch("/api/network/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save");

      setMessage(editingId ? "Location updated!" : "Location added!");
      resetForm();
      fetchLocations();
    } catch (err) {
      setMessage("Error saving location");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function deleteLocation(id: string) {
    if (!confirm("Delete this location?")) return;

    try {
      const res = await fetch(`/api/network/locations?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setMessage("Location deleted");
      fetchLocations();
    } catch (err) {
      setMessage("Error deleting location");
      console.error(err);
    }
  }

  if (loading) {
    return (
      <Container className="py-14">
        <div className="text-center text-black/50">Loading...</div>
      </Container>
    );
  }

  return (
    <Container className="py-14">
      <h1 className="text-2xl font-bold mb-6">Manage Network Locations</h1>

      {message && (
        <div className={`mb-4 p-3 rounded-xl text-sm ${
          message.includes("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
        }`}>
          {message}
        </div>
      )}

      {/* Add/Edit Form */}
      <div className="mb-8 rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="font-semibold mb-4">
          {editingId ? "Edit Location" : "Add New Location"}
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <input
            className="rounded-xl border border-black/15 px-4 py-2"
            placeholder="Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="rounded-xl border border-black/15 px-4 py-2"
            placeholder="Role (e.g., Physician, Advisor)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <input
            className="rounded-xl border border-black/15 px-4 py-2"
            placeholder="Organization"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
          />
          <input
            className="rounded-xl border border-black/15 px-4 py-2"
            placeholder="City *"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          <input
            className="rounded-xl border border-black/15 px-4 py-2"
            placeholder="State (e.g., PA) *"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
          <input
            className="rounded-xl border border-black/15 px-4 py-2"
            placeholder="Latitude *"
            type="number"
            step="any"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            required
          />
          <input
            className="rounded-xl border border-black/15 px-4 py-2"
            placeholder="Longitude *"
            type="number"
            step="any"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            required
          />
          <select
            className="rounded-xl border border-black/15 px-4 py-2"
            value={type}
            onChange={(e) => setType(e.target.value as "team" | "enrolled")}
          >
            <option value="team">Team Member</option>
            <option value="enrolled">Enrolled Practice</option>
          </select>
          <div className="md:col-span-2 flex gap-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update Location" : "Add Location"}
            </Button>
            {editingId && (
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
        <p className="mt-3 text-xs text-black/50">
          Tip: Use Google Maps to find lat/lng coordinates. Right-click on a location and select coordinates.
        </p>
      </div>

      {/* Locations List */}
      <div className="rounded-2xl border border-black/10 bg-white">
        <div className="p-4 border-b border-black/10 font-semibold">
          Current Locations ({locations.length})
        </div>
        <div className="divide-y divide-black/5">
          {locations.map((loc) => (
            <div key={loc.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{loc.name}</div>
                <div className="text-sm text-black/60">
                  {loc.role && `${loc.role} • `}
                  {loc.city}, {loc.state}
                </div>
                <div className="text-xs text-black/40">
                  {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)} •{" "}
                  <span className={loc.type === "team" ? "text-medpact-navy" : "text-green-600"}>
                    {loc.type === "team" ? "Team" : "Enrolled"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => editLocation(loc)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteLocation(loc.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {locations.length === 0 && (
            <div className="p-8 text-center text-black/50">
              No locations yet. Add one above.
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
