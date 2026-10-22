import React, { useEffect, useState } from 'react';
import { Keyboard, Modal, Platform, Pressable, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CircleCheck, Star, X } from '../../icons';
import AppText from '../ui/AppText';
import AppButton from '../ui/AppButton';
import IconTile from '../ui/IconTile';
import PressableScale from '../ui/PressableScale';
import { sendFeedback } from '../../api/feedback';
import { COLORS, FONT_FAMILY, contentColumn, tw } from '../../theme';

const MIN_LENGTH = 10;
const MAX_LENGTH = 1000;

const CATEGORIES = [
  { id: 'general', label: 'General' },
  { id: 'suggestion', label: 'Suggestion' },
  { id: 'content', label: 'Content' },
  { id: 'bug', label: 'Problem' },
];

const RATING_WORDS = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];

function StarRating({ value, onChange }) {
  return (
    <View style={tw`flex-row items-center`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value;
        return (
          <PressableScale
            key={star}
            // Tapping the star you already chose clears the rating again.
            onPress={() => onChange(star === value ? 0 : star)}
            scaleTo={0.88}
            hitSlop={{ top: 6, bottom: 6, left: 3, right: 3 }}
            accessibilityRole="button"
            accessibilityLabel={`Rate ${star} out of 5`}
            accessibilityState={{ selected: filled }}
            style={tw`mr-1.5`}
          >
            <Star size={34} color={filled ? COLORS.amber600 : COLORS.slate300} fill={filled ? COLORS.amber600 : 'transparent'} strokeWidth={1.6} />
          </PressableScale>
        );
      })}
      <AppText variant="semiBold" style={tw`ml-2 text-[13px] text-slate-600`}>
        {RATING_WORDS[value]}
      </AppText>
    </View>
  );
}

/**
 * The feedback form: an optional star rating, what it is about, and the message. The student's draft is kept if they
 * close it without sending. After a successful send it shows a thank-you and clears itself.
 */
