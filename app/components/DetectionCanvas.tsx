import { useEffect, useRef } from "react";
import type { Detection, Zone } from "~/types";

interface DetectionCanvasProps {
  videoElement: HTMLVideoElement | null;
  detections: Detection[];
  zone: Zone | null;
}

export function DetectionCanvas({
  videoElement,
  detections,
  zone,
}: DetectionCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Check if bbox intersects with zone
  const checkIntersection = (bbox: number[], zone: Zone): boolean => {
    const [x, y, width, height] = bbox;
    return !(
      x > zone.x + zone.width ||
      x + width < zone.x ||
      y > zone.y + zone.height ||
      y + height < zone.y
    );
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoElement;

    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Sync canvas dimensions with video actual display size
    const syncDimensions = () => {
      const rect = video.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    syncDimensions();

    // Draw detections on canvas
    const drawDetections = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate scaling factors (video stream size vs displayed size)
      const scaleX = canvas.width / video.videoWidth;
      const scaleY = canvas.height / video.videoHeight;

      detections.forEach((detection) => {
        const [x, y, width, height] = detection.bbox;

        // Scale bbox coordinates to canvas size
        const scaledX = x * scaleX;
        const scaledY = y * scaleY;
        const scaledWidth = width * scaleX;
        const scaledHeight = height * scaleY;

        // Determine color based on zone intersection
        const isBreaching = zone
          ? checkIntersection(detection.bbox, zone)
          : false;
        const color = isBreaching ? "#ef4444" : "#22c55e"; // red : green

        // Draw bounding box
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);

        // Draw semi-transparent fill
        ctx.fillStyle = `${color}20`; // 20 = ~12% opacity
        ctx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);

        // Draw label with animal name and confidence
        const label = `${detection.class} ${(detection.score * 100).toFixed(0)}%`;
        const fontSize = 16;
        ctx.font = `bold ${fontSize}px sans-serif`;

        // Measure text for background
        const textMetrics = ctx.measureText(label);
        const textWidth = textMetrics.width;
        const textHeight = fontSize;
        const padding = 4;

        // Position label above box (or below if not enough space)
        const labelX = scaledX;
        const labelY = scaledY > textHeight + padding * 2
          ? scaledY - padding
          : scaledY + scaledHeight + textHeight + padding;

        // Draw label background
        ctx.fillStyle = color;
        ctx.fillRect(
          labelX,
          labelY - textHeight - padding,
          textWidth + padding * 2,
          textHeight + padding * 2
        );

        // Draw label text
        ctx.fillStyle = "#ffffff";
        ctx.fillText(label, labelX + padding, labelY - padding);
      });
    };

    // Draw on mount and when detections change
    drawDetections();

    // Redraw on video resize
    const resizeObserver = new ResizeObserver(() => {
      syncDimensions();
      drawDetections();
    });
    resizeObserver.observe(video);

    return () => {
      resizeObserver.disconnect();
    };
  }, [videoElement, detections, zone]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 10 }}
    />
  );
}
