import { useEffect, useState, useRef, useCallback } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import type { Detection, Zone } from "~/types";

interface UseObjectDetectionOptions {
  videoElement: HTMLVideoElement | null;
  isMonitoring: boolean;
  selectedAnimals: string[];
  zone: Zone | null;
  onBoundaryBreach: () => void;
}

interface UseObjectDetectionResult {
  isModelLoading: boolean;
  modelError: string | null;
  detections: Detection[];
  breachDetected: boolean;
}

const DETECTION_INTERVAL = 500; // 500ms as per requirements

export function useObjectDetection({
  videoElement,
  isMonitoring,
  selectedAnimals,
  zone,
  onBoundaryBreach,
}: UseObjectDetectionOptions): UseObjectDetectionResult {
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [modelError, setModelError] = useState<string | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [breachDetected, setBreachDetected] = useState(false);

  const modelRef = useRef<cocoSsd.ObjectDetection | null>(null);
  const detectionIntervalRef = useRef<number | null>(null);

  // Load COCO-SSD model on mount
  useEffect(() => {
    let mounted = true;

    const loadModel = async () => {
      try {
        setIsModelLoading(true);
        setModelError(null);

        const model = await cocoSsd.load({
          base: "lite_mobilenet_v2", // Faster, smaller model
        });

        if (mounted) {
          modelRef.current = model;
          setIsModelLoading(false);
          console.log("COCO-SSD model loaded successfully");
        }
      } catch (error) {
        if (mounted) {
          const errorMessage = error instanceof Error ? error.message : "Failed to load AI model";
          setModelError(errorMessage);
          setIsModelLoading(false);
          console.error("Failed to load COCO-SSD model:", error);
        }
      }
    };

    loadModel();

    return () => {
      mounted = false;
    };
  }, []);

  // Check if bounding boxes intersect
  const checkIntersection = useCallback((bbox: number[], zone: Zone): boolean => {
    const [x, y, width, height] = bbox;

    // Bounding box coordinates
    const boxLeft = x;
    const boxRight = x + width;
    const boxTop = y;
    const boxBottom = y + height;

    // Zone coordinates
    const zoneLeft = zone.x;
    const zoneRight = zone.x + zone.width;
    const zoneTop = zone.y;
    const zoneBottom = zone.y + zone.height;

    // Check for intersection
    return !(
      boxRight < zoneLeft ||
      boxLeft > zoneRight ||
      boxBottom < zoneTop ||
      boxTop > zoneBottom
    );
  }, []);

  // Run detection
  const runDetection = useCallback(async () => {
    if (!modelRef.current || !videoElement || !zone || selectedAnimals.length === 0) {
      return;
    }

    try {
      const predictions = await modelRef.current.detect(videoElement);

      // Filter by selected animals and convert to Detection format
      const filteredDetections: Detection[] = predictions
        .filter((pred) => selectedAnimals.includes(pred.class))
        .map((pred) => ({
          bbox: pred.bbox as [number, number, number, number],
          class: pred.class,
          score: pred.score,
        }));

      setDetections(filteredDetections);

      // Check for boundary breaches
      const breach = filteredDetections.some((detection) =>
        checkIntersection(detection.bbox, zone)
      );

      if (breach && !breachDetected) {
        setBreachDetected(true);
        onBoundaryBreach();
      } else if (!breach && breachDetected) {
        setBreachDetected(false);
      }
    } catch (error) {
      console.error("Detection error:", error);
    }
  }, [videoElement, zone, selectedAnimals, checkIntersection, onBoundaryBreach, breachDetected]);

  // Start/stop detection loop based on monitoring state
  useEffect(() => {
    if (isMonitoring && !isModelLoading && modelRef.current) {
      // Start detection loop
      detectionIntervalRef.current = window.setInterval(() => {
        runDetection();
      }, DETECTION_INTERVAL);

      // Run immediately
      runDetection();

      return () => {
        if (detectionIntervalRef.current) {
          clearInterval(detectionIntervalRef.current);
          detectionIntervalRef.current = null;
        }
      };
    } else {
      // Stop detection loop
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
      setDetections([]);
      setBreachDetected(false);
    }
  }, [isMonitoring, isModelLoading, runDetection]);

  return {
    isModelLoading,
    modelError,
    detections,
    breachDetected,
  };
}
