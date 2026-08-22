import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

const PICKER_OPTIONS = {
  mediaTypes: ['images'],
  allowsEditing: false,
  quality: 0.65,
  base64: true,
};

function assetToDataUri(asset) {
  if (!asset) {
    return null;
  }
  const mime = asset.mimeType || 'image/jpeg';
  if (asset.base64) {
    return `data:${mime};base64,${asset.base64}`;
  }
  if (asset.uri) {
    return asset.uri;
  }
  return null;
}

export async function pickImageFromLibrary() {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission needed', 'Allow photo library access to attach images.');
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);
  if (result.canceled || !result.assets?.[0]) {
    return null;
  }

  return assetToDataUri(result.assets[0]);
}

export async function takePhotoWithCamera() {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission needed', 'Allow camera access to take photos.');
    return null;
  }

  const result = await ImagePicker.launchCameraAsync(PICKER_OPTIONS);
  if (result.canceled || !result.assets?.[0]) {
    return null;
  }

  return assetToDataUri(result.assets[0]);
}
