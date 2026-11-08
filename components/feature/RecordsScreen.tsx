import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import type { Entry, Note, RecordKind, Task } from '@/constants/models';
import { kindLabels } from '@/constants/models';
import { Screen, Footer } from '@/components/layout/Screen';
import { Button, Chips, EmptyState, Field } from '@/components/ui/Controls';
import { RecordCard } from '@/components/feature/RecordCard';
import { BalanceCard } from '@/components/feature/BalanceCard';
import { useRecords } from '@/hooks/useRecords';
import { colors, font, spacing } from '@/constants/theme';
import { money } from '@/services/records';
interface RecordsScreenProps { kind: RecordKind }
export function RecordsScreen({ kind }: RecordsScreenProps) {
  const { data, totals, toggleTask, saving } = useRecords();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [month, setMonth] = useState('');
  const [selection, setSelection] = useState(kind === 'entry' ? 'Yatan' : 'Hepsi');
  const titles = { task: 'Görevler', entry: 'İstizan', note: 'Notlar' };
  const category = selection === 'İade' ? 'iade' : selection === 'Malzemeler' ? 'malzeme' : 'yatan';
  const list = useMemo(() => {
    const records: (Task | Entry | Note)[] = kind === 'task' ? data.tasks : kind === 'entry' ? data.entries : data.notes;
    return records.filter(item => {
      const title = 'name' in item ? item.name : item.title;
      const text = 'content' in item ? item.content : 'plan' in item ? item.plan : item.person;
      return (!query || `${title} ${text}`.toLocaleLowerCase('tr-TR').includes(query.toLocaleLowerCase('tr-TR'))) && (!month || item.date.startsWith(month)) && (kind !== 'task' || selection === 'Hepsi' || (item as Task).status === selection) && (kind !== 'entry' || (item as Entry).kind === category);
    }).sort((a, b) => kind === 'task' ? (a.date + (a as Task).time).localeCompare(b.date + (b as Task).time) : b.date.localeCompare(a.date));
  }, [data, kind, query, month, selection, category]);
  const total = useMemo(() => kind === 'entry' ? list.reduce((sum, item) => sum + (item as Entry).amount, 0) : 0, [kind, list]);
  const add = useCallback(() => router.push({ pathname: '/editor', params: { kind, category } }), [router, kind, category]);
  return <Screen title={titles[kind]} subtitle={kind === 'task' ? 'Gününüzü planlayın, ilerlemenizi takip edin.' : kind === 'entry' ? 'Yatan · İade · Alınan malzemeler' : 'Aklınızdakiler kaybolmasın.'}><FlatList data={list} keyExtractor={item => item.id} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.list} ListHeaderComponent={<View style={styles.header}>{kind === 'entry' ? <><BalanceCard {...totals} compact /><Text style={styles.spent}>Toplam harcanan: <Text style={styles.emphasis}>{money(totals.spent)}</Text></Text></> : <View style={styles.context}><Text style={styles.contextNumber}>{kind === 'task' ? data.tasks.filter(t => t.status === 'Tamamlandı').length : data.notes.length}</Text><Text style={styles.contextLabel}>{kind === 'task' ? 'tamamlanan görev' : 'kişisel not'}<Text style={styles.contextSub}>{'\n'}Yalnızca bu cihazda, her zaman erişilebilir.</Text></Text></View>}<Button label={kind === 'task' ? 'Yeni görev ekle' : kind === 'entry' ? 'Yeni istizan ekle' : 'Yeni not ekle'} icon="add-outline" onPress={add} /><Field label="Kayıtlarda ara" value={query} onChangeText={setQuery} placeholder="Başlık veya içerik…" /><View style={styles.monthRow}><View style={styles.monthInput}><Field label="Ay filtresi (YYYY-AA)" value={month} onChangeText={setMonth} placeholder="Tüm aylar" maxLength={7} keyboardType="numbers-and-punctuation" /></View>{month ? <Button label="Temizle" secondary onPress={() => setMonth('')} /> : null}</View>{kind !== 'note' ? <Chips values={kind === 'task' ? ['Hepsi', 'Planlandı', 'Tamamlandı'] : ['Yatan', 'İade', 'Malzemeler']} selected={selection} onChange={setSelection} /> : null}<View style={styles.summary}><Text style={styles.heading}>{kind === 'entry' ? kindLabels[category] : kind === 'task' ? selection === 'Hepsi' ? 'Tüm görevler' : selection : 'Tüm notlar'} · {list.length}</Text>{kind === 'entry' ? <Text style={styles.emphasis}>{money(total)}</Text> : null}</View></View>} renderItem={({ item }) => <RecordCard kind={kind} item={item} onPress={() => router.push({ pathname: '/editor', params: { kind, id: item.id } })} onToggle={() => { void toggleTask(item.id); }} disabled={saving} />} ListEmptyComponent={<EmptyState icon={kind === 'task' ? 'calendar-outline' : kind === 'entry' ? 'wallet-outline' : 'reader-outline'} title={query || month || (kind === 'task' && selection !== 'Hepsi') ? 'Eşleşen kayıt yok' : 'Henüz kayıt yok'} description={query || month ? 'Aramayı veya ay filtresini değiştirin.' : 'Yukarıdaki düğmeyle ilk kaydınızı oluşturun.'} />} ListFooterComponent={<Footer />} /></Screen>;
}
const styles = StyleSheet.create({ list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md }, header: { gap: spacing.md, marginBottom: spacing.md }, context: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md }, contextNumber: { fontSize: font.hero, color: colors.primary, fontWeight: '600' }, contextLabel: { color: colors.text, fontSize: font.body, lineHeight: 26, flex: 1 }, contextSub: { color: colors.subtle, fontSize: font.small }, spent: { color: colors.subtle, fontSize: font.small }, emphasis: { color: colors.primary, fontSize: font.body, fontWeight: '600' }, monthRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm }, monthInput: { flex: 1 }, summary: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm }, heading: { color: colors.text, fontSize: font.body, fontWeight: '600', flex: 1 } });
