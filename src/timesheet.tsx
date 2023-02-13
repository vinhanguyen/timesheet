import { Menu as MenuIcon } from "@mui/icons-material";
import { AppBar, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { MouseEvent, useEffect, useState } from "react";
import { getCurrentJobId, getJob } from "./data/idb";
import { Job } from "./data/job";
import Jobs from "./jobs";
import Nav from "./nav";
import Tasks from "./tasks";

export default function Timesheet() {
  const [currentJobId, setCurrentJobId] = useState<number|null>(null);
  const [page, setPage] = useState('tasks');

  useEffect(() => {
    (async () => {
      setCurrentJobId(await getCurrentJobId());
    })();
  }, [])

  return (
    <>
      <Nav currentJobId={currentJobId} page={page} onChangePage={(page: string) => setPage(page)} />
      {page === 'tasks' && <Tasks currentJobId={currentJobId} />}
      {page === 'jobs' && <Jobs currentJobId={currentJobId} onChangeJob={setCurrentJobId} />}
    </>
  );
}
