import { useEffect, useState } from "react";
import { getCurrentJobId } from "./data/idb";
import Jobs from "./jobs";
import Tasks from "./tasks";
import './timesheet.css';

export default function Timesheet() {
  const [currentJobId, setCurrentJobId] = useState<number|null>(null);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    (async () => {
      setCurrentJobId(await getCurrentJobId());
    })();
  }, [])

  return (
    <>
      <nav>
        <ul>
          <li onClick={() => setTab(0)} className={tab === 0 ? 'active' : ''}>Timesheet</li>
          <li onClick={() => setTab(1)} className={tab === 1 ? 'active' : ''}>Jobs</li>
        </ul>
      </nav>
      {tab === 0 && <Tasks currentJobId={currentJobId} />}
      {tab === 1 && <Jobs currentJobId={currentJobId} onChangeJob={setCurrentJobId} />}
    </>
  );
}
