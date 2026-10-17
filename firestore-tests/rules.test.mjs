// Firestore security rules tests. Run with: npm run test:rules
// (starts the Firestore emulator via firebase-tools and runs this file with Node's test runner)
import { readFileSync } from 'node:fs';
import { after, before, beforeEach, describe, test } from 'node:test';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';

let env;

const LIST = 'list1';
const member = (uid, accessType) => ({ uid, email: `${uid}@test.dev`, accessType });

// owner (3), admin (2), editor (1), viewer (0); outsider is not a member
const baseList = () => ({
  id: LIST,
  title: 'Test list',
  movies: [],
  tvShows: [],
  books: [],
  users: [member('owner', 3), member('admin', 2), member('editor', 1), member('viewer', 0)],
  userIds: ['owner', 'admin', 'editor', 'viewer'],
  ownerIds: ['owner'],
  adminIds: ['admin'],
  editorIds: ['editor'],
});

const profile = (uid, extra = {}) => ({
  id: uid,
  email: `${uid}@test.dev`,
  firstName: uid,
  lastName: 'Test',
  admin: false,
  active: true,
  adultAllowed: false,
  ...extra,
});

const db = (uid) => (uid ? env.authenticatedContext(uid).firestore() : env.unauthenticatedContext().firestore());
const listRef = (uid) => doc(db(uid), 'movieLists', LIST);

// Mirrors memberFields() in src/api/movieStorage.js
const memberFields = (users) => ({
  users,
  userIds: users.map((u) => u.uid),
  ownerIds: users.filter((u) => u.accessType === 3).map((u) => u.uid),
  adminIds: users.filter((u) => u.accessType === 2).map((u) => u.uid),
  editorIds: users.filter((u) => u.accessType === 1).map((u) => u.uid),
});
const withRole = (users, uid, accessType) => users.map((u) => (u.uid === uid ? { ...u, accessType } : u));

before(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-watchlist-rules',
    firestore: { rules: readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8') },
  });
});

after(async () => {
  await env.cleanup();
});

beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (ctx) => {
    const fs = ctx.firestore();
    for (const uid of ['owner', 'admin', 'editor', 'viewer', 'outsider']) {
      await setDoc(doc(fs, 'users', uid), profile(uid));
    }
    await setDoc(doc(fs, 'users', 'siteadmin'), profile('siteadmin', { admin: true }));
    await setDoc(doc(fs, 'users', 'inactive'), profile('inactive', { active: false }));
    await setDoc(doc(fs, 'movieLists', LIST), baseList());
    await setDoc(doc(fs, 'movieLists', 'legacy'), {
      id: 'legacy',
      title: 'Old list',
      users: [member('owner', 3)],
      userIds: ['owner'],
      movies: [],
      tvShows: [],
    });
  });
});

describe('users', () => {
  test('signed-out visitors cannot read profiles', async () => {
    await assertFails(getDoc(doc(db(null), 'users', 'owner')));
  });

  test('full profiles are private: yourself and site admins only', async () => {
    await assertSucceeds(getDoc(doc(db('viewer'), 'users', 'viewer')));
    await assertFails(getDoc(doc(db('viewer'), 'users', 'owner')));
    await assertFails(getDocs(collection(db('viewer'), 'users')));
    await assertSucceeds(getDoc(doc(db('siteadmin'), 'users', 'owner')));
    await assertSucceeds(getDocs(collection(db('siteadmin'), 'users')));
  });

  test('registration creates an active, non-admin profile for yourself only', async () => {
    await assertSucceeds(setDoc(doc(db('newbie'), 'users', 'newbie'), profile('newbie')));
    await assertFails(setDoc(doc(db('newbie2'), 'users', 'newbie2'), profile('newbie2', { admin: true })));
    await assertFails(setDoc(doc(db('newbie3'), 'users', 'someoneelse'), profile('someoneelse')));
  });

  test('users can edit their own details but not admin/active', async () => {
    await assertSucceeds(updateDoc(doc(db('viewer'), 'users', 'viewer'), { firstName: 'New', adultAllowed: true }));
    await assertFails(updateDoc(doc(db('viewer'), 'users', 'viewer'), { admin: true }));
    await assertFails(updateDoc(doc(db('inactive'), 'users', 'inactive'), { active: true }));
    await assertFails(updateDoc(doc(db('viewer'), 'users', 'owner'), { firstName: 'Hacked' }));
  });

  test('site admins can change admin/active on other users', async () => {
    await assertSucceeds(updateDoc(doc(db('siteadmin'), 'users', 'viewer'), { admin: true }));
    await assertSucceeds(updateDoc(doc(db('siteadmin'), 'users', 'inactive'), { active: true }));
  });

  test('users can delete only their own profile', async () => {
    await assertFails(deleteDoc(doc(db('viewer'), 'users', 'owner')));
    await assertSucceeds(deleteDoc(doc(db('viewer'), 'users', 'viewer')));
  });
});

