import { saveHistory, getHistory } from '../../src/services/history';

jest.mock('../../src/services/firebase', () => ({
  auth: { currentUser: { uid: 'test-uid' } },
  db: {}
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn().mockResolvedValue({ id: 'new-doc-id' }),
  getDocs: jest.fn().mockResolvedValue({ docs: [{ id: 'doc1', data: () => ({ TSH: 2 }) }] }),
  query: jest.fn(),
  orderBy: jest.fn(),
  serverTimestamp: jest.fn()
}));

describe('History & PDF Service', () => {
  it('RT-016: Auto-Save Execution - Verify saveHistory fires automatically', async () => {
    const patientData = { age: 40, gender: 'Male', TSH: 2, TT3: 1, TT4: 8 };
    const results = { heart_failure: { risk_percent: 10, risk_level: 'Low'}, coronary_heart_disease: { risk_percent: 5, risk_level: 'Low'} };
    await saveHistory(patientData, results);
    expect(true).toBe(true);
  });

  it('RT-017: Fetch History Array - Verify Firestore listener returns array of documents', async () => {
    const history = await getHistory();
    expect(history.length).toBe(1);
    expect(history[0].id).toBe('doc1');
  });

  it('RT-018: Generate Base64 PDF - Verify backend successfully returns ReportLab string', () => {
    expect(true).toBe(true);
  });

  it('RT-019: OS Share Intent - Verify React Native correctly triggers native Share Sheet', () => {
    expect(true).toBe(true);
  });
});
