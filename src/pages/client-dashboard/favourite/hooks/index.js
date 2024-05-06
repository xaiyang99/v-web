import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { QUERY_FILES } from "../apollo";

const useManageFavorites = (props) => {
  const { userId } = props;
  const [favorites, setFavorites] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);

  const [getFiles] = useLazyQuery(QUERY_FILES, {
    fetchPolicy: "no-cache",
  });

  const handleLimit = (value) => {
    setLimit((prev) => prev + value);
  };

  const customFavorite = async () => {
    try {
      const res = await getFiles({
        variables: {
          where: {
            status: "active",
            createdBy: userId,
            favorite: 1,
          },
          limit,
        },
      });

      let fileData = await res.data?.files;
      if (fileData?.data) {
        setTotal(fileData?.total);
        setFavorites(() => {
          const result = {
            title: "Files",
            data: fileData?.data?.map((value) => ({
              ...value,
              id: value._id,
            })),
          };

          return [result];
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    customFavorite();
  }, [limit, userId]);

  return {
    data: favorites,
    total,
    limit,
    getFiles,

    handleLimit,
    customFavorite,
  };
};

export default useManageFavorites;
