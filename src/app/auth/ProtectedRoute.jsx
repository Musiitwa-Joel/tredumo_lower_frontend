import { selectToken } from "app/store/tokenSlice";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Access the token from Redux state
  const navigate = useNavigate();
  const token = useSelector(selectToken);

  // console.log("state", token);

  // Check if the token exists; if not, redirect to SignInPage
  if (!token) {
    // return <Navigate to="/" />;
    navigate("/");
    return;
  }

  // If token exists, render the requested page
  return children;
};

export default ProtectedRoute;
