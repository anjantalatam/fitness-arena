import { Box, Tooltip, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import useCopyToClipboard from "../../hooks/useCopyToClipboard";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { indigo } from "@mui/material/colors";

const clipboardGreen = indigo[500];
const useStyles = makeStyles({
  copyToClipboard: {
    background: "#eee",
    "&:hover": {
      background: clipboardGreen,
      color: "white",
      cursor: "pointer",
    },
  },
});

function CopyToClipboard(props) {
  const classes = useStyles();
  const { value } = props;

  const [isCopied, copyToClipboard] = useCopyToClipboard();

  return (
    <Tooltip title={isCopied ? "Copied" : "Click to copy"}>
      <Box
        p={1.5}
        borderRadius={4}
        display="flex"
        className={classes.copyToClipboard}
        onClick={() => copyToClipboard(value.toString())}
        {...props}
      >
        <Typography mr={1}>{value}</Typography>
        <Box
          className="clipboard"
          display={"flex"}
          justifyContent="center"
          alignItems="center"
        >
          <FileCopyIcon color="inherit" />
        </Box>
      </Box>
    </Tooltip>
  );
}

export default CopyToClipboard;
