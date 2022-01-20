import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
import { Chip } from "@mui/material";
import { Box } from "@mui/system";

export default function DialogPopup({ open, setOpen, teamName, leaveTeam }) {
  const [text, setText] = useState("");
  const confirmText = `leave/team/${teamName}`;

  useEffect(() => {
    setText("");
  }, [open]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. This will permanently delete your data
            from the team
            <Box component="span" mx={0.5}>
              <Chip label={teamName} color="primary" size={"small"} />
            </Box>
          </DialogContentText>
          <Box my={1}>
            Please type
            <Box component={"span"} mx={0.5}>
              <Chip label={confirmText} color="primary" size="small" />
            </Box>
            to leave.
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
            Cancel
          </Button>
          <Button
            onClick={leaveTeam}
            disabled={!(text === confirmText)}
            variant="contained"
          >
            Leave Team
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
