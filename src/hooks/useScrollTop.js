import { useEffect, useState } from "react";

const useScrollTop = ({ total }) => {
  // scroll down
  const [isFetching, setIsFetching] = useState(false);
  const [limitScroll, setLimitScroll] = useState(20);

  useEffect(() => {
    document
      .getElementById("tag-scroll")
      .addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isFetching) return;
    if (limitScroll < total) {
      fetchMoreListItems();
    }
  }, [isFetching, total]);

  const handleScroll = () => {
    let offset = document.documentElement.offsetHeight;
    let scrollHeight = document.documentElement.scrollHeight;

    if (scrollHeight - offset <= document.documentElement.scrollTop + 1);
    setIsFetching(true);
  };

  const fetchMoreListItems = () => {
    setTimeout(() => {
      setLimitScroll(parseInt(limitScroll) + 10);
      setIsFetching(false);
    }, 500);
  };

  return { isFetching, limitScroll };
};
export default useScrollTop;
