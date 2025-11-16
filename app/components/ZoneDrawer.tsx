import { useState, useRef, useEffect } from "react";
import { useMonitoringState, useMonitoringDispatch } from "~/contexts/MonitoringContext";
import type { Zone } from "~/types";

interface ZoneDrawerProps {
  videoElement: HTMLVideoElement | null;
  containerWidth: number;
  containerHeight: number;
}

type ResizeHandle = "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w" | null;

export function ZoneDrawer({ videoElement, containerWidth, containerHeight }: ZoneDrawerProps) {
  const { zone, isMonitoring } = useMonitoringState();
  const dispatch = useMonitoringDispatch();

  const [isDrawing, setIsDrawing] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentZone, setCurrentZone] = useState<Zone | null>(zone);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Sync with context
  useEffect(() => {
    setCurrentZone(zone);
  }, [zone]);

  const normalizeZone = (z: Zone): Zone => {
    return {
      x: Math.max(0, Math.min(z.x, containerWidth)),
      y: Math.max(0, Math.min(z.y, containerHeight)),
      width: Math.max(0, Math.min(z.width, containerWidth - z.x)),
      height: Math.max(0, Math.min(z.height, containerHeight - z.y)),
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMonitoring) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on resize handle
    if (currentZone) {
      const handle = getResizeHandle(x, y, currentZone);
      if (handle) {
        setIsResizing(true);
        setResizeHandle(handle);
        setStartPos({ x, y });
        return;
      }
    }

    // Start drawing new zone
    setIsDrawing(true);
    setStartPos({ x, y });
    setCurrentZone({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMonitoring) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDrawing && currentZone) {
      const width = x - startPos.x;
      const height = y - startPos.y;

      const newZone = normalizeZone({
        x: width < 0 ? x : startPos.x,
        y: height < 0 ? y : startPos.y,
        width: Math.abs(width),
        height: Math.abs(height),
      });

      setCurrentZone(newZone);
    } else if (isResizing && currentZone && resizeHandle) {
      const newZone = resizeZone(currentZone, resizeHandle, x, y, startPos);
      setCurrentZone(normalizeZone(newZone));
      setStartPos({ x, y });
    }
  };

  const handleMouseUp = () => {
    if (isDrawing || isResizing) {
      if (currentZone && currentZone.width > 10 && currentZone.height > 10) {
        dispatch({ type: "SET_ZONE", payload: currentZone });
      }
    }
    setIsDrawing(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  const resizeZone = (
    zone: Zone,
    handle: ResizeHandle,
    x: number,
    y: number,
    start: { x: number; y: number }
  ): Zone => {
    const dx = x - start.x;
    const dy = y - start.y;

    switch (handle) {
      case "nw":
        return { x: zone.x + dx, y: zone.y + dy, width: zone.width - dx, height: zone.height - dy };
      case "ne":
        return { x: zone.x, y: zone.y + dy, width: zone.width + dx, height: zone.height - dy };
      case "sw":
        return { x: zone.x + dx, y: zone.y, width: zone.width - dx, height: zone.height + dy };
      case "se":
        return { x: zone.x, y: zone.y, width: zone.width + dx, height: zone.height + dy };
      case "n":
        return { x: zone.x, y: zone.y + dy, width: zone.width, height: zone.height - dy };
      case "s":
        return { x: zone.x, y: zone.y, width: zone.width, height: zone.height + dy };
      case "e":
        return { x: zone.x, y: zone.y, width: zone.width + dx, height: zone.height };
      case "w":
        return { x: zone.x + dx, y: zone.y, width: zone.width - dx, height: zone.height };
      default:
        return zone;
    }
  };

  const getResizeHandle = (x: number, y: number, zone: Zone): ResizeHandle => {
    const handleSize = 12;
    const { x: zx, y: zy, width, height } = zone;

    // Corners
    if (Math.abs(x - zx) < handleSize && Math.abs(y - zy) < handleSize) return "nw";
    if (Math.abs(x - (zx + width)) < handleSize && Math.abs(y - zy) < handleSize) return "ne";
    if (Math.abs(x - zx) < handleSize && Math.abs(y - (zy + height)) < handleSize) return "sw";
    if (Math.abs(x - (zx + width)) < handleSize && Math.abs(y - (zy + height)) < handleSize) return "se";

    // Edges
    if (Math.abs(x - zx) < handleSize && y > zy && y < zy + height) return "w";
    if (Math.abs(x - (zx + width)) < handleSize && y > zy && y < zy + height) return "e";
    if (Math.abs(y - zy) < handleSize && x > zx && x < zx + width) return "n";
    if (Math.abs(y - (zy + height)) < handleSize && x > zx && x < zx + width) return "s";

    return null;
  };

  const handleClearZone = () => {
    if (!isMonitoring) {
      setCurrentZone(null);
      dispatch({ type: "SET_ZONE", payload: null });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {currentZone ? "Adjust zone or clear to redraw" : "Click and drag to draw zone"}
        </p>
        {currentZone && !isMonitoring && (
          <button
            onClick={handleClearZone}
            className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            Clear Zone
          </button>
        )}
      </div>

      <div
        ref={canvasRef}
        className={`relative overflow-hidden rounded-lg border-2 ${
          isMonitoring
            ? "cursor-not-allowed border-slate-300 dark:border-slate-700"
            : "cursor-crosshair border-slate-400 dark:border-slate-600"
        }`}
        style={{ width: containerWidth, height: containerHeight }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Zone overlay */}
        {currentZone && currentZone.width > 0 && currentZone.height > 0 && (
          <div
            className="absolute bg-red-500 bg-opacity-30 border-2 border-red-600"
            style={{
              left: currentZone.x,
              top: currentZone.y,
              width: currentZone.width,
              height: currentZone.height,
            }}
          >
            {/* Resize handles */}
            {!isMonitoring && (
              <>
                {/* Corner handles */}
                <div className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full bg-red-600 border border-white" />
                <div className="absolute -right-1.5 -top-1.5 h-3 w-3 rounded-full bg-red-600 border border-white" />
                <div className="absolute -left-1.5 -bottom-1.5 h-3 w-3 rounded-full bg-red-600 border border-white" />
                <div className="absolute -right-1.5 -bottom-1.5 h-3 w-3 rounded-full bg-red-600 border border-white" />

                {/* Edge handles */}
                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-red-600 border border-white" />
                <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-red-600 border border-white" />
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-red-600 border border-white" />
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-red-600 border border-white" />
              </>
            )}
          </div>
        )}

        {isMonitoring && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10">
            <p className="text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
              Zone locked during monitoring
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
