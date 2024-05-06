import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

export default function useProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress > 100 ? 100 : prevProgress + 5
      );
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);
  return <CircularProgress variant="determinate" value={progress} />;
}
