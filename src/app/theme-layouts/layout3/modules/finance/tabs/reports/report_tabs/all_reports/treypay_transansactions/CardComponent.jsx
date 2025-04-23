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
                TOTAL INVOICE AMOUNT
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
                TOTAL INVOICE AMOUNT PAID
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
                TOTAL INVOICE AMOUNT DUE
              </Typography>
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                  color: "red",
                }}
              >
                8,091,715 UGX
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
                PERCENTAGE COMPLETION
              </Typography>
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                  color: "red",
                }}
              >
                22.88 %
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InvoiceCards;
