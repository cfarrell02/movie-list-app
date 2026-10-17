// One-off migration: add the role ID arrays (ownerIds/adminIds/editorIds) that firestore.rules enforce
// to every existing watch list, derived from its users[] array.
//
// Must run BEFORE deploying the new rules (it uses the open rules to read every list).
//   node scripts/backfill-list-roles.mjs           # dry run: report only
//   node scripts/backfill-list-roles.mjs --write   # apply
import { readFileSync } from 'node:fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, terminate } from 'firebase/firestore';

const env = Object.fromEntries(
  readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split(/\r?\n/)
    .filter((line) => line.includes('='))
    .map((line) => [line.slice(0, line.indexOf('=')).trim(), line.slice(line.indexOf('=') + 1).trim()])
);

const app = initializeApp({
  apiKey: env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'weather-app-7dd48.firebaseapp.com',
  projectId: 'weather-app-7dd48',
});
const db = getFirestore(app);
const write = process.argv.includes('--write');

// Same derivation as memberFields() in src/api/movieStorage.js
const memberFields = (users) => {
  const idsWith = (level) => users.filter((u) => Number(u.accessType) === level).map((u) => u.uid);
  return {
    userIds: users.map((u) => u.uid),
    ownerIds: idsWith(3),
    adminIds: idsWith(2),
    editorIds: idsWith(1),
  };
};

const sameSet = (a = [], b = []) => a.length === b.length && a.every((x) => b.includes(x));

const snapshot = await getDocs(collection(db, 'movieLists'));
let toUpdate = 0;
let alreadyDone = 0;
const problems = [];

for (const listDoc of snapshot.docs) {
  const list = listDoc.data();
  const users = (list.users || []).filter((u) => u && u.uid);
  const fields = memberFields(users);
  const label = `${listDoc.id} "${list.title || ''}"`;

  if (fields.ownerIds.length !== 1) {
    problems.push(`${label}: has ${fields.ownerIds.length} owners – fix by hand (rules require exactly one)`);
    continue;
  }
  if (!sameSet(fields.userIds, list.userIds)) {
    console.log(`${label}: userIds will be corrected to match users[] (${(list.userIds || []).length} -> ${fields.userIds.length})`);
  }
  const current = ['userIds', 'ownerIds', 'adminIds', 'editorIds'].every((k) => sameSet(fields[k], list[k]) && Array.isArray(list[k]));
  if (current) {
    alreadyDone += 1;
    continue;
  }

  toUpdate += 1;
  console.log(
    `${write ? 'Updating' : 'Would update'} ${label}: owner ${fields.ownerIds.length}, admins ${fields.adminIds.length}, contributors ${fields.editorIds.length}, members ${fields.userIds.length}`
  );
  if (write) await updateDoc(doc(db, 'movieLists', listDoc.id), fields);
}

console.log(`\n${snapshot.size} lists: ${toUpdate} ${write ? 'updated' : 'to update'}, ${alreadyDone} already done, ${problems.length} need attention`);
problems.forEach((p) => console.log(`  ! ${p}`));
if (!write && toUpdate) console.log('\nDry run only. Re-run with --write to apply.');
await terminate(db);
