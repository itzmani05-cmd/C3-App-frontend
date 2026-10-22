import React from 'react';
import { View } from 'react-native';
import { CircleCheck, CircleX, Sparkles, TrendingDown, TrendingUp } from '../../icons';
import AppText from '../ui/AppText';
import IconTile from '../ui/IconTile';
import Pill from '../ui/Pill';
import ScoreRing from './ScoreRing';
import { COLORS, SHADOWS, tw } from '../../theme';

const TONES = {
  passed: { label: 'Passed', icon: CircleCheck, tone: 'success', color: COLORS.green600, pill: { color: '#047857', backgroundColor: '#D1FAE5' }, card: { borderColor: COLORS.green300 } },
  failed: { label: 'Not passed', icon: CircleX, tone: 'danger', color: COLORS.red600, pill: { color: COLORS.red700, backgroundColor: COLORS.red100 }, card: { borderColor: COLORS.red200 } },
};

// How this attempt compares with the student's best before it. Null when there is nothing to compare with.
function comparison(percentage, previousBest) {
  if (typeof previousBest !== 'number') return null;
  const delta = Math.round(percentage - previousBest);
  if (delta > 0) return { icon: Sparkles, color: COLORS.green600, background: '#ECFDF5', text: `New best  +${delta}%` };
  if (delta === 0) return { icon: TrendingUp, color: COLORS.slate600, background: COLORS.slate100, text: 'Matched your best' };
  return { icon: TrendingDown, color: COLORS.slate600, background: COLORS.slate100, text: `Your best is still ${Math.round(previousBest)}%` };
}

export default function ResultSummaryCard({ pathLabel, quizLabel, passed, percentage, previousBest }) {
  const tone = passed ? TONES.passed : TONES.failed;
  const compare = comparison(percentage, previousBest);
  const CompareIcon = compare?.icon;

  return (
    <View style={[tw`rounded-2xl bg-white border p-5`, SHADOWS.card, tone.card]}>
      <View style={tw`flex-row items-start`}>
        <IconTile icon={tone.icon} tone={tone.tone} size={44} iconSize={22} />
        <View style={tw`flex-1 mx-3`}>
          <AppText variant="medium" style={tw`text-xs text-slate-500`} numberOfLines={1}>
            {pathLabel}
          </AppText>
          <AppText type="section" style={tw`mt-0.5 text-slate-900`} numberOfLines={2}>
            {quizLabel}
          </AppText>
        </View>
        <Pill label={tone.label} variant="bold" {...tone.pill} style={tw`px-2.5 py-1`} />
      </View>

      <View style={tw`mt-5 flex-row items-center`}>
        <ScoreRing value={percentage} color={tone.color} />
        <View style={tw`flex-1 ml-5`}>
          <AppText type="caption" style={tw`text-slate-500`}>
            PASS MARK
          </AppText>
          <AppText variant="bold" style={tw`mt-0.5 text-lg text-slate-900`}>
            80%
          </AppText>
          {compare ? (
            <View style={[tw`mt-3 flex-row items-center self-start rounded-lg px-2.5 py-1.5`, { backgroundColor: compare.background }]}>
              <CompareIcon size={14} color={compare.color} />
              <AppText variant="bold" style={[tw`ml-1.5 text-xs`, { color: compare.color }]}>
                {compare.text}
              </AppText>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}
