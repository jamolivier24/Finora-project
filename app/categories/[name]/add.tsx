import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NotificationsPanel } from '@/components/notifications-panel';
import { addExpense, useCategories } from '@/lib/categoryStore';
import { styles as dashboardStyles, palette } from '@/styles/index.styles';

const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function MiniCalendar({ selected, onSelect }: { selected: Date; onSelect: (date: Date) => void }) {
    const year = selected.getFullYear();
    const month = selected.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)];

    return (
        <View style={calendarStyles.wrap}>
            <View style={calendarStyles.weekdayRow}>
                {weekdays.map((day) => (
                    <Text key={day} style={calendarStyles.weekday}>{day}</Text>
                ))}
            </View>
            <View style={calendarStyles.grid}>
                {days.map((day, index) => {
                    if (!day) return <View key={`empty-${index}`} style={calendarStyles.cell} />;
                    const cellDate = new Date(year, month, day);
                    const isSelected = cellDate.toDateString() === selected.toDateString();
                    return (
                        <Pressable key={day} style={[calendarStyles.cell, isSelected && calendarStyles.cellSelected]} onPress={() => onSelect(cellDate)}>
                            <Text style={[calendarStyles.cellText, isSelected && calendarStyles.cellTextSelected]}>{day}</Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

export default function AddExpenseScreen() {
    const params = useLocalSearchParams<{
        name?: string;
        demoEmail?: string;
        income?: string;
        expenses?: string;
        currency?: string;
        rate?: string;
    }>();
    const categories = useCategories();
    const initialCategory = categories.find((c) => c.name.toLowerCase() === (params.name ?? '').toLowerCase())?.name ?? categories[0]?.name ?? '';

    const [notificationsVisible, setNotificationsVisible] = useState(false);
    const [date, setDate] = useState(new Date());
    const [dateOpen, setDateOpen] = useState(false);
    const [category, setCategory] = useState(initialCategory);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

    const goBack = () => router.replace({ pathname: '/categories/[name]', params: { ...params, name: params.name ?? category } });

    const save = () => {
        const parsedAmount = Number.parseFloat(amount);
        if (!Number.isFinite(parsedAmount) || parsedAmount <= 0 || !category) return;
        addExpense({
            category,
            date: formatIso(date),
            title: title.trim() || category,
            amount: parsedAmount,
            message: message.trim() || undefined,
        });
        router.replace({ pathname: '/categories/[name]', params: { ...params, name: category } });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Pressable onPress={goBack} style={styles.headerIcon} accessibilityLabel="Go back">
                        <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
                    </Pressable>
                    <Text style={styles.headerTitle}>Add Expenses</Text>
                    <Pressable onPress={() => setNotificationsVisible(true)} style={dashboardStyles.notificationButton} accessibilityLabel="Open notifications">
                        <Ionicons name="notifications-outline" size={19} color={palette.ink} />
                    </Pressable>
                    <NotificationsPanel visible={notificationsVisible} onClose={() => setNotificationsVisible(false)} income={parseAmount(params.income)} expenses={parseAmount(params.expenses)} currency={params.currency === 'RWF' ? 'RWF' : 'USD'} />
                </View>

                <View style={styles.panel}>
                    <Text style={styles.fieldLabel}>Date</Text>
                    <Pressable style={styles.selectField} onPress={() => { setDateOpen((open) => !open); setCategoryOpen(false); }} accessibilityLabel="Choose date">
                        <Text style={styles.selectValue}>{formatDisplayDate(date)}</Text>
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

                    <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Category</Text>
                    <Pressable style={styles.selectField} onPress={() => { setCategoryOpen((open) => !open); setDateOpen(false); }} accessibilityLabel="Select category">
                        <Text style={category ? styles.selectValueBold : styles.selectPlaceholder}>{category || 'Select the category'}</Text>
                        <Ionicons name={categoryOpen ? 'chevron-up' : 'chevron-down'} size={16} color={palette.muted} />
                    </Pressable>
                    {categoryOpen && (
                        <View style={styles.dropdown}>
                            {categories.map((option) => (
                                <Pressable key={option.name} style={styles.dropdownItem} onPress={() => { setCategory(option.name); setCategoryOpen(false); }}>
                                    <Text style={styles.dropdownItemText}>{option.name}</Text>
                                </Pressable>
                            ))}
                        </View>
                    )}

                    <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Amount</Text>
                    <TextInput
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="decimal-pad"
                        placeholder="0.00"
                        placeholderTextColor={palette.muted}
                        style={styles.textInput}
                    />

                    <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Expense Title</Text>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder={category || 'Expense title'}
                        placeholderTextColor={palette.muted}
                        style={styles.textInput}
                    />

                    <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Enter Message</Text>
                    <TextInput
                        value={message}
                        onChangeText={setMessage}
                        placeholder="Enter Message"
                        placeholderTextColor={palette.muted}
                        style={[styles.textInput, styles.textArea]}
                        multiline
                    />

                    <Pressable style={styles.saveButton} onPress={save} accessibilityLabel="Save expense">
                        <Text style={styles.saveButtonText}>Save</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function parseAmount(value?: string) {
    const amount = Number.parseFloat(value ?? '0');
    return Number.isFinite(amount) && amount > 0 ? amount : 0;
}

function formatIso(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatDisplayDate(date: Date) {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: palette.teal },
    content: { flexGrow: 1, paddingBottom: 22 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 9, paddingBottom: 21, backgroundColor: palette.teal },
    headerIcon: { width: 38, height: 38, justifyContent: 'center' },
    headerTitle: { color: palette.ink, fontSize: 14, fontWeight: '700' },
    panel: { flex: 1, padding: 20, paddingTop: 22, borderTopLeftRadius: 38, borderTopRightRadius: 38, backgroundColor: '#F8FCF8' },
    fieldLabel: { color: palette.ink, fontSize: 11, fontWeight: '700', marginBottom: 8 },
    selectField: { height: 42, borderRadius: 12, backgroundColor: '#E1F2E4', paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    selectPlaceholder: { color: palette.muted, fontSize: 12 },
    selectValue: { color: palette.ink, fontSize: 12, fontWeight: '600' },
    selectValueBold: { color: palette.ink, fontSize: 12, fontWeight: '700' },
    calendarBadge: { width: 22, height: 22, borderRadius: 7, backgroundColor: palette.teal, alignItems: 'center', justifyContent: 'center' },
    dropdown: { marginTop: 6, borderRadius: 12, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D8F2DC', overflow: 'hidden' },
    dropdownItem: { paddingVertical: 10, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#EFF7F0' },
    dropdownItemText: { color: palette.ink, fontSize: 12 },
    textInput: { height: 42, borderRadius: 12, backgroundColor: '#E1F2E4', paddingHorizontal: 14, color: palette.ink, fontSize: 12 },
    textArea: { height: 90, paddingTop: 12, textAlignVertical: 'top' },
    saveButton: { marginTop: 26, height: 44, borderRadius: 22, backgroundColor: palette.teal, alignItems: 'center', justifyContent: 'center' },
    saveButtonText: { color: palette.ink, fontSize: 13, fontWeight: '800' },
});

const calendarStyles = StyleSheet.create({
    wrap: { marginTop: 8, padding: 10, borderRadius: 12, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D8F2DC' },
    weekdayRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 4 },
    weekday: { width: '14.28%', textAlign: 'center', color: palette.muted, fontSize: 9, fontWeight: '700' },
    grid: { flexDirection: 'row', flexWrap: 'wrap' },
    cell: { width: '14.28%', height: 30, alignItems: 'center', justifyContent: 'center' },
    cellSelected: { backgroundColor: palette.teal, borderRadius: 15 },
    cellText: { color: palette.ink, fontSize: 10 },
    cellTextSelected: { color: '#FFFFFF', fontWeight: '800' },
});