export default function FeedbackSheet({ visible, onClose }) {
  const insets = useSafeAreaInsets();
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState('general');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // A Modal does not resize for the keyboard on its own, so lift the sheet by the keyboard's height.
  useEffect(() => {
    const show = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', (event) => setKeyboardHeight(event.endCoordinates?.height || 0));
    const hide = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setKeyboardHeight(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const trimmedLength = message.trim().length;
  const tooShort = trimmedLength < MIN_LENGTH;

  const close = () => {
    if (submitting) return;
    Keyboard.dismiss();
    onClose();
    if (sent) {
      // Start fresh next time, after the sheet has slid away.
      setTimeout(() => {
        setSent(false);
        setRating(0);
        setCategory('general');
        setMessage('');
        setError('');
      }, 300);
    }
  };

  const submit = async () => {
    if (submitting || tooShort) return;
    Keyboard.dismiss();
    setSubmitting(true);
    setError('');
    try {
      await sendFeedback({ category, rating, message: message.trim() });
      setSent(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (err.response ? 'Could not send your feedback. Please try again.' : "Can't reach the server. Check your connection and try again.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close} statusBarTranslucent>
      <View style={tw`flex-1 justify-end`}>
        <Pressable
          style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(13,20,38,0.55)' }]}
          onPress={close}
          accessibilityRole="button"
          accessibilityLabel="Close feedback"
        />

        <View style={[tw`bg-white rounded-t-3xl pt-3`, contentColumn, { maxHeight: '92%', marginBottom: keyboardHeight }]}>
          <View style={tw`self-center w-10 h-1 rounded-full bg-slate-200 mb-3`} />

          {sent ? (
            <View style={[tw`items-center px-6 pt-4`, { paddingBottom: insets.bottom + 20 }]}>
              <IconTile icon={CircleCheck} tone="success" size={60} iconSize={30} />
              <AppText type="title" style={tw`mt-4 text-slate-900 text-center`}>
                Thank you!
              </AppText>
              <AppText type="small" style={tw`mt-1.5 mb-6 leading-5 text-slate-500 text-center`}>
                Your feedback has reached the C³ team. We read every message and use it to improve the app.
              </AppText>
              <AppButton label="Done" onPress={close} size="lg" style={tw`self-stretch rounded-lg`} />
            </View>
          ) : (
            <>
              <View style={tw`flex-row items-start justify-between px-5`}>
                <View style={tw`flex-1 pr-3`}>
                  <AppText type="title" style={tw`text-slate-900`}>
                    Send feedback
                  </AppText>
                  <AppText type="small" style={tw`mt-0.5 text-slate-500`}>
                    Tell us what is working and what to improve.
                  </AppText>
                </View>
                <TouchableOpacity
                  onPress={close}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  accessibilityRole="button"
                  accessibilityLabel="Close"
                  style={tw`w-9 h-9 rounded-full bg-slate-100 items-center justify-center`}
                >
                  <X size={18} color={COLORS.slate700} />
                </TouchableOpacity>
              </View>

              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[tw`px-5 pt-5`, { paddingBottom: insets.bottom + 16 }]}
              >
                <AppText type="heading" style={tw`mb-2.5 text-slate-900`}>
                  How would you rate the app?
                </AppText>
                <StarRating value={rating} onChange={setRating} />

                <AppText type="heading" style={tw`mt-6 mb-2.5 text-slate-900`}>
                  What is it about?
                </AppText>
                <View style={tw`flex-row flex-wrap`}>
                  {CATEGORIES.map((item) => {
                    const active = item.id === category;
                    return (
                      <PressableScale
                        key={item.id}
                        onPress={() => setCategory(item.id)}
                        scaleTo={0.95}
                        accessibilityRole="button"
                        accessibilityState={{ selected: active }}
                        style={[
                          tw`mr-2 mb-2 rounded-full border px-3.5 py-2`,
                          active ? { backgroundColor: COLORS.brand600, borderColor: COLORS.brand600 } : { backgroundColor: COLORS.white, borderColor: COLORS.slate300 },
                        ]}
                      >
                        <AppText variant="semiBold" style={{ fontSize: 13, color: active ? COLORS.white : COLORS.slate700 }}>
                          {item.label}
                        </AppText>
                      </PressableScale>
                    );
                  })}
                </View>

                <AppText type="heading" style={tw`mt-4 mb-2.5 text-slate-900`}>
                  Your message
                </AppText>
                <TextInput
                  value={message}
                  onChangeText={setMessage}
                  editable={!submitting}
                  multiline
                  maxLength={MAX_LENGTH}
                  textAlignVertical="top"
                  placeholder={category === 'bug' ? 'What went wrong, and where in the app?' : 'Write your feedback here...'}
                  placeholderTextColor={COLORS.slate500}
                  accessibilityLabel="Your feedback message"
                  style={[
                    tw`rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-slate-900`,
                    { minHeight: 120, fontSize: 15, lineHeight: 21, fontFamily: FONT_FAMILY.regular },
                  ]}
                />
                <View style={tw`mt-1.5 flex-row justify-between`}>
                  <AppText type="caption" style={{ color: trimmedLength > 0 && tooShort ? COLORS.red600 : COLORS.slate500 }}>
                    {trimmedLength > 0 && tooShort ? `Add a little more detail (at least ${MIN_LENGTH} characters).` : ' '}
                  </AppText>
                  <AppText type="caption" style={tw`text-slate-500`}>
                    {message.length}/{MAX_LENGTH}
                  </AppText>
                </View>

                {error ? (
                  <View style={tw`mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5`} accessibilityLiveRegion="polite">
                    <AppText variant="medium" style={tw`text-[13px] leading-5 text-red-700`}>
                      {error}
                    </AppText>
                  </View>
                ) : null}

                <AppButton label="Send feedback" onPress={submit} loading={submitting} disabled={tooShort} size="lg" style={tw`mt-5 rounded-lg`} />
                <AppButton label="Cancel" tone="secondary" onPress={close} disabled={submitting} size="lg" style={tw`mt-2.5 rounded-lg`} />
              </ScrollView>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
