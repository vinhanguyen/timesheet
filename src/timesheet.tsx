import { useEffect, useState } from "react";
import { getCurrentJobId } from "./data/idb";
import Jobs from "./jobs";
import Tasks from "./tasks";

export default function Timesheet() {
  const [currentJobId, setCurrentJobId] = useState<number|null>(null);

  useEffect(() => {
    (async () => {
      setCurrentJobId(await getCurrentJobId());
    })();
  }, [])

  return (
    <>
      <Tasks currentJobId={currentJobId} />
      <Jobs currentJobId={currentJobId} onChangeJob={setCurrentJobId} />
    </>
  );
}
