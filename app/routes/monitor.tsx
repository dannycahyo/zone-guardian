import type { Route } from "./+types/monitor";
import { CameraFeed } from "~/components/CameraFeed";
import { MonitoringControls } from "~/components/MonitoringControls";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Monitor - Boundary Guard AI" },
    { name: "description", content: "Monitor your space with AI-powered boundary detection" },
  ];
}

export default function Monitor() {
  const handleCameraReady = (video: HTMLVideoElement) => {
    console.log("Camera ready:", video);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <header className="border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-950">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Boundary Guard AI
        </h1>
      </header>

      <main className="flex flex-1 gap-6 p-6">
        <div className="flex-1">
          <CameraFeed onCameraReady={handleCameraReady} />
        </div>

        <aside className="w-80 space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
              Controls
            </h2>
            <MonitoringControls />
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
              Animal Selection
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              Coming in Phase 3
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
              Zone Drawing
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              Coming in Phase 4
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
