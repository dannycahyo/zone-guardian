import { useState } from "react";
import { Button } from "~/components/ui/button";

export function UserGuide() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="mb-2 text-sm font-semibold text-blue-900 dark:text-blue-50">
            Quick Start Guide
          </h3>
          {!isExpanded && (
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Follow these steps to start monitoring
            </p>
          )}
        </div>
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          size="sm"
          variant="ghost"
          className="text-blue-700 hover:bg-blue-100 dark:text-blue-300 dark:hover:bg-blue-900"
        >
          {isExpanded ? "Hide" : "Show"}
        </Button>
      </div>

      {isExpanded && (
        <ol className="mt-4 space-y-2 text-xs text-blue-800 dark:text-blue-200">
          <li className="flex gap-2">
            <span className="font-semibold">1.</span>
            <span>
              <strong>Allow camera access</strong> when prompted
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold">2.</span>
            <span>
              <strong>Select animals</strong> you want to monitor (e.g., cat, dog)
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold">3.</span>
            <span>
              <strong>Draw a zone</strong> by clicking and dragging on the canvas
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold">4.</span>
            <span>
              <strong>(Optional)</strong> Upload alert sound and enable notifications
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold">5.</span>
            <span>
              <strong>Click "Start Monitoring"</strong> to begin detection
            </span>
          </li>
        </ol>
      )}
    </div>
  );
}
