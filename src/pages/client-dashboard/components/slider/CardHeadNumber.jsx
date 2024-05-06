import {
  AdioIcon,
  Files,
  ImageIcon,
  OtherIcon,
  TextIcon,
  VideoIcon,
} from "./../../clound/icons";
const cardNumber = [
  {
    id: 1,
    icon: <Files />,
    des: "Document",
    title: "Document",
    type: "application",
  },
  {
    id: 2,
    icon: <ImageIcon />,
    des: "Image",
    title: "Image",
    type: "image",
  },
  {
    id: 3,
    icon: <VideoIcon />,
    des: "Video",
    type: "video",
    title: "Video",
  },
  {
    id: 4,
    icon: <AdioIcon />,
    des: "Audio",
    type: "audio",
    title: "Audio",
  },
  {
    id: 5,
    icon: <TextIcon />,
    des: "Text",
    title: "Text",
    type: "text",
  },
  {
    id: 6,
    icon: <OtherIcon />,
    des: "Other",
    title: "Other",
    type: "other",
  },
];
export default cardNumber;
