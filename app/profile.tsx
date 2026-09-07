import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette, styles as dashboardStyles } from '@/styles/index.styles';
import { NotificationsPanel } from '@/components/notifications-panel';

type Params = { demoEmail?: string; income?: string; expenses?: string; currency?: string; profilePicture?: string };

export default function ProfileScreen() {
  const params = useLocalSearchParams<Params>();
  const { demoEmail } = params;
  const name = demoEmail?.split('@')[0] || 'User';
  const goHome = () => router.replace({ pathname: '/', params });
  const goEdit = () => router.push({ pathname: '/edit-profile', params });
  const goSecurity = () => router.push({ pathname: '/security', params });
  const goHelp = () => router.push({ pathname: '/help', params });
  const goSettings = () => router.push({ pathname: '/settings', params });
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={goHome} style={styles.headerIcon} accessibilityLabel="Go back to home"><Ionicons name="arrow-back" size={20} color="#FFFFFF" /></Pressable>
          <Text style={styles.headerTitle}>Profile</Text>
          <Pressable onPress={() => setNotificationsVisible(true)} style={dashboardStyles.notificationButton} accessibilityLabel="Open notifications"><Ionicons name="notifications-outline" size={19} color={palette.ink} /></Pressable>
        </View>
        <View style={styles.profileIntro}>
          <View style={styles.avatar}>{params.profilePicture ? <Image source={{ uri: params.profilePicture }} style={styles.avatarImage} /> : <Ionicons name="person" size={38} color="#FFFFFF" />}</View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{demoEmail || 'No email available'}</Text>
        </View>
        <View style={styles.menu}>
          <ProfileAction icon="person-outline" title="Edit Profile" onPress={goEdit} />
          <ProfileAction icon="shield-checkmark-outline" title="Security" onPress={goSecurity} />
          <ProfileAction icon="settings-outline" title="Settings" onPress={goSettings} />
          <ProfileAction icon="help-circle-outline" title="Help" onPress={goHelp} />
          <ProfileAction icon="log-out-outline" title="Logout" onPress={() => setLogoutVisible(true)} />
        </View>
      </ScrollView>
      <NotificationsPanel visible={notificationsVisible} onClose={() => setNotificationsVisible(false)} income={Number(params.income) || 0} expenses={Number(params.expenses) || 0} currency={params.currency === 'RWF' ? 'RWF' : 'USD'} />
      <Modal visible={logoutVisible} transparent animationType="fade" onRequestClose={() => setLogoutVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmationCard}>
            <View style={styles.confirmationIcon}><Ionicons name="log-out-outline" size={24} color="#B04B4B" /></View>
            <Text style={styles.confirmationTitle}>Log out?</Text>
            <Text style={styles.confirmationMessage}>Are you sure you want to log out of FINORA?</Text>
            <View style={styles.confirmationActions}>
              <Pressable onPress={() => setLogoutVisible(false)} style={styles.cancelButton}><Text style={styles.cancelText}>Cancel</Text></Pressable>
              <Pressable onPress={() => { setLogoutVisible(false); router.replace('/auth'); }} style={styles.logoutButton}><Text style={styles.logoutText}>Log out</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <BottomNav params={params} active="profile" />
    </SafeAreaView>
  );
}

function ProfileAction({ icon, title, onPress }: { icon: keyof typeof Ionicons.glyphMap; title: string; onPress?: () => void }) {
  return <Pressable onPress={onPress} disabled={!onPress} style={styles.menuItem}><View style={styles.menuIcon}><Ionicons name={icon} size={20} color="#FFFFFF" /></View><Text style={styles.menuTitle}>{title}</Text></Pressable>;
}

function BottomNav({ params, active }: { params: Params; active: string }) {
  const routes = [
    () => router.replace({ pathname: '/', params }),
    () => router.push({ pathname: '/analysis/[period]', params: { ...params, period: 'monthly' } }),
    () => router.push({ pathname: '/transactions', params }),
    undefined,
    () => router.push({ pathname: '/profile', params }),
  ];
  return <View style={dashboardStyles.bottomNav}>{['home-outline', 'search-outline', 'swap-horizontal-outline', 'layers-outline', 'person-outline'].map((icon, index) => <Pressable key={icon} onPress={routes[index]} style={[dashboardStyles.navItem, active === 'profile' && index === 4 && dashboardStyles.navItemActive]} accessibilityLabel={index === 4 ? 'Profile' : index === 0 ? 'Home' : index === 1 ? 'Analysis' : index === 2 ? 'Transactions' : undefined}><Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={23} color={palette.ink} /></Pressable>)}</View>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ECF8ED' },
  content: { flexGrow: 1, paddingBottom: 30 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 9, paddingBottom: 21, backgroundColor: palette.teal },
  headerIcon: { width: 38, height: 38, alignItems: 'flex-start', justifyContent: 'center' },
  headerTitle: { color: palette.ink, fontSize: 14, fontWeight: '700' },
  profileIntro: { alignItems: 'center', paddingVertical: 23, borderTopLeftRadius: 38, borderTopRightRadius: 38, backgroundColor: '#F8FCF8' },
  avatar: { width: 76, height: 76, alignItems: 'center', justifyContent: 'center', borderRadius: 38, overflow: 'hidden', backgroundColor: '#65B5F7' },
  avatarImage: { width: 76, height: 76 },
  name: { color: palette.ink, fontSize: 15, fontWeight: '800', marginTop: 9 },
  email: { color: palette.muted, fontSize: 10, marginTop: 3 },
  menu: { flex: 1, paddingHorizontal: 25, paddingTop: 15, backgroundColor: '#F8FCF8' },
  menuItem: { flexDirection: 'row', alignItems: 'center', minHeight: 54 },
  menuIcon: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', marginRight: 12, borderRadius: 19, backgroundColor: '#3B9BFF' },
  menuTitle: { color: palette.ink, fontSize: 12, fontWeight: '700' },
  modalOverlay: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: 'rgba(23, 59, 61, 0.45)' },
  confirmationCard: { width: '100%', maxWidth: 330, alignItems: 'center', padding: 24, borderRadius: 20, backgroundColor: '#F8FCF8' },
  confirmationIcon: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 24, backgroundColor: '#F8DFDF' },
  confirmationTitle: { color: palette.ink, fontSize: 18, fontWeight: '800', marginTop: 12 },
  confirmationMessage: { color: palette.muted, fontSize: 12, textAlign: 'center', marginTop: 6 },
  confirmationActions: { flexDirection: 'row', gap: 10, marginTop: 22 },
  cancelButton: { minWidth: 86, alignItems: 'center', paddingVertical: 10, borderRadius: 10, backgroundColor: '#D8F2DC' },
  cancelText: { color: palette.ink, fontSize: 12, fontWeight: '700' },
  logoutButton: { minWidth: 86, alignItems: 'center', paddingVertical: 10, borderRadius: 10, backgroundColor: '#B04B4B' },
  logoutText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
});
