import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import LiveHelpOutlinedIcon from "@mui/icons-material/LiveHelpOutlined";
import { useAuth } from "../hooks/useAuth";
import useSnackbar from "../hooks/useSnackbar";
import NavLink from "./NavLink";

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

  const { user } = useAuth();
  const enqueueMessage = useSnackbar();

  const signOut = async (e) => {
    try {
      e.preventDefault();
      await logout();
      enqueueMessage("Loged Out", "success");
    } catch (error) {
      enqueueMessage(error, "error");
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

          {!user && <NavLink to="/register" name="Register" />}
          {!user && <NavLink to="/login" name="Login" />}
          {user && (
            <NavLink
              to="/support"
              name="Support"
              icon={<LiveHelpOutlinedIcon className={classes.headerHelpIcon} />}
            />
          )}
          {user && <NavLink to="/logout" name="Logout" onClick={signOut} />}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default NavBar;
