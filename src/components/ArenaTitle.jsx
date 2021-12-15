import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import SpeedIcon from "@mui/icons-material/Speed";

export default function ArenaTitle() {
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
        Fitness Arena 🏋️‍♂️
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        style={{
          fontStyle: "italic",
        }}
        mt={1}
      >
        <Chip
          label="alpha"
          color="info"
          // size="small"
          icon={<SpeedIcon />}
        />
        &nbsp;version 1.1.0{" "}
      </Typography>
    </Box>
  );
}
