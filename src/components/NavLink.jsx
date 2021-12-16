import { Box, Button, Tooltip } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  navLink: {
    textDecoration: "none",
    color: "inherit",
  },
}));

export default function NavLink({ to, name, icon, ...rest }) {
  const classes = useStyles();
  return (
    <Link to={to} className={classes.navLink} {...rest}>
      <Tooltip title={name}>
        <Button color="inherit" endIcon={icon}>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {name}
          </Box>
        </Button>
      </Tooltip>
    </Link>
  );
}
