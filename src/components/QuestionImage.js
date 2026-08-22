import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function QuestionImage({ uri, height = 200, style, imageStyle }) {
  const combinedImageStyle = [styles.img, { height }, imageStyle, style];
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [uri]);

  if (!uri || typeof uri !== 'string' || !uri.trim()) {
    return null;
  }

  const trimmed = uri.trim();

  if (failed) {
    return (
      <View style={[styles.errorWrap, style]}>
        <Text style={styles.errorText}>Could not load image</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: trimmed }}
      style={combinedImageStyle}
      resizeMode="contain"
      onError={() => setFailed(true)}
    />
  );
}

const styles = StyleSheet.create({
  img: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    marginTop: 8,
  },
  errorWrap: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 13,
  },
});
