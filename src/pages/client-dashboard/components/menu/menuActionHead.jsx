import { IconButton, Typography } from "@mui/material";
import { PiShareNetworkLight, PiLink } from "react-icons/pi";
import { FiDownload } from "react-icons/fi";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { BsTrash3, BsPinAngle } from "react-icons/bs";
import CloseIcon from "@mui/icons-material/Close";
import * as MUIFOLDER from "./../../css/folderStyle";
import { BsPinAngleFill } from "react-icons/bs";
export function MenuActionHead(props) {
  const { multiSelectId, handleClose, data, handleEvent } = props;

  return (
    <MUIFOLDER.SelelctedItem>
      <MUIFOLDER.SelectClose>
        <IconButton onClick={handleClose}>
          <CloseIcon size="18px" />
        </IconButton>
        <Typography variant="h6" sx={{ mt: 2, color: "grey" }}>
          {multiSelectId?.length > 0 ? multiSelectId?.length : 1} Select
        </Typography>
      </MUIFOLDER.SelectClose>
      <MUIFOLDER.SelectActions>
        <IconButton
          disabled={multiSelectId?.length > 1 ? true : false}
          onClick={() => handleEvent("share")}
        >
          <PiShareNetworkLight size="18px" />
        </IconButton>

        {data?.folder_type ? (
          <IconButton
            disabled={data?.file_id[0]._id ? false : true}
            onClick={() => handleEvent("download")}
          >
            <FiDownload size="18px" />
          </IconButton>
        ) : (
          <IconButton onClick={() => handleEvent("download")}>
            <FiDownload size="18px" />
          </IconButton>
        )}
        <IconButton onClick={() => handleEvent("delete")}>
          <BsTrash3 size="18px" />
        </IconButton>
        {data?.folder_type === "folder" ||
        multiSelectId[0]?.folder_type === "folder" ? (
          <IconButton onClick={() => handleEvent("pin")}>
            {data?.pin ? (
              <BsPinAngleFill size="18px" />
            ) : (
              <BsPinAngle size="18px" />
            )}
          </IconButton>
        ) : (
          <IconButton onClick={() => handleEvent("get link")}>
            <MdOutlineFavoriteBorder size="18px" />
          </IconButton>
        )}
        <IconButton
          disabled={multiSelectId?.length > 1 ? true : false}
          onClick={() => handleEvent("get link")}
        >
          <PiLink size="18px" />
        </IconButton>
      </MUIFOLDER.SelectActions>
    </MUIFOLDER.SelelctedItem>
  );
}
