import React, { useEffect, useState } from 'react';
import { Typography, Button, Paper, Grid, Avatar, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../index.css";
import Dashboard from '../assets/Dashboard';
import UserProfileTable from '../assets/UserProfileTable';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [roleData, setRoleData] = useState(null);
  const [error, setError] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/v1/user/profile`, {
          headers: { 
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setFormData({
          name: response.data.name,
          phone: response.data.phone,
          password: '',  // don't pre-fill password
        });
      } catch (err) {
        console.error(err);
        setError('Failed to fetch profile details. Please log in again.');
        sessionStorage.clear();
        navigate('/signin');
      }
    };

    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    const fetchRoleData = async () => {
      if (!user || !user.role) return;

      const token = sessionStorage.getItem('token');
      const userId = user.id;
      try {
        if (user.role === 'ADMIN') {
          const adminResponse = await axios.get(`http://localhost:8080/api/v1/hotel/admin/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setRoleData(adminResponse.data);
        } else if (user.role === 'USER') {
          const userResponse = await axios.get(`http://localhost:8080/api/v1/book/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setRoleData(userResponse.data);
        }
      } catch (err) {
        console.error('Failed to fetch role-specific data:', err);
        setRoleData({ error: 'Failed to load data specific to your role.' });
      }
    };

    fetchRoleData();
  }, [user]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/signin');
  };

  const handleEditOpen = () => {
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleDeleteOpen = () => {
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const handleSaveChanges = async () => {
    const token = sessionStorage.getItem('token');
    try {
      const response = await axios.put(`http://localhost:8080/api/v1/user/${user.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);
      setUser(response.data);
      setEditOpen(false);
    } catch (err) {
      console.error('Failed to update account:', err);
      setError('Failed to update account details.');
    }
  };

  const handleDeleteAccount = async () => {
    const token = sessionStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8080/api/v1/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      sessionStorage.clear();
      navigate('/signin');
    } catch (err) {
      console.error('Failed to delete account:', err);
      setError('Failed to delete account.');
    }
  };

  if (error) {
    return (
      <Paper elevation={3} style={{ padding: '16px', maxWidth: '90%', margin: 'auto', marginTop: '50px' }}>
        <Typography variant="h6" color="error" align="center" style={{ marginBottom: '20px' }}>
          {error}
        </Typography>
        <Button variant="contained" color="primary" fullWidth onClick={() => navigate('/signin')}>
          Go to Login
        </Button>
      </Paper>
    );
  }

  if (!user) return <p>Loading...</p>;

  return (
    <Paper elevation={3} style={{ padding: '16px', maxWidth: '90%', margin: 'auto', marginTop: '50px', marginTop: "6%"}}>
      <Grid container direction="column" spacing={4}>
        {/* Profile Details */}
        <Grid item>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Avatar alt="Profile Icon" src="/path-to-image.jpg" style={{ width: 60, height: 60 }} />
            </Grid>
            <Grid item xs>
              <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                {user.name}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Role: {user.role}
              </Typography>
            </Grid>
            <Grid item>
              <Button variant="contained" style={{ backgroundColor: "var(--green)" }} onClick={handleLogout}>
                Logout
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {/* Role-Specific Data */}
        <Grid item>
          <Typography variant="h6" style={{ marginBottom: '10px' }}>
            {user.role === 'ADMIN' ? 'Admin Dashboard' : 'User Dashboard'}
          </Typography>
          {roleData ? (
            user.role === "ADMIN" ? (
              <Dashboard hotels={roleData} userId={user.id} />
            ) : (
              <UserProfileTable userId={user.id}/>
            )
          ) : (
            <Typography variant="body1">Loading dashboard data...</Typography>
          )}
        </Grid>

        {/* Edit & Delete Account Buttons */}
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleEditOpen} style={{ marginRight: '10px', backgroundColor: "var(--orange)" }}>
            Edit Account
          </Button>
          <Button variant="contained" color="secondary" onClick={handleDeleteOpen} style={{backgroundColor: "var(--orange-light)"}}>
            Delete Account
          </Button>
        </Grid>
      </Grid>

      {/* Edit Account Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Account</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Phone"
            fullWidth
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={deleteOpen} onClose={handleDeleteClose}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete your account? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteAccount} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ProfilePage;
