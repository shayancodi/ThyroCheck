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

export const generatePdfReport = async (reportData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData),
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return await response.json(); // { pdf_base64, filename }
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw error;
  }
};