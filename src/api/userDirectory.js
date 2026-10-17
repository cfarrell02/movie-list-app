// Public user directory, so full profiles (email, date of birth…) can stay private.
//   publicProfiles/{uid}   – { firstName, lastName }      readable by any signed-in user (for "added by" names)
//   userLookup/{email}     – { uid, firstName, lastName } readable only by exact, lower-cased email (to add members)
// Entries are written by the user themselves on sign-in, and by site admins for everyone from the Admin page.
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { getUserByEmail, getUserById } from './userDataStorage';

export const normaliseEmail = (email) => String(email || '').trim().toLowerCase();

/** Create or refresh a user's directory entries. Failures are logged, never thrown (it's best effort). */
export const syncDirectoryEntry = async (user) => {
  const uid = user?.id || user?.uid;
  if (!uid) return;
  const names = { firstName: user.firstName || '', lastName: user.lastName || '' };
  const writes = [setDoc(doc(db, 'publicProfiles', uid), names)];
  if (user.email) writes.push(setDoc(doc(db, 'userLookup', normaliseEmail(user.email)), { uid, ...names }));
  const results = await Promise.allSettled(writes);
  results.filter((r) => r.status === 'rejected').forEach((r) => console.warn('Directory sync skipped:', r.reason?.message));
};

/** Remove a user's directory entries (account deletion, or the old email after an email change) */
export const removeDirectoryEntry = async ({ uid, email }) => {
  const deletes = [];
  if (uid) deletes.push(deleteDoc(doc(db, 'publicProfiles', uid)));
  if (email) deletes.push(deleteDoc(doc(db, 'userLookup', normaliseEmail(email))));
  await Promise.allSettled(deletes);
};

/** Removes just the email lookup (e.g. when an email changes) */
export const removeEmailLookup = async (email) => {
  if (email) await deleteDoc(doc(db, 'userLookup', normaliseEmail(email))).catch(() => {});
};

const SESSION_KEY = 'directorySynced';

/** Sync once per browser session per user, so ordinary page loads don't keep writing */
export const syncDirectoryEntryOnce = async (user) => {
  const uid = user?.id || user?.uid;
  if (!uid) return;
  try {
    if (sessionStorage.getItem(SESSION_KEY) === uid) return;
  } catch {
    // Storage unavailable – just sync
  }
  await syncDirectoryEntry(user);
  try {
    sessionStorage.setItem(SESSION_KEY, uid);
  } catch {
    // Not remembered – harmless
  }
};

/** First name for "added by" labels. Falls back to the full profile for entries not synced yet. */
export const getPublicName = async (uid) => {
  if (!uid) return '';
  try {
    const snapshot = await getDoc(doc(db, 'publicProfiles', uid));
    if (snapshot.exists()) return snapshot.data().firstName || '';
  } catch {
    // Not readable yet (rules not deployed) – try the profile below
  }
  try {
    const profile = await getUserById(uid);
    return profile.firstName || profile.email || '';
  } catch {
    return '';
  }
};

/** Find a user by their exact email. Returns { uid, email, firstName, lastName } or null. */
export const findUserByEmail = async (email) => {
  const key = normaliseEmail(email);
  if (!key) return null;
  try {
    const snapshot = await getDoc(doc(db, 'userLookup', key));
    if (snapshot.exists()) return { ...snapshot.data(), email: key };
  } catch {
    // Not readable yet – fall back to querying profiles (works for site admins, or before the new rules)
  }
  try {
    const [match] = await getUserByEmail(key);
    return match ? { uid: match.id, email: key, firstName: match.firstName, lastName: match.lastName } : null;
  } catch {
    return null;
  }
};
