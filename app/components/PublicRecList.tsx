"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const GENRE_COLORS: Record<string, string> = {
  horror:       "bg-red-950 text-red-400 border-red-900",
  action:       "bg-orange-950 text-orange-400 border-orange-900",
  comedy:       "bg-yellow-950 text-yellow-400 border-yellow-900",
  drama:        "bg-blue-950 text-blue-400 border-blue-900",
  romance:      "bg-pink-950 text-pink-400 border-pink-900",
  documentary:  "bg-green-950 text-green-400 border-green-900",
  other:        "bg-zinc-800 text-zinc-400 border-zinc-700",
};

export default function PublicRecList() {
  const recs = useQuery(api.recommendations.getLatestPublic);

  if (!recs) return (
    <div className="flex justify-center py-8">
      <div className="w-5 h-5 border-2 border-zinc-600 border-t-white rounded-full animate-spin" />
    </div>
  );

  if (recs.length === 0) return (
    <p className="text-center text-zinc-600 py-8">
      No recommendations yet. Sign in and be the first!
    </p>
  );

  return (
    <ul className="flex flex-col gap-3">
      {recs.map((rec) => {
        const genreStyle = GENRE_COLORS[rec.genre] ?? GENRE_COLORS.other;

        return (
          <li
            key={rec._id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 hover:border-zinc-700 transition"
          >
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-semibold text-white">{rec.title}</span>
              {rec.isStaffPick && (
                <span className="text-xs bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-2 py-0.5 rounded-full">
                  Staff Pick
                </span>
              )}
            </div>

            <p className="text-zinc-400 text-sm mb-2">{rec.blurb}</p>

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
          </li>
        );
      })}
    </ul>
  );
}