describe('public directory', () => {
  // Signed in with an email on the token, as Firebase Auth does
  const dbWithEmail = (uid, email) => env.authenticatedContext(uid, { email }).firestore();

  test('names are readable by signed-in users, not by visitors, and not listable', async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'publicProfiles', 'owner'), { firstName: 'Owner', lastName: 'Test' });
    });
    await assertSucceeds(getDoc(doc(db('viewer'), 'publicProfiles', 'owner')));
    await assertFails(getDoc(doc(db(null), 'publicProfiles', 'owner')));
    await assertFails(getDocs(collection(db('viewer'), 'publicProfiles')));
  });

  test('you can only write your own public name, and only name fields', async () => {
    await assertSucceeds(setDoc(doc(db('viewer'), 'publicProfiles', 'viewer'), { firstName: 'V', lastName: 'T' }));
    await assertFails(setDoc(doc(db('viewer'), 'publicProfiles', 'owner'), { firstName: 'Hacked', lastName: 'T' }));
    await assertFails(setDoc(doc(db('viewer'), 'publicProfiles', 'viewer'), { firstName: 'V', lastName: 'T', dateOfBirth: 'x' }));
    await assertSucceeds(setDoc(doc(db('siteadmin'), 'publicProfiles', 'owner'), { firstName: 'Owner', lastName: 'Test' }));
  });

  test('email lookup works for an exact email but cannot be listed', async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'userLookup', 'owner@test.dev'), { uid: 'owner', firstName: 'Owner', lastName: 'Test' });
    });
    await assertSucceeds(getDoc(doc(db('viewer'), 'userLookup', 'owner@test.dev')));
    await assertFails(getDocs(collection(db('viewer'), 'userLookup')));
    await assertFails(getDoc(doc(db(null), 'userLookup', 'owner@test.dev')));
  });

  test('you can only claim the lookup for your own sign-in email', async () => {
    const mine = { uid: 'viewer', firstName: 'V', lastName: 'T' };
    await assertSucceeds(setDoc(doc(dbWithEmail('viewer', 'Viewer@Test.dev'), 'userLookup', 'viewer@test.dev'), mine));
    await assertFails(setDoc(doc(dbWithEmail('viewer', 'viewer@test.dev'), 'userLookup', 'owner@test.dev'), mine));
    await assertFails(setDoc(doc(dbWithEmail('viewer', 'viewer@test.dev'), 'userLookup', 'viewer@test.dev'), { ...mine, uid: 'owner' }));
    await assertSucceeds(setDoc(doc(db('siteadmin'), 'userLookup', 'owner@test.dev'), { uid: 'owner', firstName: 'O', lastName: 'T' }));
  });

  test('only the owner of a lookup (or a site admin) can delete it', async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'userLookup', 'owner@test.dev'), { uid: 'owner', firstName: 'O', lastName: 'T' });
    });
    await assertFails(deleteDoc(doc(db('viewer'), 'userLookup', 'owner@test.dev')));
    await assertSucceeds(deleteDoc(doc(db('owner'), 'userLookup', 'owner@test.dev')));
  });
});

describe('watch lists: reading', () => {
  test('members can read; outsiders and signed-out visitors cannot', async () => {
    await assertSucceeds(getDoc(listRef('viewer')));
    await assertFails(getDoc(listRef('outsider')));
    await assertFails(getDoc(listRef(null)));
  });

  test('"my lists" query works, querying everything does not', async () => {
    const mine = query(collection(db('viewer'), 'movieLists'), where('userIds', 'array-contains', 'viewer'));
    await assertSucceeds(getDocs(mine));
    await assertFails(getDocs(collection(db('viewer'), 'movieLists')));
  });

  test('inactive accounts are locked out', async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      const users = [...baseList().users, member('inactive', 1)];
      await updateDoc(doc(ctx.firestore(), 'movieLists', LIST), memberFields(users));
    });
    await assertFails(getDoc(listRef('inactive')));
    await assertFails(updateDoc(listRef('inactive'), { title: 'x' }));
  });
});

describe('watch lists: creating and deleting', () => {
  const newList = (uid) => ({
    id: 'new',
    title: 'Mine',
    ...memberFields([member(uid, 3)]),
    movies: [],
    tvShows: [],
    books: [],
  });

  test('you can create a list you own', async () => {
    await assertSucceeds(setDoc(doc(db('viewer'), 'movieLists', 'new'), newList('viewer')));
  });

  test("you can't create a list owned by someone else or with extra members", async () => {
    await assertFails(setDoc(doc(db('viewer'), 'movieLists', 'new'), newList('owner')));
    const sneaky = { ...newList('viewer'), ...memberFields([member('viewer', 3), member('outsider', 2)]) };
    await assertFails(setDoc(doc(db('viewer'), 'movieLists', 'new'), sneaky));
  });

  test('owners and list admins can delete; others cannot', async () => {
    await assertFails(deleteDoc(listRef('editor')));
    await assertFails(deleteDoc(listRef('viewer')));
    await assertSucceeds(deleteDoc(listRef('admin')));
  });
});

