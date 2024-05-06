import { Box, Grid, Skeleton } from "@mui/material";

function CardSkeleton() {
  const countSkeleton = Array.from({ length: 18 });
  return (
    <div>
      <Skeleton width={100} height={30} sx={{ mb: 2, mt: 5 }} />
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={5}>
          {countSkeleton.map((item, index) => (
            <Grid item md={4} lg={2} xs={6} sm={6} key={index}>
              <Skeleton variant="rectangular" height={180} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
}

export default CardSkeleton;
