import { StyleSheet } from 'react-native';

export const palette = {
  ink: '#173B3D',
  teal: '#08C7A1',
  muted: '#668381',
};

export const styles = StyleSheet.create({
  // Loading
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.ink,
  },
  loadingText: {
    color: '#F2F7F1',
    fontSize: 15,
  },

  // Dashboard layout
  dashboardSafeArea: {
    flex: 1,
    backgroundColor: '#ECF8ED',
  },
  dashboardContent: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 520,
    padding: 24,
    paddingBottom: 22,
  },
  dashboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  dashboardGreeting: {
    color: palette.ink,
    fontSize: 19,
    fontWeight: '800',
  },
  dashboardDate: {
    color: palette.ink,
    fontSize: 11,
    marginTop: 2,
  },
  notificationButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    backgroundColor: '#D5F0D9',
  },
  notificationOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(23, 59, 61, 0.35)',
  },
  notificationSheet: {
    maxHeight: '78%',
    padding: 22,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#F8FCF8',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  notificationTitle: {
    color: palette.ink,
    fontSize: 20,
    fontWeight: '800',
  },
  notificationSubtitle: {
    color: palette.muted,
    fontSize: 11,
    marginTop: 3,
  },
  closeButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: '#D8F2DC',
  },
  notificationLoading: {
    paddingVertical: 32,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 13,
    borderTopWidth: 1,
    borderTopColor: '#DCEBE0',
  },
  notificationIcon: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderRadius: 19,
  },
  notificationCopy: {
    flex: 1,
  },
  notificationItemTitle: {
    color: palette.ink,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 3,
  },
  notificationMessage: {
    color: palette.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  currencyToggle: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 14,
    padding: 3,
    borderRadius: 12,
    backgroundColor: '#D8F2DC',
  },
  currencyToggleLabel: {
    color: palette.muted,
    fontSize: 10,
    marginHorizontal: 6,
  },
  currencyOption: {
    minWidth: 42,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 9,
  },
  currencyOptionActive: {
    backgroundColor: palette.teal,
  },
  currencyOptionText: {
    color: palette.muted,
    fontSize: 10,
    fontWeight: '700',
  },
  currencyOptionTextActive: {
    color: palette.ink,
  },

  // Monthly plan
  monthlyPlan: {
    marginBottom: 22,
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    color: palette.ink,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 14,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  moneyInputGroup: {
    flex: 1,
  },
  moneyInputLabel: {
    color: palette.muted,
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 6,
  },
  moneyInputWrap: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#CFE5D6',
    borderRadius: 10,
    backgroundColor: '#F8FCF8',
  },
  currency: {
    color: palette.ink,
    fontSize: 15,
    fontWeight: '700',
    marginRight: 3,
  },
  moneyInput: {
    flex: 1,
    color: palette.ink,
    fontSize: 14,
    paddingVertical: 9,
  },
  conversionTitle: {
    color: palette.ink,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 8,
  },
  periodAmountRow: {
    minHeight: 30,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E4F0E5',
  },
  periodAmountLabel: {
    flex: 1,
    color: palette.muted,
    fontSize: 11,
  },
  periodIncome: {
    width: 92,
    color: '#078C72',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'right',
  },
  periodExpense: {
    width: 92,
    color: '#1477F8',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'right',
  },
  adviceBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    marginTop: 14,
    padding: 11,
    borderRadius: 12,
    backgroundColor: '#F2F8F2',
  },
  adviceContent: {
    flex: 1,
  },
  adviceTitle: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 3,
  },
  adviceText: {
    color: palette.muted,
    fontSize: 10,
    lineHeight: 15,
  },

  // Summary and progress
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryBlock: {
    flex: 1,
  },
  summaryDivider: {
    width: 1,
    height: 38,
    marginHorizontal: 14,
    backgroundColor: '#8CE2C3',
  },
  summaryLabel: {
    color: palette.ink,
    fontSize: 11,
    marginBottom: 4,
  },
  balanceAmount: {
    color: palette.ink,
    fontSize: 21,
    fontWeight: '800',
  },
  expenseAmount: {
    color: '#1477F8',
    fontSize: 21,
    fontWeight: '800',
  },
  progressTrack: {
    height: 18,
    justifyContent: 'center',
    marginBottom: 12,
    overflow: 'hidden',
    position: 'relative',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  progressFill: {
    height: '100%',
    width: '30%',
    borderRadius: 10,
    backgroundColor: palette.ink,
  },
  progressText: {
    position: 'absolute',
    left: 15,
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '700',
  },
  progressValue: {
    position: 'absolute',
    right: 15,
    color: palette.ink,
    fontSize: 9,
    fontWeight: '700',
  },
  healthText: {
    color: palette.ink,
    fontSize: 11,
    marginBottom: 25,
  },

  // Insight card
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 19,
    padding: 17,
    borderRadius: 28,
    backgroundColor: palette.teal,
  },
  savingsCircle: {
    width: 75,
    alignItems: 'center',
  },
  circleCaption: {
    color: palette.ink,
    fontSize: 9,
    lineHeight: 11,
    textAlign: 'center',
    marginTop: 5,
  },
  insightDivider: {
    width: 1,
    height: 76,
    marginHorizontal: 13,
    backgroundColor: '#D8F8E2',
  },
  insightDetails: {
    flex: 1,
    gap: 13,
  },
  insightLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  insightLabel: {
    color: palette.ink,
    fontSize: 9,
  },
  insightValue: {
    color: palette.ink,
    fontSize: 13,
    fontWeight: '800',
  },
  insightNegative: {
    color: '#1477F8',
    fontSize: 13,
    fontWeight: '800',
  },

  // Period selector
  periodSwitcher: {
    flexDirection: 'row',
    marginBottom: 18,
    padding: 3,
    borderRadius: 17,
    backgroundColor: '#D8F2DC',
  },
  period: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 11,
    borderRadius: 14,
  },
  periodActive: {
    backgroundColor: palette.teal,
  },
  periodText: {
    color: palette.ink,
    fontSize: 11,
  },
  periodTextActive: {
    fontWeight: '800',
  },

  // Transactions
  transaction: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 51,
    marginBottom: 10,
  },
  transactionIcon: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderRadius: 13,
  },
  transactionName: {
    width: 92,
  },
  transactionTitle: {
    color: palette.ink,
    fontSize: 12,
    fontWeight: '700',
  },
  transactionDate: {
    color: '#1477F8',
    fontSize: 8,
    fontWeight: '700',
    marginTop: 4,
  },
  transactionCategory: {
    width: 50,
    color: palette.muted,
    fontSize: 9,
  },
  transactionRule: {
    width: 1,
    height: 25,
    marginRight: 12,
    backgroundColor: '#82D9B1',
  },
  transactionAmount: {
    flex: 1,
    color: palette.ink,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'right',
  },
  transactionNegative: {
    color: '#1477F8',
  },

  // Bottom navigation
  bottomNav: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 14,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: '#D8F2DC',
  },
  navItem: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemActive: {
    borderRadius: 18,
    backgroundColor: palette.teal,
  },
});
