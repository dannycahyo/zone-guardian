import { useState, useCallback } from "react";
import type { Route } from "./+types/monitor";
import { CameraFeed } from "~/components/CameraFeed";
import { MonitoringControls } from "~/components/MonitoringControls";
import { AnimalSelector } from "~/components/AnimalSelector";
import { ZoneDrawer } from "~/components/ZoneDrawer";
import { AlertSettings } from "~/components/AlertSettings";
import { UserGuide } from "~/components/UserGuide";
import { useMonitoringState } from "~/contexts/MonitoringContext";
import { useObjectDetection } from "~/hooks/useObjectDetection";
import { useAlertManager } from "~/hooks/useAlertManager";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Monitor - Boundary Guard AI" },
    { name: "description", content: "Monitor your space with AI-powered boundary detection" },
  ];
}

export default function Monitor() {
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const { isMonitoring, zone, selectedAnimals } = useMonitoringState();
  const { triggerAlert } = useAlertManager();

  const handleCameraReady = (video: HTMLVideoElement) => {
    console.log("Camera ready:", video);
    setVideoElement(video);
  };

  const handleBoundaryBreach = useCallback(() => {
    console.log("🚨 Boundary breach detected!");
    triggerAlert();
  }, [triggerAlert]);

  const { isModelLoading, modelError, detections, breachDetected } = useObjectDetection({
    videoElement,
    isMonitoring,
    selectedAnimals,
    zone,
    onBoundaryBreach: handleBoundaryBreach,
  });

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <header className="border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Boundary Guard AI
          </h1>

          {/* Model status indicator */}
          <div className="flex items-center gap-2 text-sm">
            {isModelLoading && (
              <span className="text-slate-600 dark:text-slate-400">
                Loading AI model...
              </span>
            )}
            {modelError && (
              <span className="text-red-600 dark:text-red-400">
                AI Error: {modelError}
              </span>
            )}
            {!isModelLoading && !modelError && (
              <span className="text-green-600 dark:text-green-400">
                ✓ AI Ready
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-6 p-6 lg:flex-row">
        <div className="flex-1">
          <CameraFeed onCameraReady={handleCameraReady} />
        </div>

        <aside className="w-full space-y-6 lg:w-80">
          <UserGuide />

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
            <AnimalSelector />
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
              Zone Drawing
            </h2>
            <div className="w-full overflow-hidden">
              <ZoneDrawer
                videoElement={videoElement}
                containerWidth={280}
                containerHeight={158}
              />
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
              Alert Settings
            </h2>
            <AlertSettings />
          </div>

          {/* Detection Status Panel */}
          {isMonitoring && (
            <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
              <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
                Detection Status
              </h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Breach Status:
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      breachDetected
                        ? "text-red-600 dark:text-red-400"
                        : "text-green-600 dark:text-green-400"
                    }`}
                  >
                    {breachDetected ? "⚠️ BREACH" : "✓ Safe"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Detections:
                  </span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {detections.length}
                  </span>
                </div>

                {detections.length > 0 && (
                  <div className="rounded-md bg-slate-100 p-3 dark:bg-slate-900">
                    <p className="mb-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                      Detected Animals:
                    </p>
                    <div className="space-y-1">
                      {detections.map((det, idx) => (
                        <div
                          key={idx}
                          className="text-xs text-slate-700 dark:text-slate-300"
                        >
                          • {det.class} ({(det.score * 100).toFixed(0)}%)
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
