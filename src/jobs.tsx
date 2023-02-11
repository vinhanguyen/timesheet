import { useEffect, useState } from "react";
import { createJob, deleteJob, getJobs, updateCurrentJob, updateJob } from "./data/idb";
import { Job } from "./data/job";
import Field from "./field";
import JobForm from "./job-form";

export default function Jobs({currentJobId, onChangeJob = ((id: number) => console.log(id))}: any) {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    (async () => {
      setJobs(await getJobs());
    })();
  }, [currentJobId]);

  async function handleSubmit(job: Job) {
    await createJob(job);
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
      <JobForm onSubmit={handleSubmit} />
      <table>
        <thead>
          <tr>
            <th colSpan={4}>Jobs</th>
          </tr>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Rate</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(j => (
            <tr key={j.id}>
              <td>
                <input type="radio" title="Set current job" checked={j.id === currentJobId} onChange={() => handleChangeJob(j.id)} />
              </td>
              <td>
                <Field value={j.name} onChange={(name: string) => handleUpdate({...j, name})} />
              </td>
              <td>
                $<Field type="number" value={j.rate} onChange={(rate: number) => handleUpdate({...j, rate})} />
              </td>
              <td>
                <button onClick={() => handleDelete(j)}>Delete</button>
              </td>
            </tr>
          ))}
          {jobs.length === 0 && <tr><td colSpan={4}>Empty</td></tr>}
        </tbody>
      </table>
    </>
  );
}
