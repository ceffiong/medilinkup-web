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
  

const ResetPassword = ({match}) => {
    const classes = useStyles();
    const { dispatch } = useContext(LoginContext);
    const [password, setPassword] =  useState('password');
    const [passConfirmed, setPassConfirmed] = useState('');
    //backdrop
    const [open, setOpen] = React.useState(false);
    //error
    const [iserror, setIserror] = useState(false)
    const [errorMessages, setErrorMessages] = useState([])
    const [showform, setShowform] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [success, setSuccess] = useState(false)
    const history = useHistory();

    const [values, setValues] = React.useState({
      amount: '',
      password: '',
      weight: '',
      weightRange: '',
      showPassword: false,
  });
  
    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event) => {
    event.preventDefault();
    };


    const [valuesP, setValuesP] = React.useState({
        amount: '',
        password: '',
        weight: '',
        weightRange: '',
        showPassword: false,
    });

    const handleClickShowPasswordP = () => {
        setValuesP({ ...valuesP, showPassword: !valuesP.showPassword });
    };

    const handleMouseDownPasswordP = (event) => {
        event.preventDefault();
    };
  

    const handleResetPassword = (e) => {
      e.preventDefault();
      setOpen(true)
      let errMsg = []

      if((password != undefined || password != '') && (passConfirmed != undefined || passConfirmed != "")){
        if(passConfirmed === password){
            if(password.length < 8 || passConfirmed.length < 8){
                errMsg.push("Passwords length must be at least 8 characters")
            }
            if (/\s/.test(password)) {
                errMsg.push("Passwords cannot containe whitespace(s)")
            }

        }else{
            errMsg.push("Passwords MUST match")
        }
      }else{
          errMsg.push("Password fields cannot be blank")
      }
      if(errMsg.length < 1){
        api.put('/healthworkers/reset-password', {reset_link: match.params.token, password: password})
          .then(res => {
              setTimeout(() => {
                  setSuccessMessage("You've successfully reset your password")
                  setIserror(false)
                  setSuccess(true)
                  setOpen(false)
              }, 500);
              
          })
          .catch(error => {
              setOpen(false)
              setIserror(true)

              if(error.response && error.response.data.message === "Healthworker not found"){
                  setErrorMessages(["No token found! You've either reset your password or didn't initiate a request to do so. Consider initiating a password reset request if you want to reset your password."])
              }else if(error.response && error.response.data.message === "Not activated"){
                  setErrorMessages(["Your account is not yet activated. Please allow us a few more days to verify your account. Contact us if you have any questions."])
              }else if(error.response && error.response.data.message === "Auth failed"){
                setErrorMessages(["Invalid token! Please consider initiating a new password reset request."])
              }else{
                  setErrorMessages(["Auth failure! Consider creating an account or contact us if you have questions"])
              }
              
          })

      }else{
        setErrorMessages(errMsg)
        setIserror(true)
        setOpen(false)
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
                        <Alert style={{textAlign: "left"}} severity="error">
                            {errorMessages.map((msg, i) => {
                                return <div key={i}>{msg}</div>
                            })}
                        </Alert>
                    }

                    {success && 
                        <Alert style={{textAlign: "left"}} severity="success">
                            {successMessage}. You can now <Link href="#" onClick={() => history.push("/login")}> Login </Link>
                        </Alert>
                    }
                    
                </div>

                <h1 style={{color: mytextcolor}}>Reset password</h1>
                
                <Divider />
                <p style={{textAlign: "left"}}>Enter your new password for your <b style={{color: mytextcolor}}>MEDILINKUP</b> account</p>
                <Divider />
                <form>
                  <FormControl style={{marginBottom: 30}} fullWidth={true} className={clsx(classes.margin, classes.textField)} variant="outlined">
                      <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                      <OutlinedInput
                          id="outlined-adornment-password"
                          type={values.showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required={true}
                          endAdornment={
                          <InputAdornment position="end">
                              <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                              >
                              {values.showPassword ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                          </InputAdornment>
                          }
                          labelWidth={70}
                      />
                  </FormControl>

                  <FormControl style={{marginBottom: 30}} fullWidth={true} className={clsx(classes.margin, classes.textField)} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Re-password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={valuesP.showPassword ? 'text' : 'password'}
                        value={passConfirmed}
                        onChange={(e) => setPassConfirmed(e.target.value)}
                        required={true}
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPasswordP}
                            onMouseDown={handleMouseDownPasswordP}
                            edge="end"
                            >
                            {valuesP.showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                        }
                        labelWidth={100}
                    />
                    
                </FormControl>


                  <Button fullWidth={true} variant="contained" color="primary" onClick={handleResetPassword}>Reset password</Button>

                  
                  <p>
                    Can remember your password? <Link href="#" onClick={() => history.push("/login")}> Login </Link>
                  </p>

                  <p>
                    Or initiate a new <Link href="#" onClick={() => history.push("/forgot-password")}> Password reset </Link> request
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
 
export default ResetPassword;