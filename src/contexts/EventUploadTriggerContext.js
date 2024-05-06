import { createContext, useState } from "react";
import useDeepEqualEffect from "../hooks/useDeepEqualEffect";

export const EventUploadTriggerContext = createContext(null);

export const EventUploadTriggerProvider = (props) => {
  const [triggerData, setTriggerData] = useState({});
  const trigger = () => {
    setTriggerData((state) => ({
      ...state,
      isTriggered: true,
      type: "file",
    }));
  };

  useDeepEqualEffect(() => {
    if (triggerData.isTriggered) {
      setTriggerData((state) => ({
        ...state,
        isTriggered: false,
      }));
    }
  }, [triggerData.isTriggered]);

  return (
    <EventUploadTriggerContext.Provider value={{ triggerData, trigger }}>
      {props.children}
    </EventUploadTriggerContext.Provider>
  );
};
