import type { Session } from "@/hooks/useQuiz";

export function ScoreBoard({ session, bestStreak }: { session: Session; bestStreak: number }) {
  const accuracy = session.total ? Math.round((session.correct / session.total) * 100) : null;
  const items = [
    { label: "Score", value: `${session.correct}/${session.total}` },
    { label: "Accuracy", value: accuracy === null ? "–" : `${accuracy}%` },
    { label: "Streak", value: session.streak },
    { label: "Best streak", value: Math.max(bestStreak, session.streak) },
  ];

  return (
    <dl className="grid grid-cols-4 gap-2 text-center">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl bg-zinc-100 px-2 py-3 dark:bg-zinc-900">
          <dt className="text-[11px] uppercase tracking-wide text-zinc-500">{item.label}</dt>
          <dd className="mt-1 text-xl font-semibold tabular-nums">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
