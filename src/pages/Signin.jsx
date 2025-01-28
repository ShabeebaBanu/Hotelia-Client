import React from 'react'
import SigninForm from '../assets/SigninForm'
import { Grid} from "@mui/material";

function Signin() {
  return (
    <Grid
        item
        xs={12}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh", 
          marginTop: "10%"
        }}
      >
         <SigninForm/>
      </Grid>
  )
}

export default Signin