import { Stack, useLocalSearchParams } from 'expo-router';
import { RecordEditor } from '@/components/feature/RecordEditor';
import { pageLabels, type RecordKind } from '@/constants/models';
export default function EditorPage() {
  const params = useLocalSearchParams<{ kind: string; id?: string; category?: string }>();
  const kind: RecordKind = params.kind === 'entry' || params.kind === 'note' ? params.kind : 'task';
  return <><Stack.Screen options={{ title: `${params.id ? 'Düzenle' : 'Yeni kayıt'} · ${pageLabels[kind]}` }} /><RecordEditor kind={kind} id={typeof params.id === 'string' ? params.id : undefined} category={typeof params.category === 'string' ? params.category : undefined} /></>;
}
