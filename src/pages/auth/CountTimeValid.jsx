import { Fragment, useEffect, useState } from "react";

const CountdownTimer = ({ initialTime, showTimestamp, finishTime }) => {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      if (time >= 0) {
        setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }
    }, 1000);

    if (time <= 0) {
      finishTime();
      setTime(initialTime);
    }

    return () => clearInterval(timeInterval);
  }, [showTimestamp, time]);

  // Format the time as HH:MM:SS
  const formatTime = () => {
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    const pad = (num) => (num < 10 ? "0" + num : num);

    return `${pad(minutes)}:${pad(seconds)}`;
  };

  return <Fragment>{formatTime()}</Fragment>;
};

export default CountdownTimer;
