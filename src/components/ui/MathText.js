import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { toMathHtml } from '../../utils/mathTokens';

const KATEX_VERSION = '0.16.11';
const CDN = `https://cdn.jsdelivr.net/npm/katex@${KATEX_VERSION}/dist`;
const WEIGHTS = { regular: 400, medium: 500, semiBold: 600, bold: 700, extraBold: 800 };

// Style keys that describe the text itself; everything else (flex, margins, width…) stays on the wrapper view.
const TEXT_KEYS = ['color', 'fontSize', 'fontFamily', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing', 'textAlign', 'textTransform', 'textDecorationLine'];

function buildPage(body, { color, fontSize, lineHeight, fontWeight, textAlign }) {
  return `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<link rel="stylesheet" href="${CDN}/katex.min.css">
<script src="${CDN}/katex.min.js"></script>
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
 * Needs a network connection to fetch KaTeX; without one the formulas show as their source text.
 */
export default function MathText({ text, variant = 'regular', style }) {
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

  return (
    <View style={[layout, { height }]} pointerEvents="none">
      <WebView
        originWhitelist={['*']}
        source={{ html, baseUrl: 'https://cdn.jsdelivr.net' }}
        style={{ height, backgroundColor: 'transparent' }}
        containerStyle={{ backgroundColor: 'transparent' }}
        scrollEnabled={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        javaScriptEnabled
        androidLayerType="hardware"
        onMessage={(event) => {
          const next = parseInt(event.nativeEvent.data, 10);
          if (next > 0) setHeight((prev) => (Math.abs(prev - next) > 1 ? next : prev));
        }}
      />
    </View>
  );
}
