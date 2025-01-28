import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
  Popover,
  Tabs,
  Tab,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import AddHotelForm from "./AddHotelForm";
import AddRoom from "./AddRoom"; // Import the AddRoomForm component
import "../index.css";

const Dashboard = ({ hotels, userId }) => {
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [roomsData, setRoomsData] = useState([]);
  const [bookingsData, setBookingsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [roomPopoverOpen, setRoomPopoverOpen] = useState(false);
  const [roomAnchorEl, setRoomAnchorEl] = useState(null);
  const [activeTab, setActiveTab] = useState("rooms");

  // Cancel confirmation popover
  const [cancelPopoverOpen, setCancelPopoverOpen] = useState(false);
  const [cancelBookingId, setCancelBookingId] = useState(null);

  const handleHotelClick = (id) => {
    setSelectedHotelId(id);
    setActiveTab("rooms");
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAddHotelClick = (event) => {
    setAnchorEl(event.currentTarget);
    setPopoverOpen(true);
  };

  const handleClosePopover = () => {
    setPopoverOpen(false);
    setAnchorEl(null);
  };

  const handleAddRoomClick = (event) => {
    setRoomAnchorEl(event.currentTarget);
    setRoomPopoverOpen(true);
  };

  const handleCloseRoomPopover = () => {
    setRoomPopoverOpen(false);
    setRoomAnchorEl(null);
  };

  // Open cancel confirmation popover
  const handleCancelBooking = (bookingId) => {
    setCancelBookingId(bookingId);
    setCancelPopoverOpen(true);
  };

  // Close cancel confirmation popover
  const handleCloseCancelPopover = () => {
    setCancelPopoverOpen(false);
    setCancelBookingId(null);
  };

  // Confirm cancel action
  const handleConfirmCancel = async () => {
    const token = sessionStorage.getItem("token");
    // Call the API to cancel the booking
    try {
      await axios.delete(`http://localhost:8080/api/v1/book/admin/${cancelBookingId}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookingsData((prevBookings) => prevBookings.filter((b) => b.id !== cancelBookingId));
    } catch (error) {
      console.error("Error canceling booking:", error);
    } finally {
      setCancelPopoverOpen(false);
      setCancelBookingId(null);
    }
  };

  useEffect(() => {
    const fetchRooms = async () => {
      if (selectedHotelId) {
        setLoading(true);
        try {
          const response = await axios.get(
            `http://localhost:8080/api/v1/room/hotel/${selectedHotelId}`
          );
          setRoomsData(response.data);
        } catch (error) {
          console.error("Error fetching room data:", error);
          setRoomsData([]);
        } finally {
          setLoading(false);
        }
      }
    };

    const fetchBookings = async () => {
      const token = sessionStorage.getItem("token");
      if (selectedHotelId) {
        setLoading(true);
        try {
          const response = await axios.get(
            `http://localhost:8080/api/v1/book/admin/${selectedHotelId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response);
          setBookingsData(response.data);
        } catch (error) {
          console.error("Error fetching booking data:", error);
          setBookingsData([]);
        } finally {
          setLoading(false);
        }
      }
    };

    if (activeTab === "rooms") {
      fetchRooms();
    } else if (activeTab === "bookings") {
      fetchBookings();
    }
  }, [selectedHotelId, activeTab]);

  return (
    <Box display="flex" height="100vh" marginTop="2%">
      {/* Sidebar for hotels */}
      <Box width="30%" bgcolor="#f5f5f5" p={2} display="flex" flexDirection="column">
        <Paper elevation={3} style={{ marginBottom: "16px", padding: "16px" }}>
          <Typography variant="h6" gutterBottom>
            Hotels
          </Typography>
          <List>
            {hotels.map((hotel) => (
              <ListItem
                key={hotel.id}
                button
                onClick={() => handleHotelClick(hotel.id)}
                style={{
                  marginBottom: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  backgroundColor:
                    selectedHotelId === hotel.id ? "#e0f7fa" : "transparent",
                }}
              >
                <ListItemAvatar>
                  <Avatar>{hotel.name[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={hotel.name} />
              </ListItem>
            ))}
          </List>
        </Paper>
        <Button
          style={{
            backgroundColor: "var(--orange)",
            color: "white",
          }}
          sx={{
            height: "56px",
            width: "100%",
          }}
          onClick={handleAddHotelClick}
        >
          Add Hotel
        </Button>
      </Box>

      {/* Main content for room or booking details */}
      <Box width="70%" p={3}>
        {selectedHotelId ? (
          <>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" gutterBottom>
                {`Details for ${
                  hotels.find((h) => h.id === selectedHotelId)?.name
                }`}
              </Typography>
              {activeTab === "rooms" && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddRoomClick}
                  style={{
                    backgroundColor: "var(--shadow-color)",
                    color: "white",
                  }}
                >
                  Add Room
                </Button>
              )}
            </Box>

            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Rooms" value="rooms" />
              <Tab label="Bookings" value="bookings" />
            </Tabs>

            {loading ? (
              <Typography>Loading...</Typography>
            ) : activeTab === "rooms" ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Room No</TableCell>
                      <TableCell>Room Type</TableCell>
                      <TableCell>Rent Per Day</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {roomsData.map((room) => (
                      <TableRow key={room.id}>
                        <TableCell>{room.roomNo}</TableCell>
                        <TableCell>{room.type}</TableCell>
                        <TableCell>{room.price}</TableCell>
                        <TableCell>
                          <Button variant="contained" color="primary" size="small" style={{backgroundColor: "var(--shadow-color)", color: "white"}}>
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Room ID</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Rent</TableCell>
                      <TableCell>CheckIn</TableCell>
                      <TableCell>CheckOut</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bookingsData.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>{booking.room.id}</TableCell>
                        <TableCell>{booking.name}</TableCell>
                        <TableCell>{booking.rentTotal}</TableCell>
                        <TableCell>{new Date(booking.checkIn).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(booking.checkOut).toLocaleDateString()}</TableCell>
                        <TableCell>{booking.phone}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            style={{backgroundColor: "var(--shadow-color)", color: "white"}}
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            Cancel
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        ) : (
          <Typography>Select a hotel to view its details.</Typography>
        )}
      </Box>

      {/* Add Room Popover */}
      <Popover
        open={roomPopoverOpen}
        anchorEl={roomAnchorEl}
        onClose={handleCloseRoomPopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        PaperProps={{
          style: {
            width: "400px", // Set the desired width here
          },
        }}
      >
        <Box p={3}>
          <AddRoom hotelId={selectedHotelId} onClose={handleCloseRoomPopover} />
        </Box>
      </Popover>

      {/* Add Hotel Popover */}
      <Popover
        open={popoverOpen}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Box p={2}>
          <AddHotelForm onClose={handleClosePopover} userId={userId} />
        </Box>
      </Popover>

      {/* Cancel Booking Popover */}
      <Dialog open={cancelPopoverOpen} onClose={handleCloseCancelPopover}>
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          Are you sure you want to cancel this booking?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelPopover} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmCancel} color="secondary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
