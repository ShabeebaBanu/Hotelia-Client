import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import "../index.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import { validateEmail, validatePassword } from './Validation';

function SigninForm() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [formError, setFormError] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

  const emailValidation = validateEmail(email);
  const passwordValidation = validatePassword(password);

  if (!emailValidation.isValid || !passwordValidation.isValid) {
    setFormError({
      email: emailValidation.Message,
      password: passwordValidation.Message
    });
    return;
  }

  try {
    const response = await axios.post(`http://localhost:8080/api/v1/auth/login`, {
      email: email,
      password: password,
    });

    if (response) {
      console.log(response);
      const token = response.data.token; 
      console.log("Token:", token);
      sessionStorage.setItem('token', token); 
      navigate('/profile'); 
    }
  } catch (error) {
    console.error(error);
    setError('Invalid email or password. Please try again.');
  }
  };

  return (
    <form className='formCss' onSubmit={handleSubmit}>
      <Typography
        variant="h4"
        align="center"
        style={{ marginBottom: "20px", color: "var(--text-primary)" }}
      >
        Signin
      </Typography>

      {error && <p className="error">{error}</p>}

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
        label="Password"
        variant="outlined"
        fullWidth
        margin="normal"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {formError.password && <p className="error">{formError.password}</p>}

      <Typography
        align="right"
        style={{ marginBottom: "20px", color: "var(--text-primary)", fontSize: "15px" }}
      >
        Forgot Password
      </Typography>

      <Button
        variant="contained"
        type="submit" 
        style={{
          backgroundColor: "var(--green)"
        }}
        sx={{
          height: '56px',
          width: "100%"
        }}
      >
        Signin
      </Button>

      <Button
        style={{
          backgroundColor: "white",
          color: "var(--text-primary)"
        }}
        sx={{
          height: '56px',
          width: "100%"
        }}
        onClick={() => navigate('/signup')} 
      >
        Do not have an Account
      </Button>
    </form>
  );
}

export default SigninForm;
