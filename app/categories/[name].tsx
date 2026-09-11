import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NotificationsPanel } from '@/components/notifications-panel';
import { useExpenses } from '@/lib/categoryStore';
import { styles as dashboardStyles, palette } from '@/styles/index.styles';

type Currency = 'USD' | 'RWF';
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function CategoryDetailScreen() {
    const params = useLocalSearchParams<{
        name?: string;
        demoEmail?: string;
        income?: string;
        expenses?: string;
        currency?: string;
        rate?: string;
    }>();
    const name = params.name ?? 'Category';
    const currency: Currency = params.currency === 'RWF' ? 'RWF' : 'USD';
    const income = parseAmount(params.income);
    const totalExpenses = parseAmount(params.expenses);
    const balance = Math.max(income - totalExpenses, 0);
    const expenseRate = income > 0 ? totalExpenses / income : 0;

    const [notificationsVisible, setNotificationsVisible] = useState(false);
    const allExpenses = useExpenses();

    const groups = useMemo(() => {
        const rows = allExpenses.filter((row) => row.category.toLowerCase() === name.toLowerCase());
        rows.sort((a, b) => (a.date < b.date ? 1 : -1));
        const byMonth = new Map<string, typeof rows>();
        rows.forEach((row) => {
            const month = monthNames[new Date(row.date).getMonth()];
            const list = byMonth.get(month) ?? [];
            list.push(row);
            byMonth.set(month, list);
        });
        return Array.from(byMonth.entries());
    }, [allExpenses, name]);

    const goBack = () => router.replace({ pathname: '/categories', params });
    const goAddExpense = () => router.push({ pathname: '/categories/[name]/add', params: { ...params, name } });

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Pressable onPress={goBack} style={styles.headerIcon} accessibilityLabel="Go back to categories">
                        <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
                    </Pressable>
                    <Text style={styles.headerTitle}>{name}</Text>
                    <Pressable onPress={() => setNotificationsVisible(true)} style={dashboardStyles.notificationButton} accessibilityLabel="Open notifications">
                        <Ionicons name="notifications-outline" size={19} color={palette.ink} />
                    </Pressable>
                    <NotificationsPanel visible={notificationsVisible} onClose={() => setNotificationsVisible(false)} income={income} expenses={totalExpenses} currency={currency} />
                </View>
                <View style={styles.summary}>
                    <View>
                        <Text style={styles.summaryLabel}>Total Balance</Text>
                        <Text style={styles.balance}>{formatAmount(balance, currency)}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View>
                        <Text style={styles.summaryLabel}>Total Expense</Text>
                        <Text style={styles.expense}>-{formatAmount(totalExpenses, currency)}</Text>
                    </View>
                </View>
                <View style={styles.budget}>
                    <Text style={styles.budgetValue}>{Math.round(expenseRate * 100)}%</Text>
                    <Text style={styles.budgetAmount}>{formatAmount(totalExpenses, currency)}</Text>
                </View>
                <Text style={styles.budgetMessage}>▣ {Math.round(expenseRate * 100)}% of your expenses, looks good.</Text>

                <View style={styles.panel}>
                    {groups.length === 0 ? (
                        <Text style={styles.emptyText}>No {name.toLowerCase()} expenses yet.</Text>
                    ) : (
                        groups.map(([month, rows]) => (
                            <View key={month} style={styles.monthGroup}>
                                <Text style={styles.monthLabel}>{month}</Text>
                                {rows.map((row) => (
                                    <View key={row.id} style={styles.row}>
                                        <View style={styles.rowIcon}>
                                            <Ionicons name="pricetag-outline" size={16} color="#FFFFFF" />
                                        </View>
                                        <View style={styles.rowCopy}>
                                            <Text style={styles.rowTitle}>{row.title}</Text>
                                            <Text style={styles.rowDate}>{formatDay(row.date)}</Text>
                                        </View>
                                        <Text style={styles.rowAmount}>-{formatAmount(row.amount, currency)}</Text>
                                    </View>
                                ))}
                            </View>
                        ))
                    )}
                    <Pressable style={styles.addButton} onPress={goAddExpense} accessibilityLabel="Add expenses">
                        <Text style={styles.addButtonText}>Add Expenses</Text>
                    </Pressable>
                </View>
            </ScrollView>

            <View style={dashboardStyles.bottomNav}>
                {['home-outline', 'search-outline', 'swap-horizontal-outline', 'layers-outline', 'person-outline'].map((icon, index) => (
                    <Pressable
                        key={icon}
                        onPress={
                            index === 0
                                ? () => router.replace({ pathname: '/', params })
                                : index === 1
                                    ? () => router.push({ pathname: '/analysis/[period]', params: { ...params, period: 'monthly' } })
                                    : index === 2
                                        ? () => router.push({ pathname: '/transactions', params })
                                        : index === 4
                                            ? () => router.push({ pathname: '/profile', params })
                                            : undefined
                        }
                        style={[dashboardStyles.navItem, index === 3 && dashboardStyles.navItemActive]}
                        accessibilityLabel={index === 3 ? 'Categories' : undefined}
                    >
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

function formatDay(dateStr: string) {
    const date = new Date(dateStr);
    return `${monthNames[date.getMonth()].slice(0, 3)} ${date.getDate()}`;
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: palette.teal },
    content: { flexGrow: 1, paddingBottom: 22 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 9, paddingBottom: 21, backgroundColor: palette.teal },
    headerIcon: { width: 38, height: 38, justifyContent: 'center' },
    headerTitle: { color: palette.ink, fontSize: 14, fontWeight: '700' },
    summary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 8, backgroundColor: palette.teal },
    summaryLabel: { color: palette.ink, fontSize: 9 },
    balance: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', marginTop: 2 },
    expense: { color: '#1477F8', fontSize: 16, fontWeight: '800', marginTop: 2 },
    divider: { width: 1, height: 31, backgroundColor: '#8CE2C3' },
    budget: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 18, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 5, backgroundColor: '#F8FCF8' },
    budgetValue: { color: palette.ink, fontSize: 9, fontWeight: '700' },
    budgetAmount: { color: palette.ink, fontSize: 9, fontWeight: '700' },
    budgetMessage: { color: palette.ink, fontSize: 9, paddingHorizontal: 24, paddingVertical: 8, backgroundColor: palette.teal },
    panel: { flex: 1, padding: 18, paddingTop: 17, borderTopLeftRadius: 38, borderTopRightRadius: 38, backgroundColor: '#F8FCF8' },
    emptyText: { color: palette.muted, fontSize: 12, textAlign: 'center', marginTop: 20 },
    monthGroup: { marginBottom: 14 },
    monthLabel: { color: palette.ink, fontSize: 11, fontWeight: '800', marginBottom: 8 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
    rowIcon: { width: 32, height: 32, borderRadius: 11, backgroundColor: '#65B5F7', alignItems: 'center', justifyContent: 'center' },
    rowCopy: { flex: 1 },
    rowTitle: { color: palette.ink, fontSize: 12, fontWeight: '700' },
    rowDate: { color: '#1477F8', fontSize: 9, marginTop: 2 },
    rowAmount: { color: '#1477F8', fontSize: 12, fontWeight: '800' },
    addButton: { marginTop: 8, height: 42, borderRadius: 21, backgroundColor: palette.teal, alignItems: 'center', justifyContent: 'center' },
    addButtonText: { color: palette.ink, fontSize: 13, fontWeight: '800' },
});