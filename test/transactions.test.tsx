import { fireEvent, render } from '@testing-library/react-native';

const mockReplace = jest.fn();
const mockPush = jest.fn();

jest.mock('expo-router', () => ({
    router: {
        replace: mockReplace,
        push: mockPush,
    },
    useLocalSearchParams: jest.fn(),
}));

const { useLocalSearchParams } = require('expo-router');
let TransactionsScreen: any;

describe('TransactionsScreen', () => {
    beforeEach(() => {
        mockReplace.mockClear();
        mockPush.mockClear();

        (useLocalSearchParams as jest.Mock).mockReturnValue({
            demoEmail: 'demo@example.com',
            income: '2500',
            expenses: '700',
            currency: 'USD',
        });

        TransactionsScreen = require('../app/transactions').default;
    });

    it('renders the main transaction summary and balance', async () => {
        const { getByText } = await render(<TransactionsScreen />);

        expect(getByText('Transaction')).toBeTruthy();
        expect(getByText('Total Balance')).toBeTruthy();
        expect(getByText('$1,800.00')).toBeTruthy();
        expect(getByText('Income')).toBeTruthy();
        expect(getByText('Expense')).toBeTruthy();
    });

    it('navigates home when pressing the back button', async () => {
        const { getByLabelText } = await render(<TransactionsScreen />);

        fireEvent.press(getByLabelText('Go back to home'));

        expect(mockReplace).toHaveBeenCalledWith({
            pathname: '/',
            params: {
                demoEmail: 'demo@example.com',
                income: '2500',
                expenses: '700',
                currency: 'USD',
            },
        });
    });
});