describe('watch lists: content', () => {
  test('contributors and up can change titles in the list; viewers cannot', async () => {
    await assertSucceeds(updateDoc(listRef('editor'), { movies: [{ id: 1, title: 'Film' }] }));
    await assertSucceeds(updateDoc(listRef('admin'), { books: [{ id: 'OL1W' }] }));
    await assertSucceeds(updateDoc(listRef('editor'), { title: 'Renamed' }));
    await assertFails(updateDoc(listRef('viewer'), { movies: [{ id: 1 }] }));
    await assertFails(updateDoc(listRef('outsider'), { movies: [{ id: 1 }] }));
  });

  test("contributors can't sneak membership changes into a content write", async () => {
    await assertFails(updateDoc(listRef('editor'), { movies: [], editorIds: [], adminIds: ['admin', 'editor'] }));
  });
});

describe('watch lists: membership', () => {
  const users = baseList().users;

  test('list admins can add members and promote up to admin', async () => {
    await assertSucceeds(updateDoc(listRef('admin'), memberFields([...users, member('outsider', 0)])));
    await assertSucceeds(updateDoc(listRef('admin'), memberFields(withRole(users, 'viewer', 2))));
  });

  test("list admins can't make themselves owner, demote other admins or remove the owner", async () => {
    await assertFails(updateDoc(listRef('admin'), memberFields(withRole(withRole(users, 'admin', 3), 'owner', 2))));
    await env.withSecurityRulesDisabled(async (ctx) => {
      await updateDoc(doc(ctx.firestore(), 'movieLists', LIST), memberFields(withRole(users, 'viewer', 2)));
    });
    const twoAdmins = withRole(users, 'viewer', 2);
    await assertFails(updateDoc(listRef('admin'), memberFields(withRole(twoAdmins, 'viewer', 0))));
    await assertFails(updateDoc(listRef('admin'), memberFields(twoAdmins.filter((u) => u.uid !== 'owner'))));
  });

  test('contributors and viewers cannot manage members', async () => {
    await assertFails(updateDoc(listRef('editor'), memberFields([...users, member('outsider', 0)])));
    await assertFails(updateDoc(listRef('viewer'), memberFields(withRole(users, 'viewer', 2))));
  });

  test('the owner can do anything consistent, including transferring ownership', async () => {
    await assertSucceeds(updateDoc(listRef('owner'), memberFields(withRole(users, 'admin', 0))));
    const transferred = withRole(withRole(users, 'editor', 3), 'owner', 2);
    await assertSucceeds(updateDoc(listRef('owner'), memberFields(transferred)));
  });

  test('ownership can only go to an existing member, and a list always has exactly one owner', async () => {
    await assertFails(updateDoc(listRef('owner'), memberFields([...withRole(users, 'owner', 2), member('outsider', 3)])));
    await assertFails(updateDoc(listRef('owner'), memberFields(withRole(users, 'owner', 2))));
  });

  test('any non-owner member can leave; the owner cannot just walk away', async () => {
    await assertSucceeds(updateDoc(listRef('viewer'), memberFields(users.filter((u) => u.uid !== 'viewer'))));
    // The viewer has already gone, so the editor leaves from the updated member list
    await assertSucceeds(updateDoc(listRef('editor'), memberFields(users.filter((u) => u.uid !== 'viewer' && u.uid !== 'editor'))));
    await assertFails(updateDoc(listRef('owner'), { ...memberFields(users.filter((u) => u.uid !== 'owner')), ownerIds: [] }));
  });

  test("leaving can't be used to remove someone else", async () => {
    await assertFails(updateDoc(listRef('viewer'), memberFields(users.filter((u) => u.uid !== 'editor'))));
  });

  test('role arrays must agree with membership', async () => {
    await assertFails(updateDoc(listRef('owner'), { ...memberFields(users), editorIds: ['outsider'] }));
  });

  test('members can update their own display details (name/email sync)', async () => {
    const renamed = users.map((u) => (u.uid === 'viewer' ? { ...u, email: 'new@test.dev' } : u));
    await assertSucceeds(updateDoc(listRef('viewer'), { users: renamed }));
  });
});

describe('legacy lists (no role arrays yet)', () => {
  test('members can still read them', async () => {
    await assertSucceeds(getDoc(doc(db('owner'), 'movieLists', 'legacy')));
  });

  test('but nobody can write until they are back-filled', async () => {
    await assertFails(updateDoc(doc(db('owner'), 'movieLists', 'legacy'), { movies: [{ id: 1 }] }));
  });
});
