import { Job } from "./job";
import { Task } from "./task";

const DB_NAME = 'timesheet';
const DB_VERSION = 1;

function createDatabase({target: {result: db}}: any) {
  db.createObjectStore('config', {keyPath: 'name'});

  db.createObjectStore('jobs', {keyPath: 'id', autoIncrement: true});

  const taskStore = db.createObjectStore('tasks', {keyPath: 'id', autoIncrement: true});
  taskStore.createIndex('jobId', 'jobId', {unique: false});
}

export function createJob(job: Job): Promise<Job> {
  return new Promise((resolve, reject) => {
    const openDb = indexedDB.open(DB_NAME, DB_VERSION);
  
    openDb.onupgradeneeded = createDatabase;
  
    openDb.onerror = ({target: error}) => {
      reject(error);
    };
  
    openDb.onsuccess = ({target: {result: db}}: any) => {
      const create = db.transaction(['jobs'], 'readwrite')
        .objectStore('jobs')
        .add(job);
      
      create.onsuccess = ({target: {result: id}}: any) => {
        resolve({...job, id});
      };
  
      create.onerror = ({target: error}: any) => {
        reject(error);
      };
    };
  });
}

export function getJobs(): Promise<Job[]> {
  return new Promise((resolve, reject) => {
    const openDb = indexedDB.open(DB_NAME, DB_VERSION);
  
    openDb.onupgradeneeded = createDatabase;
  
    openDb.onerror = ({target: error}) => {
      reject(error);
    };
  
    openDb.onsuccess = ({target: {result: db}}: any) => {
      const getAll = db.transaction(['jobs'], 'readonly')
        .objectStore('jobs')
        .getAll();
      
      getAll.onsuccess = ({target: {result: jobs}}: any) => {
        resolve(jobs);
      };
  
      getAll.onerror = ({target: error}: any) => {
        reject(error);
      };
    };
  });
}

export function getJob(id: number): Promise<Job> {
  return new Promise((resolve, reject) => {
    const openDb = indexedDB.open(DB_NAME, DB_VERSION);
  
    openDb.onupgradeneeded = createDatabase;
  
    openDb.onerror = ({target: error}) => {
      reject(error);
    };
  
    openDb.onsuccess = ({target: {result: db}}: any) => {
      const getJob = db.transaction(['jobs'], 'readonly')
        .objectStore('jobs')
        .get(id);
      
      getJob.onsuccess = ({target: {result: job}}: any) => {
        resolve(job);
      };
  
      getJob.onerror = ({target: error}: any) => {
        reject(error);
      };
    };
  });
}

export function getTasks(jobId: number): Promise<Task[]> {
  return new Promise((resolve, reject) => {
    const openDb = indexedDB.open(DB_NAME, DB_VERSION);
  
    openDb.onupgradeneeded = createDatabase;
  
    openDb.onerror = ({target: error}) => {
      reject(error);
    };
  
    openDb.onsuccess = ({target: {result: db}}: any) => {
      const openCursor = db.transaction(['tasks'], 'readonly')
        .objectStore('tasks')
        .index('jobId')
        .openCursor(IDBKeyRange.only(jobId));

      const tasks: Task[] = [];

      openCursor.onsuccess = ({target: {result: cursor}}: any) => {
        if (cursor) {
          tasks.push(cursor.value);
          cursor.continue();
        } else {
          resolve(tasks);
        }
      }
  
      openCursor.onerror = ({target: error}: any) => {
        reject(error);
      };
    };
  });
}

export function getCurrentJobId(): Promise<number> {
  return new Promise((resolve, reject) => {
    const openDb = indexedDB.open(DB_NAME, DB_VERSION);
  
    openDb.onupgradeneeded = createDatabase;
  
    openDb.onerror = ({target: error}) => {
      reject(error);
    };
  
    openDb.onsuccess = ({target: {result: db}}: any) => {
      const req = db.transaction(['config'], 'readonly')
        .objectStore('config')
        .get('currentJobId');

      req.onsuccess = ({target: {result}}: any) => {
        resolve(result ? result.value : null);
      }

      req.onerror = ({target: error}: any) => {
        reject(error);
      };
    };
  });
}

export function updateJob(job: Job): Promise<Job> {
  return new Promise((resolve, reject) => {
    const openDb = indexedDB.open(DB_NAME, DB_VERSION);
  
    openDb.onupgradeneeded = createDatabase;
  
    openDb.onerror = ({target: error}) => {
      reject(error);
    };
  
    openDb.onsuccess = ({target: {result: db}}: any) => {
      const update = db.transaction(['jobs'], 'readwrite')
        .objectStore('jobs')
        .put(job);
      
      update.onsuccess = () => {
        resolve(job);
      };
  
      update.onerror = ({target: error}: any) => {
        reject(error);
      };
    };
  });
}

