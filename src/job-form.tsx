import { useState } from "react"
import { Job } from "./data/job";

export default function JobForm({onSubmit = (job: Job) => console.log(job)}: any) {
  const [name, setName] = useState('');
  const [rate, setRate] = useState(0);

  const valid = name.length > 0 && rate > 0;

  function reset() {
    setName('');
    setRate(0);
  }

  function handleSubmit() {
    reset();
    onSubmit({name, rate} as Job);
  }

  return (
    <fieldset>
      <legend>Create Job</legend>

      <label htmlFor="name">Name: </label>
      <input id="name" value={name} onChange={e => setName(e.target.value)} />

      <label htmlFor="rate">Rate: </label>
      <input id="rate" type="number" min="0" value={rate} onChange={e => setRate(Number(e.target.value))} />
      
      <button onClick={handleSubmit} disabled={!valid}>Submit</button>
      <button onClick={reset} disabled={name === '' && rate === 0}>Cancel</button>
    </fieldset>
  );
}
