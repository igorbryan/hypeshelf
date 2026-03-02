import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import PublicRecList from "./components/PublicRecList";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/shelf");

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center px-4 py-20">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold tracking-tight mb-3">HypeShelf</h1>
        <p className="text-zinc-400 text-lg max-w-sm mx-auto leading-relaxed">
          Collect and share the stuff you're hyped about.
        </p>
        <SignInButton>
          <button className="mt-8 bg-white text-black font-semibold px-8 py-3 rounded-xl hover:bg-zinc-200 transition text-sm">
            Sign in to add yours
          </button>
        </SignInButton>
      </div>

      {/* Latest picks */}
      <div className="w-full max-w-xl">
        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-4 text-center">
          Latest picks
        </p>
        <PublicRecList />
      </div>
    </main>
  );
}
