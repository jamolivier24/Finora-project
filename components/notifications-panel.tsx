import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { palette, styles } from '@/styles/index.styles';

type Currency = 'USD' | 'RWF';
type NotificationItem = { id: string; title: string; message: string; icon: keyof typeof Ionicons.glyphMap; color: string };

export function NotificationsPanel({ visible, onClose, income, expenses, currency }: { visible: boolean; onClose: () => void; income: number; expenses: number; currency: Currency }) {
  const expenseRate = income > 0 ? expenses / income : 0;
  const amount = (value: number) => formatAmount(value, currency);
  const notifications: NotificationItem[] = [
    { id: 'income', title: 'Income received', message: income ? `Your planned monthly income is ${amount(income)}.` : 'Add your income to track money received.', icon: 'arrow-down-circle-outline', color: '#078C72' },
    { id: 'expenses', title: 'Expenses recorded', message: expenses ? `${amount(expenses)} is recorded for this month.` : 'No expenses have been recorded yet.', icon: 'receipt-outline', color: '#1477F8' },
    { id: 'budget', title: 'Budget warning', message: expenseRate > 0.8 ? 'You have used more than 80% of your monthly income.' : 'Your spending is within the current budget range.', icon: expenseRate > 0.8 ? 'warning-outline' : 'shield-checkmark-outline', color: expenseRate > 0.8 ? '#B04B4B' : '#078C72' },
    { id: 'bills', title: 'Bill payment reminder', message: 'Review upcoming bills before their due dates.', icon: 'calendar-outline', color: '#B57900' },
    { id: 'savings', title: 'Savings goal', message: income > expenses ? `You have ${amount(income - expenses)} available to put toward a savings goal.` : 'Reduce expenses to make room for your savings goal.', icon: 'star-outline', color: '#8A5A00' },
    { id: 'summary', title: 'Monthly financial summary', message: `Balance: ${amount(Math.max(income - expenses, 0))}. Expenses use ${Math.round(expenseRate * 100)}% of income.`, icon: 'bar-chart-outline', color: palette.ink },
  ];

  return <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}><View style={styles.notificationOverlay}><View style={styles.notificationSheet}><View style={styles.notificationHeader}><View><Text style={styles.notificationTitle}>Notifications</Text><Text style={styles.notificationSubtitle}>Your financial pulse, in one place</Text></View><Pressable onPress={onClose} accessibilityLabel="Close notifications" style={styles.closeButton}><Ionicons name="close" size={21} color={palette.ink} /></Pressable></View><ScrollView showsVerticalScrollIndicator={false}>{notifications.map((notification) => <View key={notification.id} style={styles.notificationItem}><View style={[styles.notificationIcon, { backgroundColor: `${notification.color}20` }]}><Ionicons name={notification.icon} size={19} color={notification.color} /></View><View style={styles.notificationCopy}><Text style={styles.notificationItemTitle}>{notification.title}</Text><Text style={styles.notificationMessage}>{notification.message}</Text></View></View>)}</ScrollView></View></View></Modal>;
}

function formatAmount(amount: number, currency: Currency) { const formatted = amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); return currency === 'RWF' ? `FRw ${formatted}` : `$${formatted}`; }
