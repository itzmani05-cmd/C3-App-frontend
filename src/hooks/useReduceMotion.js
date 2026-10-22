import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

// True when the student has turned on "reduce motion" in their phone's accessibility settings. Animations check this
// and shorten or skip themselves.
export default function useReduceMotion() {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => mounted && setReduce(!!value))
      .catch(() => {});
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', (value) => setReduce(!!value));
    return () => {
      mounted = false;
      subscription?.remove?.();
    };
  }, []);

  return reduce;
}
