import { Ionicons } from '@expo/vector-icons';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NotificationsPanel } from '@/components/notifications-panel';
import { styles as dashboardStyles } from '@/styles/index.styles';

const palette = { ink: '#173B3D', teal: '#08C7A1', muted: '#668381', background: '#ECF8ED' };
const periods = ['daily', 'weekly', 'monthly', 'yearly'] as const;
type Period = (typeof periods)[number];
type Currency = 'USD' | 'RWF';
const fallbackUsdToRwf = 1400;

// My Targets — savings goals shown as percentage rings on filled cards.
const targets: { label: string; percent: number }[] = [
  { label: 'Travel', percent: 30 },
  { label: 'Car', percent: 50 },
];

const periodData: Record<Period, { income: string; expense: string; caption: string; labels: string[]; values: number[] }> = {
  daily: { income: '$4,120.00', expense: '$1,187.40', caption: 'Today', labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], values: [42, 65, 38, 58, 76, 48, 69] },
  weekly: { income: '$11,420.00', expense: '$20,000.00', caption: 'This week', labels: ['1st Week', '2nd Week', '3rd Week', '4th Week'], values: [52, 35, 68, 48] },
  monthly: { income: '$47,200.00', expense: '$35,510.20', caption: 'This month', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], values: [42, 73, 54, 85, 62, 49] },
  yearly: { income: '$430,560.00', expense: '$320,300.00', caption: 'This year', labels: ['2019', '2020', '2021', '2022', '2023'], values: [58, 87, 66, 91, 72] },
};

