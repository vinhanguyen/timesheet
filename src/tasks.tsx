import { ContentCopy, Delete, PunchClock } from "@mui/icons-material";
import { Checkbox, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import ConfirmDialog from "./confirm-dialog";
import { deleteTask, getJob, getTasks, punch, updateTask } from "./data/idb";
import { Job } from "./data/job";
import { Task } from "./data/task";
import Field from "./field";
import { copyToClipboard, formatCurrency, formatTimestamp, getHms, msToHours } from "./utils";

export default function Tasks({currentJobId}: any) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [job, setJob] = useState<Job|null>(null);
  const [now, setNow] = useState(Date.now());
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [needConfirm, setNeedConfirm] = useState(false);

  useEffect(() => {
    (async () => {
      setTasks(currentJobId ? await getTasks(currentJobId) : []);
    })();
  }, [currentJobId]);

  useEffect(() => {
    (async () => {
      setJob(currentJobId ? await getJob(currentJobId) : null);
    })();
  }, [currentJobId]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const unfinishedTask = tasks.find(({finish}) => !finish);

  const diffTime = (start: number, finish?: number) => Math.max((finish ? finish : now)-start, 0);

  const totalTime = tasks.reduce((sum, t) => sum+diffTime(t.start, t.finish), 0);

  async function handlePunch() {
    await punch();
    setTasks(await getTasks(currentJobId))
  }

  function handleSelectAll({target: {checked}}: ChangeEvent<HTMLInputElement>) {
    setSelectAll(checked);

    if (checked) {
      setSelectedIds(tasks.map(({id}) => id));
    } else {
      setSelectedIds([]);
    }
  }

  function handleSelectSingle({target: {value, checked}}: ChangeEvent<HTMLInputElement>) {
    if (checked) {
      setSelectedIds([...selectedIds, Number(value)]);
    } else {
      setSelectedIds(selectedIds.filter(id => id !== Number(value)));
      setSelectAll(false);
    }
  }

  function handleDelete() {
    setNeedConfirm(true);
  }

  async function handleConfirm(confirm: boolean) {
    setNeedConfirm(false);

    if (confirm) {
      for (const id of selectedIds) {
        await deleteTask(id);
      }
      setSelectedIds([]);
      setSelectAll(false);
      setTasks(await getTasks(currentJobId));
    }
  }

  async function handleChangeComment(task: Task) {
    await updateTask(task);
    setTasks(await getTasks(currentJobId));
  }

  function formatTimeHms(time: number) {
    const [h, m, s] = getHms(time);
    return `${h}h ${m}m ${s}s`;
  }

  function handleCopy() {
    copyToClipboard(msToHours(totalTime).toFixed(2));
  }

  return (
    <>
      <ConfirmDialog open={needConfirm} onClose={handleConfirm}>
        Delete selected task{selectedIds.length > 1 ? 's' : ''}?
      </ConfirmDialog>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Tooltip title="Delete selected">
                <span>
                  <IconButton onClick={handleDelete} disabled={selectedIds.length === 0}>
                    <Delete />
                  </IconButton>
                </span>
              </Tooltip>
            </TableCell>
            <TableCell colSpan={6}>
              <Tooltip title={unfinishedTask ? 'Stop' : 'Start'}>
                <span>
                  <IconButton sx={{paddingLeft: 0, paddingRight: 0}} color={unfinishedTask ? 'error' : 'success'} onClick={handlePunch} disabled={!currentJobId}>
                    <PunchClock />
                  </IconButton>
                </span>
              </Tooltip>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Tooltip title="Select all">
                <Checkbox checked={selectAll} onChange={handleSelectAll} />
              </Tooltip>
            </TableCell>
            <TableCell>Start</TableCell>
            <TableCell>Finish</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Rate</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Comment</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map(t => (
            <TableRow key={t.id}>
              <TableCell>
                <Tooltip title="Select row">
                  <Checkbox value={t.id} checked={selectedIds.some(id => id === t.id)} onChange={handleSelectSingle} />
                </Tooltip>
              </TableCell>
              <TableCell>{formatTimestamp(t.start)}</TableCell>
              <TableCell>{t.finish ? formatTimestamp(t.finish) : null}</TableCell>
              <TableCell>{formatTimeHms(diffTime(t.start, t.finish))}</TableCell>
              <TableCell>{job ? formatCurrency(job.rate) : null}</TableCell>
              <TableCell>{job ? formatCurrency(msToHours(diffTime(t.start, t.finish))*job.rate) : null}</TableCell>
              <TableCell>
                <Field value={t.comment || ''} 
                  onChange={(comment: any) => handleChangeComment({...t, comment})} 
                  validator={(comment: any) => comment?.length > 0} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableHead>
          <TableRow>
            <TableCell colSpan={3}></TableCell>
            <TableCell component="th">
              {formatTimeHms(totalTime)}
              <Tooltip title="Copy hours to clipboard">
                <IconButton onClick={handleCopy}>
                  <ContentCopy />
                </IconButton>
              </Tooltip>
            </TableCell>
            <TableCell>{job ? formatCurrency(job.rate) : null}</TableCell>
            <TableCell>{job ? formatCurrency(msToHours(totalTime)*job.rate) : null}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
      </Table>
    </>
  );
}
