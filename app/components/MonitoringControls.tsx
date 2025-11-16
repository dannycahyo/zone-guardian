import { Button } from "~/components/ui/button";
import { useMonitoringState, useMonitoringDispatch } from "~/contexts/MonitoringContext";

export function MonitoringControls() {
  const { isMonitoring, zone, selectedAnimals } = useMonitoringState();
  const dispatch = useMonitoringDispatch();

  const canStart = !isMonitoring && zone !== null && selectedAnimals.length > 0;

  const handleStart = () => {
    dispatch({ type: "SET_IS_MONITORING", payload: true });
  };

  const handleStop = () => {
    dispatch({ type: "SET_IS_MONITORING", payload: false });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 text-sm font-medium text-slate-900 dark:text-slate-50">
          Monitoring Status
        </h3>
        <div className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${
              isMonitoring
                ? "bg-green-500 animate-pulse"
                : "bg-slate-300 dark:bg-slate-700"
            }`}
          />
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {isMonitoring ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {!isMonitoring ? (
          <Button
            onClick={handleStart}
            disabled={!canStart}
            className="w-full"
            size="lg"
          >
            Start Monitoring
          </Button>
        ) : (
          <Button
            onClick={handleStop}
            variant="destructive"
            className="w-full"
            size="lg"
          >
            Stop Monitoring
          </Button>
        )}

        {!canStart && !isMonitoring && (
          <p className="text-xs text-slate-500 dark:text-slate-500">
            {!zone
              ? "Draw a zone to start"
              : selectedAnimals.length === 0
              ? "Select at least one animal"
              : ""}
          </p>
        )}
      </div>
    </div>
  );
}
