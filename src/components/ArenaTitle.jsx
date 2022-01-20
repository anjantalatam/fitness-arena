import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import SpeedIcon from "@mui/icons-material/Speed";

export default function ArenaTitle({ title, version }) {
  return (
    <Box my={3}>
      <Typography
        variant="h3"
        className="header"
        align="center"
        style={{
          backgroundColor: "#4f4e4c",
          color: "white",
          borderRadius: 20,
        }}
        p={2}
      >
        {title} 🏋️‍♂️
      </Typography>
      {version && (
        <Typography
          variant="subtitle1"
          align="center"
          style={{
            fontStyle: "italic",
          }}
          mt={1}
        >
          <Chip
            label="beta"
            color="info"
            // size="small"
            icon={<SpeedIcon />}
          />
          &nbsp;version {version}
        </Typography>
      )}
    </Box>
  );
}
