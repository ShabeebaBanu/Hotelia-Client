import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Popover,
  Typography,
} from "@mui/material";
import axios from "axios";
import "../index.css"

const BookingTable = ({ userId }) => {
  const [bookings, setBookings] = useState([]);
  const [details, setDetails] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = sessionStorage.getItem("token");
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/book/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const bookingsWithDetails = await Promise.all(
          response.data.map(async (booking) => {
            const hotelResponse = await axios.get(
              `http://localhost:8080/api/v1/hotel/${booking.hotelId}`
            );

            const roomResponse = await axios.get(
              `http://localhost:8080/api/v1/room/${booking.room.id}`
            );

            return {
              ...booking,
              hotel: hotelResponse.data,
              room: roomResponse.data,
            };
          })
        );
        setBookings(bookingsWithDetails);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [userId]);

  const handleViewDetails = (event, details) => {
    setAnchorEl(event.currentTarget);
    setDetails(details);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setDetails(null);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Hotel Name</TableCell>
            <TableCell>Room Number</TableCell>
            <TableCell>Rent</TableCell>
            <TableCell>Check-In</TableCell>
            <TableCell>Check-Out</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>{booking.hotel.name || "N/A"}</TableCell>
              <TableCell>{booking.room.roomNo || "N/A"}</TableCell>
              <TableCell>{booking.rentTotal}</TableCell>
              <TableCell>{new Date(booking.checkIn).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(booking.checkOut).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  onClick={(event) => handleViewDetails(event, booking)}
                  style={{backgroundColor: "var(--text-primary)", color: "white"}}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {details && (
          <Paper style={{ padding: 24, maxWidth: 400 }}>
            <Typography variant="h5" gutterBottom>
              Hotel Details
            </Typography>
            <div style={{ marginBottom: 16 }}>
              <Typography variant="body1" color="textSecondary">
                <strong>Name:</strong> {details.hotel.name}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <strong>Address:</strong> {`${details.hotel.addNo}, ${details.hotel.addStreet}, ${details.hotel.addCity}, ${details.hotel.province}, ${details.hotel.district}`}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <strong>Phone:</strong> {details.hotel.phone}
              </Typography>
            </div>

            <Typography variant="h5" gutterBottom>
              Room Details
            </Typography>
            <div>
              <Typography variant="body1" color="textSecondary">
                <strong>Room Number:</strong> {details.room.roomNo}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <strong>Type:</strong> {details.room.type}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <strong>Beds:</strong> {details.room.bed}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <strong>Max Members:</strong> {details.room.maxMembers}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <strong>Price:</strong> {details.room.price}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <strong>Status:</strong> {details.room.status}
              </Typography>
            </div>

            <Typography variant="h5" gutterBottom style={{ marginTop: 16 }}>
              Booking Details
            </Typography>
            <div>
              <Typography variant="body1" color="textSecondary">
                <strong>Check-In:</strong> {new Date(details.checkIn).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <strong>Check-Out:</strong> {new Date(details.checkOut).toLocaleDateString()}
              </Typography>
            </div>
          </Paper>
        )}
      </Popover>
    </TableContainer>
  );
};

export default BookingTable;
