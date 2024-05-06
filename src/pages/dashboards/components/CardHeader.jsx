import React from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Typography,
  styled,
} from "@mui/material";

function CardHeader(props) {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "left",
    color: theme.palette.text.secondary,
    borderRadius: "8px",
    boxShadow: "rgba(0, 0, 0, 0.09) 0px 3px 12px",
  }));

  const cardUsers = props;

  return (
    <div>
      <Box sx={{ m: 5 }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {cardUsers?.cardUser.map((item) => (
            <Grid item md={3} xs={12}>
              <Item>
                <Card>
                  <CardContent
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box>
                      <Typography variant="h3" sx={{ mb: 2 }}>
                        {item?.quantity}
                      </Typography>
                      <Typography variant="p">{item?.title}</Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "8px 9px",
                        width: "40px",
                        background: "grey",
                        height: "40px",
                        fontSize: "22px",
                        borderRadius: "50%",
                        backgroundColor: `${item?.backgroundColor}`,
                        color: `${item?.color}`,
                      }}
                    >
                      {item?.icon}
                    </Box>
                  </CardContent>
                </Card>
              </Item>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
}

export default CardHeader;
