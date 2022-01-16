import { Launch } from "@mui/icons-material";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { noop } from "lodash";
import React from "react";

function ResponsiveButton({
  button = {
    title: "Click",
    variant: "contained",
    color: "primary",
  },
  iconButton = { icon: <Launch color="primary" /> },
  tooltip = "Click",
  onClick = noop,
}) {
  return (
    <Tooltip title={tooltip}>
      <Box mx={1}>
        <Button
          variant={button.variant}
          sx={{ flexGrow: 1, display: { xs: "none", sm: "inline" } }}
          style={{ background: button.color }}
          onClick={onClick}
        >
          {button.title}
        </Button>
        <IconButton sx={{ flexGrow: 1, display: { xs: "inline", sm: "none" } }}>
          {iconButton.icon}
        </IconButton>
      </Box>
    </Tooltip>
  );
}

export default ResponsiveButton;
