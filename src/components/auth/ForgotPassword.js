import React, { useContext, useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { useEffect } from 'react'
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Button from '@material-ui/core/Button';
import axios from 'axios'
import { useHistory } from 'react-router-dom';
import { LoginContext } from '../../context/LoginContext';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import { indigo } from '@material-ui/core/colors';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link'
import Alert from '@material-ui/lab/Alert';


const mytextcolor = indigo["900"];

const api = axios.create({
  baseURL: process.env.REACT_APP_MY_HOST
})
function validateEmail(email){
    const re = /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
    return re.test(String(email).toLowerCase());
}

const useStyles = makeStyles((theme) => ({
root: {
    margin: theme.spacing(0)
},
control: {
    textAlign: "center",
    padding: theme.spacing(5)
},
textcolor: {
    color: mytextcolor
},
backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
},

}));
  

const ForgotPassword = () => {
    const classes = useStyles();
    const { dispatch } = useContext(LoginContext);
    const[email, setEmail] =  useState('john.doe@gmail.com');
    const history = useHistory();
    //backdrop
    const [open, setOpen] = React.useState(false);
    //error
    const [iserror, setIserror] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [showform, setShowform] = useState(false)

    const handleForgetPassword = (e) => {
        e.preventDefault();
        if(validateEmail(email) === false){
            setErrorMessage("Please enter a valid email")
            setIserror(true)
        }else{
            console.log("Email is: " + email)
            setOpen(true)
            api.put('/healthworkers/forgot-password', {email: email})
                .then(res => {
                    setTimeout(() => {
                        setErrorMessage("We have sent you an email with a reset link. Please follow the instructions in the email to reset your password.")
                        setIserror(true)
                        setEmail("")
                        setOpen(false)
                    }, 500);
                    
                })
                .catch(error => {
                    setOpen(false)
                    setIserror(true)

                    if(error.response && error.response.data.message === "Healthworker not found"){
                        setErrorMessage("Your account does not exist in our System. Please considering creating an account or contact us!")
                    }else if(error.response && error.response.data.message === "Not activated"){
                        setErrorMessage("Your account is not yet activated. Please allow us a few more days to verify your account. Contact us if you have any questions.")
                    }else if(error.response && error.response.data.message === "Email not sent"){
                        setErrorMessage("Unfortunately, we are unable to email you a password reset link. Please try again later.")
                    }else{
                        setErrorMessage("Auth failure! Consider creating an account or contact us if you have questions")
                    }
                    
                })
        }
    }

    useEffect(() => {
      const storedUser = JSON.parse(window.localStorage.getItem('login'));
      if(storedUser){
        setShowform(false)
        history.push("/dashboard/"+storedUser.id)
      }else{
        setShowform(true)
      }
    }, [])

    return ( 
        <div className={classes.root}>
            {showform &&
            <Grid container className={classes.root} spacing={2}>
            
              <Grid item lg={4} md={3} sm={12}>
                
              <p>
              </p>
              </Grid>

              <Grid item lg={4} md={6} sm={12}>
            
              <div>
                <Backdrop className={classes.backdrop} open={open}>
                  <CircularProgress color="inherit" />
                </Backdrop>
              </div>

              <Paper className={classes.control}>
                <div>
                  {iserror && 
                      <Alert style={{textAlign: "left"}} severity="info">
                          {errorMessage}
                      </Alert>
                  }
                  
                </div>

                <h1 style={{color: mytextcolor}}>Forgot your password?</h1>
                
                <Divider />
                <p style={{textAlign: "left"}}>Can't remember your password? We're humans! Just enter your <b style={{color: mytextcolor}}>MEDILINKUP</b> account email and we'll send you a password reset link.</p>
                <Divider />
                <form>
                  <TextField style={{marginTop: 30, marginBottom: 30}} required={true} fullWidth={true} className={clsx(classes.margin, classes.textField)} id="outlined-basic" label="Email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)}/>
                  <Button fullWidth={true} variant="contained" color="primary" onClick={handleForgetPassword}>Reset password</Button>
                  <p>
                    Already have an account? <Link href="#" onClick={() => history.push("/login")}> Login </Link>
                  </p>

                  <p>
                    Don't have an account? <Link href="#" onClick={() => history.push("/signup")}> SignUp </Link>
                  </p>

                </form>
                </Paper>
                
              </Grid>

              <Grid item lg={4} md= {3} sm={12}>
              <p></p>
              </Grid>
              
            </Grid>
          }
        </div>
    );
}
 
export default ForgotPassword;