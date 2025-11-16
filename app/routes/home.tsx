import { Link } from "react-router";
import type { Route } from "./+types/home";
import { Button } from "~/components/ui/button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Boundary Guard AI - Home" },
    { name: "description", content: "AI-powered boundary monitoring for your space" },
  ];
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-2xl text-center">
        <h1 className="mb-4 text-5xl font-bold text-slate-900 dark:text-slate-50">
          Boundary Guard AI
        </h1>
        <p className="mb-8 text-lg text-slate-600 dark:text-slate-400">
          Keep your pets safe with AI-powered boundary monitoring. Get instant alerts when animals enter restricted zones.
        </p>

        <div className="mb-12 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-2 text-3xl">🎥</div>
            <h3 className="mb-2 font-semibold text-slate-900 dark:text-slate-50">Live Detection</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Real-time object detection using your webcam
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-2 text-3xl">🎯</div>
            <h3 className="mb-2 font-semibold text-slate-900 dark:text-slate-50">Custom Zones</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Draw and resize no-go zones with ease
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-2 text-3xl">🔔</div>
            <h3 className="mb-2 font-semibold text-slate-900 dark:text-slate-50">Smart Alerts</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Desktop notifications and custom audio alerts
            </p>
          </div>
        </div>

        <Link to="/monitor">
          <Button size="lg" className="px-8 text-lg">
            Get Started
          </Button>
        </Link>

        <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 text-left dark:border-slate-800 dark:bg-slate-950">
          <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-50">
            How It Works
          </h3>
          <ol className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>1. Allow camera access in your browser</li>
            <li>2. Select which animals to monitor</li>
            <li>3. Draw a restricted zone on the video feed</li>
            <li>4. Configure alerts (optional)</li>
            <li>5. Start monitoring and get instant alerts</li>
          </ol>
        </div>

        <p className="mt-6 text-xs text-slate-500 dark:text-slate-500">
          100% client-side • Privacy-first • No data leaves your device
        </p>
      </div>
    </div>
  );
}
