import { State, StateAction } from "./type";
import { stateReducer, initialState } from "./state";
import React, { createContext, useReducer, useContext, Dispatch } from "react";

interface GlobalContextType {
  globalState: State;
  globalDispatch: Dispatch<StateAction>;
}

const GlobalStateContext = createContext<GlobalContextType | undefined>(
  undefined
);

// Provider
export const StateProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  return (
    <GlobalStateContext.Provider
      value={{ globalState: state, globalDispatch: dispatch }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

// Custom Hook
export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a StateProvider");
  }
  return context;
};
