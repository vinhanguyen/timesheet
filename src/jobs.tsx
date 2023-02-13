import { Add, Cancel, Delete, Save } from "@mui/icons-material";
import { IconButton, Input, Radio, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { createJob, deleteJob, getJobs, updateCurrentJob, updateJob } from "./data/idb";
import { Job } from "./data/job";
import Field from "./field";

export default function Jobs({currentJobId, onChangeJob}: any) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [create, setCreate] = useState(false);

  useEffect(() => {
    (async () => {
      setJobs(await getJobs());
    })();
  }, [currentJobId]);

  async function handleCreate(job: Job) {
    await createJob(job);
    setCreate(false);
    setJobs(await getJobs());
  }

  async function handleChangeJob(id: number) {
    await updateCurrentJob(id);
    onChangeJob(id);
  }

  async function handleUpdate(job: Job) {
    await updateJob(job);
    setJobs(await getJobs());
  }

  async function handleDelete({id, name}: Job) {
    if (!window.confirm(`Delete ${name}?`)) {
      return;
    }
    await deleteJob(id);
    setJobs(await getJobs());
    if (id === currentJobId) {
      onChangeJob(null);
    }
  }

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Tooltip title="Add job" onClick={() => setCreate(true)}>
                <IconButton sx={{paddingLeft: 0, paddingRight: 0}}>
                  <Add />
                </IconButton>
              </Tooltip>
            </TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Rate</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jobs.map(j => (
            <TableRow key={j.id}>
              <TableCell>
                <Tooltip title="Set current job">
                  <Radio sx={{paddingLeft: 0, paddingRight: 0}} checked={j.id === currentJobId} onChange={() => handleChangeJob(j.id)} />
                </Tooltip>
              </TableCell>
              <TableCell>
                <Field value={j.name} 
                  onChange={(name: any) => handleUpdate({...j, name})} 
                  validator={(name: any) => name?.length > 0} />
              </TableCell>
              <TableCell>
                <Field value={j.rate} 
                  onChange={(rate: any) => handleUpdate({...j, rate: Number(rate)})} 
                  validator={(rate: any) => rate && Number(rate) >= 0} 
                  prefix="$" />
              </TableCell>
              <TableCell>
                <Tooltip title="Delete">
                  <IconButton onClick={() => handleDelete(j)}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
          {create && <CreateJobRow onSave={handleCreate} onCancel={() => setCreate(false)} />}
        </TableBody>
      </Table>
    </>
  );
}

function CreateJobRow({onSave, onCancel}: any) {
  const [name, setName] = useState('');
  const [rate, setRate] = useState('');

  function handleSave() {
    onSave({name, rate: Number(rate)});
  }

  function handleCancel() {
    setName('');
    setRate('');
    onCancel();
  }

  const nameValid = name.length > 0;
  const rateValid = rate.length > 0 && Number(rate) >= 0;
  const valid = nameValid && rateValid;

  return (
    <TableRow>
      <TableCell></TableCell>
      <TableCell>
        <Input value={name} error={!nameValid} onChange={e => setName(e.target.value)} />
      </TableCell>
      <TableCell>
        <Input value={rate} error={!rateValid} onChange={e => setRate(e.target.value)} 
          startAdornment={<>$</>} />
      </TableCell>
      <TableCell>
        <Tooltip title="Save">
          <span>
            <IconButton disabled={!valid} onClick={handleSave}>
              <Save />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Cancel">
          <IconButton onClick={handleCancel}>
            <Cancel />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
