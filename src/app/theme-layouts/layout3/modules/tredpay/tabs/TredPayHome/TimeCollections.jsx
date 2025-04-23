import React from "react";
import { Card, CardContent, Grid, Typography, Box } from "@mui/material";

const InvoiceCards = () => {
  return (
    <Box sx={{ marginTop: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 0 }}>
            <CardContent>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                }}
              >
                THIS YEAR'S COLLECTIONS
              </Typography>
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                  color: "green",
                }}
              >
                10,492,715 UGX
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 0 }}>
            <CardContent>
              <Typography
                variant="h6"
                component="div"
                sx={{ fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" } }}
              >
                THIS MONTH'S COLLECTIONS
              </Typography>
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                  color: "green",
                }}
              >
                2,401,000 UGX
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 0 }}>
            <CardContent>
              <Typography
                variant="h6"
                component="div"
                sx={{ fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" } }}
              >
                THIS WEEK'S COLLECTIONS
              </Typography>
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                  color: "blue",
                }}
              >
                8,456,091,715,000 UGX
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 0 }}>
            <CardContent>
              <Typography
                variant="h6"
                component="div"
                sx={{ fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" } }}
              >
                TODAY'S TOTAL COLLECTIONS
              </Typography>
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                  color: "blue",
                }}
              >
                45,715,000 UGX
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InvoiceCards;
