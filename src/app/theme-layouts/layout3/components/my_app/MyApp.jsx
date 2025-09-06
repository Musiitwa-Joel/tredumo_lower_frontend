import React from "react";
import "./my_app.css";
import { motion } from "framer-motion";
import { Box, Paper } from "@mui/material";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";


function MyApp({
  title,
  logo,
  description,
  onClick,
  onMouseEnter,
  onMouseLeave,
  sx,
}) {
  const theme = useTheme();

  return (
    <Paper
      component={motion.div}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      sx={{
        p: 2.5,
        cursor: "pointer",
        borderRadius: 3,
        width: "100%",
        minHeight: 150,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
        position: "relative",
        overflow: "hidden",
        // Glassy background to let watermark subtly show through
        background: alpha(theme.palette.background.paper, 0.5),
        backdropFilter: "blur(8px)",
        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        boxShadow: `0 1px 2px ${alpha(theme.palette.common.black, 0.04)}, 0 8px 24px ${alpha(
          theme.palette.common.black,
          0.06
        )}`,
        outline: "none",
        "&:focus-visible": {
          boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.3)}`,
        },
        "&:hover": {
          borderColor: alpha(theme.palette.primary.main, 0.35),
          boxShadow: `0 6px 20px ${alpha(theme.palette.common.black, 0.12)}`,
        },
        // Soft hover halo
        "&::after": {
          content: '""',
          position: "absolute",
          inset: -2,
          borderRadius: 16,
          pointerEvents: "none",
          background: `radial-gradient(600px 200px at 50% -10%, ${alpha(
            theme.palette.primary.main,
            0.15
          )}, transparent 50%)`,
          opacity: 0,
          transition: "opacity 200ms ease",
        },
        "&:hover::after": { opacity: 1 },
        ...sx,
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: alpha(theme.palette.primary.main, 0.06),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
          boxShadow: `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.3)}`,
        }}
      >
        <img
          src={logo}
          alt={title}
          style={{ width: 48, height: 48, objectFit: "contain" }}
        />
      </Box>

      <Typography
        variant="subtitle1"
        className="text-center font-medium"
        sx={{ color: "text.primary", lineHeight: 1.2 }}
      >
        {title}
      </Typography>

      {description && (
        <Typography
          variant="body2"
          className="text-center"
          sx={{
            color: "text.secondary",
            mt: 0.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </Typography>
      )}
    </Paper>
  );
}

export default MyApp;
