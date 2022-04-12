import {Box, Grid, Paper, Avatar, TextField, Checkbox, Typography, Link} from "@mui/material";
import { FormControlLabel } from '@material-ui/core';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { sizeHeight } from '@mui/system';

function Login() {  
  
  const paperStyle={padding :20, height: '70vh', width:360, margin:"20px auto"}
  const avatarStyle={backgroundColor:'#108AC9'}
  const textStyle={margin:'10px auto'}

  return(
    <Grid container>
      <Paper elevation={10} style={paperStyle}>
        <Grid align='center'>
          <Avatar style={avatarStyle} sx={{width:56, height:56}}><LockIcon sx={{width:30, height:30}}/></Avatar>
          <h2>Sign in</h2>
        </Grid>
        <TextField label='Email' placeholder='Enter email' style={textStyle} fullWidth required/>
        <TextField label='Password' placeholder='Enter password' style={textStyle} type='password' fullWidth required/>
        <FormControlLabel
          control={
            <Checkbox
              name='checkedB'
              color='primary'
            />
          }
          label='Remember me'
        />
        <Typography>
          <Link href="#">Forgot password ?</Link>
        </Typography>
      </Paper>
    </Grid>

  );
};

export default Login;
