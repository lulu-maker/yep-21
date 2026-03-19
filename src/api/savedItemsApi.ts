const SAVED_KEY = 'yep21.saved.items';

interface SavedItemsRecord {
  [userId: string]: {
    jobs: string[];
    freelancers: string[];
  };
}

function readSaved(): SavedItemsRecord {
  const raw = localStorage.getItem(SAVED_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as SavedItemsRecord;
  } catch {
    return {};
  }
}

function writeSaved(value: SavedItemsRecord) {
  localStorage.setItem(SAVED_KEY, JSON.stringify(value));
}

function userBucket(userId: string, store: SavedItemsRecord) {
  return store[userId] ?? { jobs: [], freelancers: [] };
}

export async function getSavedItems(userId: string) {
  const store = readSaved();
  return userBucket(userId, store);
}

export async function toggleSavedJob(userId: string, jobId: string) {
  const store = readSaved();
  const bucket = userBucket(userId, store);
  const jobs = bucket.jobs.includes(jobId) ? bucket.jobs.filter((item) => item !== jobId) : [...bucket.jobs, jobId];
  store[userId] = { ...bucket, jobs };
  writeSaved(store);
  return store[userId];
}

export async function toggleSavedFreelancer(userId: string, freelancerId: string) {
  const store = readSaved();
  const bucket = userBucket(userId, store);
  const freelancers = bucket.freelancers.includes(freelancerId)
    ? bucket.freelancers.filter((item) => item !== freelancerId)
    : [...bucket.freelancers, freelancerId];
  store[userId] = { ...bucket, freelancers };
  writeSaved(store);
  return store[userId];
}
