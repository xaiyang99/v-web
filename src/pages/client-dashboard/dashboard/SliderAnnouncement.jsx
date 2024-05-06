import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { previewImage } from "../../../functions";

function SliderAnnouncement(props) {
  return (
    <div>
      <Card
        sx={{
          padding: "2px",
          display: "flex",
          boxShadow: "rgba(0, 0, 0, 0.45) 0px 15px 20px -20px",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent>
            <Typography component="div" variant="h5">
              {props.title}
            </Typography>
          </CardContent>
        </Box>
        <CardMedia
          component="img"
          sx={{ width: "100%", height: 100, objectFit: "contain" }}
          image={`${previewImage}${props.image}`}
          alt={props.image}
        />
      </Card>
    </div>
  );
}

export default SliderAnnouncement;
