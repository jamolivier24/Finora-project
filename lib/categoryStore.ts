import { useSyncExternalStore } from 'react';

// A small in-memory store shared across the Categories screens. There's no
// backend yet, so this just keeps state in module scope for the app session
// and notifies subscribers on change — enough to make "Add Expenses" /
// "Add Savings" feel real without pulling in a state library.

export type CategoryDef = { name: string; icon: string };
export type ExpenseEntry = { id: string; category: string; date: string; title: string; amount: number; message?: string };
export type GoalDef = { name: string; icon: string; target: number };
export type DepositEntry = { id: string; goal: string; date: string; title: string; amount: number; message?: string };

let categories: CategoryDef[] = [
    { name: 'Food', icon: 'restaurant-outline' },
    { name: 'Transport', icon: 'bus-outline' },
    { name: 'Medicine', icon: 'bandage-outline' },
    { name: 'Groceries', icon: 'cart-outline' },
    { name: 'Rent', icon: 'hand-left-outline' },
    { name: 'Gifts', icon: 'gift-outline' },
    { name: 'Savings', icon: 'cash-outline' },
    { name: 'Entertainment', icon: 'ticket-outline' },
];

let expenses: ExpenseEntry[] = [
    { id: 'e1', category: 'Food', date: '2024-04-30', title: 'Dinner', amount: 26.0 },
    { id: 'e2', category: 'Food', date: '2024-04-24', title: 'Delivery Pizza', amount: 18.35 },
    { id: 'e3', category: 'Food', date: '2024-04-15', title: 'Lunch', amount: 15.4 },
    { id: 'e4', category: 'Food', date: '2024-04-08', title: 'Brunch', amount: 12.13 },
    { id: 'e5', category: 'Food', date: '2024-03-31', title: 'Dinner', amount: 27.2 },
    { id: 'e6', category: 'Groceries', date: '2024-03-10', title: 'Pantry', amount: 53.59 },
    { id: 'e7', category: 'Groceries', date: '2024-03-01', title: 'Snacks', amount: 35.03 },
    { id: 'e8', category: 'Groceries', date: '2024-02-10', title: 'Canned Food', amount: 51.82 },
    { id: 'e9', category: 'Groceries', date: '2024-02-20', title: 'Veggies', amount: 14.79 },
    { id: 'e10', category: 'Groceries', date: '2024-02-01', title: 'Groceries', amount: 75.35 },
    { id: 'e11', category: 'Rent', date: '2024-04-15', title: 'Rent', amount: 674.4 },
    { id: 'e12', category: 'Rent', date: '2024-03-15', title: 'Rent', amount: 674.4 },
    { id: 'e13', category: 'Rent', date: '2024-02-15', title: 'Rent', amount: 674.4 },
    { id: 'e14', category: 'Rent', date: '2024-01-15', title: 'Rent', amount: 674.4 },
    { id: 'e15', category: 'Gifts', date: '2024-04-20', title: 'Perfume', amount: 30.0 },
    { id: 'e16', category: 'Gifts', date: '2024-04-15', title: 'Make-Up', amount: 60.35 },
    { id: 'e17', category: 'Gifts', date: '2024-03-10', title: 'Teddy Bear', amount: 20.0 },
    { id: 'e18', category: 'Gifts', date: '2024-03-01', title: 'Cooking Lessons', amount: 128.0 },
    { id: 'e19', category: 'Gifts', date: '2024-02-15', title: 'Toys For Dani', amount: 50.2 },
    { id: 'e20', category: 'Medicine', date: '2024-04-30', title: 'Acetaminophen', amount: 2.0 },
    { id: 'e21', category: 'Medicine', date: '2024-03-30', title: 'Vitamin C', amount: 8.2 },
    { id: 'e22', category: 'Medicine', date: '2024-03-12', title: 'Muscle Pain Cream', amount: 10.13 },
    { id: 'e23', category: 'Medicine', date: '2024-02-02', title: 'Aspirin', amount: 2.2 },
    { id: 'e24', category: 'Entertainment', date: '2024-04-26', title: 'Cinema', amount: 30.0 },
    { id: 'e25', category: 'Entertainment', date: '2024-04-13', title: 'Netflix', amount: 12.27 },
    { id: 'e26', category: 'Entertainment', date: '2024-04-05', title: 'Karaoke', amount: 10.0 },
    { id: 'e27', category: 'Entertainment', date: '2024-03-24', title: 'Video Game', amount: 60.2 },
    { id: 'e28', category: 'Entertainment', date: '2024-03-13', title: 'Netflix', amount: 12.27 },
    { id: 'e29', category: 'Transport', date: '2024-03-30', title: 'Fuel', amount: 3.53 },
    { id: 'e30', category: 'Transport', date: '2024-03-30', title: 'Car Parts', amount: 26.75 },
    { id: 'e31', category: 'Transport', date: '2024-02-10', title: 'New Tires', amount: 373.99 },
    { id: 'e32', category: 'Transport', date: '2024-02-09', title: 'Car Wash', amount: 9.74 },
    { id: 'e33', category: 'Transport', date: '2024-02-01', title: 'Public Transport', amount: 1.24 },
];

