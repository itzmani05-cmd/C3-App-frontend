import React from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import Header from './Header';
import LoadingView from './LoadingView';
import { COLORS } from '../../theme';

export default function Screen({
  title,
  onBack,
  headerProps,
  loading = false,
  loaderColor,
  background = COLORS.pageBackground,
  top = null,
  scroll = true,
  refreshing = false,
  onRefresh,
  contentStyle,
  children,
}) {
  let body;
  if (loading) {
    body = <LoadingView color={loaderColor} />;
  } else if (scroll) {
    body = (
      <ScrollView
        contentContainerStyle={[{ padding: 16, paddingBottom: 32 }, contentStyle]}
        refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : undefined}
      >
        {children}
      </ScrollView>
    );
  } else {
    body = children;
  }

  return (
    <View style={{ flex: 1, backgroundColor: background }}>
      {title !== undefined ? <Header title={title} showBack={!!onBack} onBackPress={onBack} {...headerProps} /> : null}
      {loading ? null : top}
      {body}
    </View>
  );
}
