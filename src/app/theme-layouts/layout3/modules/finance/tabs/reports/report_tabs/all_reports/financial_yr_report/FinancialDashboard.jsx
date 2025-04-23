import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import {
  ArrowUpward,
  ArrowDownward,
  AccountBalance,
} from "@mui/icons-material";

// Helper function to format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const StatisticCard = ({ title, value, icon, color }) => (
  <Card sx={{ height: "100%", marginTop: 2 }}>
    <CardContent
      sx={{ padding: "16px", "&:last-child": { paddingBottom: "16px" } }}
    >
      <Typography variant="h6" component="div" gutterBottom>
        {title}
      </Typography>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        {icon}
        <Typography
          variant="h4"
          component="div"
          sx={{
            ml: 1,
            color,
            fontSize: "clamp(1rem, 4vw, 2rem)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            paddingRight: "5px",
          }}
        >
          {formatCurrency(value)}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

const FinancialDashboard = ({
  totalRevenue = 1500000000,
  totalExpenses = 1200000000,
  netProfit = 300000000,
  cashFlow = 250000000,
}) => {
  return (
    <Grid container spacing={2} style={{ marginBottom: 15 }}>
      <Grid item xs={12} sm={6} md={3}>
        <StatisticCard
          title="Total Revenue"
          value={totalRevenue}
          icon={<ArrowUpward sx={{ color: "success.main" }} />}
          color="success.main"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatisticCard
          title="Total Expenses"
          value={totalExpenses}
          icon={<ArrowDownward sx={{ color: "error.main" }} />}
          color="error.main"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatisticCard
          title="Net Profit/Loss"
          value={netProfit}
          icon={
            netProfit >= 0 ? (
              <ArrowUpward sx={{ color: "success.main" }} />
            ) : (
              <ArrowDownward sx={{ color: "error.main" }} />
            )
          }
          color={netProfit >= 0 ? "success.main" : "error.main"}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatisticCard
          title="Cash Flow"
          value={cashFlow}
          icon={
            <AccountBalance
              sx={{ color: cashFlow >= 0 ? "success.main" : "error.main" }}
            />
          }
          color={cashFlow >= 0 ? "success.main" : "error.main"}
        />
      </Grid>
    </Grid>
  );
};

export default FinancialDashboard;
