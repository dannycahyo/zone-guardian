/**
 * Zone Guardian Types
 */

/**
 * Coordinates for a rectangular zone
 */
export interface Zone {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Object detection result from COCO-SSD
 */
export interface Detection {
  bbox: [number, number, number, number]; // [x, y, width, height]
  class: string; // e.g., "cat", "dog", "bird"
  score: number; // confidence score 0-1
}

/**
 * Alert configuration
 */
export interface AlertConfig {
  audioFile: File | null;
  audioUrl: string | null;
  cooldownSeconds: number; // 5 seconds default
  notificationsEnabled: boolean;
}

/**
 * App monitoring state
 */
export interface MonitoringState {
  isMonitoring: boolean;
  zone: Zone | null;
  selectedAnimals: string[];
  alertConfig: AlertConfig;
  lastAlertTime: number | null;
}

/**
 * Supported animals by COCO-SSD model
 */
export const SUPPORTED_ANIMALS = [
  "bird",
  "cat",
  "dog",
  "horse",
  "sheep",
  "cow",
  "elephant",
  "bear",
  "zebra",
  "giraffe",
] as const;

export type SupportedAnimal = (typeof SUPPORTED_ANIMALS)[number];
