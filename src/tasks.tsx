import { ChangeEvent, useEffect, useState } from "react";
import { getJob, getTasks, punch, deleteTask, updateTask } from "./data/idb";
import { Job } from "./data/job";
import { Task } from "./data/task";
import Field from "./field";
import { formatCurrency, formatTimestamp, getHms, msToHours } from "./utils";

export default function Tasks({currentJobId}: any) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [job, setJob] = useState<Job|null>(null);
  const [now, setNow] = useState(Date.now());
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

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

  async function handleDelete() {
    for (const id of selectedIds) {
      await deleteTask(id);
    }
    setSelectedIds([]);
    setSelectAll(false);
    setTasks(await getTasks(currentJobId));
  }

  async function handleChangeComment(task: Task) {
    await updateTask(task);
    setTasks(await getTasks(currentJobId));
  }

  function formatTimeHms(time: number) {
    const [h, m, s] = getHms(time);
    return `${h}h ${m}m ${s}s`;
  }

  return (
    <>
      <nav>
        <button onClick={handleDelete} disabled={selectedIds.length === 0}>Delete</button>
        <button onClick={handlePunch} disabled={!currentJobId}>{unfinishedTask ? 'Stop' : 'Start'}</button>
      </nav>
      <table>
        <thead>
          <tr>
            <th>
              <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
            </th>
            <th>Start</th>
            <th>Finish</th>
            <th>Time</th>
            <th>Rate</th>
            <th>Total</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(t => (
            <tr key={t.id}>
              <td>
                <input type="checkbox" value={t.id} checked={selectedIds.some(id => id === t.id)} onChange={handleSelectSingle} />
              </td>
              <td>{formatTimestamp(t.start)}</td>
              <td>{t.finish ? formatTimestamp(t.finish) : null}</td>
              <td>{formatTimeHms(diffTime(t.start, t.finish))}</td>
              <td>{job ? formatCurrency(job.rate) : null}</td>
              <td>{job ? formatCurrency(msToHours(diffTime(t.start, t.finish))*job.rate) : null}</td>
              <td>
                <Field value={t.comment} onChange={(comment: string) => handleChangeComment({...t, comment})} />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3}></td>
            <td>{formatTimeHms(totalTime)}</td>
            <td>{job ? formatCurrency(job.rate) : null}</td>
            <td>{job ? formatCurrency(msToHours(totalTime)*job.rate) : null}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </>
  );
}
