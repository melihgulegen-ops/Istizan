import { memo, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius, spacing } from '@/constants/theme';
interface ButtonProps { label: string; onPress: () => void; icon?: keyof typeof Ionicons.glyphMap; secondary?: boolean; danger?: boolean; disabled?: boolean; loading?: boolean }
export const Button = memo(function Button({ label, onPress, icon, secondary, danger, disabled, loading }: ButtonProps) {
  const tint = danger ? colors.danger : secondary ? colors.primary : colors.onPrimary;
  return <Pressable accessibilityRole="button" accessibilityLabel={label} disabled={disabled || loading} onPress={onPress} style={({ pressed }) => [styles.button, secondary ? styles.secondary : null, danger ? styles.secondary : null, { opacity: disabled ? 0.45 : pressed ? 0.75 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }]}>{loading ? <ActivityIndicator color={tint} /> : icon ? <Ionicons name={icon} size={20} color={tint} /> : null}<Text style={[styles.buttonText, { color: tint }]}>{label}</Text></Pressable>;
});
interface FieldProps extends TextInputProps { label: string }
export const Field = memo(function Field({ label, ...props }: FieldProps) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput {...props} accessibilityLabel={label} placeholderTextColor={colors.subtle} selectionColor={colors.primary} style={[styles.input, props.multiline ? styles.multiline : null, props.style]} /></View>;
});
interface ChipsProps { values: string[]; selected: string; onChange: (value: string) => void }
export const Chips = memo(function Chips({ values, selected, onChange }: ChipsProps) {
  return <View style={styles.chipsOuter}><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>{values.map(value => <Pressable key={value} accessibilityRole="button" accessibilityState={{ selected: selected === value }} onPress={() => onChange(value)} style={({ pressed }) => [styles.chip, selected === value ? styles.chipSelected : null, { opacity: pressed ? 0.6 : 1 }]}><Text style={[styles.chipText, selected === value ? styles.chipTextSelected : null]}>{value}</Text></Pressable>)}</ScrollView></View>;
});
interface EmptyProps { icon: keyof typeof Ionicons.glyphMap; title: string; description: string; children?: ReactNode }
export const EmptyState = memo(function EmptyState({ icon, title, description, children }: EmptyProps) {
  return <View style={styles.empty}><View style={styles.emptyIcon}><Ionicons name={icon} size={32} color={colors.primary} /></View><Text style={styles.emptyTitle}>{title}</Text><Text style={styles.description}>{description}</Text>{children}</View>;
});
export const styles = StyleSheet.create({
  button: { minHeight: 52, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radius.md, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: spacing.sm },
  secondary: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }, buttonText: { fontSize: font.body, fontWeight: '600', includeFontPadding: false },
  field: { gap: spacing.sm }, label: { color: colors.subtle, fontSize: font.small, fontWeight: '600' }, input: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background, color: colors.text, minHeight: 52, padding: spacing.md, borderRadius: radius.sm, fontSize: font.body }, multiline: { minHeight: 128, textAlignVertical: 'top', lineHeight: 26 },
  chipsOuter: { minHeight: 48 }, chips: { gap: spacing.sm, alignItems: 'center' }, chip: { height: 44, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface }, chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary }, chipText: { color: colors.subtle, fontSize: font.small, fontWeight: '600' }, chipTextSelected: { color: colors.onPrimary },
  empty: { borderWidth: 1, borderStyle: 'dashed', borderColor: colors.border, backgroundColor: colors.surface, borderRadius: radius.lg, alignItems: 'center', padding: spacing.xl, gap: spacing.md }, emptyIcon: { width: 64, height: 64, borderRadius: radius.md, backgroundColor: colors.goldSoft, justifyContent: 'center', alignItems: 'center' }, emptyTitle: { fontSize: font.section, fontWeight: '600', color: colors.text, textAlign: 'center' }, description: { color: colors.subtle, fontSize: font.body, lineHeight: 26, textAlign: 'center' },
});
