import { Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as Icons from "../icons/index";

const OfferContainer = styled("div")(({ theme }) => ({
  display: "flex",
  columnGap: 16,
  padding: theme.spacing(4),
  backgroundColor: "rgba(40, 199, 111, 0.2)",
  borderRadius: 4,
}));

const OfferContentLeft = styled("div")({
  display: "flex",
});

const OfferContentLeftIcon = styled("div")({
  display: "flex",
  padding: 8,
  borderRadius: 4,
  backgroundColor: "white",
  height: "fit-content",
});

const OfferContentRight = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  rowGap: 16,
  color: theme.palette.green.main,
}));

const Offer = (props) => {
  const theme = useTheme();
  return (
    <OfferContainer>
      <OfferContentLeft>
        <OfferContentLeftIcon>
          <Icons.MdOutlineBookmarksIcon
            style={{
              color: theme.palette.green.main,
              width: "22px",
              height: "22px",
            }}
          />
        </OfferContentLeftIcon>
      </OfferContentLeft>
      <OfferContentRight>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
          }}
        >
          {props.title}
        </Typography>
        <Typography
          component="div"
          sx={{
            fontWeight: 600,
          }}
        >
          {props.context}
        </Typography>
      </OfferContentRight>
    </OfferContainer>
  );
};

export default Offer;
