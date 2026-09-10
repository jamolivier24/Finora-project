import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NotificationsPanel } from '@/components/notifications-panel';
import { styles as dashboardStyles, palette } from '@/styles/index.styles';

type Currency = 'USD' | 'RWF';
type ReportType = 'income' | 'expense';

const categoryOptions = ['Groceries', 'Rent', 'Transport', 'Food', 'Salary', 'Entertainment', 'Health'];

// Demo rows — same shape as the Transactions screen so results feel consistent.
const rows = [
    { icon: 'cash-outline' as const, color: '#65B5F7', title: 'Salary', date: '18:27 - April 30', category: 'Salary', type: 'income' as const, amount: 4120 },
    { icon: 'bag-handle-outline' as const, color: '#3B9BFF', title: 'Groceries', date: '17:00 - April 24', category: 'Groceries', type: 'expense' as const, amount: 118.6 },
    { icon: 'hand-left-outline' as const, color: '#1477F8', title: 'Rent', date: '8:30 - April 15', category: 'Rent', type: 'expense' as const, amount: 674.4 },
    { icon: 'car-outline' as const, color: '#4F9FEE', title: 'Transport', date: '7:30 - April 08', category: 'Transport', type: 'expense' as const, amount: 48.7 },
    { icon: 'restaurant-outline' as const, color: '#6BB7FF', title: 'Dinner', date: '18:47 - April 30', category: 'Food', type: 'expense' as const, amount: 35.0 },
];

