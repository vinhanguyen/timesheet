import { Menu as MenuIcon } from "@mui/icons-material";
import { AppBar, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { MouseEvent, useEffect, useState } from "react";
import { getJob } from "./data/idb";
import { Job } from "./data/job";

export default function Nav({currentJobId, page, onChangePage}: any) {
  const [job, setJob] = useState<null|Job>(null);
  const [anchorEl, setAnchorEl] = useState<null|HTMLElement>(null);

  const open = Boolean(anchorEl);
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  function handleClickItem(page: string) {
    setAnchorEl(null);
    onChangePage(page);
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
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" sx={{paddingLeft: 0}} onClick={handleClick}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">{page === 'tasks' ? job?.name : 'Jobs'}</Typography>
        </Toolbar>
      </AppBar>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {page === 'jobs' && <MenuItem onClick={() => handleClickItem('tasks')}>Timesheet</MenuItem>}
        {page === 'tasks' && <MenuItem onClick={() => handleClickItem('jobs')}>Jobs</MenuItem>}
      </Menu>
    </>
  );
}
