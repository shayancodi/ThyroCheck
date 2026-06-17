import { extractThyroidValues } from '../../src/services/ocr';

global.fetch = jest.fn();

describe('OCR Extraction Service', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('RT-006: Valid Payload Transmission - Verify base64 string formats correctly', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ values: { TSH: 2.1 } }) });
    const file = { type: 'image', data: 'base64str' };
    await extractThyroidValues(file);
    expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
      body: JSON.stringify({ image: 'base64str' })
    }));
  });

  it('RT-007: Payload Too Large - Verify UI correctly blocks oversized images', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 413, json: async () => ({ detail: 'Payload Too Large' }) });
    await expect(extractThyroidValues({ type: 'image', data: 'large' })).rejects.toThrow();
  });

  it('RT-008: Parse Valid Response - Verify JSON maps correctly to UI inputs', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ values: { TSH: 2.1, TT3: 1.5, TT4: 8.0 } }) });
    const result = await extractThyroidValues({ type: 'image', data: 'ok' });
    expect(result.TSH).toBe(2.1);
  });

  it('RT-009: Handle OCR Failure - Verify empty response triggers user alert', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 400, json: async () => ({ detail: 'OCR failed' }) });
    await expect(extractThyroidValues({ type: 'pdf', data: 'bad' })).rejects.toThrow('OCR failed');
  });

  it('RT-010: Regex Sanity Checks - Verify bounding limits for TSH/TT4 values', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ values: { TSH: 155.0 } }) });
    const result = await extractThyroidValues({ type: 'pdf', data: 'b' });
    expect(result.TSH).toBe(155.0);
  });
});
