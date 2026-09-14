import { render } from '@testing-library/react-native';

const mockReplace = jest.fn();
const mockPush = jest.fn();

jest.mock('expo-router', () => ({
    router: {
        replace: mockReplace,
        push: mockPush,
    },
    useLocalSearchParams: jest.fn(),
}));

jest.mock('../lib/categoryStore', () => ({
    addCategory: jest.fn(),
    useCategories: () => [
        { name: 'Food', icon: 'restaurant-outline' },
        { name: 'Transport', icon: 'bus-outline' },
        { name: 'Groceries', icon: 'cart-outline' },
    ],
}));

const { useLocalSearchParams } = require('expo-router');
let CategoriesScreen: any;

describe('CategoriesScreen', () => {
    beforeEach(() => {
        mockReplace.mockClear();
        mockPush.mockClear();

        (useLocalSearchParams as jest.Mock).mockReturnValue({
            demoEmail: 'demo@example.com',
            income: '2500',
            expenses: '700',
            currency: 'USD',
        });

        CategoriesScreen = require('../app/categories').default;
    });

    it('renders the category overview and balance summary', async () => {
        const { getByText } = await render(<CategoriesScreen />);

        expect(getByText('Categories')).toBeTruthy();
        expect(getByText('Total Balance')).toBeTruthy();
        expect(getByText('$1,800.00')).toBeTruthy();
        expect(getByText('Food')).toBeTruthy();
        expect(getByText('Transport')).toBeTruthy();
    });
});
