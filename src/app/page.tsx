"use client";

import { SettingsPanel } from "@/components/SettingsPanel";
import { Trainer } from "@/components/Trainer";
import { usePersistentStore } from "@/hooks/usePersistentStore";
import { settingsStore } from "@/lib/settings";

export default function Home() {
  const settings = usePersistentStore(settingsStore);
  // Changing what is being tested starts a fresh session.
  const sessionKey = `${settings.difficulty}|${settings.mode}|${settings.enabledPitchClasses.join(",")}`;

  return (
    <div className="space-y-10">
      <Trainer key={sessionKey} settings={settings} />
      <details className="group rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
        <summary className="cursor-pointer select-none font-semibold">Settings</summary>
        <div className="mt-5">
          <SettingsPanel />
        </div>
      </details>
    </div>
  );
}
