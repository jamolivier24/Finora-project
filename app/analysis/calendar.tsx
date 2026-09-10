import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import { NotificationsPanel } from '@/components/notifications-panel';
import { styles as dashboardStyles, palette } from '@/styles/index.styles';

type Currency = 'USD' | 'RWF';
type Tab = 'spends' | 'categories';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const weekdayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const spendRows = [
    { icon: 'bag-handle-outline' as const, color: '#3B9BFF', title: 'Groceries', date: '17:00 - Apr 24', category: 'Pantry', amount: 588.0, type: 'expense' as const },
    { icon: 'cube-outline' as const, color: '#8FBBFB', title: 'Others', date: '17:00 - Apr 24', category: 'Payments', amount: 500.0, type: 'income' as const },
];

// Category breakdown for the donut. Segments sharing a label are drawn as
// separate arcs (for a bit of shading) but grouped into one legend entry.
const categorySegments = [
    { percent: 10, color: '#0D3FA6', label: 'Groceries' },
    { percent: 11, color: '#4F8AF5', label: 'Groceries' },
    { percent: 79, color: '#8FBBFB', label: 'Others' },
];

export default function CalendarScreen() {
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
    const today = new Date();
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [monthPickerOpen, setMonthPickerOpen] = useState(false);
    const [yearPickerOpen, setYearPickerOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(today.getDate());
    const [tab, setTab] = useState<Tab>('spends');

    const years = useMemo(() => {
        const base = today.getFullYear();
        return Array.from({ length: 9 }, (_, index) => base - 4 + index);
    }, [today]);

    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const days = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)];

    const goBack = () =>
        router.replace({ pathname: '/analysis/[period]', params: { ...params, period: params.period ?? 'monthly' } });

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Pressable onPress={goBack} style={styles.headerIcon} accessibilityLabel="Go back to analysis">
                        <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
                    </Pressable>
                    <Text style={styles.headerTitle}>Calendar</Text>
                    <Pressable onPress={() => setNotificationsVisible(true)} style={styles.headerIconButton} accessibilityLabel="Open notifications">
                        <Ionicons name="notifications-outline" size={18} color={palette.ink} />
                    </Pressable>
                </View>
                <NotificationsPanel visible={notificationsVisible} onClose={() => setNotificationsVisible(false)} income={parseAmount(params.income)} expenses={parseAmount(params.expenses)} currency={currency} />

                <View style={styles.card}>
                    <View style={styles.monthYearRow}>
                        <Pressable
                            style={styles.monthYearPicker}
                            onPress={() => {
                                setMonthPickerOpen((open) => !open);
                                setYearPickerOpen(false);
                            }}
                            accessibilityLabel="Change month"
                        >
                            <Text style={styles.monthYearText}>{monthNames[viewMonth]}</Text>
                            <Ionicons name={monthPickerOpen ? 'chevron-up' : 'chevron-down'} size={14} color={palette.teal} />
                        </Pressable>
                        <Pressable
                            style={styles.monthYearPicker}
                            onPress={() => {
                                setYearPickerOpen((open) => !open);
                                setMonthPickerOpen(false);
                            }}
                            accessibilityLabel="Change year"
                        >
                            <Text style={styles.monthYearText}>{viewYear}</Text>
                            <Ionicons name={yearPickerOpen ? 'chevron-up' : 'chevron-down'} size={14} color={palette.teal} />
                        </Pressable>
                    </View>

                    {monthPickerOpen && (
                        <View style={styles.pickerPanel}>
                            {monthNames.map((name, index) => (
                                <Pressable
                                    key={name}
                                    style={[styles.pickerItem, index === viewMonth && styles.pickerItemActive]}
                                    onPress={() => {
                                        setViewMonth(index);
                                        setMonthPickerOpen(false);
                                    }}
                                >
                                    <Text style={[styles.pickerItemText, index === viewMonth && styles.pickerItemTextActive]}>{name}</Text>
                                </Pressable>
                            ))}
                        </View>
                    )}
                    {yearPickerOpen && (
                        <View style={styles.pickerPanel}>
                            {years.map((year) => (
                                <Pressable
                                    key={year}
                                    style={[styles.pickerItem, year === viewYear && styles.pickerItemActive]}
                                    onPress={() => {
                                        setViewYear(year);
                                        setYearPickerOpen(false);
                                    }}
                                >
                                    <Text style={[styles.pickerItemText, year === viewYear && styles.pickerItemTextActive]}>{year}</Text>
                                </Pressable>
                            ))}
                        </View>
                    )}

                    <View style={styles.weekdayRow}>
                        {weekdayLabels.map((day) => (
                            <Text key={day} style={styles.weekday}>{day}</Text>
                        ))}
                    </View>
                    <View style={styles.grid}>
                        {days.map((day, index) => {
                            if (!day) return <View key={`empty-${index}`} style={styles.dayCell} />;
                            const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
                            const isSelected = day === selectedDay;
                            return (
                                <Pressable
                                    key={day}
                                    style={[styles.dayCell, isToday && styles.todayCell, isSelected && !isToday && styles.selectedCell]}
                                    onPress={() => setSelectedDay(day)}
                                >
                                    <Text style={[styles.dayText, (isToday || isSelected) && styles.dayTextActive]}>{day}</Text>
                                </Pressable>
                            );
                        })}
                    </View>

                    <View style={styles.tabRow}>
                        <Pressable style={[styles.tab, tab === 'spends' && styles.tabActive]} onPress={() => setTab('spends')}>
                            <Text style={[styles.tabText, tab === 'spends' && styles.tabTextActive]}>Spends</Text>
                        </Pressable>
                        <Pressable style={[styles.tab, tab === 'categories' && styles.tabActive]} onPress={() => setTab('categories')}>
                            <Text style={[styles.tabText, tab === 'categories' && styles.tabTextActive]}>Categories</Text>
                        </Pressable>
                    </View>

                    {tab === 'spends' ? (
                        <View style={styles.spendsList}>
                            {spendRows.map((row) => (
                                <View key={row.title} style={styles.spendRow}>
                                    <View style={[styles.spendIcon, { backgroundColor: row.color }]}>
                                        <Ionicons name={row.icon} size={16} color="#FFFFFF" />
                                    </View>
                                    <View style={styles.spendCopy}>
                                        <Text style={styles.spendTitle}>{row.title}</Text>
                                        <Text style={styles.spendDate}>{row.date}</Text>
                                    </View>
                                    <Text style={styles.spendCategory}>{row.category}</Text>
                                    <Text style={[styles.spendAmount, row.type === 'expense' && styles.spendAmountExpense]}>
                                        {row.type === 'expense' ? '-' : ''}
                                        {formatAmount(row.amount, currency, parseAmount(params.rate))}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <CategoryDonut />
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
                        accessibilityLabel={index === 0 ? 'Home' : index === 1 ? 'Calendar' : undefined}
                    >
                        <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={23} color={palette.ink} />
                    </Pressable>
                ))}
            </View>
        </SafeAreaView>
    );
}

