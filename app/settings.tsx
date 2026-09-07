import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import { palette, styles as dashboardStyles } from '@/styles/index.styles';

type Params = { demoEmail?: string; income?: string; expenses?: string; currency?: string; profilePicture?: string };

export default function SettingsScreen() {
  const params = useLocalSearchParams<Params>();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkTheme, setDarkTheme] = useState(false);
  const surface = darkTheme ? '#173B3D' : '#F8FCF8';
  const textColor = darkTheme ? '#F2F7F1' : palette.ink;
  const goProfile = () => router.replace({ pathname: '/profile', params });
  const goHome = () => router.replace({ pathname: '/', params });

  return (
    <SafeAreaView style={[styles.safeArea, darkTheme && styles.darkSafeArea]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}><Pressable onPress={goProfile} style={styles.headerIcon} accessibilityLabel="Go back to profile"><Ionicons name="arrow-back" size={20} color="#FFFFFF" /></Pressable><Text style={styles.headerTitle}>Settings</Text><Pressable style={dashboardStyles.notificationButton} accessibilityLabel="Open notifications"><Ionicons name="notifications-outline" size={19} color={palette.ink} /></Pressable></View>
        <View style={[styles.panel, { backgroundColor: surface }]}>
          <SettingRow icon="notifications-outline" title="Notification Settings" color={textColor} right={<Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} trackColor={{ true: palette.teal }} />} />
          <SettingRow icon="key-outline" title="Password Settings" color={textColor} right={<Ionicons name="chevron-forward" size={17} color={textColor} />} />
          <SettingRow icon="person-remove-outline" title="Delete Account" color={textColor} right={<Ionicons name="chevron-forward" size={17} color={textColor} />} />
          <View style={styles.themeRow}><Text style={[styles.themeText, { color: textColor }]}>Dark theme</Text><Switch value={darkTheme} onValueChange={setDarkTheme} trackColor={{ true: palette.teal }} /></View>
        </View>
      </ScrollView>
      <View style={dashboardStyles.bottomNav}>{['home-outline', 'search-outline', 'swap-horizontal-outline', 'layers-outline', 'person-outline'].map((icon, index) => <Pressable key={icon} onPress={index === 0 ? goHome : index === 4 ? goProfile : undefined} style={[dashboardStyles.navItem, index === 4 && dashboardStyles.navItemActive]} accessibilityLabel={index === 0 ? 'Home' : index === 4 ? 'Profile' : undefined}><Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={23} color={palette.ink} /></Pressable>)}</View>
    </SafeAreaView>
  );
}

function SettingRow({ icon, title, color, right }: { icon: keyof typeof Ionicons.glyphMap; title: string; color: string; right: React.ReactNode }) { return <View style={styles.row}><View style={styles.rowIcon}><Ionicons name={icon} size={17} color="#FFFFFF" /></View><Text style={[styles.rowText, { color }]}>{title}</Text><View style={styles.rowRight}>{right}</View></View>; }

const styles = StyleSheet.create({ safeArea: { flex: 1, backgroundColor: '#ECF8ED' }, darkSafeArea: { backgroundColor: '#102D2F' }, content: { flexGrow: 1 }, header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 9, paddingBottom: 21, backgroundColor: palette.teal }, headerIcon: { width: 38, height: 38, justifyContent: 'center' }, headerTitle: { color: palette.ink, fontSize: 14, fontWeight: '700' }, panel: { flex: 1, paddingTop: 21, borderTopLeftRadius: 38, borderTopRightRadius: 38 }, row: { minHeight: 53, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, borderBottomWidth: 1, borderBottomColor: '#DCEBE0' }, rowIcon: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center', marginRight: 11, borderRadius: 14, backgroundColor: palette.teal }, rowText: { fontSize: 11, fontWeight: '700' }, rowRight: { flex: 1, alignItems: 'flex-end' }, themeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, paddingHorizontal: 18 }, themeText: { fontSize: 11, fontWeight: '700' } });
