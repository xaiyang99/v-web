import { useMutation } from "@apollo/client";
import { UPDATE_TOTAL_DOWNLOAD } from "../apollo";
import { errorMessage } from "../../../../components/Alerts";

const useDownloadFile = (initialFileId) => {
  const [updateTotalDownload] = useMutation(UPDATE_TOTAL_DOWNLOAD);

  if (initialFileId) {
    const totalDownloadHandle = async () => {
      try {
        await updateTotalDownload({
          variables: {
            where: {
              _id: initialFileId,
            },
            data: {
              totalDownload: 1,
            },
          },
        });
      } catch (error) {
        errorMessage(
          "Sorry!!. Something went wrong. Please try again later!!",
          2000,
        );
      }
    };
    return totalDownloadHandle;
  }
};
export default useDownloadFile;
