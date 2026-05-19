import * as ImagePicker from 'expo-image-picker';
const API_BASE_URL = 'https://shayanhugg-thyrocheckapi.hf.space';

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

export const extractThyroidValues = async (base64Image) => {
  const response = await fetch(`${API_BASE_URL}/ocr`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64Image }),
  });

  const data = await response.json();
  console.log('OCR Response:', data);

  if (!response.ok) {
    throw new Error(data.detail || 'OCR failed');
  }

  return data.values;
};