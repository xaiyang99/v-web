import { useMutation } from "@apollo/client";
import { useState } from "react";
import { errorMessage, successMessage } from "../components/Alerts";
import { MUTATION_UPDATE_RECENT_FILE } from "../pages/client-dashboard/clound/apollo";
import { MUTATION_UPDATE_FOLDER } from "../pages/client-dashboard/components/apollo";
import { handleGraphqlErrors } from "../functions";
// import CryptoJS from "crypto-js";
import useShortenURL from "./useShortenUrl";
import { Base64Encode, Base64Decode } from "../base64-file";

const useGetUrl = (data) => {
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

      const dataType =
        data?.folder_type || data?.folderId?._id ? "folder" : "file";
      const ownerData = data?.createdBy?._id ?? data?.ownerId?._id;
      const newNameData = data?.createdBy?.newName ?? data?.ownerId?.newName;

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

      try {
        const url = Base64Encode(JSON.stringify(dataUrl), encodeKey);
        const createdById = Base64Encode(ownerData, encodeKey);

        const params = new URLSearchParams();
        params.set("lc", `${url}-${createdById}-${newNameData}`);

        const getURL = new URL(vshareURL);
        getURL.search = params.toString();

        const shortenUrl = await useShortenURL({
          url: getURL.toString(),
        });
        // shortenUrl => id, error, shorturl;
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
          .catch((error) => {
            errorMessage(error, 3000);
          });
      } catch (error) {
        errorMessage(error, 3000);
      }
    };

    return handleGetFolderURL;
  }
};

export default useGetUrl;
