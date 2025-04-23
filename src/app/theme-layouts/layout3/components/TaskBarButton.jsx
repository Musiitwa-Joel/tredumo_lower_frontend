import React from "react";
import { Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function TaskBarButton({ title, onClick, onClose, isActive }) {
  return (
    <Button
      variant="contained"
      color={isActive ? "secondary" : "primary"}
      className="mx-4"
      style={{
        display: "flex",
      }}
    >
      <div
        onClick={onClick}
        style={{
          marginRight: 5,
        }}
      >
        {title}
      </div>
      <div>
        <CloseIcon fontSize="small" onClick={onClose} />
      </div>
    </Button>
  );
}

export default TaskBarButton;
