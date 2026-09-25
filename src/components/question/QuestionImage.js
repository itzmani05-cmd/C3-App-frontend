import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Maximize2 } from 'lucide-react-native';
import ImageZoomModal from './ImageZoomModal';

export default function QuestionImage({ uri, height = 200, style, imageStyle, zoomable = true }) {
  const combinedImageStyle = [styles.img, { height }, imageStyle, style];
  const [failed, setFailed] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);

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

  const image = (
    <Image
      source={{ uri: trimmed }}
      style={combinedImageStyle}
      resizeMode="contain"
      onError={() => setFailed(true)}
    />
  );

  if (!zoomable) return image;

  return (
    <>
      <Pressable
        onPress={() => setZoomOpen(true)}
        accessibilityRole="imagebutton"
        accessibilityLabel="Open image full screen"
        style={styles.pressable}
      >
        {image}
        <View style={styles.zoomBadge} pointerEvents="none">
          <Maximize2 size={14} color="#FFFFFF" />
        </View>
      </Pressable>
      <ImageZoomModal visible={zoomOpen} uri={trimmed} onClose={() => setZoomOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
  },
  img: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    marginTop: 8,
  },
  zoomBadge: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15,23,42,0.55)',
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
