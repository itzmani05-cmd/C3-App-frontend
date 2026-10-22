import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FONT_FAMILY } from '../../theme';
import { toMathHtml } from '../../utils/mathTokens';

// The web view is native code. An app build made before it was added doesn't have it, so load it defensively: such
// builds keep running (formulas show as plain text) and get typeset formulas once they are rebuilt.
let WebView = null;
try {
  WebView = require('react-native-webview').WebView;
} catch (error) {
  WebView = null;
}

// If the web view fails to render (e.g. an older build without the native module), show the text instead of crashing.
class WebViewGuard extends React.Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

// KaTeX ships inside the app (see scripts/build-katex-assets.js), so formulas typeset without a network connection.
// The ~0.5 MB payload is only loaded when the first formula is shown, and the page head is built once and shared.
let katexHead = null;
function getKatexHead() {
  if (!katexHead) {
    const { KATEX_CSS, KATEX_JS } = require('../../utils/katexAssets');
    katexHead = `<style>${KATEX_CSS}</style>\n<script>${KATEX_JS.replace(/<\/script/gi, '<\\/script')}</script>`;
  }
  return katexHead;
}
const WEIGHTS = { regular: 400, medium: 500, semiBold: 600, bold: 700, extraBold: 800 };

// Style keys that describe the text itself; everything else (flex, margins, width…) stays on the wrapper view.
const TEXT_KEYS = ['color', 'fontSize', 'fontFamily', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing', 'textAlign', 'textTransform', 'textDecorationLine'];

function buildPage(body, { color, fontSize, lineHeight, fontWeight, textAlign }) {
  return `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
${getKatexHead()}
<style>
  html,body{margin:0;padding:0;background:transparent;-webkit-text-size-adjust:100%}
  body{font-family:-apple-system,Roboto,'Segoe UI',sans-serif;font-size:${fontSize}px;line-height:${lineHeight}px;color:${color};font-weight:${fontWeight};text-align:${textAlign};white-space:pre-wrap;overflow-wrap:anywhere}
  .katex{font-size:1.05em}
  .katex-display{margin:.5em 0;overflow-x:auto;overflow-y:hidden;white-space:normal}
</style></head>
<body><div id="c">${body}</div>
<script>
  function typeset(){
    if(!window.katex) return;
    document.querySelectorAll('.m').forEach(function(el){
      var tex = decodeURIComponent(el.getAttribute('data-t'));
      try { el.innerHTML = katex.renderToString(tex,{displayMode:el.getAttribute('data-d')==='1',throwOnError:false,strict:'ignore'}); }
      catch(e) {}
    });
  }
  function report(){
    var h = Math.ceil(document.getElementById('c').getBoundingClientRect().height);
    window.ReactNativeWebView && window.ReactNativeWebView.postMessage(String(h));
  }
  window.addEventListener('load', function(){
    typeset(); report();
    setTimeout(report, 200);
    if(window.ResizeObserver) new ResizeObserver(report).observe(document.getElementById('c'));
  });
</script></body></html>`;
}

/**
 * Text that contains LaTeX, typeset with KaTeX in a small web view (React Native has no maths renderer of its own).
 * It takes the same style props as <Text>; touches pass through to the parent so options stay tappable.
 * KaTeX is bundled with the app, so no network connection is needed.
 */
function MathText({ text, variant = 'regular', style }) {
  const flat = StyleSheet.flatten(style) || {};
  const fontSize = flat.fontSize || 14;
  const lineHeight = flat.lineHeight || Math.round(fontSize * 1.5);
  const color = flat.color || '#0F172A';
  const fontWeight = flat.fontWeight || WEIGHTS[variant] || 400;
  const textAlign = flat.textAlign || 'left';

  const layout = {};
  Object.keys(flat).forEach((key) => {
    if (!TEXT_KEYS.includes(key)) layout[key] = flat[key];
  });

  const [height, setHeight] = useState(lineHeight);
  const html = useMemo(
    () => buildPage(toMathHtml(text), { color, fontSize, lineHeight, fontWeight, textAlign }),
    [text, color, fontSize, lineHeight, fontWeight, textAlign]
  );

  // Stable props for the web view: a new `source` object or handler on every render makes it do needless work.
  const source = useMemo(() => ({ html }), [html]);
  const handleMessage = useCallback((event) => {
    const next = parseInt(event.nativeEvent.data, 10);
    if (next > 0) setHeight((prev) => (Math.abs(prev - next) > 1 ? next : prev));
  }, []);

  const fallback = <Text style={[{ fontFamily: FONT_FAMILY[variant] || FONT_FAMILY.regular }, style]}>{text}</Text>;
  if (!WebView) return fallback;

  return (
    <WebViewGuard fallback={fallback}>
    <View style={[layout, { height }]} pointerEvents="none">
      <WebView
        originWhitelist={['*']}
        source={source}
        style={{ height, backgroundColor: 'transparent' }}
        containerStyle={{ backgroundColor: 'transparent' }}
        scrollEnabled={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        javaScriptEnabled
        androidLayerType="hardware"
        onMessage={handleMessage}
      />
    </View>
    </WebViewGuard>
  );
}

// Parents pass a fresh style object on every render (the quiz screen re-renders on each answer), so compare styles by
// value; otherwise every formula would rebuild its page and reload its web view.
const sameProps = (a, b) =>
  a.text === b.text &&
  a.variant === b.variant &&
  JSON.stringify(StyleSheet.flatten(a.style)) === JSON.stringify(StyleSheet.flatten(b.style));

export default React.memo(MathText, sameProps);
