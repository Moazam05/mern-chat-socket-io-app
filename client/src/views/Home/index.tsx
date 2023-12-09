import { Box, Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <Box>
      <p>Home page</p>
      <Button onClick={() => navigate("/profile")}>Profile</Button>
    </Box>
  );
};

export default Home;
