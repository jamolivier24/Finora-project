import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette, styles as dashboardStyles } from '@/styles/index.styles';

type Params = { demoEmail?: string; income?: string; expenses?: string; currency?: string };

export default function SecurityScreen() {
  const params = useLocalSearchParams<Params>();
  const goProfile = () => router.replace({ pathname: '/profile', params });
  return <SafeAreaView style={styles.safeArea}><ScrollView contentContainerStyle={styles.content}><View style={styles.header}><Pressable onPress={goProfile} style={styles.headerIcon}><Ionicons name="arrow-back" size={20} color="#FFFFFF" /></Pressable><Text style={styles.headerTitle}>Security</Text><View style={styles.headerSpacer} /></View><View style={styles.panel}><Text style={styles.sectionTitle}>Security</Text><SecurityRow title="Change Pin" /><SecurityRow title="Fingerprint" /><SecurityRow title="Terms And Conditions" /></View></ScrollView><View style={dashboardStyles.bottomNav}>{['home-outline', 'search-outline', 'swap-horizontal-outline', 'layers-outline', 'person-outline'].map((icon, index) => <Pressable key={icon} onPress={index === 0 ? () => router.replace({ pathname: '/', params }) : index === 4 ? goProfile : undefined} style={[dashboardStyles.navItem, index === 4 && dashboardStyles.navItemActive]}><Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={23} color={palette.ink} /></Pressable>)}</View></SafeAreaView>;
}
function SecurityRow({ title }: { title: string }) { return <Pressable style={styles.row}><Text style={styles.rowText}>{title}</Text><Ionicons name="chevron-forward" size={17} color={palette.ink} /></Pressable>; }
const styles = StyleSheet.create({ safeArea: { flex: 1, backgroundColor: '#ECF8ED' }, content: { flexGrow: 1, paddingBottom: 30 }, header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 9, paddingBottom: 21, backgroundColor: palette.teal }, headerIcon: { width: 38, height: 38, justifyContent: 'center' }, headerTitle: { color: palette.ink, fontSize: 14, fontWeight: '700' }, headerSpacer: { width: 38 }, panel: { flex: 1, paddingTop: 22, borderTopLeftRadius: 38, borderTopRightRadius: 38, backgroundColor: '#F8FCF8' }, sectionTitle: { color: palette.ink, fontSize: 14, fontWeight: '800', paddingHorizontal: 22, marginBottom: 8 }, row: { minHeight: 53, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22, borderBottomWidth: 1, borderBottomColor: '#DCEBE0' }, rowText: { color: palette.ink, fontSize: 11 } });
