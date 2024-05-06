import { useState, useEffect } from "react";

function useOuterClicked(ref) {
  const [isOuterClicked, setIsOuterClicked] = useState(false);

  const handleClick = (event) => {
    setIsOuterClicked(ref.current?.contains(event.target));
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return isOuterClicked;
}

export default useOuterClicked;
