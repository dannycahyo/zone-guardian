import { useMonitoringState, useMonitoringDispatch } from "~/contexts/MonitoringContext";
import { SUPPORTED_ANIMALS } from "~/types";

export function AnimalSelector() {
  const { isMonitoring, selectedAnimals } = useMonitoringState();
  const dispatch = useMonitoringDispatch();

  const handleToggle = (animal: string) => {
    if (!isMonitoring) {
      dispatch({ type: "TOGGLE_ANIMAL", payload: animal });
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Select animals to monitor
      </p>

      <div className="space-y-2">
        {SUPPORTED_ANIMALS.map((animal) => {
          const isSelected = selectedAnimals.includes(animal);

          return (
            <label
              key={animal}
              className={`flex items-center gap-3 rounded-md border p-3 transition-colors ${
                isMonitoring
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900"
              } ${
                isSelected
                  ? "border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggle(animal)}
                disabled={isMonitoring}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950"
              />
              <span className="flex-1 text-sm font-medium capitalize text-slate-900 dark:text-slate-50">
                {animal}
              </span>
            </label>
          );
        })}
      </div>

      {selectedAnimals.length > 0 && (
        <div className="rounded-md bg-slate-100 p-3 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Selected: {selectedAnimals.length} animal{selectedAnimals.length !== 1 ? "s" : ""}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
            {selectedAnimals.map((a) => a).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
