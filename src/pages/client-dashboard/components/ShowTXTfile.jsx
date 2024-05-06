import { useEffect, useState } from "react";

const ShowTXTfile = ({ url }) => {
  const [text, setText] = useState("");

  useEffect(() => {
    if (url) {
      fetch(url)
        .then(async (response) => {
          return response.text();
        })
        .then((text) => setText(text))
        .catch((error) => {
          console.error(error);
        });
    }
  }, [url]);

  return <div>{text && <pre>{text}</pre>}</div>;
};

export default ShowTXTfile;
