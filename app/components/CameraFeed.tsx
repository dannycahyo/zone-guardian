import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";

interface CameraFeedProps {
  onCameraReady?: (video: HTMLVideoElement) => void;
}

export function CameraFeed({ onCameraReady }: CameraFeedProps) {
  const webcamRef = useRef<Webcam>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleUserMedia = useCallback(() => {
    setIsLoading(false);
    setError(null);

    // Notify parent when camera is ready
    if (onCameraReady && webcamRef.current?.video) {
      onCameraReady(webcamRef.current.video);
    }
  }, [onCameraReady]);

  const handleUserMediaError = useCallback((error: string | DOMException) => {
    setIsLoading(false);

    if (typeof error === "string") {
      setError(error);
    } else if (error.name === "NotAllowedError") {
      setError("Camera access denied. Please allow camera permissions.");
    } else if (error.name === "NotFoundError") {
      setError("No camera found. Please connect a camera.");
    } else if (error.name === "NotReadableError") {
      setError("Camera is already in use by another application.");
    } else {
      setError(`Camera error: ${error.message}`);
    }
  }, []);

  if (error) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
        <div className="text-center">
          <p className="mb-2 text-lg font-semibold text-red-900 dark:text-red-50">
            Camera Error
          </p>
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-lg border border-slate-200 bg-slate-900 dark:border-slate-800">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900">
          <div className="text-center">
            <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-slate-200"></div>
            <p className="text-sm text-slate-400">Loading camera...</p>
          </div>
        </div>
      )}

      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        }}
        onUserMedia={handleUserMedia}
        onUserMediaError={handleUserMediaError}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
