import { useMutation } from "@apollo/client";
import { useState } from "react";
import { Base64Encode } from "../base64-file";
import { errorMessage, successMessage } from "../components/Alerts";
import { handleGraphqlErrors } from "../functions";
import { MUTATION_UPDATE_RECENT_FILE } from "../pages/client-dashboard/clound/apollo";
import { MUTATION_UPDATE_FOLDER } from "../pages/client-dashboard/components/apollo";
import useShortenURL from "./useShortenUrl";

const useGetUrlExtendFolder = (data) => {
  const [updateFile] = useMutation(MUTATION_UPDATE_RECENT_FILE);
  const [updateFolder] = useMutation(MUTATION_UPDATE_FOLDER);

  async function copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }

  const [copied, setCoppied] = useState(false);
  if (data) {
    const handleGetFolderURL = async (data) => {
      let vshareURL = process.env.REACT_APP_DOWNLOAD_URL_SERVER;
      const encodeKey = process.env.REACT_APP_ENCODE_KEY;

      const dataType = data?.checkTypeItem;
      const ownerData = data?.createdBy?._id;
      const newNameData = data?.createdBy?.newName;
      const dataUrl = {
        _id: data?._id,
        type: dataType,
      };

      // const url = encodeURIComponent(
      //   CryptoJS.AES.encrypt(JSON.stringify(dataUrl), encodeKey),
      // );
      // const createdById = encodeURIComponent(
      //   CryptoJS.AES.encrypt(JSON.stringify(ownerData), encodeKey),
      // );
      const url = Base64Encode(JSON.stringify(dataUrl), encodeKey);
      const createdById = Base64Encode(ownerData, encodeKey);

      const params = new URLSearchParams();
      params.set("lc", `${url}-${createdById}-${newNameData}`);

      const getURL = new URL(vshareURL);
      getURL.search = params.toString();

      try {
        const shortenUrl = await useShortenURL({
          url: getURL.toString(),
        });

        await copyTextToClipboard(shortenUrl?.shorturl || getURL)
          .then(() => {
            setCoppied(true);
            setTimeout(async () => {
              if (dataUrl.type === "folder") {
                const result = await updateFolder({
                  variables: {
                    where: {
                      _id: dataUrl._id,
                    },
                    data: {
                      getLinkBy: parseInt(ownerData),
                      shortUrl: shortenUrl?.shorturl ?? "",
                    },
                  },
                });

                if (result.data?.updateFolders?._id) {
                  setCoppied(false);
                  successMessage("Link is copied!", 2000);
                }
              } else {
                const result = await updateFile({
                  variables: {
                    where: {
                      _id: dataUrl._id,
                    },
                    data: {
                      getLinkBy: parseInt(ownerData),
                      shortUrl: shortenUrl?.shorturl ?? "",
                    },
                  },
                });
                if (result.data?.updateFiles?._id) {
                  setCoppied(false);
                  successMessage("Link is copied!", 2000);
                }
              }
            }, 500);
          })
          .catch((err) => {
            let cutErr = err.message.replace(/(ApolloError: )?Error: /, "");
            errorMessage(
              handleGraphqlErrors(
                cutErr || "Something went wrong, Please try again",
              ),
              2000,
            );
          });
      } catch (error) {
        console.log(error);
      }
    };

    return handleGetFolderURL;
  }
};

export default useGetUrlExtendFolder;
