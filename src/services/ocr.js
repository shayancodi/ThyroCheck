import * as ImagePicker from 'expo-image-picker';

const GOOGLE_VISION_API_KEY = 'AIzaSyBGihYsFtnRJdKmbXm_D7Z9hVAAc2PebDM';

export const pickImage = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Gallery permission denied');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 1,
    base64: true,
  });

  if (result.canceled) return null;
  return result.assets[0].base64;
};

export const takePhoto = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Camera permission denied');
  }

  const result = await ImagePicker.launchCameraAsync({
    quality: 1,
    base64: true,
  });

  if (result.canceled) return null;
  return result.assets[0].base64;
};

export const extractTextFromImage = async (base64Image) => {
  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [{
          image: { content: base64Image },
          features: [{ type: 'TEXT_DETECTION' }],
        }],
      }),
    }
  );

  const data = await response.json();
  if (data.responses?.[0]?.fullTextAnnotation?.text) {
    return data.responses[0].fullTextAnnotation.text;
  }
  throw new Error('No text found in image');
};

export const parseThyroidValues = (text) => {
  const values = {};
  const lines = text.toUpperCase();

  const patterns = [
    { key: 'tsh', regex: /TSH[\s:.\-]*(\d+\.?\d*)/i },
    { key: 'tt3', regex: /(?:TOTAL\s*T3|TT3|TOTAL\s*TRIIODOTHYRONINE)[\s:.\-]*(\d+\.?\d*)/i },
    { key: 'tt4', regex: /(?:TOTAL\s*T4|TT4|TOTAL\s*THYROXINE)[\s:.\-]*(\d+\.?\d*)/i },
    { key: 'ft3', regex: /(?:FREE\s*T3|FT3|FREE\s*TRIIODOTHYRONINE)[\s:.\-]*(\d+\.?\d*)/i },
    { key: 'ft4', regex: /(?:FREE\s*T4|FT4|FREE\s*THYROXINE)[\s:.\-]*(\d+\.?\d*)/i },
  ];

  patterns.forEach(({ key, regex }) => {
    const match = text.match(regex);
    if (match) values[key] = match[1];
  });

  return values;
};