import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette, styles as dashboardStyles } from '@/styles/index.styles';
import { NotificationsPanel } from '@/components/notifications-panel';

type Currency = 'USD' | 'RWF';

export default function IncomeScreen() {
  const { demoEmail, income: incomeParam, expenses: expensesParam, currency: currencyParam } = useLocalSearchParams<{
    demoEmail?: string;
    income?: string;
    expenses?: string;
    currency?: string;
  }>();
  const currency: Currency = currencyParam === 'RWF' ? 'RWF' : 'USD';
  const income = parseAmount(incomeParam);
  const expenses = parseAmount(expensesParam);
  const balance = Math.max(income - expenses, 0);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const goHome = () => router.replace({ pathname: '/', params: { demoEmail, income: String(income), expenses: String(expenses), currency } });
  const goAnalysis = () => router.push({ pathname: '/analysis/[period]', params: { period: 'monthly', income: String(income), expenses: String(expenses), currency, demoEmail } });
  const goTransactions = () => router.push({ pathname: '/transactions', params: { demoEmail, income: String(income), expenses: String(expenses), currency } });
  const goExpenses = () => router.push({ pathname: '/expenses', params: { demoEmail, income: String(income), expenses: String(expenses), currency } });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={goTransactions} style={styles.headerIcon} accessibilityLabel="Go back to transactions">
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Income</Text>
          <Pressable onPress={() => setNotificationsVisible(true)} style={dashboardStyles.notificationButton} accessibilityLabel="Open notifications">
            <Ionicons name="notifications-outline" size={19} color={palette.ink} />
          </Pressable>
        </View>
        <NotificationsPanel visible={notificationsVisible} onClose={() => setNotificationsVisible(false)} income={income} expenses={expenses} currency={currency} />

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceValue}>{formatAmount(balance, currency)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, styles.summaryCardActive]}>
            <Ionicons name="arrow-down-outline" size={18} color="#FFFFFF" />
            <Text style={styles.summaryLabelActive}>Income</Text>
            <Text style={styles.summaryValueActive}>{formatAmount(income, currency)}</Text>
          </View>
          <Pressable onPress={goExpenses} style={styles.summaryCard} accessibilityLabel="View expenses">
            <Ionicons name="arrow-up-outline" size={18} color="#1477F8" />
            <Text style={styles.summaryLabel}>Expense</Text>
            <Text style={styles.summaryValue}>{formatAmount(expenses, currency)}</Text>
          </Pressable>
        </View>

        <View style={styles.listPanel}>
          <Text style={styles.sectionTitle}>Income by month</Text>
          <Pressable style={styles.calendarButton} accessibilityLabel="Choose income date">
            <Ionicons name="calendar-outline" size={18} color={palette.ink} />
          </Pressable>
          {['April', 'March', 'February'].map((month, index) => (
            <View key={month} style={styles.historyRow}>
              <View style={styles.historyIcon}><Ionicons name="cash-outline" size={18} color="#FFFFFF" /></View>
              <View style={styles.historyCopy}><Text style={styles.month}>{month}</Text><Text style={styles.detail}>{index === 0 ? 'Salary received' : 'Income received'}</Text></View>
              <Text style={styles.historyAmount}>{formatAmount(income, currency)}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={dashboardStyles.bottomNav}>
        {['home-outline', 'search-outline', 'swap-horizontal-outline', 'layers-outline', 'person-outline'].map((icon, index) => (
          <Pressable key={icon} onPress={index === 0 ? goHome : index === 1 ? goAnalysis : index === 2 ? goTransactions : index === 3 ? () => router.push({ pathname: '/categories', params: { demoEmail, income: String(income), expenses: String(expenses), currency } }) : index === 4 ? () => router.push({ pathname: '/profile', params: { demoEmail, income: String(income), expenses: String(expenses), currency } }) : undefined} style={[dashboardStyles.navItem, index === 2 && dashboardStyles.navItemActive]} accessibilityLabel={index === 0 ? 'Home' : index === 1 ? 'Analysis' : index === 2 ? 'Transactions' : index === 3 ? 'Categories' : index === 4 ? 'Profile' : undefined}>
            <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={23} color={palette.ink} />
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

function parseAmount(value?: string) {
  const amount = Number.parseFloat(value ?? '0');
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
}

function formatAmount(amount: number, currency: Currency) {
  const formatted = amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return currency === 'RWF' ? `FRw ${formatted}` : `$${formatted}`;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ECF8ED' },
  content: { flexGrow: 1, paddingBottom: 22 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 9, paddingBottom: 19, backgroundColor: palette.teal },
  headerIcon: { width: 38, height: 38, alignItems: 'flex-start', justifyContent: 'center' },
  headerTitle: { color: palette.ink, fontSize: 14, fontWeight: '700' },
  balanceCard: { marginHorizontal: 18, marginTop: -2, paddingVertical: 14, borderRadius: 12, alignItems: 'center', backgroundColor: '#F8FCF8' },
  balanceLabel: { color: palette.muted, fontSize: 11, fontWeight: '700' },
  balanceValue: { color: palette.ink, fontSize: 22, fontWeight: '800', marginTop: 3 },
  summaryRow: { flexDirection: 'row', gap: 9, margin: 9 },
  summaryCard: { flex: 1, minHeight: 74, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5, borderRadius: 11, backgroundColor: '#F8FCF8' },
  summaryCardActive: { backgroundColor: '#1477F8' },
  summaryLabel: { color: palette.ink, fontSize: 9, fontWeight: '700', marginTop: 4, textAlign: 'center' },
  summaryLabelActive: { color: '#FFFFFF', fontSize: 9, fontWeight: '700', marginTop: 4 },
  summaryValue: { color: '#1477F8', fontSize: 13, fontWeight: '800', marginTop: 2 },
  summaryValueActive: { color: '#FFFFFF', fontSize: 13, fontWeight: '800', marginTop: 2 },
  listPanel: { position: 'relative', marginTop: 0, padding: 17, paddingTop: 18, borderTopLeftRadius: 38, borderTopRightRadius: 38, backgroundColor: '#F8FCF8' },
  sectionTitle: { color: palette.ink, fontSize: 15, fontWeight: '800', marginBottom: 10 },
  calendarButton: { position: 'absolute', top: 13, right: 16, width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: palette.teal },
  historyRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, borderTopWidth: 1, borderTopColor: '#DCEBE0' },
  historyIcon: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', marginRight: 12, borderRadius: 18, backgroundColor: '#65B5F7' },
  historyCopy: { flex: 1 },
  month: { color: palette.ink, fontSize: 14, fontWeight: '700' },
  detail: { color: '#1477F8', fontSize: 10, marginTop: 3 },
  historyAmount: { color: '#078C72', fontSize: 14, fontWeight: '800' },
});
