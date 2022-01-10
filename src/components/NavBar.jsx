import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { useAuth } from "../hooks/useAuth";
import useSnackbar from "../hooks/useSnackbar";
import NavLink from "./NavLink";
import LiveHelpOutlinedIcon from "@mui/icons-material/LiveHelpOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },

  toolBar: {
    backgroundColor: "#2c387e",
  },
  headerHelpIcon: {
    // marginLeft: "0.3rem",
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
      enqueueMessage(error);
    }
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.toolBar}>
          <Link to="/" className={`${classes.navLink} ${classes.navLogo}`}>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<FitnessCenterIcon />}
            >
              <Typography>Fitness Arena</Typography>
            </Button>
          </Link>

          {!user && (
            <NavLink
              to="/register"
              name="Register"
              icon={<PersonAddAltIcon className={classes.headerHelpIcon} />}
            />
          )}
          {!user && (
            <NavLink
              to="/login"
              name="Login"
              icon={<LoginIcon className={classes.headerHelpIcon} />}
            />
          )}
          {user && (
            <NavLink
              to="/arena"
              name="Arena"
              icon={<AccountCircleIcon className={classes.headerHelpIcon} />}
            />
          )}
          {user && (
            <NavLink
              to="/teams"
              name="Teams"
              icon={<GroupsIcon className={classes.headerHelpIcon} />}
            />
          )}

          {user && (
            <NavLink
              to="/support"
              name="Support"
              icon={<LiveHelpOutlinedIcon className={classes.headerHelpIcon} />}
            />
          )}
          {user && (
            <NavLink
              to="/logout"
              name="Logout"
              onClick={signOut}
              icon={<LogoutIcon className={classes.headerHelpIcon} />}
            />
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default NavBar;
