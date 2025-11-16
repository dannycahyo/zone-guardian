import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from 'react';
import type { MonitoringState } from '~/types';
import {
  monitoringReducer,
  initialState,
  type MonitoringAction,
} from './monitoringReducer';

interface MonitoringContextValue {
  state: MonitoringState;
  dispatch: Dispatch<MonitoringAction>;
}

const MonitoringContext = createContext<
  MonitoringContextValue | undefined
>(undefined);

export function MonitoringProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(
    monitoringReducer,
    initialState,
  );

  return (
    <MonitoringContext.Provider value={{ state, dispatch }}>
      {children}
    </MonitoringContext.Provider>
  );
}

export function useMonitoring() {
  const context = useContext(MonitoringContext);
  if (context === undefined) {
    throw new Error(
      'useMonitoring must be used within MonitoringProvider',
    );
  }
  return context;
}

// Convenience hooks
export function useMonitoringState() {
  return useMonitoring().state;
}

export function useMonitoringDispatch() {
  return useMonitoring().dispatch;
}

// Re-export action type for convenience
export type { MonitoringAction };
