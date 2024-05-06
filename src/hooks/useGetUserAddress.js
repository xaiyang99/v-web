import axios from "axios";
import React from "react";

const useGetUserAddress = () => {
  const [country, setCountry] = React.useState(null);
  React.useEffect(() => {
    const getGeoInfo = () => {
      axios
        .get("https://ipapi.co/json/")
        .then((response) => {
          let data = response.data;
          setCountry(data);
        })
        .catch((error) => {
          console.error(error);
        });
    };
    // getGeoInfo();
  }, []);
  return country;
};

export { useGetUserAddress };
