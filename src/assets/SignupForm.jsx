import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import "../index.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import { validateName,
         validateEmail,
         validatePassword,
         validatePhone
 } from './Validation';
import { FormControl, InputLabel, Select, MenuItem, } from '@mui/material';

function SignupForm() {
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');  
  const [error, setError] = useState('');
  const [formError, setFormError] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: ""  
  })

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nameValidation = validateName(name);
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const phoneValidation = validatePhone(phone);

    if(!nameValidation.isValid ||
      !emailValidation.isValid ||
      !passwordValidation.isValid ||
      !phoneValidation.isValid 
      
    ){
      setFormError({
        name: nameValidation.Message,
        email: emailValidation.Message,
        password: passwordValidation.Message,
        phone: phoneValidation.Message,
        role: role ? "" : "Role is required" 
      })
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/register', {
        email: email,
        name: name,
        password: password,
        phone: phone,
        role: role 
      });

      if (response.data) {
        navigate('/signin');
      }
    } catch (error) {
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <form className='formCss' onSubmit={handleSubmit}>
      <Typography variant="h4" align="center" style={{marginBottom: "20px", color: "var(--text-primary)"}}>
          Signup  
      </Typography>
      
      {error && <p className="error">{error}</p>}
      
      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {formError.name && <p className="error">{formError.name}</p>}

      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {formError.email && <p className="error">{formError.email}</p>}

      <TextField
        label="Phone"
        variant="outlined"
        fullWidth
        margin="normal"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      {formError.phone && <p className="error">{formError.phone}</p>}

      <FormControl fullWidth margin="normal">
        <InputLabel id="role-label">Why Are You Here</InputLabel>
        <Select
          labelId="role-label"
          id="role-select"
          value={role}
          label="Role"
          onChange={(e) => setRole(e.target.value)}
        >
          <MenuItem value="USER">Book Hotel Room</MenuItem>
          <MenuItem value="ADMIN">Post Hotel Details</MenuItem>
        </Select>
      </FormControl>
      {formError.role && <p className="error">{formError.role}</p>}

      <TextField
        label="Password"
        variant="outlined"
        fullWidth
        margin="normal"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {formError.password && <p className="error">{formError.password}</p>}

      <Button
        variant="contained"
        type='submit'
        style={{
        backgroundColor: "var(--green)"
              }}
              sx={{
                height: '56px',
                width : "100%"
              }}
            >
              Signup
        </Button>
        <Button
        onClick={() => navigate('/signin')} 
        style={{
        backgroundColor: "white",
        color: "var(--text-primary)"
              }}
              sx={{
                height: '56px',
                width : "100%"
              }}
            >
              Already have an Account
        </Button>
    </form>
  );
}

export default SignupForm;
