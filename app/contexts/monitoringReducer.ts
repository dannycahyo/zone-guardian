import type { Zone, AlertConfig, MonitoringState } from "~/types";

// Action types
export type MonitoringAction =
  | { type: "SET_IS_MONITORING"; payload: boolean }
  | { type: "SET_ZONE"; payload: Zone | null }
  | { type: "SET_SELECTED_ANIMALS"; payload: string[] }
  | { type: "SET_ALERT_CONFIG"; payload: AlertConfig }
  | { type: "UPDATE_LAST_ALERT_TIME" }
  | { type: "TOGGLE_ANIMAL"; payload: string }
  | { type: "RESET_STATE" };

const DEFAULT_ALERT_CONFIG: AlertConfig = {
  audioFile: null,
  audioUrl: null,
  cooldownSeconds: 5,
  notificationsEnabled: false,
};

export const initialState: MonitoringState = {
  isMonitoring: false,
  zone: null,
  selectedAnimals: [],
  alertConfig: DEFAULT_ALERT_CONFIG,
  lastAlertTime: null,
};

export function monitoringReducer(
  state: MonitoringState,
  action: MonitoringAction
): MonitoringState {
  switch (action.type) {
    case "SET_IS_MONITORING":
      return { ...state, isMonitoring: action.payload };
    case "SET_ZONE":
      return { ...state, zone: action.payload };
    case "SET_SELECTED_ANIMALS":
      return { ...state, selectedAnimals: action.payload };
    case "SET_ALERT_CONFIG":
      return { ...state, alertConfig: action.payload };
    case "UPDATE_LAST_ALERT_TIME":
      return { ...state, lastAlertTime: Date.now() };
    case "TOGGLE_ANIMAL":
      return {
        ...state,
        selectedAnimals: state.selectedAnimals.includes(action.payload)
          ? state.selectedAnimals.filter((a) => a !== action.payload)
          : [...state.selectedAnimals, action.payload],
      };
    case "RESET_STATE":
      return initialState;
    default:
      return state;
  }
}
