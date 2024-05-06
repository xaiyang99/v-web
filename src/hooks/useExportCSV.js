import { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { QUERY_DESC_MAIN_FILES } from "../pages/client-dashboard/clound/apollo";
import { ConvertBytetoMBandGB, DateOfNumber } from "../functions";

const useExportCSV = ({ folderId, exportRef }) => {
  const [getFile, { data: getFileData }] = useLazyQuery(QUERY_DESC_MAIN_FILES, {
    fetchPolicy: "no-cache",
  });

  async function handleGetAllFile() {
    try {
      const result = await getFile({
        variables: {
          where: {
            folder_id: folderId,
          },
        },
      });

      if (result.data?.files?.data?.length > 0) {
        await exportRef?.current?.link.click();
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    handleGetAllFile();
  }, [folderId]);

  return {
    data:
      getFileData?.files?.data?.map((item) => {
        return {
          ID: item._id,
          Filename: item.filename,
          ShortUrl: item.shortUrl ?? "",
          Size: ConvertBytetoMBandGB(item.size),
          Url: item.url,
          createdAt: DateOfNumber(item.createdAt),
        };
      }) || [],
  };
};

export default useExportCSV;
