import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NotificationsPanel } from '@/components/notifications-panel';
import { addGoal, useGoals } from '@/lib/categoryStore';
import { styles as dashboardStyles, palette } from '@/styles/index.styles';

type Currency = 'USD' | 'RWF';

export default function SavingsScreen() {
    const params = useLocalSearchParams<{
        demoEmail?: string;
        income?: string;
        expenses?: string;
        currency?: string;
        rate?: string;
    }>();
    const currency: Currency = params.currency === 'RWF' ? 'RWF' : 'USD';
    const income = parseAmount(params.income);
    const totalExpenses = parseAmount(params.expenses);
    const balance = Math.max(income - totalExpenses, 0);
    const expenseRate = income > 0 ? totalExpenses / income : 0;

    const [notificationsVisible, setNotificationsVisible] = useState(false);
    const [newGoalOpen, setNewGoalOpen] = useState(false);
    const [newGoalName, setNewGoalName] = useState('');
    const [newGoalTarget, setNewGoalTarget] = useState('');
    const goals = useGoals();

    const goBack = () => router.replace({ pathname: '/categories', params });
    const openGoal = (name: string) => router.push({ pathname: '/categories/savings/[goal]/add', params: { ...params, goal: name } });
    const saveNewGoal = () => {
        addGoal(newGoalName, Number.parseFloat(newGoalTarget) || 0);
        setNewGoalName('');
        setNewGoalTarget('');
        setNewGoalOpen(false);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Pressable onPress={goBack} style={styles.headerIcon} accessibilityLabel="Go back to categories">
                        <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
                    </Pressable>
                    <Text style={styles.headerTitle}>Savings</Text>
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
                    <View style={styles.grid}>
                        {goals.map((goal) => (
                            <Pressable key={goal.name} style={styles.goalItem} onPress={() => openGoal(goal.name)} accessibilityLabel={goal.name}>
                                <View style={styles.goalIcon}>
                                    <Ionicons name={goal.icon as keyof typeof Ionicons.glyphMap} size={30} color="#FFFFFF" />
                                </View>
                                <Text style={styles.goalTitle}>{goal.name}</Text>
                            </Pressable>
                        ))}
                    </View>
                    <Pressable style={styles.addMoreButton} onPress={() => setNewGoalOpen(true)} accessibilityLabel="Add a new savings goal">
                        <Text style={styles.addMoreButtonText}>Add More</Text>
                    </Pressable>
                </View>
            </ScrollView>

            <Modal visible={newGoalOpen} transparent animationType="fade" onRequestClose={() => setNewGoalOpen(false)}>
                <View style={modalStyles.backdrop}>
                    <View style={modalStyles.card}>
                        <Text style={modalStyles.title}>New Goal</Text>
                        <TextInput value={newGoalName} onChangeText={setNewGoalName} placeholder="Goal name" placeholderTextColor={palette.muted} style={modalStyles.input} autoFocus />
                        <TextInput value={newGoalTarget} onChangeText={setNewGoalTarget} placeholder="Target amount" placeholderTextColor={palette.muted} keyboardType="decimal-pad" style={modalStyles.input} />
                        <Pressable style={modalStyles.saveButton} onPress={saveNewGoal} accessibilityLabel="Save new goal">
                            <Text style={modalStyles.saveButtonText}>Save</Text>
                        </Pressable>
                        <Pressable style={modalStyles.cancelButton} onPress={() => { setNewGoalName(''); setNewGoalTarget(''); setNewGoalOpen(false); }} accessibilityLabel="Cancel">
                            <Text style={modalStyles.cancelButtonText}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

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
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', columnGap: '5%', rowGap: 22 },
    goalItem: { width: '30%', alignItems: 'center' },
    goalIcon: { width: 58, height: 58, alignItems: 'center', justifyContent: 'center', borderRadius: 15, backgroundColor: '#65B5F7' },
    goalTitle: { color: palette.ink, fontSize: 10, marginTop: 6, textAlign: 'center' },
    addMoreButton: { marginTop: 24, height: 42, borderRadius: 21, backgroundColor: palette.teal, alignItems: 'center', justifyContent: 'center' },
    addMoreButtonText: { color: palette.ink, fontSize: 13, fontWeight: '800' },
});

const modalStyles = StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: 'rgba(10,20,20,0.55)', alignItems: 'center', justifyContent: 'center', padding: 30 },
    card: { width: '100%', maxWidth: 320, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 20 },
    title: { color: palette.ink, fontSize: 14, fontWeight: '800', textAlign: 'center', marginBottom: 14 },
    input: { height: 42, borderRadius: 10, backgroundColor: '#E1F2E4', paddingHorizontal: 14, color: palette.ink, fontSize: 12, marginBottom: 10 },
    saveButton: { height: 40, borderRadius: 20, backgroundColor: palette.teal, alignItems: 'center', justifyContent: 'center', marginTop: 4, marginBottom: 8 },
    saveButtonText: { color: palette.ink, fontSize: 12, fontWeight: '800' },
    cancelButton: { height: 40, borderRadius: 20, backgroundColor: '#E1F2E4', alignItems: 'center', justifyContent: 'center' },
    cancelButtonText: { color: palette.ink, fontSize: 12, fontWeight: '700' },
});