import React, { useRef } from 'react';
import { Animated, RefreshControl, ScrollView, View } from 'react-native';
import AppText from './AppText';
import Header from './Header';
import LoadingView from './LoadingView';
import { COLORS, contentColumn, tw } from '../../theme';

/**
 * Page shell: header, optional `top` strip and a scrolling body. While `loading`, a `skeleton` (placeholder layout) is
 * shown in place of the content; without one it falls back to a spinner.
 */
export default function Screen({
  title,
  onBack,
  headerProps,
  loading = false,
  loaderColor,
  skeleton = null,
  largeTitle = null,
  background = COLORS.pageBackground,
  top = null,
  scroll = true,
  refreshing = false,
  onRefresh,
  contentStyle,
  children,
}) {
  // With `largeTitle` the title sits big at the top of the content and the header's small title fades in once it scrolls away.
  const scrollY = useRef(new Animated.Value(0)).current;
  const titleOpacity = largeTitle ? scrollY.interpolate({ inputRange: [24, 56], outputRange: [0, 1], extrapolate: 'clamp' }) : undefined;

  let body;
  if (loading) {
    body = skeleton ? (
      <ScrollView scrollEnabled={false} contentContainerStyle={[contentColumn, { padding: 16, paddingBottom: 32 }, contentStyle]}>
        {skeleton}
      </ScrollView>
    ) : (
      <LoadingView color={loaderColor} />
    );
  } else if (scroll) {
    body = (
      <Animated.ScrollView
        contentContainerStyle={[contentColumn, { padding: 16, paddingBottom: 32 }, contentStyle]}
        refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : undefined}
        onScroll={largeTitle ? Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true }) : undefined}
        scrollEventThrottle={16}
      >
        {largeTitle ? (
          <AppText type="display" style={tw`mb-4 text-slate-900`}>
            {largeTitle}
          </AppText>
        ) : null}
        {children}
      </Animated.ScrollView>
    );
  } else {
    body = children;
  }

  return (
    <View style={{ flex: 1, backgroundColor: background }}>
      {title !== undefined ? <Header title={title} titleOpacity={titleOpacity} showBack={!!onBack} onBackPress={onBack} {...headerProps} /> : null}
      {loading ? null : top}
      {body}
    </View>
  );
}
