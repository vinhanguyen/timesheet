import { Menu as MenuIcon } from "@mui/icons-material";
import { AppBar, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import { MouseEvent, useEffect, useState } from "react";
import { getJob } from "./data/idb";
import { Job } from "./data/job";
import HelpDialog from "./HelpDialog";

export default function Nav({currentJobId, page, onChangePage}: any) {
  const [job, setJob] = useState<null|Job>(null);
  const [anchorEl, setAnchorEl] = useState<null|HTMLElement>(null);
  const [showHelp, setShowHelp] = useState(false);

  const open = Boolean(anchorEl);
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  function handleClickPage(page: string) {
    setAnchorEl(null);
    onChangePage(page);
  }

  function handleClickHelp() {
    setAnchorEl(null);
    setShowHelp(true);
  }

  useEffect(() => {
    (async () => {
      if (currentJobId) {
        setJob(await getJob(currentJobId));
      }
    })();
  }, [currentJobId]);

  return (
    <>
      <HelpDialog open={showHelp} onClose={() => setShowHelp(false)} />
      <AppBar position="static">
        <Toolbar>
          <Tooltip title="Menu">
            <IconButton color="inherit" sx={{paddingLeft: 0}} onClick={handleClick}>
              <MenuIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h6">{page === 'tasks' ? (currentJobId ? job?.name : 'Timesheet') : 'Jobs'}</Typography>
        </Toolbar>
      </AppBar>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {page === 'jobs' && <MenuItem onClick={() => handleClickPage('tasks')}>Timesheet</MenuItem>}
        {page === 'tasks' && <MenuItem onClick={() => handleClickPage('jobs')}>Jobs</MenuItem>}
        <MenuItem onClick={handleClickHelp}>Help</MenuItem>
      </Menu>
    </>
  );
}
