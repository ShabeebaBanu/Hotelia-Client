import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import "../index.css";
import FilterHotel from "../assets/FilterHotel";
import HotelGrid from "../assets/HotelGrid";

const Home = () => {
  return (
    <Grid
      container
      style={{
        minHeight: "100vh",
        marginTop: "10%",
        overflowY: "auto", // Enables scrolling if content overflows
        padding: "20px",   // Adds padding to prevent content from touching edges
      }}
    >
      {/* Filter and Title Section */}
      <Grid
        item
        xs={12}
        style={{
          display: "flex",
          flexDirection: "column", // Stack elements vertically
          alignItems: "center",
          backgroundColor: "var(--background-color)",
          padding: "20px",
          borderRadius: "10px", // Rounded corners for aesthetics
          marginBottom: "20px", // Spacing between sections
        }}
      >
        <Typography
          variant="h4"
          align="center"
          style={{
            marginBottom: "20px",
            color: "var(--text-primary)",
          }}
        >
          Do Your Hotel Booking Here
        </Typography>
        <FilterHotel />
      </Grid>

      {/* Hotel Listings Section */}
      <Grid
        item
        xs={12}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "var(--background-secondary)", // A slightly different color
          padding: "20px",
          borderRadius: "10px",
          overflowY: "auto", // Ensure scrolling within the grid for large data
        }}
      >
        <HotelGrid />
      </Grid>
    </Grid>
  );
};

export default Home;
