import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { palette, styles as dashboardStyles } from "@/styles/index.styles";
import { NotificationsPanel } from "@/components/notifications-panel";

type Params = {
  demoEmail?: string;
  income?: string;
  expenses?: string;
  currency?: string;
  profilePicture?: string;
};
const categories = [
  { title: "Food", icon: "restaurant-outline" as const },
  { title: "Transport", icon: "bus-outline" as const },
  { title: "Medicine", icon: "bandage-outline" as const },
  { title: "Groceries", icon: "cart-outline" as const },
  { title: "Rent", icon: "hand-left-outline" as const },
  { title: "Gifts", icon: "gift-outline" as const },
  { title: "Savings", icon: "cash-outline" as const },
  { title: "Entertainment", icon: "ticket-outline" as const },
  { title: "More", icon: "add-outline" as const },
];

export default function CategoriesScreen() {
  const params = useLocalSearchParams<Params>();
  const income = parseAmount(params.income);
  const expenses = parseAmount(params.expenses);
  const currency = params.currency === "RWF" ? "RWF" : "USD";
  const balance = Math.max(income - expenses, 0);
  const expenseRate = income > 0 ? expenses / income : 0;
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const goHome = () => router.replace({ pathname: "/", params });
  const goTransactions = () =>
    router.push({ pathname: "/transactions", params });
  const goProfile = () => router.push({ pathname: "/profile", params });
  const goAnalysis = () =>
    router.push({
      pathname: "/analysis/[period]",
      params: { ...params, period: "monthly" },
    });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable
            onPress={goHome}
            style={styles.headerIcon}
            accessibilityLabel="Go back to home"
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Categories</Text>
          <Pressable
            onPress={() => setNotificationsVisible(true)}
            style={dashboardStyles.notificationButton}
            accessibilityLabel="Open notifications"
          >
            <Ionicons
              name="notifications-outline"
              size={19}
              color={palette.ink}
            />
          </Pressable>
          <NotificationsPanel
            visible={notificationsVisible}
            onClose={() => setNotificationsVisible(false)}
            income={income}
            expenses={expenses}
            currency={currency}
          />
        </View>
        <View style={styles.summary}>
          <View>
            <Text style={styles.summaryLabel}>Total Balance</Text>
            <Text style={styles.balance}>
              {formatAmount(balance, currency)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View>
            <Text style={styles.summaryLabel}>Total Expense</Text>
            <Text style={styles.expense}>
              -{formatAmount(expenses, currency)}
            </Text>
          </View>
        </View>
        <View style={styles.budget}>
          <Text style={styles.budgetValue}>
            {Math.round(expenseRate * 100)}%
          </Text>
          <Text style={styles.budgetAmount}>
            {formatAmount(expenses, currency)}
          </Text>
        </View>
        <Text style={styles.budgetMessage}>
          ▣ {Math.round(expenseRate * 100)}% of your expenses, looks good.
        </Text>
        <View style={styles.panel}>
          <View style={styles.grid}>
            {categories.map((item) => (
              <Pressable
                key={item.title}
                style={styles.categoryItem}
                accessibilityLabel={item.title}
              >
                <View style={styles.categoryIcon}>
                  <Ionicons name={item.icon} size={30} color="#FFFFFF" />
                </View>
                <Text style={styles.categoryTitle}>{item.title}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={dashboardStyles.bottomNav}>
        {[
          "home-outline",
          "search-outline",
          "swap-horizontal-outline",
          "layers-outline",
          "person-outline",
        ].map((icon, index) => (
          <Pressable
            key={icon}
            onPress={
              index === 0
                ? goHome
                : index === 1
                  ? goAnalysis
                  : index === 2
                    ? goTransactions
                    : index === 4
                      ? goProfile
                      : undefined
            }
            style={[
              dashboardStyles.navItem,
              index === 3 && dashboardStyles.navItemActive,
            ]}
            accessibilityLabel={
              index === 0
                ? "Home"
                : index === 1
                  ? "Analysis"
                  : index === 2
                    ? "Transactions"
                    : index === 3
                      ? "Categories"
                      : index === 4
                        ? "Profile"
                        : undefined
            }
          >
            <Ionicons
              name={icon as keyof typeof Ionicons.glyphMap}
              size={23}
              color={palette.ink}
            />
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

function parseAmount(value?: string) {
  const amount = Number.parseFloat(value ?? "0");
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
}
function formatAmount(amount: number, currency: "USD" | "RWF") {
  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return currency === "RWF" ? `FRw ${formatted}` : `$${formatted}`;
}
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.teal },
  content: { flexGrow: 1, paddingBottom: 22 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 9,
    paddingBottom: 21,
    backgroundColor: palette.teal,
  },
  headerIcon: { width: 38, height: 38, justifyContent: "center" },
  headerTitle: { color: palette.ink, fontSize: 14, fontWeight: "700" },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 8,
    backgroundColor: palette.teal,
  },
  summaryLabel: { color: palette.ink, fontSize: 9 },
  balance: { color: "#FFFFFF", fontSize: 16, fontWeight: "800", marginTop: 2 },
  expense: { color: "#1477F8", fontSize: 16, fontWeight: "800", marginTop: 2 },
  divider: { width: 1, height: 31, backgroundColor: "#8CE2C3" },
  budget: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 18,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 5,
    backgroundColor: "#F8FCF8",
  },
  budgetValue: { color: palette.ink, fontSize: 9, fontWeight: "700" },
  budgetAmount: { color: palette.ink, fontSize: 9, fontWeight: "700" },
  budgetMessage: {
    color: palette.ink,
    fontSize: 9,
    paddingHorizontal: 24,
    paddingVertical: 8,
    backgroundColor: palette.teal,
  },
  panel: {
    flex: 1,
    padding: 18,
    paddingTop: 17,
    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,
    backgroundColor: "#F8FCF8",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 22,
  },
  categoryItem: { width: "30%", alignItems: "center" },
  categoryIcon: {
    width: 58,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: "#65B5F7",
  },
  categoryTitle: {
    color: palette.ink,
    fontSize: 10,
    marginTop: 6,
    textAlign: "center",
  },
});
