"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

const GENRES = ["horror", "action", "comedy", "drama", "romance", "documentary", "other"];

export default function AddRecForm() {
  const { user, isLoaded, isSignedIn } = useUser();
  const createRec = useMutation(api.recommendations.create);
  const [form, setForm] = useState({ title: "", genre: "action", link: "", blurb: "" });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !isSignedIn || !user) return;
    setLoading(true);
    await createRec({
      ...form,
      authorName: user.fullName ?? user.username ?? "Anonymous",
    });
    setForm({ title: "", genre: "action", link: "", blurb: "" });
    setOpen(false);
    setLoading(false);
  };

  const inputClass = "w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 outline-none focus:border-zinc-500 transition text-sm";

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full font-semibold py-3 rounded-xl transition text-sm ${
          open
            ? "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700"
            : "bg-white text-black hover:bg-zinc-200"
        }`}
      >
        {open ? "✕ Cancel" : "+ Add Recommendation"}
      </button>

      {open && (
        <form
          onSubmit={handleSubmit}
          className="mt-3 flex flex-col gap-3 bg-zinc-900 p-5 rounded-2xl border border-zinc-800"
        >
          <input
            required
            placeholder="Title (e.g. Halloween)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inputClass}
          />

          <select
            value={form.genre}
            onChange={(e) => setForm({ ...form, genre: e.target.value })}
            className={inputClass}
          >
            {GENRES.map((g) => (
              <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
            ))}
          </select>

          <input
            placeholder="Link (optional)"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            className={inputClass}
          />

          <textarea
            required
            placeholder="Why are you hyped about it? (required)"
            value={form.blurb}
            onChange={(e) => setForm({ ...form, blurb: e.target.value })}
            className={`${inputClass} resize-none`}
            rows={3}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-semibold py-2.5 rounded-xl hover:bg-zinc-200 transition text-sm disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add to Shelf"}
          </button>
        </form>
      )}
    </div>
  );
}