// Half-donut "gauge" breakdown, drawn with react-native-svg. Each segment is
// a stroked arc on the top half of a circle; percentages are laid end to end
// so they always fill exactly 180°.
function CategoryDonut() {
    const size = 200;
    const strokeWidth = 26;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const halfCircumference = circumference / 2;
    const cx = size / 2;
    const cy = size / 2;

    let cumulative = 0;
    const arcs = categorySegments.map((segment) => {
        const length = (segment.percent / 100) * halfCircumference;
        const arc = { ...segment, length, offset: cumulative };
        cumulative += length;
        return arc;
    });

    const legend = useMemo(() => {
        const seen = new Set<string>();
        return categorySegments.filter((segment) => {
            if (seen.has(segment.label)) return false;
            seen.add(segment.label);
            return true;
        });
    }, []);

    return (
        <View style={donutStyles.wrap}>
            <View style={{ width: size, height: size / 2 + 30, overflow: 'hidden' }}>
                <Svg width={size} height={size}>
                    {arcs.map((arc, index) => (
                        <Circle
                            key={index}
                            cx={cx}
                            cy={cy}
                            r={radius}
                            stroke={arc.color}
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${arc.length} ${circumference - arc.length}`}
                            strokeDashoffset={-arc.offset}
                            strokeLinecap="butt"
                            fill="none"
                            rotation="180"
                            origin={`${cx}, ${cy}`}
                        />
                    ))}
                </Svg>
                <View style={donutStyles.labelLayer}>
                    {arcs.map((arc, index) => {
                        const midAngle = Math.PI - ((arc.offset + arc.length / 2) / halfCircumference) * Math.PI;
                        const labelRadius = radius;
                        const x = cx + labelRadius * Math.cos(midAngle);
                        const y = cy - labelRadius * Math.sin(midAngle);
                        return (
                            <Text key={index} style={[donutStyles.arcLabel, { left: x - 16, top: y - 8 }]}>
                                {arc.percent}%
                            </Text>
                        );
                    })}
                </View>
            </View>
            <View style={donutStyles.legendRow}>
                {legend.map((item) => (
                    <View key={item.label} style={donutStyles.legendItem}>
                        <View style={[donutStyles.legendDot, { backgroundColor: item.color }]} />
                        <Text style={donutStyles.legendLabel}>{item.label}</Text>
                    </View>
                ))}
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

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#ECF8ED' },
    content: { flexGrow: 1, paddingBottom: 110 },
    header: { backgroundColor: palette.teal, paddingHorizontal: 18, paddingTop: 8, paddingBottom: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    headerIcon: { width: 32, height: 32, alignItems: 'flex-start', justifyContent: 'center' },
    headerTitle: { color: palette.ink, fontSize: 14, fontWeight: '700' },
    headerIconButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
    card: { flex: 1, marginTop: -10, paddingHorizontal: 18, paddingTop: 18, borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: '#F3FBF4' },
    monthYearRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    monthYearPicker: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    monthYearText: { color: palette.teal, fontSize: 13, fontWeight: '800' },
    pickerPanel: { maxHeight: 180, marginBottom: 10, borderRadius: 12, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D8F2DC', overflow: 'hidden' },
    pickerItem: { paddingVertical: 9, paddingHorizontal: 14 },
    pickerItemActive: { backgroundColor: '#D8F2DC' },
    pickerItemText: { color: palette.ink, fontSize: 12 },
    pickerItemTextActive: { fontWeight: '800' },
    weekdayRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 4 },
    weekday: { width: '14.28%', textAlign: 'center', color: '#5D8EF7', fontSize: 10, fontWeight: '700' },
    grid: { flexDirection: 'row', flexWrap: 'wrap' },
    dayCell: { width: '14.28%', height: 32, alignItems: 'center', justifyContent: 'center' },
    todayCell: { backgroundColor: palette.teal, borderRadius: 16 },
    selectedCell: { backgroundColor: palette.ink, borderRadius: 16 },
    dayText: { color: palette.ink, fontSize: 11 },
    dayTextActive: { color: '#FFFFFF', fontWeight: '800' },
    tabRow: { flexDirection: 'row', gap: 10, marginTop: 14, marginBottom: 14 },
    tab: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 16, backgroundColor: '#D8F2DC' },
    tabActive: { backgroundColor: palette.teal },
    tabText: { color: palette.ink, fontSize: 11, fontWeight: '700' },
    tabTextActive: { color: '#FFFFFF' },
    spendsList: { gap: 8 },
    spendRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
    spendIcon: { width: 32, height: 32, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
    spendCopy: { flex: 1 },
    spendTitle: { color: palette.ink, fontSize: 12, fontWeight: '700' },
    spendDate: { color: '#1477F8', fontSize: 9, marginTop: 2 },
    spendCategory: { color: palette.muted, fontSize: 10, marginRight: 10 },
    spendAmount: { color: palette.ink, fontSize: 12, fontWeight: '800' },
    spendAmountExpense: { color: '#1477F8' },
});

const donutStyles = StyleSheet.create({
    wrap: { alignItems: 'center', paddingVertical: 10 },
    labelLayer: { position: 'absolute', width: '100%', height: '100%' },
    arcLabel: { position: 'absolute', width: 32, color: '#FFFFFF', fontSize: 11, fontWeight: '800', textAlign: 'center' },
    legendRow: { flexDirection: 'row', gap: 20, marginTop: 8 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    legendDot: { width: 8, height: 8, borderRadius: 4 },
    legendLabel: { color: palette.ink, fontSize: 11, fontWeight: '600' },
});