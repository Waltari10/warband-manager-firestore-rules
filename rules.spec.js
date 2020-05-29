const { setup, teardown } = require('./helpers');
const { assertFails, assertSucceeds } = require('@firebase/testing');
const uid = 'myUid'

describe('Database rules', () => {
  let db;

  // Applies only to tests in this describe block
  beforeAll(async () => {
    db = await setup({ uid: uid });

  });

  afterAll(async () => {
    await teardown();
  });

  test('fail when reading/writing an unauthorized collection', async () => {
    const ref = db.collection('some-nonexistent-collection');
    const failedRead = await assertFails(ref.get());
    expect(failedRead);

    // One-line await
    expect(await assertFails(ref.add({})));

    // Custom Matchers
    await expect(ref.get()).toDeny();
    // await expect(ref.get()).toAllow(); // should fail
  });

  test('Should deny adding user', async () => {
    
    const ref = db.collection('users');

    await expect(ref.get()).toDeny();
  });


  test('Should allow setting own user', async () => {
    
    const ref = db.collection('users').doc(uid);

    await expect(ref.get()).toAllow();
  });


  test('Should deny setting other user', async () => {
    
    const ref = db.collection('users').doc('other uid');

    await expect(ref.get()).toDeny();
  });


  test('Should deny getting other warbands', async () => {
    
    const ref = db.collection('users').doc('someotheruid').collection('warbands');

    await expect(ref.get()).toDeny();
  });


  test('Should deny adding empty other warband', async () => {
    
    const ref = db.collection('users').doc('stranger danger').collection('warbands');

    await expect(ref.add({})).toDeny();
  });


  test('Should deny setting empty other warband', async () => {
    
    const ref = db.collection('users').doc('stranger danger').collection('warbands').doc('some warband');

    await expect(ref.set({})).toDeny();
  });

  test('Should allow getting own warbands', async () => {
    
    const ref = db.collection('users').doc(uid).collection('warbands');

    await expect(ref.get()).toAllow();
  });


  test('Should allow adding empty own warband', async () => {
    
    const ref = db.collection('users').doc(uid).collection('warbands');

    await expect(ref.add({})).toAllow();
  });


  test('Should allow setting empty own warband', async () => {
    
    const ref = db.collection('users').doc(uid).collection('warbands').doc('some warband');

    await expect(ref.set({})).toAllow();
  });

});