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

export default function DialogPopup({
  open,
  setOpen,
  teamName,
  leaveTeam,
  deleteTeam,
}) {
  const [text, setText] = useState("");
  const confirmDeleteText = `delete/team/${teamName}`;
  const confirmLeaveText = `leave/team/${teamName}`;

  useEffect(() => {
    setText("");
  }, [open]);

  const disableButton = () => {
    if (text === confirmDeleteText) {
      return false;
    }
    if (text === confirmLeaveText) {
      return false;
    }
    return true;
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent component={"div"}>
          <DialogContentText>
            This action cannot be undone. This will permanently delete the team
            <Chip label={teamName} color="primary" size={"small"} /> ,stats,
            data, and remove all the team members or just leave the team.
          </DialogContentText>
          <Box my={1}>
            Please type
            <Box display="inline" component={"p"} px={0.5}>
              <Chip
                label={confirmDeleteText}
                color="primary"
                size="small"
                component={"span"}
              />
            </Box>
            to Delete <br />
            (or)
            <br />
            Type
            <Box display="inline" component={"p"} px={0.5}>
              <Chip
                label={confirmLeaveText}
                color="primary"
                size="small"
                component={"span"}
              />
            </Box>
            to Leave
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
            onClick={text === confirmLeaveText ? leaveTeam : deleteTeam}
            disabled={disableButton()}
            variant="contained"
          >
            {text === confirmLeaveText ? "Leave Team" : "Delete Team"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
