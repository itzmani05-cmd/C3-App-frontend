import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, X } from '../../icons';
import AppText from './AppText';
import IconTile from './IconTile';
import PressableScale from './PressableScale';
import { COLORS, SHADOWS, contentColumn, tw } from '../../theme';

// A big tappable tile (two per row) for the main features.
function FeatureTile({ item, onSelect }) {
  return (
    <View style={tw`w-1/2 p-1`}>
      <PressableScale
        onPress={() => onSelect(item)}
        scaleTo={0.97}
        accessibilityRole="button"
        accessibilityLabel={`${item.label}. ${item.helper}`}
        style={[tw`rounded-xl border border-slate-200 bg-white p-3`, SHADOWS.sm]}
      >
        <IconTile icon={item.icon} tone={item.tone} size={38} iconSize={19} />
        <AppText type="heading" style={tw`mt-2.5 text-slate-900`} numberOfLines={1}>
          {item.label}
        </AppText>
        <AppText type="small" style={tw`mt-0.5 text-slate-500`} numberOfLines={2}>
          {item.helper}
        </AppText>
      </PressableScale>
    </View>
  );
}

// A full-width row for account items.
function FeatureRow({ item, onSelect }) {
  return (
    <PressableScale
      onPress={() => onSelect(item)}
      scaleTo={0.985}
      accessibilityRole="button"
      accessibilityLabel={`${item.label}. ${item.helper}`}
      style={tw`mb-2 flex-row items-center rounded-xl border border-slate-200 bg-white p-2.5`}
    >
      <IconTile icon={item.icon} tone={item.tone} size={36} iconSize={18} />
      <View style={tw`flex-1 mx-3`}>
        <AppText type="heading" style={[item.danger ? { color: COLORS.red600 } : tw`text-slate-900`]}>
          {item.label}
        </AppText>
        <AppText type="small" style={tw`mt-0.5 text-slate-500`} numberOfLines={1}>
          {item.helper}
        </AppText>
      </View>
      <ChevronRight size={16} color={COLORS.slate400} />
    </PressableScale>
  );
}

/**
 * The "Features" menu: everything in the app in one place, opened from the icon at the top right. `groups` is a list of
 * { title, layout: 'grid' | 'list', items: [{ id, label, helper, icon, tone }] }; `onSelect` gets the tapped item.
 */
export default function FeaturesSheet({ visible, groups, onSelect, onClose }) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={tw`flex-1 justify-end`}>
        <Pressable
          style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(13,20,38,0.55)' }]}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close features menu"
        />

        <View style={[tw`bg-app rounded-t-3xl pt-3`, contentColumn, { maxHeight: '90%' }]}>
          <View style={tw`self-center w-10 h-1 rounded-full bg-slate-300 mb-3`} />

          <View style={tw`flex-row items-center justify-between px-5`}>
            <View>
              <AppText type="title" style={tw`text-slate-900`}>
                Features
              </AppText>
              <AppText type="small" style={tw`mt-0.5 text-slate-500`}>
                Jump to anything in the app
              </AppText>
            </View>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel="Close"
              style={tw`w-9 h-9 rounded-full bg-white border border-slate-200 items-center justify-center`}
            >
              <X size={18} color={COLORS.slate700} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={[tw`px-4 pt-4`, { paddingBottom: insets.bottom + 20 }]} showsVerticalScrollIndicator={false}>
            {groups.map((group) => (
              <View key={group.title} style={tw`mb-4`}>
                <AppText type="caption" style={[tw`mb-2 ml-1 text-slate-500`, { letterSpacing: 0.8 }]}>
                  {group.title.toUpperCase()}
                </AppText>
                {group.layout === 'grid' ? (
                  <View style={tw`flex-row flex-wrap -mx-1`}>
                    {group.items.map((item) => (
                      <FeatureTile key={item.id} item={item} onSelect={onSelect} />
                    ))}
                  </View>
                ) : (
                  group.items.map((item) => <FeatureRow key={item.id} item={item} onSelect={onSelect} />)
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
