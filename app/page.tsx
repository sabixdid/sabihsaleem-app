"use client";

import Link from "next/link";

export default function Home() {
  const tiles = [
    {
      title: "Vault",
      description: "Secure documents, exhibits, and case files.",
      href: "https://vault.sabitx.com",
      external: true,
    },
    {
      title: "Store",
      description: "Customer-facing ordering & pre-pay (coming online).",
      href: "https://store.sabitx.com",
      external: true,
    },
    {
      title: "Operator Console",
      description: "Lighting, automations, and internal tools.",
      href: "/operator/lights",
      external: false,
    },
    {
      title: "Systems",
      description: "SABITX automation & infrastructure.",
      href: "https://systems.sabitx.com",
      external: true,
    },
    {
      title: "Mesh Library",
      description: "Knowledge, references, and SABITX canon.",
      href: "https://mesh.sabitx.com",
      external: true,
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <header className="px-6 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md border border-white/20 flex items-center justify-center text-xs font-semibold">
            SABIT
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-wide">
              SABITX OS
            </h1>
            <p className="text-xs text-zinc-400">
              Portal • Identity • Control
            </p>
          </div>
        </div>
      </header>

      <section className="px-6 pb-6">
        <h2 className="text-2xl font-semibold mb-2">
          Choose your channel
        </h2>
        <p className="text-sm text-zinc-400 mb-6">
          One identity. Multiple roles. This portal routes you into the
          correct layer of SABITX: legal, operations, store, or automation.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tiles.map((tile) => {
            const TileInner = (
              <div className="h-full rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 hover:border-zinc-500 transition-colors flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-semibold mb-1">
                    {tile.title}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {tile.description}
                  </p>
                </div>
                <div className="mt-4 text-xs text-zinc-500 flex items-center gap-1">
                  <span>Enter</span>
                  {tile.external && (
                    <span className="text-[10px] uppercase tracking-wide">
                      External
                    </span>
                  )}
                </div>
              </div>
            );

            if (tile.external) {
              return (
                <a
                  key={tile.title}
                  href={tile.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {TileInner}
                </a>
              );
            }

            return (
              <Link key={tile.title} href={tile.href}>
                {TileInner}
              </Link>
            );
          })}
        </div>
      </section>

      <footer className="mt-auto px-6 py-4 text-[10px] text-zinc-500 flex items-center justify-between border-t border-zinc-900">
        <span>SABITX Portal • sabihsaleem.app</span>
        <span>Operator • Vault • Store • Systems</span>
      </footer>
    </main>
  );
}
