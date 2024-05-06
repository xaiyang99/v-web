// MenuStateProvider.js
import React, { createContext, useState, useContext } from "react";

const MenuStateContext = createContext();

export const MenuDropdownProvider = ({ children }) => {
  const [isAutoClose, setIsAutoClose] = useState(false);
  return (
    <MenuStateContext.Provider value={{ isAutoClose, setIsAutoClose }}>
      {children}
    </MenuStateContext.Provider>
  );
};

export const useMenuDropdownState = () => {
  const context = useContext(MenuStateContext);
  if (!context) {
    throw new Error("useMenuState must be used within a MenuStateProvider");
  }
  return context;
};
