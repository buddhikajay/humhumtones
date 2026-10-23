"use client";

import Image from "next/image";
import { useState } from "react";
import icon from "@/assets/icon.png";
import { usePersistentStore } from "@/hooks/usePersistentStore";
import { ALL_PITCH_CLASSES, noteLabel } from "@/lib/notes";
import { resetStats, statsStore } from "@/lib/stats";

export default function StatsPage() {
  const stats = usePersistentStore(statsStore);
  const [confirming, setConfirming] = useState(false);

  const totals = Object.values(stats.notes).reduce(
    (acc, n) => ({ attempts: acc.attempts + n.attempts, correct: acc.correct + n.correct }),
    { attempts: 0, correct: 0 },
  );

  const confusions = Object.entries(stats.confusions)
    .map(([key, count]) => {
      const [target, guess] = key.split(">").map(Number);
      return { target, guess, count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Your progress</h1>
          <p className="text-sm text-zinc-500">
            {totals.attempts
              ? `${totals.attempts} answers · ${Math.round((totals.correct / totals.attempts) * 100)}% correct · best streak ${stats.bestStreak}`
              : "No answers yet. Train a bit and come back!"}
          </p>
        </div>
        {totals.attempts > 0 && (
          <button
            type="button"
            onClick={() => {
              if (confirming) resetStats();
              setConfirming(!confirming);
            }}
            onBlur={() => setConfirming(false)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              confirming
                ? "border-rose-500 bg-rose-500 text-white"
                : "border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
            }`}
          >
            {confirming ? "Click again to reset" : "Reset progress"}
          </button>
        )}
      </div>

      {totals.attempts === 0 && <Image src={icon} alt="" className="mx-auto h-24 w-auto opacity-90" />}

      <section className="space-y-2">
        <h2 className="font-semibold">Accuracy by note</h2>
        <ul className="space-y-1.5">
          {ALL_PITCH_CLASSES.map((pc) => {
            const stat = stats.notes[pc];
            const accuracy = stat?.attempts ? stat.correct / stat.attempts : null;
            return (
              <li key={pc} className="grid grid-cols-[4.5rem_1fr_5.5rem] items-center gap-3 text-sm">
                <span className="font-medium">{noteLabel(pc)}</span>
                <div className="h-3 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
                  {accuracy !== null && (
                    <div
                      className={`h-full rounded-full ${
                        accuracy >= 0.8 ? "bg-emerald-500" : accuracy >= 0.5 ? "bg-amber-500" : "bg-rose-500"
                      }`}
                      style={{ width: `${Math.max(accuracy * 100, 2)}%` }}
                    />
                  )}
                </div>
                <span className="text-right tabular-nums text-zinc-500">
                  {accuracy === null ? "–" : `${Math.round(accuracy * 100)}% · ${stat.attempts}`}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {confusions.length > 0 && (
        <section className="space-y-2">
          <h2 className="font-semibold">Most common mix-ups</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {confusions.map(({ target, guess, count }) => (
              <li
                key={`${target}>${guess}`}
                className="flex justify-between rounded-lg bg-zinc-100 px-3 py-2 text-sm dark:bg-zinc-900"
              >
                <span>
                  Heard <strong>{noteLabel(target)}</strong>, answered <strong>{noteLabel(guess)}</strong>
                </span>
                <span className="tabular-nums text-zinc-500">×{count}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