export function updateTask(task: Task): Promise<Task> {
  return new Promise((resolve, reject) => {
    const openDb = indexedDB.open(DB_NAME, DB_VERSION);
  
    openDb.onupgradeneeded = createDatabase;
  
    openDb.onerror = ({target: error}) => {
      reject(error);
    };
  
    openDb.onsuccess = ({target: {result: db}}: any) => {
      const update = db.transaction(['tasks'], 'readwrite')
        .objectStore('tasks')
        .put(task);
      
      update.onsuccess = () => {
        resolve(task);
      };
  
      update.onerror = ({target: error}: any) => {
        reject(error);
      };
    };
  });
}

export function deleteJob(id: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const openDb = indexedDB.open(DB_NAME, DB_VERSION);

    openDb.onupgradeneeded = createDatabase;
  
    openDb.onerror = ({target: error}) => {
      reject(error);
    };
  
    openDb.onsuccess = ({target: {result: db}}: any) => {
      const tx = db.transaction(['config', 'jobs'], 'readwrite');
      const configStore = tx.objectStore('config');
      const jobStore = tx.objectStore('jobs');

      const removeJob = jobStore.delete(id);
      
      removeJob.onsuccess = () => {
        const getCurrentJobId = configStore.get('currentJobId');

        getCurrentJobId.onsuccess = ({target: {result}}: any) => {
          if (result?.value === id) {
            const clearCurrentJobId = configStore.put({name: 'currentJobId', value: null});

            clearCurrentJobId.onsuccess = () => {
              resolve(id);
            }
          } else {
            resolve(id);
          }
        }
      };
  
      tx.onerror = ({target: error}: any) => {
        reject(error);
      };
    };
  });
}

export function deleteTask(id: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const openDb = indexedDB.open(DB_NAME, DB_VERSION);

    openDb.onupgradeneeded = createDatabase;
  
    openDb.onerror = ({target: error}) => {
      reject(error);
    };
  
    openDb.onsuccess = ({target: {result: db}}: any) => {
      const remove = db.transaction(['tasks'], 'readwrite')
        .objectStore('tasks')
        .delete(id);
      
      remove.onsuccess = () => {
        resolve(id);
      };

      remove.onerror = ({target: error}: any) => {
        reject(error);
      };
    };
  });
}

export function updateCurrentJob(id: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const openDb = indexedDB.open(DB_NAME, DB_VERSION);
  
    openDb.onupgradeneeded = createDatabase;
  
    openDb.onerror = ({target: error}) => {
      reject(error);
    };
  
    openDb.onsuccess = ({target: {result: db}}: any) => {
      const tx = db.transaction(['config', 'tasks'], 'readwrite');
      const configStore = tx.objectStore('config');
      const taskStore = tx.objectStore('tasks');

      const update = configStore.put({name: 'currentJobId', value: id});
      
      update.onsuccess = () => {
        const getTasks = taskStore.getAll();

        getTasks.onsuccess = ({target: {result: tasks}}: any) => {
          const unfinishedTask = tasks.find((t: Task) => t.jobId !== id && !t.finish);
          if (unfinishedTask) {
            const stopTask = taskStore.put({...unfinishedTask, finish: Date.now()});

            stopTask.onsuccess = () => {
              resolve(id);
            }
          } else {
            resolve(id);
          }
        }
      };
  
      tx.onerror = ({target: error}: any) => {
        reject(error);
      };
    };
  });
}

export function punch(): Promise<number> {
  return new Promise((resolve, reject) => {
    const openDb = indexedDB.open(DB_NAME, DB_VERSION);
  
    openDb.onupgradeneeded = createDatabase;
  
    openDb.onerror = ({target: error}) => {
      reject(error);
    };
  
    openDb.onsuccess = ({target: {result: db}}: any) => {
      const tx = db.transaction(['config', 'tasks'], 'readwrite');
      const configStore = tx.objectStore('config');
      const taskStore = tx.objectStore('tasks');

      const getCurrentJobId = configStore.get('currentJobId');

      getCurrentJobId.onsuccess = ({target: {result}}: any) => {
        if (result?.value) {
          const {value: currentJobId} = result;

          const getTasks = taskStore
            .index('jobId')
            .openCursor(IDBKeyRange.only(currentJobId));

          const tasks: Task[] = [];

          getTasks.onsuccess = ({target: {result: cursor}}: any) => {
            if (cursor) {
              tasks.push(cursor.value);
              cursor.continue();
            } else {
              const unfinished = tasks.find(({finish}) => !finish);
  
              if (unfinished) {
                const stopTask = taskStore.put({...unfinished, finish: Date.now()});
  
                stopTask.onsuccess = () => {
                  resolve(unfinished.id);
                }
              } else {
                const addTask = taskStore.add({jobId: currentJobId, start: Date.now(), finish: null});
  
                addTask.onsuccess = ({target: {result: id}}: any) => {
                  resolve(id);
                }
              }
            }
          };
        } else {
          reject(Error('No current job'));
        }
      }
  
      tx.onerror = ({target: error}: any) => {
        reject(error);
      };
    };
  });
}
