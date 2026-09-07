import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette, styles as dashboardStyles } from '@/styles/index.styles';

type Params = { demoEmail?: string; income?: string; expenses?: string; currency?: string; profilePicture?: string };

export default function EditProfileScreen() {
  const params = useLocalSearchParams<Params>();
  const [name, setName] = useState(params.demoEmail?.split('@')[0] || 'User');
  const [profilePicture, setProfilePicture] = useState(params.profilePicture);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkTheme, setDarkTheme] = useState(false);
  const goProfile = () => router.replace({ pathname: '/profile', params: { ...params, profilePicture } });
  const chooseProfilePicture = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Gallery permission needed', 'Allow photo access in your device settings to choose a profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) setProfilePicture(result.assets[0].uri);
  };
  const surface = darkTheme ? '#173B3D' : '#F8FCF8';
  const textColor = darkTheme ? '#F2F7F1' : palette.ink;
  return <SafeAreaView style={[styles.safeArea, darkTheme && styles.darkSafeArea]}><ScrollView contentContainerStyle={styles.content}><View style={styles.header}><Pressable onPress={goProfile} style={styles.headerIcon}><Ionicons name="arrow-back" size={20} color="#FFFFFF" /></Pressable><Text style={styles.headerTitle}>Edit My Profile</Text><View style={styles.headerSpacer} /></View><View style={[styles.profileIntro, { backgroundColor: surface }]}><Pressable onPress={chooseProfilePicture} accessibilityLabel="Change profile picture"><View style={[styles.avatar, !profilePicture && styles.defaultAvatar]}>{profilePicture ? <Image source={{ uri: profilePicture }} style={styles.avatarImage} /> : <Ionicons name="person" size={38} color="#FFFFFF" />}<View style={styles.cameraBadge}><Ionicons name="camera" size={12} color={palette.ink} /></View></View></Pressable><Text style={[styles.name, { color: textColor }]}>{name}</Text><Text style={styles.email}>{params.demoEmail || 'No email available'}</Text><Pressable onPress={chooseProfilePicture}><Text style={styles.changePicture}>Change profile picture</Text></Pressable></View><View style={[styles.form, { backgroundColor: surface }]}><Text style={[styles.sectionTitle, { color: textColor }]}>Account Settings</Text><Field label="Username" value={name} onChangeText={setName} /><Field label="Phone" value="+44 555 555 55" onChangeText={() => undefined} /><Field label="Email Address" value={params.demoEmail || ''} onChangeText={() => undefined} /><View style={styles.settingRow}><Text style={[styles.settingText, { color: textColor }]}>Push Notifications</Text><Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} trackColor={{ true: palette.teal }} /></View><View style={styles.settingRow}><Text style={[styles.settingText, { color: textColor }]}>Turn Dark Theme</Text><Switch value={darkTheme} onValueChange={setDarkTheme} trackColor={{ true: palette.teal }} /></View><Pressable style={styles.updateButton} onPress={goProfile}><Text style={styles.updateText}>Update Profile</Text></Pressable></View></ScrollView><BottomNav params={params} /></SafeAreaView>;
}

function Field({ label, value, onChangeText }: { label: string; value: string; onChangeText: (value: string) => void }) { return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput value={value} onChangeText={onChangeText} editable={label === 'Username'} style={styles.input} /></View>; }
function BottomNav({ params }: { params: Params }) { return <View style={dashboardStyles.bottomNav}>{['home-outline', 'search-outline', 'swap-horizontal-outline', 'layers-outline', 'person-outline'].map((icon, index) => <Pressable key={icon} onPress={index === 0 ? () => router.replace({ pathname: '/', params }) : index === 4 ? () => router.replace({ pathname: '/profile', params }) : undefined} style={[dashboardStyles.navItem, index === 4 && dashboardStyles.navItemActive]}><Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={23} color={palette.ink} /></Pressable>)}</View>; }

const styles = StyleSheet.create({ safeArea: { flex: 1, backgroundColor: '#ECF8ED' }, darkSafeArea: { backgroundColor: '#102D2F' }, content: { flexGrow: 1, paddingBottom: 30 }, header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 9, paddingBottom: 21, backgroundColor: palette.teal }, headerIcon: { width: 38, height: 38, justifyContent: 'center' }, headerTitle: { color: palette.ink, fontSize: 14, fontWeight: '700' }, headerSpacer: { width: 38 }, profileIntro: { alignItems: 'center', paddingVertical: 20, borderTopLeftRadius: 38, borderTopRightRadius: 38 }, avatar: { width: 76, height: 76, alignItems: 'center', justifyContent: 'center', borderRadius: 38, overflow: 'visible' }, defaultAvatar: { backgroundColor: '#65B5F7' }, avatarImage: { width: 76, height: 76, borderRadius: 38 }, cameraBadge: { position: 'absolute', right: -2, bottom: 0, width: 25, height: 25, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#F8FCF8', borderRadius: 13, backgroundColor: palette.teal }, name: { color: palette.ink, fontSize: 15, fontWeight: '800', marginTop: 8 }, email: { color: palette.muted, fontSize: 10, marginTop: 3 }, changePicture: { color: '#1477F8', fontSize: 10, fontWeight: '700', marginTop: 8 }, form: { flex: 1, paddingHorizontal: 25, paddingTop: 12 }, sectionTitle: { color: palette.ink, fontSize: 14, fontWeight: '800', marginBottom: 12 }, field: { marginBottom: 10 }, label: { color: palette.ink, fontSize: 9, fontWeight: '700', marginBottom: 4 }, input: { height: 30, paddingHorizontal: 10, borderRadius: 7, backgroundColor: '#D8F2DC', color: palette.ink, fontSize: 10 }, settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }, settingText: { color: palette.ink, fontSize: 10 }, updateButton: { alignSelf: 'center', marginTop: 18, paddingHorizontal: 18, paddingVertical: 8, borderRadius: 15, backgroundColor: palette.teal }, updateText: { color: palette.ink, fontSize: 10, fontWeight: '800' } });
