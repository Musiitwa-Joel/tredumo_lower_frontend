import React from "react";
import "./my_app.css";
import { motion } from "framer-motion";
import { Paper } from "@mui/material";
import Typography from "@mui/material/Typography";


function MyApp({ title, logo, description, onClick, sx }) {
  return (
    <Paper
      onClick={onClick}
      sx={{
        p: 2,
        cursor: 'pointer',
        borderRadius: 2,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'background.paper',
        ...sx
      }}
    >
      <img 
        src={logo} 
        alt={title}
        style={{
          width: 64,
          height: 64,
          objectFit: 'contain',
          marginBottom: 12
        }}
      />
      <Typography 
        variant="subtitle1" 
        className="text-center font-medium"
        sx={{ color: 'text.primary' }}
      >
        {title}
      </Typography>
      {description && (
        <Typography 
          variant="body2" 
          className="text-center mt-4"
          sx={{ 
            color: 'text.secondary',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {description}
        </Typography>
      )}
    </Paper>
  );
}

export default MyApp;
