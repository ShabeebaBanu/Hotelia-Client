import React from 'react'
import SignupForm from '../assets/SignupForm'
import { Grid} from "@mui/material";

function Signup() {
  return (
    <Grid
        item
        xs={10}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "90vh", 
          
        }}
      >
         <SignupForm/>
      </Grid>
  )
}

export default Signup