export default function AnalysisScreen() {
  const { period, income: incomeParam, expenses: expensesParam, currency: currencyParam, rate: rateParam, demoEmail } = useLocalSearchParams<{
    period?: string;
    income?: string;
    expenses?: string;
    currency?: string;
    rate?: string;
    demoEmail?: string;
  }>();
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const today = new Date();
  const todayKey = formatDateKey(today);
  const selectedDate = todayKey;

  if (!periods.includes(period as Period)) return <Redirect href="/" />;

  const selectedPeriod = period as Period;
  const data = periodData[selectedPeriod];
  const monthlyIncome = parseAmount(incomeParam);
  const monthlyExpenses = parseAmount(expensesParam);
  const currency: Currency = currencyParam === 'RWF' ? 'RWF' : 'USD';
  const rate = parseAmount(rateParam) || fallbackUsdToRwf;
  const multiplier = {
    daily: 1 / 30,
    weekly: 1 / 4.345,
    monthly: 1,
    yearly: 12,
  }[selectedPeriod];
  const selectedIncome = monthlyIncome * multiplier;
  const selectedExpenses = monthlyExpenses * multiplier;
  const balance = Math.max(selectedIncome - selectedExpenses, 0);
  const advice = getAnalysisAdvice(selectedIncome, selectedExpenses, currency, rate);
  const spendPercent = selectedIncome > 0 ? Math.min(100, Math.round((selectedExpenses / selectedIncome) * 100)) : 0;
  const spendInsight = !selectedIncome
    ? 'Add your income on Home to see insights.'
    : spendPercent <= 50
      ? `${spendPercent}% of your expenses, looks good.`
      : spendPercent <= 80
        ? `${spendPercent}% of your expenses, keep an eye on it.`
        : `${spendPercent}% of your expenses, spending is high.`;
  const chartPoints = data.labels.map((label, index) => ({ label, value: data.values[index] }));
  const goSearch = () => router.push({ pathname: '/analysis/search', params: { period: selectedPeriod, income: String(monthlyIncome), expenses: String(monthlyExpenses), currency, rate: String(rate), demoEmail } });
  const goCalendar = () => router.push({ pathname: '/analysis/calendar', params: { period: selectedPeriod, income: String(monthlyIncome), expenses: String(monthlyExpenses), currency, rate: String(rate), demoEmail } });
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.replace({ pathname: '/', params: { demoEmail, income: String(monthlyIncome), expenses: String(monthlyExpenses), currency } })} style={styles.backButton} accessibilityLabel="Go back to home screen">
            <Ionicons name="arrow-back" size={21} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Analysis</Text>
          <Pressable onPress={() => setNotificationsVisible(true)} style={styles.headerIconButton} accessibilityLabel="Open notifications">
            <Ionicons name="notifications-outline" size={18} color={palette.ink} />
          </Pressable>
        </View>
        <NotificationsPanel visible={notificationsVisible} onClose={() => setNotificationsVisible(false)} income={selectedIncome} expenses={selectedExpenses} currency={currency} />
        <View style={styles.summaryRow}>
          <View><Text style={styles.summaryLabel}>Total Balance</Text><Text style={styles.balance}>{formatAmount(balance, currency, rate)}</Text></View>
          <View style={styles.divider} />
          <View><Text style={styles.summaryLabel}>Total Expense</Text><Text style={styles.expense}>{formatNegativeAmount(selectedExpenses, currency, rate)}</Text></View>
        </View>
        <View style={styles.insightSection}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.max(spendPercent, 18)}%` }]}>
              <Text style={styles.progressFillText}>{spendPercent}%</Text>
            </View>
            {spendPercent < 78 && (
              <Text style={styles.progressTrackText}>of {formatAmount(selectedIncome, currency, rate)}</Text>
            )}
          </View>
          <View style={styles.insightRow}>
            <Ionicons name={advice.icon} size={12} color={palette.ink} />
            <Text style={styles.insightText}>{spendInsight}</Text>
          </View>
        </View>
        <View style={styles.periodSwitcher}>
          {periods.map((item) => {
            const label = item[0].toUpperCase() + item.slice(1);
            return <Pressable key={item} onPress={() => router.replace({ pathname: '/analysis/[period]', params: { period: item, income: String(monthlyIncome), expenses: String(monthlyExpenses), currency, rate: String(rate), demoEmail } })} style={[styles.period, item === selectedPeriod && styles.periodActive]}><Text style={[styles.periodText, item === selectedPeriod && styles.periodTextActive]}>{label}</Text></Pressable>;
          })}
        </View>
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Income &amp; Expenses</Text>
            <View style={styles.chartActions}>
              <Pressable
                onPress={goSearch}
                accessibilityLabel="Search analysis"
                style={actionStyles.chartActionButton}
              >
                <Ionicons name="search-outline" size={14} color="#FFFFFF" />
              </Pressable>
              <Pressable
                onPress={goCalendar}
                accessibilityLabel="Choose analysis date"
                style={actionStyles.chartActionButtonAlt}
              >
                <Ionicons name="calendar-outline" size={14} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>
          <View style={styles.chart}>
            <View style={styles.gridLine} /><View style={[styles.gridLine, styles.gridLineMiddle]} /><View style={[styles.gridLine, styles.gridLineBottom]} />
            <View style={styles.bars}>{chartPoints.map(({ label, value }) => <View key={label} style={styles.barGroup}><View style={[styles.barIncome, { height: `${value}%` }]} /><View style={[styles.barExpense, { height: `${Math.max(24, value - 17)}%` }]} /></View>)}</View>
          </View>
          <View style={styles.labels}>{chartPoints.map(({ label }) => <Text key={label} style={styles.label}>{label}</Text>)}</View>
        </View>
        <View style={adviceStyles.card}>
          <Ionicons name={advice.icon} size={22} color={advice.color} />
          <View style={adviceStyles.copy}>
            <Text style={[adviceStyles.title, { color: advice.color }]}>{advice.title}</Text>
            <Text style={adviceStyles.message}>{advice.message}</Text>
          </View>
        </View>
        <Text style={styles.caption}>{data.caption} · {selectedDate}</Text>
        <View style={styles.totals}>
          <View style={styles.totalColumn}>
            <View style={styles.totalIconBadge}><Ionicons name="arrow-up-outline" size={16} color={palette.teal} /></View>
            <Text style={styles.totalLabel}>Income</Text>
            <Text style={styles.totalValue}>{formatAmount(selectedIncome, currency, rate)}</Text>
          </View>
          <View style={styles.totalColumn}>
            <View style={styles.totalIconBadgeBlue}><Ionicons name="arrow-down-outline" size={16} color="#1477F8" /></View>
            <Text style={styles.totalLabel}>Expense</Text>
            <Text style={styles.totalValueBlue}>{formatAmount(selectedExpenses, currency, rate)}</Text>
          </View>
        </View>
        <View style={styles.targetsSection}>
          <Text style={styles.targetsTitle}>My Targets</Text>
          <View style={styles.targetsRow}>
            {targets.map((target) => (
              <TargetCard key={target.label} percent={target.percent} label={target.label} />
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={dashboardStyles.bottomNav}>
        {['home-outline', 'search-outline', 'swap-horizontal-outline', 'layers-outline', 'person-outline'].map((icon, index) => (
          <Pressable
            key={icon}
            onPress={index === 0 ? () => router.replace({ pathname: '/', params: { demoEmail, income: String(monthlyIncome), expenses: String(monthlyExpenses), currency } }) : index === 2 ? () => router.push({ pathname: '/transactions', params: { demoEmail, income: String(monthlyIncome), expenses: String(monthlyExpenses), currency } }) : index === 3 ? () => router.push({ pathname: '/categories', params: { demoEmail, income: String(monthlyIncome), expenses: String(monthlyExpenses), currency } }) : index === 4 ? () => router.push({ pathname: '/profile', params: { demoEmail, income: String(monthlyIncome), expenses: String(monthlyExpenses), currency } }) : undefined}
            style={[dashboardStyles.navItem, index === 1 && dashboardStyles.navItemActive]}
            accessibilityLabel={index === 0 ? 'Home' : index === 1 ? 'Analysis' : undefined}
          >
            <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={23} color={palette.ink} />
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

// Circular percentage ring on a filled card — built from two overlapping
// half-circle borders (the standard trick for a progress ring without a
// chart library), matching the "My Targets" mockup.
function TargetCard({ percent, label }: { percent: number; label: string }) {
  const size = 72;
  const thickness = 6;
  const clamped = Math.max(0, Math.min(100, percent));
  const rotation = (clamped / 100) * 360;
  const firstHalf = Math.min(rotation, 180);
  const secondHalf = Math.max(rotation - 180, 0);

  return (
    <View style={targetStyles.card}>
      <View style={[targetStyles.ring, { width: size, height: size, borderRadius: size / 2 }]}>
        <View
          style={[
            targetStyles.track,
            { width: size, height: size, borderRadius: size / 2, borderWidth: thickness, borderColor: 'rgba(255,255,255,0.5)' },
          ]}
        />
        <View style={[targetStyles.halfClip, { width: size / 2, height: size, right: 0 }]}>
          <View
            style={[
              targetStyles.halfCircle,
              {
                left: -size / 2,
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: thickness,
                borderColor: '#0D3FA6',
                borderLeftColor: 'transparent',
                borderBottomColor: 'transparent',
                transform: [{ rotate: `${firstHalf}deg` }],
              },
            ]}
          />
        </View>
        {secondHalf > 0 && (
          <View style={[targetStyles.halfClip, { width: size / 2, height: size, left: 0 }]}>
            <View
              style={[
                targetStyles.halfCircle,
                {
                  left: 0,
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  borderWidth: thickness,
                  borderColor: '#0D3FA6',
                  borderRightColor: 'transparent',
                  borderTopColor: 'transparent',
                  transform: [{ rotate: `${secondHalf}deg` }],
                },
              ]}
            />
          </View>
        )}
        <Text style={targetStyles.percentText}>{clamped}%</Text>
      </View>
      <Text style={targetStyles.label}>{label}</Text>
    </View>
  );
}

const targetStyles = StyleSheet.create({
  card: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#6DB6FE', borderRadius: 22, paddingVertical: 18, gap: 10 },
  ring: { alignItems: 'center', justifyContent: 'center' },
  track: { position: 'absolute' },
  halfClip: { position: 'absolute', overflow: 'hidden' },
  halfCircle: { position: 'absolute' },
  percentText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  label: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
});

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background }, content: { flexGrow: 1, paddingBottom: 30 }, header: { backgroundColor: palette.teal, paddingHorizontal: 18, paddingTop: 8, paddingBottom: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, backButton: { width: 34, height: 34, justifyContent: 'center' }, headerTitle: { color: palette.ink, fontSize: 14, fontWeight: '700' }, headerSpacer: { width: 34 }, summaryRow: { backgroundColor: palette.teal, paddingHorizontal: 24, paddingBottom: 22, flexDirection: 'row', alignItems: 'center', gap: 18 }, summaryLabel: { color: palette.ink, fontSize: 8 }, balance: { color: '#FFFFFF', fontSize: 15, fontWeight: '800', marginTop: 3 }, expense: { color: '#1477F8', fontSize: 15, fontWeight: '800', marginTop: 3 }, divider: { height: 31, width: 1, backgroundColor: '#8CE2C3' }, periodSwitcher: { margin: 18, padding: 3, borderRadius: 18, backgroundColor: '#D8F2DC', flexDirection: 'row' }, period: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 15 }, periodActive: { backgroundColor: palette.teal }, periodText: { color: palette.ink, fontSize: 10 }, periodTextActive: { fontWeight: '800' }, chartCard: { marginHorizontal: 12, padding: 16, borderRadius: 24, backgroundColor: '#D8F2DC' }, chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, chartTitle: { color: palette.ink, fontSize: 11, fontWeight: '600' }, chartActions: { flexDirection: 'row', gap: 9 }, chart: { height: 148, marginTop: 13, position: 'relative' }, gridLine: { position: 'absolute', left: 0, right: 0, top: 20, borderTopWidth: 1, borderColor: '#B6DCCA', borderStyle: 'dashed' }, gridLineMiddle: { top: 74 }, gridLineBottom: { top: 128 }, bars: { height: 132, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', paddingHorizontal: 8 }, barGroup: { height: '100%', flexDirection: 'row', alignItems: 'flex-end', gap: 3 }, barIncome: { width: 5, minHeight: 12, backgroundColor: palette.teal, borderRadius: 3 }, barExpense: { width: 5, minHeight: 12, backgroundColor: '#1477F8', borderRadius: 3 }, labels: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 4 }, label: { color: palette.muted, fontSize: 8 }, caption: { textAlign: 'center', color: palette.muted, fontSize: 10, marginTop: 12 }, totals: { marginTop: 18, flexDirection: 'row', justifyContent: 'space-evenly', textAlign: 'center' }, totalLabel: { color: palette.muted, fontSize: 10, marginTop: 3, textAlign: 'center' }, totalValue: { color: palette.ink, fontSize: 13, fontWeight: '800', marginTop: 3 }, totalValueBlue: { color: '#1477F8', fontSize: 13, fontWeight: '800', marginTop: 3 },
  headerIconButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  insightSection: { backgroundColor: palette.teal, paddingHorizontal: 24, paddingBottom: 20 },
  progressTrack: { height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.9)', flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
  progressFill: { height: 28, minWidth: 54, borderRadius: 14, backgroundColor: palette.ink, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  progressFillText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  progressTrackText: { position: 'absolute', right: 14, color: palette.ink, fontSize: 9, fontWeight: '700' },
  insightRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  insightText: { color: palette.ink, fontSize: 9, fontWeight: '600' },
  totalColumn: { alignItems: 'center' },
  totalIconBadge: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#D8F2DC', alignItems: 'center', justifyContent: 'center' },
  totalIconBadgeBlue: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#E4EEFE', alignItems: 'center', justifyContent: 'center' },
  targetsSection: { marginTop: 22, paddingHorizontal: 16, paddingBottom: 4 },
  targetsTitle: { color: palette.ink, fontSize: 13, fontWeight: '800', marginBottom: 12, marginLeft: 4 },
  targetsRow: { flexDirection: 'row', gap: 14 },
});

const adviceStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 12,
    marginTop: 16,
    padding: 15,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },
  copy: {
    flex: 1,
    marginLeft: 11,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  message: {
    color: palette.muted,
    fontSize: 11,
    lineHeight: 17,
  },
});

const actionStyles = StyleSheet.create({
  chartActionButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: palette.teal,
  },
  chartActionButtonAlt: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: palette.teal,
  },
});

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseAmount(value?: string) {
  const amount = Number.parseFloat(value ?? '0');
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
}

function getAnalysisAdvice(income: number, expenses: number, currency: Currency, rate: number) {
  if (!income) {
    return {
      icon: 'information-circle-outline' as const,
      color: palette.muted,
      title: 'Add your income',
      message: 'Enter your income on Home to receive a saving recommendation.',
    };
  }

  const expenseRate = expenses / income;
  const savings = Math.max(income - expenses, 0);
  const savingsAmount = formatAmount(savings, currency, rate);

  if (expenseRate <= 0.5) {
    return {
      icon: 'checkmark-circle-outline' as const,
      color: '#078C72',
      title: 'Strong saving position',
      message: `You are keeping ${savingsAmount} available in this period. Consider putting part of it toward your savings goal.`,
    };
  }

  if (expenseRate <= 0.8) {
    return {
      icon: 'alert-circle-outline' as const,
      color: '#B57900',
      title: 'Room to save more',
      message: `You are using ${Math.round(expenseRate * 100)}% of your income. Set aside a small amount first, then plan the rest of your spending.`,
    };
  }

  return {
    icon: 'warning-outline' as const,
    color: '#B04B4B',
    title: 'Protect your savings',
    message: `Expenses use ${Math.round(expenseRate * 100)}% of your income. Review non-essential spending before adding to your savings goal.`,
  };
}

function formatAmount(amount: number, currency: Currency, rate: number) {
  const convertedAmount = currency === 'RWF' ? amount * rate : amount;
  const formatted = convertedAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return currency === 'RWF' ? `FRw ${formatted}` : `$${formatted}`;
}

function formatNegativeAmount(amount: number, currency: Currency, rate: number) {
  return `-${formatAmount(amount, currency, rate).replace('$', '').replace('FRw ', '')}`;
}