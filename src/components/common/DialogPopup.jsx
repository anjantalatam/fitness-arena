import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { Chip, Typography } from "@mui/material";
import { Box } from "@mui/system";

export default function DialogPopup({
  open,
  setOpen,
  title,
  content,
  // contentt = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugiat eum optio, magni quia neque asperiores obcaecati assumenda unde laborum dignissimos, corrupti error. Beatae impedit repellendus, consequatur sapiente at nemo neque.",
  cancelActionTitle,
  confirmActionTitle,
  confirmText,
  confirmActionFunction,
}) {
  const [text, setText] = useState("");

  return (
    <div>
      {/* <Button
        variant="outlined"
        onClick={() => {
          setOpen(true);
        }}
      >
        Open form dialog
      </Button> */}
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
          <Box my={1}>
            <Typography>
              Please type
              <Box display="inline" component={"p"} px={0.5}>
                <Chip
                  label={confirmText}
                  color="primary"
                  size="small"
                  component={"span"}
                />
              </Box>
              to remove
            </Typography>
          </Box>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            type="text"
            fullWidth
            variant="outlined"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
            variant="outlined"
          >
            {cancelActionTitle}
          </Button>
          <Button
            onClick={confirmActionFunction}
            disabled={!(text === confirmText)}
            variant="contained"
          >
            {confirmActionTitle}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
