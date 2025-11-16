import { useRef, useCallback, useEffect } from "react";
import { useMonitoringState, useMonitoringDispatch } from "~/contexts/MonitoringContext";

const COOLDOWN_MS = 5000; // 5 seconds

export function useAlertManager() {
  const { alertConfig, lastAlertTime } = useMonitoringState();
  const dispatch = useMonitoringDispatch();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element when audioUrl changes
  useEffect(() => {
    if (alertConfig.audioUrl) {
      audioRef.current = new Audio(alertConfig.audioUrl);
      audioRef.current.preload = "auto";
    } else {
      audioRef.current = null;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [alertConfig.audioUrl]);

  const showNotification = useCallback(() => {
    if (Notification.permission === "granted") {
      try {
        new Notification("🚨 Boundary Breach Detected!", {
          body: "An animal has entered the restricted zone.",
          icon: "/favicon.ico",
          tag: "boundary-breach", // Prevents duplicate notifications
          requireInteraction: false,
        });
      } catch (error) {
        console.error("Failed to show notification:", error);
      }
    }
  }, []);

  const playAudio = useCallback(async () => {
    if (audioRef.current) {
      try {
        // Reset audio to start
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
      } catch (error) {
        console.error("Failed to play audio:", error);
      }
    }
  }, []);

  const triggerAlert = useCallback(() => {
    // Check cooldown
    const now = Date.now();
    if (lastAlertTime && now - lastAlertTime < COOLDOWN_MS) {
      console.log("Alert on cooldown, skipping...");
      return;
    }

    console.log("🚨 Triggering alert!");

    // Update last alert time
    dispatch({ type: "UPDATE_LAST_ALERT_TIME" });

    // Show notification if enabled
    if (alertConfig.notificationsEnabled) {
      showNotification();
    }

    // Play audio if configured
    if (alertConfig.audioUrl) {
      playAudio();
    }

    // Fallback: if no notification or audio, at least log
    if (!alertConfig.notificationsEnabled && !alertConfig.audioUrl) {
      console.warn("⚠️ No alert method configured (no notification or audio)");
    }
  }, [
    lastAlertTime,
    alertConfig.notificationsEnabled,
    alertConfig.audioUrl,
    dispatch,
    showNotification,
    playAudio,
  ]);

  const canTriggerAlert = useCallback(() => {
    const now = Date.now();
    return !lastAlertTime || now - lastAlertTime >= COOLDOWN_MS;
  }, [lastAlertTime]);

  const getCooldownRemaining = useCallback(() => {
    if (!lastAlertTime) return 0;
    const elapsed = Date.now() - lastAlertTime;
    return Math.max(0, COOLDOWN_MS - elapsed);
  }, [lastAlertTime]);

  return {
    triggerAlert,
    canTriggerAlert,
    getCooldownRemaining,
  };
}
