import { useLazyQuery } from "@apollo/client";
import { QUERY_SEARCH } from "../apollo";
import useAuth from "../../../../hooks/useAuth";
import { useEffect, useState } from "react";

export default function useSearch({ checkEnter, inputSearch }) {
  const { user } = useAuth();
  const [searchFolderAndFile] = useLazyQuery(QUERY_SEARCH);
  const [dataOfSearch, setDataOfSearch] = useState(null);

  const handleSearch = async () => {
    if (checkEnter?.key === "Enter" && inputSearch) {
      await searchFolderAndFile({
        variables: {
          where: {
            name: inputSearch,
            createdBy: user?._id,
          },
        },
        onCompleted: (data) => {
          setDataOfSearch(data.searchFolderAndFile?.data);
        },
      });
    }
  };
  useEffect(() => {
    handleSearch();
  }, [checkEnter]);

  return dataOfSearch;
}