let goals: GoalDef[] = [
    { name: 'Travel', icon: 'airplane-outline', target: 1962.93 },
    { name: 'New House', icon: 'home-outline', target: 569200 },
    { name: 'Car', icon: 'car-sport-outline', target: 14390 },
    { name: 'Wedding', icon: 'heart-outline', target: 34700 },
];

let deposits: DepositEntry[] = [
    { id: 'd1', goal: 'Travel', date: '2024-04-30', title: 'Travel Deposit', amount: 217.77 },
    { id: 'd2', goal: 'Travel', date: '2024-04-14', title: 'Travel Deposit', amount: 217.77 },
    { id: 'd3', goal: 'Travel', date: '2024-04-02', title: 'Travel Deposit', amount: 217.77 },
    { id: 'd4', goal: 'New House', date: '2024-04-05', title: 'House Deposit', amount: 477.77 },
    { id: 'd5', goal: 'New House', date: '2024-01-18', title: 'House Deposit', amount: 102.67 },
    { id: 'd6', goal: 'New House', date: '2024-01-03', title: 'House Deposit', amount: 45.04 },
    { id: 'd7', goal: 'Car', date: '2024-07-05', title: 'Car Deposit', amount: 387.32 },
    { id: 'd8', goal: 'Car', date: '2024-05-30', title: 'Car Deposit', amount: 122.99 },
    { id: 'd9', goal: 'Car', date: '2024-05-09', title: 'Car Deposit', amount: 85.94 },
    { id: 'd10', goal: 'Wedding', date: '2024-11-15', title: 'Wedding Deposit', amount: 87.32 },
    { id: 'd11', goal: 'Wedding', date: '2024-09-30', title: 'Wedding Deposit', amount: 22.99 },
    { id: 'd12', goal: 'Wedding', date: '2024-09-15', title: 'Wedding Deposit', amount: 185.94 },
];

const listeners = new Set<() => void>();
function emit() {
    listeners.forEach((listener) => listener());
}
function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function useCategories() {
    return useSyncExternalStore(subscribe, () => categories);
}
export function useExpenses() {
    return useSyncExternalStore(subscribe, () => expenses);
}
export function useGoals() {
    return useSyncExternalStore(subscribe, () => goals);
}
export function useDeposits() {
    return useSyncExternalStore(subscribe, () => deposits);
}

export function addCategory(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) return;
    categories = [...categories, { name: trimmed, icon: 'pricetag-outline' }];
    emit();
}

export function addExpense(entry: Omit<ExpenseEntry, 'id'>) {
    expenses = [{ ...entry, id: `e${Date.now()}` }, ...expenses];
    emit();
}

export function addGoal(name: string, target: number) {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (goals.some((g) => g.name.toLowerCase() === trimmed.toLowerCase())) return;
    goals = [...goals, { name: trimmed, icon: 'flag-outline', target: Math.max(target, 0) }];
    emit();
}

export function addDeposit(entry: Omit<DepositEntry, 'id'>) {
    deposits = [{ ...entry, id: `d${Date.now()}` }, ...deposits];
    emit();
}

export function findCategory(name: string) {
    return categories.find((c) => c.name.toLowerCase() === name.toLowerCase());
}

export function findGoal(name: string) {
    return goals.find((g) => g.name.toLowerCase() === name.toLowerCase());
}