import React from 'react';
import { View } from 'react-native';
import BilingualText from '../ui/BilingualText';
import { COLORS, RADII } from '../../theme';
import { parseAssertionReason, parseMatchTheFollowing, parseStatements } from '../../utils/questionStructure';

const markerLabel = (marker) => (marker ? `${marker.replace(/^\(|\)$/g, '').replace(/[.)]$/, '')}.` : '');

function Paragraph({ text, prefix, base, style }) {
  if (!text && !prefix) return null;
  return (
    <BilingualText variant={base.variant} style={[{ fontSize: base.fontSize, lineHeight: base.lineHeight, color: base.color }, style]}>
      {prefix ? <BilingualText variant="bold" style={{ color: base.prefixColor }}>{prefix} </BilingualText> : null}
      {text}
    </BilingualText>
  );
}

function MatchTable({ match, base }) {
  const rows = Math.max(match.listI.length, match.listII.length);
  const cell = (item, withBorder) => (
    <View style={[styles.cell, withBorder && styles.cellBorder]}>
      {item ? (
        <>
          {item.marker ? (
            <BilingualText variant="bold" style={[styles.marker, { fontSize: base.fontSize - 1 }]}>
              {markerLabel(item.marker)}
            </BilingualText>
          ) : null}
          <BilingualText variant="medium" style={{ flex: 1, fontSize: base.fontSize - 1, lineHeight: base.lineHeight - 2, color: COLORS.slate800 }}>
            {item.text}
          </BilingualText>
        </>
      ) : null}
    </View>
  );
  const heading = (label, title, withBorder) => (
    <View style={[styles.headCell, withBorder && styles.cellBorder]}>
      <BilingualText variant="bold" style={styles.headLabel}>
        {label}
        {title ? <BilingualText variant="medium" style={styles.headTitle}>{`  ${title}`}</BilingualText> : null}
      </BilingualText>
    </View>
  );

  return (
    <View style={styles.table}>
      <View style={[styles.row, styles.headRow]}>
        {heading('LIST I', match.titleI, false)}
        {heading('LIST II', match.titleII, true)}
      </View>
      {Array.from({ length: rows }, (_, i) => (
        <View key={i} style={[styles.row, i < rows - 1 && styles.rowDivider]}>
          {cell(match.listI[i], false)}
          {cell(match.listII[i], true)}
        </View>
      ))}
    </View>
  );
}

function AssertionReasonBox({ parsed, base }) {
  const row = (label, body) => (
    <View style={{ marginBottom: 2 }}>
      <BilingualText variant="bold" style={styles.arLabel}>{label.toUpperCase()}</BilingualText>
      <BilingualText variant="medium" style={{ fontSize: base.fontSize, lineHeight: base.lineHeight, color: COLORS.slate800 }}>{body}</BilingualText>
    </View>
  );
  return (
    <View style={styles.arBox}>
      {row(parsed.assertionLabel, parsed.assertion)}
      <View style={styles.arDivider} />
      {row(parsed.reasonLabel, parsed.reason)}
    </View>
  );
}

function StatementList({ statements, base }) {
  return (
    <View style={{ marginTop: 8 }}>
      {statements.map((statement, i) => (
        <View key={i} style={styles.statement}>
          <View style={styles.badge}>
            <BilingualText variant="bold" style={styles.badgeText}>{i + 1}</BilingualText>
          </View>
          <BilingualText variant="medium" style={{ flex: 1, fontSize: base.fontSize, lineHeight: base.lineHeight, color: COLORS.slate800 }}>
            {statement}
          </BilingualText>
        </View>
      ))}
    </View>
  );
}

/**
 * Shows a question's text. Match-the-following questions become a two-column table, assertion-reason questions a
 * labelled box and "Consider the following statements" questions numbered cards; anything else is plain text.
 * `prefix` (e.g. "Q3.") is shown in front of the first line of text.
 */
export default function FormattedQuestionText({ text, prefix, variant = 'medium', fontSize = 15, lineHeight = 22, color = COLORS.gray700 }) {
  const base = { variant, fontSize, lineHeight, color, prefixColor: color };
  const source = text || '';

  const match = parseMatchTheFollowing(source);
  if (match) {
    return (
      <View>
        <Paragraph text={match.prompt} prefix={prefix} base={base} />
        <MatchTable match={match} base={base} />
        <Paragraph text={match.trailer} base={base} style={{ marginTop: 8 }} />
      </View>
    );
  }

  const assertion = parseAssertionReason(source);
  if (assertion) {
    return (
      <View>
        <Paragraph text={assertion.header} prefix={prefix} base={base} style={{ marginBottom: 8 }} />
        <AssertionReasonBox parsed={assertion} base={base} />
        <Paragraph text={assertion.trailer} base={base} style={{ marginTop: 8 }} />
      </View>
    );
  }

  const statements = parseStatements(source);
  if (statements) {
    return (
      <View>
        <Paragraph text={statements.intro} prefix={prefix} base={base} />
        <StatementList statements={statements.statements} base={base} />
        <Paragraph text={statements.question} base={{ ...base, variant: 'bold', color: COLORS.slate900 }} style={{ marginTop: 10 }} />
      </View>
    );
  }

  return <Paragraph text={source} prefix={prefix} base={base} />;
}

const styles = {
  table: { marginTop: 8, borderWidth: 1, borderColor: COLORS.slate300, borderRadius: RADII.md, overflow: 'hidden', backgroundColor: COLORS.white },
  row: { flexDirection: 'row' },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: COLORS.slate200 },
  headRow: { backgroundColor: COLORS.slate100, borderBottomWidth: 1, borderBottomColor: COLORS.slate300 },
  headCell: { flex: 1, padding: 10 },
  headLabel: { fontSize: 11, letterSpacing: 0.6, color: COLORS.slate600 },
  headTitle: { fontSize: 11, color: COLORS.slate500 },
  cell: { flex: 1, flexDirection: 'row', padding: 10 },
  cellBorder: { borderLeftWidth: 1, borderLeftColor: COLORS.slate200 },
  marker: { width: 22, color: COLORS.brand700 },
  arBox: { borderWidth: 1, borderColor: COLORS.slate200, borderRadius: RADII.md, backgroundColor: COLORS.slate50, padding: 12 },
  arLabel: { fontSize: 11, letterSpacing: 0.6, color: COLORS.brand700, marginBottom: 2 },
  arDivider: { height: 1, backgroundColor: COLORS.slate200, marginVertical: 10 },
  statement: { flexDirection: 'row', alignItems: 'flex-start', borderWidth: 1, borderColor: COLORS.slate200, borderRadius: RADII.md, backgroundColor: COLORS.slate50, padding: 10, marginBottom: 8 },
  badge: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.brand100, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  badgeText: { fontSize: 12, color: COLORS.brand700 },
};
