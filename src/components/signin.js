import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import { withSnackbar } from "notistack";
import Container from "@material-ui/core/Container";
import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";
import classtigerAPI from "../services/api";
import { login } from "../services/auth";

const AdapterLink = React.forwardRef((props, ref) => (
  <RouterLink innerRef={ref} {...props} />
));

const styles = theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
});

class SignIn extends React.Component {
  state = {
    email: "",
    password: ""
  };

  loginSubmit = async event => {
    event.preventDefault();
    await this.setState({ email: this.state.email.trim() });
    await this.setState({ password: this.state.password.trim() });
    var { name, email, password } = this.state;
    this.setState({
      emailError: false,
      passwordError: false
    });
    if (email.length < 5 || email.length > 180) {
      this.setState({
        emailError: "Email must be between 5 and 180 characters."
      });
    }
    if (password.length < 8 || password.length > 180) {
      this.setState({
        passwordError: "Password must be between 8 and 180 characters."
      });
    }
    if (this.state.passwordError || this.state.emailError) {
      return;
    }
    try {
      const res = await classtigerAPI.post("auth/login", {
        email: this.state.email,
        password: this.state.password
      });
      login(res.data.token);
      this.props.history.push("/");
    } catch (error) {
      this.props.enqueueSnackbar(error.response.data.message, {
        variant: "error",
        action: this.dismissAction
      });
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={this.loginSubmit}>
            <TextField
              value={this.state.email}
              onChange={event => {
                this.setState({ email: event.target.value });
              }}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              helperText={this.state.emailError}
              error={this.state.emailError}
              autoFocus
            />
            <TextField
              value={this.state.password}
              onChange={event => {
                this.setState({ password: event.target.value });
              }}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              helperText={this.state.passwordError}
              error={this.state.passwordError}
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link component={AdapterLink} to="signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    );
  }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withSnackbar(withStyles(styles)(SignIn));
