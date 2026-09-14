import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles as dashboardStyles, palette } from '@/styles/index.styles';

type Currency = 'USD' | 'RWF';

const transactionRows = [
  { icon: 'cash-outline', color: '#65B5F7', title: 'Salary', date: '18:27 - April 30', category: 'Monthly', type: 'income' as const },
  { icon: 'bag-handle-outline', color: '#3B9BFF', title: 'Groceries', date: '17:00 - April 24', category: 'Pantry', type: 'expense' as const },
  { icon: 'hand-left-outline', color: '#1477F8', title: 'Rent', date: '8:30 - April 15', category: 'Rent', type: 'expense' as const },
  { icon: 'car-outline', color: '#4F9FEE', title: 'Transport', date: '7:30 - April 08', category: 'Fuel', type: 'expense' as const },
  { icon: 'restaurant-outline', color: '#6BB7FF', title: 'Food', date: '19:30 - March 31', category: 'Dinner', type: 'expense' as const },
];

export default function TransactionsScreen() {
  const params = useLocalSearchParams<{
    demoEmail?: string;
    income?: string;
    expenses?: string;
    currency?: string;
  }>() ?? {};
  const { demoEmail, income: incomeParam, expenses: expensesParam, currency: currencyParam } = params;
  const currency: Currency = currencyParam === 'RWF' ? 'RWF' : 'USD';
  const income = incomeParam ?? '';
  const expenses = expensesParam ?? '';
  const incomeAmount = parseAmount(income);
  const expensesAmount = parseAmount(expenses);
  const balance = Math.max(incomeAmount - expensesAmount, 0);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const notifications = buildNotifications(incomeAmount, expensesAmount, currency);

  const goHome = () => router.replace({ pathname: '/', params: { demoEmail, income, expenses, currency } });
  const goAnalysis = () => router.push({ pathname: '/analysis/[period]', params: { period: 'monthly', income, expenses, currency, demoEmail } });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={goHome} style={styles.headerIcon} accessibilityLabel="Go back to home">
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Transaction</Text>
          <Pressable onPress={() => setNotificationsVisible(true)} style={dashboardStyles.notificationButton} accessibilityLabel="Open notifications">
            <Ionicons name="notifications-outline" size={19} color={palette.ink} />
          </Pressable>
        </View>

        <Modal visible={notificationsVisible} animationType="slide" transparent onRequestClose={() => setNotificationsVisible(false)}>
          <View style={dashboardStyles.notificationOverlay}>
            <View style={dashboardStyles.notificationSheet}>
              <View style={dashboardStyles.notificationHeader}>
                <View>
                  <Text style={dashboardStyles.notificationTitle}>Notifications</Text>
                  <Text style={dashboardStyles.notificationSubtitle}>Your financial pulse, in one place</Text>
                </View>
                <Pressable onPress={() => setNotificationsVisible(false)} accessibilityLabel="Close notifications" style={dashboardStyles.closeButton}>
                  <Ionicons name="close" size={21} color={palette.ink} />
                </Pressable>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                {notifications.map((notification) => (
                  <View key={notification.id} style={dashboardStyles.notificationItem}>
                    <View style={[dashboardStyles.notificationIcon, { backgroundColor: `${notification.color}20` }]}>
                      <Ionicons name={notification.icon} size={19} color={notification.color} />
                    </View>
                    <View style={dashboardStyles.notificationCopy}>
                      <Text style={dashboardStyles.notificationItemTitle}>{notification.title}</Text>
                      <Text style={dashboardStyles.notificationMessage}>{notification.message}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceValue}>{formatAmount(balance, currency)}</Text>
        </View>

        <View style={styles.editableRow}>
          <SummaryCard icon="arrow-down-outline" color="#078C72" label="Income" value={incomeAmount} currency={currency} onPress={() => router.push({ pathname: '/income', params: { demoEmail, income, expenses, currency } })} />
          <SummaryCard icon="arrow-up-outline" color="#1477F8" label="Expense" value={expensesAmount} currency={currency} onPress={() => router.push({ pathname: '/expenses', params: { demoEmail, income, expenses, currency } })} />
        </View>

        <View style={styles.listPanel}>
          <Text style={styles.monthLabel}>April</Text>
          <Pressable style={styles.calendarButton} accessibilityLabel="Choose transaction date">
            <Ionicons name="calendar-outline" size={18} color={palette.ink} />
          </Pressable>
          {transactionRows.slice(0, 4).map((row) => (
            <TransactionRow key={row.title} {...row} amount={row.type === 'income' ? incomeAmount : expensesAmount * (row.title === 'Rent' ? 0.568 : row.title === 'Transport' ? 0.041 : 0.1)} currency={currency} />
          ))}
          <Text style={styles.monthLabel}>March</Text>
          <TransactionRow {...transactionRows[4]} amount={expensesAmount * 0.04} currency={currency} />
        </View>
      </ScrollView>

      <View style={dashboardStyles.bottomNav}>
        {['home-outline', 'search-outline', 'swap-horizontal-outline', 'layers-outline', 'person-outline'].map((icon, index) => (
          <Pressable key={icon} onPress={index === 0 ? goHome : index === 1 ? goAnalysis : index === 3 ? () => router.push({ pathname: '/categories', params: { demoEmail, income, expenses, currency } }) : index === 4 ? () => router.push({ pathname: '/profile', params: { demoEmail, income, expenses, currency } }) : undefined} style={[dashboardStyles.navItem, index === 2 && dashboardStyles.navItemActive]} accessibilityLabel={index === 0 ? 'Home' : index === 1 ? 'Analysis' : index === 2 ? 'Transactions' : index === 3 ? 'Categories' : index === 4 ? 'Profile' : undefined}>
            <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={23} color={palette.ink} />
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

function SummaryCard({ icon, color, label, value, currency, onPress }: { icon: keyof typeof Ionicons.glyphMap; color: string; label: string; value: number; currency: Currency; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={styles.summaryCard} accessibilityLabel={onPress ? 'View income history' : undefined}>
      <View style={[styles.summaryIcon, { backgroundColor: `${color}18` }]}>
        <Ionicons name={icon} size={19} color={color} />
      </View>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryAmount}>{formatAmount(value, currency)}</Text>
    </Pressable>
  );
}

function TransactionRow({ icon, color, title, date, category, amount, currency, type }: { icon: string; color: string; title: string; date: string; category: string; amount: number; currency: Currency; type: 'income' | 'expense' }) {
  return (
    <View style={styles.transactionRow}>
      <View style={[styles.transactionIcon, { backgroundColor: color }]}><Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={19} color="#FFFFFF" /></View>
      <View style={styles.transactionName}><Text style={styles.transactionTitle}>{title}</Text><Text style={styles.transactionDate}>{date}</Text></View>
      <Text style={styles.category}>{category}</Text>
      <View style={styles.rule} />
      <Text style={[styles.transactionAmount, type === 'expense' && styles.expenseAmount]}>{type === 'expense' ? '-' : ''}{formatAmount(amount, currency)}</Text>
    </View>
  );
}

function parseAmount(value: string) {
  const amount = Number.parseFloat(value.replace(',', '.'));
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
}

function formatAmount(amount: number, currency: Currency) {
  const formatted = amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return currency === 'RWF' ? `FRw ${formatted}` : `$${formatted}`;
}

function buildNotifications(income: number, expenses: number, currency: Currency) {
  const expenseRate = income > 0 ? expenses / income : 0;
  const amount = (value: number) => formatAmount(value, currency);

  return [
    { id: 'income', title: 'Income received', message: income ? `Your planned monthly income is ${amount(income)}.` : 'Add your income to track money received.', icon: 'arrow-down-circle-outline' as const, color: '#078C72' },
    { id: 'expenses', title: 'Expenses recorded', message: expenses ? `${amount(expenses)} is recorded for this month.` : 'No expenses have been recorded yet.', icon: 'receipt-outline' as const, color: '#1477F8' },
    { id: 'budget', title: 'Budget warning', message: expenseRate > 0.8 ? 'You have used more than 80% of your monthly income.' : 'Your spending is within the current budget range.', icon: expenseRate > 0.8 ? 'warning-outline' as const : 'shield-checkmark-outline' as const, color: expenseRate > 0.8 ? '#B04B4B' : '#078C72' },
    { id: 'bills', title: 'Bill payment reminder', message: 'Review upcoming bills before their due dates.', icon: 'calendar-outline' as const, color: '#B57900' },
    { id: 'savings', title: 'Savings goal', message: income > expenses ? `You have ${amount(income - expenses)} available to put toward a savings goal.` : 'Reduce expenses to make room for your savings goal.', icon: 'star-outline' as const, color: '#8A5A00' },
    { id: 'summary', title: 'Monthly financial summary', message: `Balance: ${amount(Math.max(income - expenses, 0))}. Expenses use ${Math.round(expenseRate * 100)}% of income.`, icon: 'bar-chart-outline' as const, color: '#173B3D' },
  ];
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
  editableRow: { flexDirection: 'row', gap: 10, margin: 10 },
  summaryCard: { flex: 1, alignItems: 'center', minHeight: 104, paddingVertical: 12, paddingHorizontal: 6, borderWidth: 1, borderColor: '#D2E9D8', borderRadius: 14, backgroundColor: '#F8FCF8' },
  summaryIcon: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center', borderRadius: 17 },
  summaryLabel: { color: palette.ink, fontSize: 12, fontWeight: '700', marginTop: 5 },
  summaryAmount: { color: palette.ink, fontSize: 16, fontWeight: '800', marginTop: 6, textAlign: 'center' },
  listPanel: { position: 'relative', marginTop: 0, padding: 17, paddingTop: 15, borderTopLeftRadius: 38, borderTopRightRadius: 38, backgroundColor: '#F8FCF8' },
  monthLabel: { color: palette.ink, fontSize: 10, fontWeight: '700', marginBottom: 9 },
  calendarButton: { position: 'absolute', top: 13, right: 16, width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: palette.teal },
  transactionRow: { minHeight: 43, flexDirection: 'row', alignItems: 'center', marginBottom: 7 },
  transactionIcon: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center', marginRight: 8, borderRadius: 8 },
  transactionName: { width: 78 },
  transactionTitle: { color: palette.ink, fontSize: 9, fontWeight: '700' },
  transactionDate: { color: '#1477F8', fontSize: 7, fontWeight: '700', marginTop: 2 },
  category: { width: 42, color: palette.muted, fontSize: 7 },
  rule: { width: 1, height: 24, marginRight: 8, backgroundColor: '#82D9B1' },
  transactionAmount: { flex: 1, color: palette.ink, fontSize: 9, fontWeight: '700', textAlign: 'right' },
  expenseAmount: { color: '#1477F8' },
});
