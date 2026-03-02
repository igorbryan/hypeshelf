"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import AddRecForm from "../components/AddRecForm";
import RecCard from "../components/RecCard";
import UserSync from "../components/UserSync";

const GENRES = ["All", "horror", "action", "comedy", "drama", "romance", "documentary", "other"];

export default function ShelfPage() {
  const { isLoaded, isSignedIn } = useUser();
  const [genre, setGenre] = useState<string | undefined>(undefined);
  const recs = useQuery(api.recommendations.getAll, { genre });
  const me = useQuery(api.users.getMe);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  //Header
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-tight">HypeShelf</h1>
            <p className="text-zinc-500 text-xs">Collect and share the stuff you're hyped about.</p>
          </div>
          <UserButton />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <UserSync />

        {/* Add form and filters*/}
        <AddRecForm />

        <div className="mt-8 mb-5">
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-3">Filter by genre</p>
          <div className="flex gap-2 flex-wrap">
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => setGenre(g === "All" ? undefined : g)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  (g === "All" && !genre) || genre === g
                    ? "bg-white text-black border-white font-semibold"
                    : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {!recs ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-zinc-600 border-t-white rounded-full animate-spin" />
          </div>
        ) : recs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-zinc-400">No recommendations yet.</p>
            <p className="text-zinc-600 text-sm mt-1">Be the first to add something!</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {recs.map((rec) => (
              <RecCard key={rec._id} rec={rec} me={me ?? null} />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
