import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import LiveHelpOutlinedIcon from "@mui/icons-material/LiveHelpOutlined";
import { useAuth } from "../hooks/useAuth";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },

  toolBar: {
    backgroundColor: "#2c387e",
  },
  headerHelpIcon: {
    marginLeft: "4px",
  },
  navLink: {
    textDecoration: "none",
    color: "inherit",
  },
  navLogo: {
    flexGrow: 1,
  },
}));

function NavBar() {
  const { logout } = useAuth();
  const classes = useStyles();

  const signOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.toolBar}>
          <Link to="/" className={`${classes.navLink} ${classes.navLogo}`}>
            <Button color="inherit">
              <FitnessCenterIcon /> &nbsp;
              <Typography variant="h5">Fitness Arena</Typography>
            </Button>
          </Link>
          <Link to="/register" className={classes.navLink}>
            <Button color="inherit"> Register</Button>
          </Link>
          <Link to="/login" className={classes.navLink}>
            <Button color="inherit">Login</Button>
          </Link>
          {/* <Link className={classes.navLink}>
            <Button color='inherit' className={classes.menuButton}>
              Who are we
            </Button>
          </Link> */}
          <Link to="/" className={classes.navLink}>
            <Button color="inherit" onClick={signOut}>
              Logout
            </Button>
          </Link>
          <Link to="/support" className={classes.navLink}>
            <Button color="inherit" className={classes.menuButton}>
              Support
              <LiveHelpOutlinedIcon className={classes.headerHelpIcon} />
            </Button>
          </Link>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default NavBar;
