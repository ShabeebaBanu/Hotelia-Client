import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import BookingForm from '../assets/BookingForm';
import '../index.css';
import { Grid } from '@mui/material';


const columns = [
  { id: 'roomNo', label: 'Room No.', minWidth: 170 },
  { id: 'type', label: 'Type', minWidth: 100 },
  { id: 'maxMembers', label: 'Max Members', minWidth: 170, align: 'right' },
  { id: 'bed', label: 'Beds', minWidth: 170, align: 'right' },
  { id: 'status', label: 'Status', minWidth: 170, align: 'right' },
  { id: 'action', label: 'Action', minWidth: 170, align: 'center' },
];

function Room() {
  const { id, name } = useParams(); // Extract id and name from params
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState([]);
  const [dateRange, setDateRange] = React.useState([null, null]); // State for selected date range
  const [popoverAnchor, setPopoverAnchor] = React.useState(null); // State for popover
  const [selectedRoom, setSelectedRoom] = React.useState(null); // State for selected room details

  
  React.useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/room/${id}`);
        const roomData = response.data.map((room) => ({
          roomNo: room.roomNo,
          type: room.type,
          maxMembers: room.maxMembers,
          bed: room.bed,
          status: room.bookingStatus ? 'Booked' : 'Available',
          id: room.id,
          price: room.price, 
        }));
        setRows(roomData);
      } catch (error) {
        console.error('Error fetching room data:', error);
      }
    };

    fetchRoomData();
  }, [id]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  
  const handleCheckAvailability = async () => {
    if (!dateRange[0] || !dateRange[1]) {
      alert('Please select a valid date range!');
      return;
    }

    const checkIn = dateRange[0].format('YYYY-MM-DD');
    const checkOut = dateRange[1].format('YYYY-MM-DD');
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/room/available`, {
        params: { checkIn, checkOut },
      });
      const availableRooms = response.data.map((room) => ({
        roomNo: room.roomNo,
        type: room.type,
        maxMembers: room.maxMembers,
        bed: room.bed,
        status: room.bookingStatus ? 'Booked' : 'Available',
        id: room.id,
        price: room.price, 
      }));
      setRows(availableRooms);
    } catch (error) {
      console.error('Error checking availability:', error);
    }
  };

  const handlePopoverOpen = (event, room) => {
    setSelectedRoom(room); // Set the selected room details
    setPopoverAnchor(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setPopoverAnchor(null);
    setSelectedRoom(null); // Clear selected room when closing
  };

  const isPopoverOpen = Boolean(popoverAnchor);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '5%' }}>
      <Typography variant="h4" align="center" style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>
        {name ? `Welcome to ${name}` : 'Room Details'}
      </Typography>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateRangePicker
            slots={{ field: SingleInputDateRangeField }}
            value={dateRange}
            onChange={(newValue) => setDateRange(newValue)}
          />
        </LocalizationProvider>
        <Button
          variant="contained"
          color="primary"
          style={{ marginLeft: '20px', backgroundColor: 'var(--orange)' }}
          onClick={handleCheckAvailability}
        >
          Check Availability
        </Button>
      </div>

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    backgroundColor: 'var(--shadow-color)',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.roomNo}>
                {columns.map((column) => {
                  const value = row[column.id];
                  if (column.id === 'action') {
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {row.status === 'Available' && (
                          <Button
                            style={{ backgroundColor: 'var(--green)' }}
                            variant="contained"
                            color="primary"
                            onClick={(event) => handlePopoverOpen(event, row)} 
                          >
                            Book Now
                          </Button>
                        )}
                      </TableCell>
                    );
                  }
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

     
      <Popover
        open={isPopoverOpen}
        anchorReference="none" 
        onClose={handlePopoverClose}
        PaperProps={{
          style: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)', 
            padding: '20px',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
          },
        }}
      >
        <Grid sx={{ p: 2 }}>
          {selectedRoom && (
            <BookingForm roomId={selectedRoom.id} pricePerDay={selectedRoom.price} />
          )}
        </Grid>
      </Popover>
    </Paper>
  );
}

export default Room;
