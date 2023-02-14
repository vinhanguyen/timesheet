import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

export default function ConfirmDialog({open, onClose, children}: any) {
  return (
    <Dialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>Confirm</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => onClose(false)}>Cancel</Button>
        <Button variant="contained" onClick={() => onClose(true)}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}
