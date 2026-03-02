"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";

type Rec = {
  _id: Id<"recommendations">;
  title: string;
  genre: string;
  link: string;
  blurb: string;
  authorId: string;
  authorName: string;
  isStaffPick: boolean;
};

// Roles
type User = {
  clerkId: string;
  role: "admin" | "user";
} | null | undefined;

const GENRE_COLORS: Record<string, string> = {
  horror:       "bg-red-950 text-red-400 border-red-900",
  action:       "bg-orange-950 text-orange-400 border-orange-900",
  comedy:       "bg-yellow-950 text-yellow-400 border-yellow-900",
  drama:        "bg-blue-950 text-blue-400 border-blue-900",
  romance:      "bg-pink-950 text-pink-400 border-pink-900",
  documentary:  "bg-green-950 text-green-400 border-green-900",
  other:        "bg-zinc-800 text-zinc-400 border-zinc-700",
};

export default function RecCard({ rec, me }: { rec: Rec; me: User }) {
  const removeRec = useMutation(api.recommendations.remove);
  const toggleStaffPick = useMutation(api.recommendations.toggleStaffPick);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isAdmin = me?.role === "admin";
  const isOwner = me?.clerkId === rec.authorId;
  const canDelete = isAdmin || isOwner;
  const genreStyle = GENRE_COLORS[rec.genre] ?? GENRE_COLORS.other;

  const handleDelete = async () => {
    await removeRec({ id: rec._id });
    setConfirmDelete(false);
  };

  return (
    <>
      <li className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 hover:border-zinc-700 transition-all group">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-semibold text-white text-base">{rec.title}</span>
              {rec.isStaffPick && (
                <span className="text-xs bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-2 py-0.5 rounded-full font-semibold">
                  Staff Pick
                </span>
              )}
            </div>

            <p className="text-zinc-400 text-sm leading-relaxed mb-3">{rec.blurb}</p>

            <div className="flex items-center gap-3 flex-wrap">
              <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${genreStyle}`}>
                {rec.genre}
              </span>
              {rec.link && (
                <a
                  href={rec.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 hover:underline transition"
                >
                  View link
                </a>
              )}
              <span className="text-zinc-600 text-xs">by {rec.authorName}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 items-end shrink-0">
            {isAdmin && (
              <button
                onClick={() => toggleStaffPick({ id: rec._id })}
                className="text-xs text-yellow-500 hover:text-yellow-300 transition whitespace-nowrap"
              >
                {rec.isStaffPick ? "Unmark Pick" : "Mark Pick"}
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => setConfirmDelete(true)}
                className="text-xs text-red-500 hover:text-red-400 transition"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </li>

      {/* Confirmation Modal - Delete Recommendation */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-white font-semibold text-lg mb-1">Delete recommendation?</h3>
            <p className="text-zinc-400 text-sm mb-6">
              <span className="text-white font-medium">"{rec.title}"</span> will be permanently removed.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 text-sm hover:bg-zinc-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
