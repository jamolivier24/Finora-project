import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette, styles as dashboardStyles } from '@/styles/index.styles';
import { NotificationsPanel } from '@/components/notifications-panel';
import { useState } from 'react';

type Currency = 'USD' | 'RWF';

const expenseRows = [
  { title: 'Groceries', category: 'Pantry', date: '17:00 - April 24', amount: 0.1, icon: 'bag-handle-outline' as const, color: '#3B9BFF' },
  { title: 'Rent', category: 'Rent', date: '8:30 - April 15', amount: 0.568, icon: 'hand-left-outline' as const, color: '#1477F8' },
  { title: 'Transport', category: 'Fuel', date: '7:30 - April 08', amount: 0.041, icon: 'car-outline' as const, color: '#4F9FEE' },
  { title: 'Food', category: 'Dinner', date: '19:30 - March 31', amount: 0.04, icon: 'restaurant-outline' as const, color: '#6BB7FF' },
];

export default function ExpensesScreen() {
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
  const goIncome = () => router.push({ pathname: '/income', params: { demoEmail, income: String(income), expenses: String(expenses), currency } });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={goTransactions} style={styles.headerIcon} accessibilityLabel="Go back to transactions"><Ionicons name="arrow-back" size={20} color="#FFFFFF" /></Pressable>
          <Text style={styles.headerTitle}>Expense</Text>
          <Pressable onPress={() => setNotificationsVisible(true)} style={dashboardStyles.notificationButton} accessibilityLabel="Open notifications"><Ionicons name="notifications-outline" size={19} color={palette.ink} /></Pressable>
        </View>
        <NotificationsPanel visible={notificationsVisible} onClose={() => setNotificationsVisible(false)} income={income} expenses={expenses} currency={currency} />

        <View style={styles.balanceCard}><Text style={styles.balanceLabel}>Total Balance</Text><Text style={styles.balanceValue}>{formatAmount(balance, currency)}</Text></View>
        <View style={styles.summaryRow}>
          <Pressable onPress={goIncome} style={styles.summaryCard} accessibilityLabel="View income"><Ionicons name="arrow-down-outline" size={18} color="#078C72" /><Text style={styles.summaryLabel}>Income</Text><Text style={styles.summaryValue}>{formatAmount(income, currency)}</Text></Pressable>
          <View style={[styles.summaryCard, styles.summaryCardActive]}><Ionicons name="arrow-up-outline" size={18} color="#FFFFFF" /><Text style={styles.summaryLabelActive}>Expense</Text><Text style={styles.summaryValueActive}>{formatAmount(expenses, currency)}</Text></View>
        </View>

        <View style={styles.listPanel}>
          <Text style={styles.sectionTitle}>Expenses by month</Text>
          <Pressable style={styles.calendarButton} accessibilityLabel="Choose expense date"><Ionicons name="calendar-outline" size={18} color={palette.ink} /></Pressable>
          <Text style={styles.monthLabel}>April</Text>
          {expenseRows.slice(0, 3).map((row) => <ExpenseRow key={row.title} {...row} total={expenses} currency={currency} />)}
          <Text style={styles.monthLabel}>March</Text>
          <ExpenseRow {...expenseRows[3]} total={expenses} currency={currency} />
        </View>
      </ScrollView>

      <View style={dashboardStyles.bottomNav}>
        {['home-outline', 'search-outline', 'swap-horizontal-outline', 'layers-outline', 'person-outline'].map((icon, index) => (
          <Pressable key={icon} onPress={index === 0 ? goHome : index === 1 ? goAnalysis : index === 2 ? goTransactions : index === 3 ? () => router.push({ pathname: '/categories', params: { demoEmail, income: String(income), expenses: String(expenses), currency } }) : index === 4 ? () => router.push({ pathname: '/profile', params: { demoEmail, income: String(income), expenses: String(expenses), currency } }) : undefined} style={[dashboardStyles.navItem, index === 2 && dashboardStyles.navItemActive]} accessibilityLabel={index === 0 ? 'Home' : index === 1 ? 'Analysis' : index === 2 ? 'Transactions' : index === 3 ? 'Categories' : index === 4 ? 'Profile' : undefined}><Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={23} color={palette.ink} /></Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

function ExpenseRow({ title, category, date, amount, icon, color, total, currency }: { title: string; category: string; date: string; amount: number; icon: keyof typeof Ionicons.glyphMap; color: string; total: number; currency: Currency }) {
  return <View style={styles.expenseRow}><View style={[styles.expenseIcon, { backgroundColor: color }]}><Ionicons name={icon} size={18} color="#FFFFFF" /></View><View style={styles.expenseCopy}><Text style={styles.expenseTitle}>{title}</Text><Text style={styles.expenseDate}>{date}</Text></View><Text style={styles.category}>{category}</Text><View style={styles.rule} /><Text style={styles.expenseAmount}>-{formatAmount(total * amount, currency)}</Text></View>;
}

function parseAmount(value?: string) { const amount = Number.parseFloat(value ?? '0'); return Number.isFinite(amount) && amount > 0 ? amount : 0; }
function formatAmount(amount: number, currency: Currency) { const formatted = amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); return currency === 'RWF' ? `FRw ${formatted}` : `$${formatted}`; }

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ECF8ED' }, content: { flexGrow: 1, paddingBottom: 22 }, header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 9, paddingBottom: 19, backgroundColor: palette.teal }, headerIcon: { width: 38, height: 38, alignItems: 'flex-start', justifyContent: 'center' }, headerTitle: { color: palette.ink, fontSize: 14, fontWeight: '700' }, balanceCard: { marginHorizontal: 18, marginTop: -2, paddingVertical: 14, borderRadius: 12, alignItems: 'center', backgroundColor: '#F8FCF8' }, balanceLabel: { color: palette.muted, fontSize: 11, fontWeight: '700' }, balanceValue: { color: palette.ink, fontSize: 22, fontWeight: '800', marginTop: 3 }, summaryRow: { flexDirection: 'row', gap: 9, margin: 9 }, summaryCard: { flex: 1, minHeight: 74, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5, borderRadius: 11, backgroundColor: '#F8FCF8' }, summaryCardActive: { backgroundColor: '#1477F8' }, summaryLabel: { color: palette.ink, fontSize: 9, fontWeight: '700', marginTop: 4 }, summaryLabelActive: { color: '#FFFFFF', fontSize: 9, fontWeight: '700', marginTop: 4 }, summaryValue: { color: '#078C72', fontSize: 13, fontWeight: '800', marginTop: 2 }, summaryValueActive: { color: '#FFFFFF', fontSize: 13, fontWeight: '800', marginTop: 2 }, listPanel: { position: 'relative', marginTop: 0, padding: 17, paddingTop: 18, borderTopLeftRadius: 38, borderTopRightRadius: 38, backgroundColor: '#F8FCF8' }, sectionTitle: { color: palette.ink, fontSize: 15, fontWeight: '800', marginBottom: 10 }, monthLabel: { color: palette.ink, fontSize: 11, fontWeight: '700', marginTop: 8, marginBottom: 8 }, calendarButton: { position: 'absolute', top: 13, right: 16, width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: palette.teal }, expenseRow: { minHeight: 43, flexDirection: 'row', alignItems: 'center', marginBottom: 7 }, expenseIcon: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center', marginRight: 8, borderRadius: 8 }, expenseCopy: { width: 78 }, expenseTitle: { color: palette.ink, fontSize: 9, fontWeight: '700' }, expenseDate: { color: '#1477F8', fontSize: 7, fontWeight: '700', marginTop: 2 }, category: { width: 42, color: palette.muted, fontSize: 7 }, rule: { width: 1, height: 24, marginRight: 8, backgroundColor: '#82D9B1' }, expenseAmount: { flex: 1, color: '#1477F8', fontSize: 9, fontWeight: '700', textAlign: 'right' },
});
