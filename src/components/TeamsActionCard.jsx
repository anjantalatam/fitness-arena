import { Button, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import noop from "lodash/noop";

function TeamsActionCard({
  title,
  placeholder,
  action,
  actionFunction = noop,
}) {
  const [text, setText] = useState("");

  return (
    <Paper style={{ margin: "1rem 1rem" }}>
      <Box p={2}>
        <Typography variant="h5">{title}</Typography>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          minWidth="19rem"
          maxWidth="20rem"
          mt={1}
        >
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            variant="outlined"
            placeholder={placeholder}
          />
          <Button
            variant="contained"
            onClick={() => actionFunction(text)}
            disabled={!text}
          >
            {action}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default TeamsActionCard;
