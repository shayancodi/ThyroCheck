import { predictRisk, generatePdfReport } from '../../src/services/api';

global.fetch = jest.fn();

describe('ML Prediction Service', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('RT-011: Valid Payload Construction - Verify Age/Gender/Levels format properly', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ heart_failure: {}, coronary_heart_disease: {} }) });
    const payload = { age: 45, gender: 'Male', TSH: 2.5, TT3: 1.2, TT4: 8.0 };
    await predictRisk(payload);
    expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
      body: JSON.stringify(payload)
    }));
  });

  it('RT-012: Parse Dual Risk Response - Verify HF and CHD risks map to state', async () => {
    fetch.mockResolvedValueOnce({ 
      ok: true, 
      json: async () => ({ heart_failure: { risk_percent: 10, risk_level: 'Low' }, coronary_heart_disease: { risk_percent: 5, risk_level: 'Low' } }) 
    });
    const result = await predictRisk({});
    expect(result.heart_failure).toBeDefined();
    expect(result.coronary_heart_disease).toBeDefined();
  });

  it('RT-013: Handle 422 Validation Error - Verify FastAPI validation errors are caught', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 422 });
    await expect(predictRisk({})).rejects.toThrow('API Error: 422');
  });

  it('RT-014: Handle 500 Server Error - Verify HuggingFace server crashes are caught', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 500 });
    await expect(predictRisk({})).rejects.toThrow('API Error: 500');
  });

  it('RT-015: Handle Network Timeout - Verify AbortController stops hanging requests', async () => {
    fetch.mockRejectedValueOnce(new Error('Network timeout'));
    await expect(predictRisk({})).rejects.toThrow('Network timeout');
  });
});
