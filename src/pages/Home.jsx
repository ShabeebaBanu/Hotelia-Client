import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import "../index.css"
import FilterHotel from "../assets/FilterHotel";
import HotelGrid from "../assets/HotelGrid";

const Home = () => {
  return (
    <Grid container style={{ minHeight: "100vh", marginTop: "10%"}} >
      <Grid
        item
        xs={12}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "var(--background-color)", 
          height: "50vh", 
        }}
      >
        <Box>
          <Typography variant="h4" align="center" style={{marginBottom: "20px", color: "var(--text-primary)"}}>
            Do Your Hotel Booking Here
          </Typography>
          <Box>
             <FilterHotel/>
          </Box>
        </Box>
      </Grid>

      
    </Grid>
  );
};

export default Home;
