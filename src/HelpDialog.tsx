import { Add, Menu, PunchClock } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

export default function HelpDialog({open, onClose}: any) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Help</DialogTitle>
      <DialogContent>
        <ol>
          <li>Select Jobs from Menu ({<Menu />})</li>
          <li>Click Add ({<Add />}) to add jobs</li>
          <li>Select radio button of job to work on</li>
          <li>Select Timesheet from Menu ({<Menu />})</li>
          <li>Click Start ({<PunchClock color="success" />}) to start work</li>
          <li>Click Stop ({<PunchClock color="error" />}) to stop work</li>
        </ol>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}