export default function SearchScreen() {
    const params = useLocalSearchParams<{
        demoEmail?: string;
        income?: string;
        expenses?: string;
        currency?: string;
        rate?: string;
        period?: string;
    }>();
    const currency: Currency = params.currency === 'RWF' ? 'RWF' : 'USD';

    const [notificationsVisible, setNotificationsVisible] = useState(false);
    const [query, setQuery] = useState('');
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [category, setCategory] = useState<string | null>(null);
    const [dateOpen, setDateOpen] = useState(false);
    const [date, setDate] = useState<Date | null>(null);
    const [report, setReport] = useState<ReportType>('expense');
    const [hasSearched, setHasSearched] = useState(false);

    const results = useMemo(() => {
        return rows.filter((row) => {
            if (row.type !== report) return false;
            if (category && row.category !== category) return false;
            if (query && !row.title.toLowerCase().includes(query.toLowerCase())) return false;
            if (date && !row.date.toLowerCase().includes(String(date.getDate()))) return false;
            return true;
        });
    }, [category, date, query, report]);

    const goBack = () =>
        router.replace({ pathname: '/analysis/[period]', params: { ...params, period: params.period ?? 'monthly' } });

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Pressable onPress={goBack} style={styles.headerIcon} accessibilityLabel="Go back to analysis">
                        <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
                    </Pressable>
                    <Text style={styles.headerTitle}>Search</Text>
                    <Pressable onPress={() => setNotificationsVisible(true)} style={styles.headerIconButton} accessibilityLabel="Open notifications">
                        <Ionicons name="notifications-outline" size={18} color={palette.ink} />
                    </Pressable>
                </View>
                <NotificationsPanel visible={notificationsVisible} onClose={() => setNotificationsVisible(false)} income={parseAmount(params.income)} expenses={parseAmount(params.expenses)} currency={currency} />

                <View style={styles.searchBarWrap}>
                    <Ionicons name="search-outline" size={15} color={palette.muted} style={styles.searchIcon} />
                    <TextInput
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Search..."
                        placeholderTextColor={palette.muted}
                        style={styles.searchBar}
                    />
                </View>

                <View style={styles.card}>
                    <Text style={styles.fieldLabel}>Categories</Text>
                    <Pressable
                        style={styles.selectField}
                        onPress={() => {
                            setCategoryOpen((open) => !open);
                            setDateOpen(false);
                        }}
                        accessibilityLabel="Select category"
                    >
                        <Text style={category ? styles.selectValue : styles.selectPlaceholder}>{category ?? 'Select the category'}</Text>
                        <Ionicons name={categoryOpen ? 'chevron-up' : 'chevron-down'} size={16} color={palette.muted} />
                    </Pressable>
                    {categoryOpen && (
                        <View style={styles.dropdown}>
                            <Pressable
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setCategory(null);
                                    setCategoryOpen(false);
                                }}
                            >
                                <Text style={styles.dropdownItemText}>All categories</Text>
                            </Pressable>
                            {categoryOptions.map((option) => (
                                <Pressable
                                    key={option}
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        setCategory(option);
                                        setCategoryOpen(false);
                                    }}
                                >
                                    <Text style={styles.dropdownItemText}>{option}</Text>
                                </Pressable>
                            ))}
                        </View>
                    )}

                    <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Date</Text>
                    <Pressable
                        style={styles.selectField}
                        onPress={() => {
                            setDateOpen((open) => !open);
                            setCategoryOpen(false);
                        }}
                        accessibilityLabel="Choose date"
                    >
                        <Text style={date ? styles.selectValue : styles.selectPlaceholder}>{date ? formatDate(date) : 'DD/MMM/YYYY'}</Text>
                        <View style={styles.calendarBadge}>
                            <Ionicons name="calendar-outline" size={13} color="#FFFFFF" />
                        </View>
                    </Pressable>
                    {dateOpen && (
                        <MiniCalendar
                            selected={date}
                            onSelect={(picked) => {
                                setDate(picked);
                                setDateOpen(false);
                            }}
                        />
                    )}

                    <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Report</Text>
                    <View style={styles.reportRow}>
                        <Pressable style={styles.reportOption} onPress={() => setReport('income')} accessibilityLabel="Filter by income">
                            <View style={[styles.radio, report === 'income' && styles.radioActive]}>{report === 'income' && <View style={styles.radioDot} />}</View>
                            <Text style={styles.reportLabel}>Income</Text>
                        </Pressable>
                        <Pressable style={styles.reportOption} onPress={() => setReport('expense')} accessibilityLabel="Filter by expense">
                            <View style={[styles.radio, report === 'expense' && styles.radioActive]}>{report === 'expense' && <View style={styles.radioDot} />}</View>
                            <Text style={styles.reportLabel}>Expense</Text>
                        </Pressable>
                    </View>

                    <Pressable style={styles.searchButton} onPress={() => setHasSearched(true)} accessibilityLabel="Run search">
                        <Text style={styles.searchButtonText}>Search</Text>
                    </Pressable>

                    {hasSearched && (
                        <View style={styles.results}>
                            {results.length === 0 ? (
                                <Text style={styles.emptyText}>No matching transactions.</Text>
                            ) : (
                                results.map((row) => (
                                    <View key={row.title} style={styles.resultRow}>
                                        <View style={[styles.resultIcon, { backgroundColor: row.color }]}>
                                            <Ionicons name={row.icon} size={17} color="#FFFFFF" />
                                        </View>
                                        <View style={styles.resultCopy}>
                                            <Text style={styles.resultTitle}>{row.title}</Text>
                                            <Text style={styles.resultDate}>{row.date}</Text>
                                        </View>
                                        <Text style={[styles.resultAmount, row.type === 'expense' && styles.resultAmountExpense]}>
                                            {row.type === 'expense' ? '-' : ''}
                                            {formatAmount(row.amount, currency, parseAmount(params.rate))}
                                        </Text>
                                    </View>
                                ))
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>

            <View style={dashboardStyles.bottomNav}>
                {['home-outline', 'search-outline', 'swap-horizontal-outline', 'layers-outline', 'person-outline'].map((icon, index) => (
                    <Pressable
                        key={icon}
                        onPress={
                            index === 0
                                ? () => router.replace({ pathname: '/', params })
                                : index === 2
                                    ? () => router.push({ pathname: '/transactions', params })
                                    : index === 3
                                        ? () => router.push({ pathname: '/categories', params })
                                        : index === 4
                                            ? () => router.push({ pathname: '/profile', params })
                                            : undefined
                        }
                        style={[dashboardStyles.navItem, index === 1 && dashboardStyles.navItemActive]}
                        accessibilityLabel={index === 0 ? 'Home' : index === 1 ? 'Search' : undefined}
                    >
                        <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={23} color={palette.ink} />
                    </Pressable>
                ))}
            </View>
        </SafeAreaView>
    );
}

// Small single-month calendar used by the Date field — kept local since the
// full month/year picker lives on the dedicated Calendar screen.
function MiniCalendar({ selected, onSelect }: { selected: Date | null; onSelect: (date: Date) => void }) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)];

    return (
        <View style={miniStyles.wrap}>
            <View style={miniStyles.weekdayRow}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                    <Text key={day} style={miniStyles.weekday}>{day}</Text>
                ))}
            </View>
            <View style={miniStyles.grid}>
                {days.map((day, index) => {
                    if (!day) return <View key={`empty-${index}`} style={miniStyles.cell} />;
                    const cellDate = new Date(year, month, day);
                    const isSelected = selected ? cellDate.toDateString() === selected.toDateString() : false;
                    return (
                        <Pressable key={day} style={[miniStyles.cell, isSelected && miniStyles.cellSelected]} onPress={() => onSelect(cellDate)}>
                            <Text style={[miniStyles.cellText, isSelected && miniStyles.cellTextSelected]}>{day}</Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

function parseAmount(value?: string) {
    const amount = Number.parseFloat(value ?? '0');
    return Number.isFinite(amount) && amount > 0 ? amount : 0;
}

function formatAmount(amount: number, currency: Currency, rate: number) {
    const convertedAmount = currency === 'RWF' ? amount * (rate || 1400) : amount;
    const formatted = convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return currency === 'RWF' ? `FRw ${formatted}` : `$${formatted}`;
}

function formatDate(date: Date) {
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '/');
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#ECF8ED' },
    content: { flexGrow: 1, paddingBottom: 110 },
    header: { backgroundColor: palette.teal, paddingHorizontal: 18, paddingTop: 8, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    headerIcon: { width: 32, height: 32, alignItems: 'flex-start', justifyContent: 'center' },
    headerTitle: { color: palette.ink, fontSize: 14, fontWeight: '700' },
    headerIconButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
    searchBarWrap: { backgroundColor: palette.teal, paddingHorizontal: 18, paddingBottom: 20, flexDirection: 'row', alignItems: 'center' },
    searchIcon: { position: 'absolute', left: 30, zIndex: 1 },
    searchBar: { flex: 1, height: 38, borderRadius: 19, backgroundColor: '#FFFFFF', paddingLeft: 34, paddingRight: 14, color: palette.ink, fontSize: 12 },
    card: { flex: 1, marginTop: -6, paddingHorizontal: 20, paddingTop: 22, borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: '#F3FBF4' },
    fieldLabel: { color: palette.ink, fontSize: 11, fontWeight: '700', marginBottom: 8 },
    selectField: { height: 42, borderRadius: 12, backgroundColor: '#E1F2E4', paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    selectPlaceholder: { color: palette.muted, fontSize: 12 },
    selectValue: { color: palette.ink, fontSize: 12, fontWeight: '700' },
    calendarBadge: { width: 22, height: 22, borderRadius: 7, backgroundColor: palette.teal, alignItems: 'center', justifyContent: 'center' },
    dropdown: { marginTop: 6, borderRadius: 12, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D8F2DC', overflow: 'hidden' },
    dropdownItem: { paddingVertical: 10, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#EFF7F0' },
    dropdownItemText: { color: palette.ink, fontSize: 12 },
    reportRow: { flexDirection: 'row', gap: 26 },
    reportOption: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#B6DCCA', alignItems: 'center', justifyContent: 'center' },
    radioActive: { borderColor: palette.teal },
    radioDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: palette.teal },
    reportLabel: { color: palette.ink, fontSize: 12, fontWeight: '600' },
    searchButton: { marginTop: 22, height: 42, borderRadius: 21, backgroundColor: palette.teal, alignItems: 'center', justifyContent: 'center' },
    searchButtonText: { color: palette.ink, fontSize: 13, fontWeight: '800' },
    results: { marginTop: 18 },
    emptyText: { color: palette.muted, fontSize: 12, textAlign: 'center', marginTop: 6 },
    resultRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 10, borderRadius: 14, backgroundColor: '#E1F2E4', marginBottom: 8 },
    resultIcon: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    resultCopy: { flex: 1 },
    resultTitle: { color: palette.ink, fontSize: 12, fontWeight: '700' },
    resultDate: { color: palette.muted, fontSize: 10, marginTop: 2 },
    resultAmount: { color: palette.ink, fontSize: 12, fontWeight: '800' },
    resultAmountExpense: { color: '#1477F8' },
});

const miniStyles = StyleSheet.create({
    wrap: { marginTop: 8, padding: 10, borderRadius: 12, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D8F2DC' },
    weekdayRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 4 },
    weekday: { width: '14.28%', textAlign: 'center', color: palette.muted, fontSize: 9, fontWeight: '700' },
    grid: { flexDirection: 'row', flexWrap: 'wrap' },
    cell: { width: '14.28%', height: 30, alignItems: 'center', justifyContent: 'center' },
    cellSelected: { backgroundColor: palette.teal, borderRadius: 15 },
    cellText: { color: palette.ink, fontSize: 10 },
    cellTextSelected: { color: '#FFFFFF', fontWeight: '800' },
});