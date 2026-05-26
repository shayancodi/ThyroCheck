import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';

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
  return { type: 'image', data: result.assets[0].base64 };
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
  return { type: 'image', data: result.assets[0].base64 };
};

export const pickPdf = async () => {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'application/pdf',
    copyToCacheDirectory: true,
  });

  if (result.canceled) return null;

  const uri = result.assets[0].uri;
  // Read PDF file as base64
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return { type: 'pdf', data: base64 };
};

export const extractThyroidValues = async (file) => {
  // file: { type: 'image' | 'pdf', data: base64String }
  const body =
    file.type === 'pdf'
      ? { pdf: file.data }
      : { image: file.data };

  const response = await fetch(`${API_BASE_URL}/ocr`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  console.log('OCR Response:', data);

  if (!response.ok) {
    throw new Error(data.detail || 'OCR failed');
  }

  return data.values;
};