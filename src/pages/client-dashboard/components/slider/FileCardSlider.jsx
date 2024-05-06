import { Box } from "@mui/material";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import cardNumber from "./CardHeadNumber";
import HeadCardMobile from "./HeadCardMobile";

function FileCardSlider({ ...children }) {
  let application = 0;
  let image = 0;
  let video = 0;
  let audio = 0;
  let text = 0;
  let other = 0;

  for (
    let i = 0;
    i < children?.getCount?.getFileCategories?.data?.length;
    i++
  ) {
    if (
      children.getCount.getFileCategories?.data[i]?.fileType === "application"
    ) {
      application = children.getCount.getFileCategories?.data[i]?.size;
    } else if (
      children.getCount.getFileCategories?.data[i]?.fileType === "image"
    ) {
      image = children.getCount.getFileCategories?.data[i]?.size;
    } else if (
      children.getCount.getFileCategories?.data[i]?.fileType === "video"
    ) {
      video = children.getCount.getFileCategories?.data[i]?.size;
    } else if (
      children.getCount.getFileCategories?.data[i]?.fileType === "audio"
    ) {
      audio = children.getCount.getFileCategories?.data[i]?.size;
    } else if (
      children.getCount.getFileCategories?.data[i]?.fileType === "text"
    ) {
      text = children.getCount.getFileCategories?.data[i]?.size;
    } else if (
      children.getCount.getFileCategories?.data[i]?.fileType === "" ||
      null
    ) {
      other = children.getCount.getFileCategories?.data[i]?.size;
    }
  }
  const obj = { application, image, video, audio, text, other };
  return (
    <div>
      <Box>
        <Swiper spaceBetween={5} slidesPerView={3}>
          {cardNumber.map((card, index) => (
            <SwiperSlide key={index}>
              <HeadCardMobile
                data={obj}
                icon={card.icon}
                title={card.title}
                type={card.type}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </div>
  );
}

export default FileCardSlider;
