import { useRef, type ChangeEvent } from "react";
import { useMonitoringState, useMonitoringDispatch } from "~/contexts/MonitoringContext";
import { Button } from "~/components/ui/button";

export function AlertSettings() {
  const { isMonitoring, alertConfig } = useMonitoringState();
  const dispatch = useMonitoringDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("audio/")) {
      const url = URL.createObjectURL(file);
      dispatch({
        type: "SET_ALERT_CONFIG",
        payload: {
          ...alertConfig,
          audioFile: file,
          audioUrl: url,
        },
      });
    }
  };

  const handleRemoveAudio = () => {
    if (alertConfig.audioUrl) {
      URL.revokeObjectURL(alertConfig.audioUrl);
    }
    dispatch({
      type: "SET_ALERT_CONFIG",
      payload: {
        ...alertConfig,
        audioFile: null,
        audioUrl: null,
      },
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      dispatch({
        type: "SET_ALERT_CONFIG",
        payload: {
          ...alertConfig,
          notificationsEnabled: permission === "granted",
        },
      });
    } catch (error) {
      console.error("Failed to request notification permission:", error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Notification Settings */}
      <div>
        <h3 className="mb-2 text-sm font-medium text-slate-900 dark:text-slate-50">
          Desktop Notifications
        </h3>
        {Notification.permission === "granted" ? (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <span>✓</span>
            <span>Enabled</span>
          </div>
        ) : Notification.permission === "denied" ? (
          <div className="text-sm text-red-600 dark:text-red-400">
            Blocked. Enable in browser settings.
          </div>
        ) : (
          <Button
            onClick={requestNotificationPermission}
            disabled={isMonitoring}
            size="sm"
            variant="outline"
            className="w-full"
          >
            Enable Notifications
          </Button>
        )}
      </div>

      {/* Audio Upload */}
      <div>
        <h3 className="mb-2 text-sm font-medium text-slate-900 dark:text-slate-50">
          Alert Sound
        </h3>

        {alertConfig.audioFile ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex-1 truncate">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-50">
                  {alertConfig.audioFile.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  {(alertConfig.audioFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleRemoveAudio}
                disabled={isMonitoring}
                size="sm"
                variant="destructive"
                className="flex-1"
              >
                Remove
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isMonitoring}
                size="sm"
                variant="outline"
                className="flex-1"
              >
                Change
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              disabled={isMonitoring}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isMonitoring}
              size="sm"
              variant="outline"
              className="w-full"
            >
              Upload Audio File
            </Button>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
              Supported: MP3, WAV, OGG, etc.
            </p>
          </div>
        )}
      </div>

      {/* Cooldown Info */}
      <div className="rounded-md bg-slate-100 p-3 dark:bg-slate-900">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          <span className="font-medium">Cooldown:</span> 5 seconds between alerts
        </p>
      </div>
    </div>
  );
}
