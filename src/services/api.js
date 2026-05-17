const API_BASE_URL = 'https://shayanhugg-thyrocheckapi.hf.space';

export const predictRisk = async (patientData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData),
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Prediction Error:', error);
    throw error;
  }
};