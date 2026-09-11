import { fireEvent, render, screen } from '@testing-library/react-native';


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
        // require the screen after mocks are set up so imports pick up mocked module
        TransactionsScreen = require('../app/transactions').default;

        (useLocalSearchParams as jest.Mock).mockReturnValue({
            demoEmail: 'demo@example.com',
            income: '2500',
            expenses: '700',
            currency: 'USD',
        });
    });

    it('renders the main transaction summary and balance', () => {
        render(<TransactionsScreen />);

        expect(screen.getByText('Transaction')).toBeTruthy();
        expect(screen.getByText('Total Balance')).toBeTruthy();
        expect(screen.getByText('$1,800.00')).toBeTruthy();
        expect(screen.getByText('Income')).toBeTruthy();
        expect(screen.getByText('Expense')).toBeTruthy();
    });

    it('opens the notification modal', () => {
        render(<TransactionsScreen />);

        fireEvent.press(screen.getByLabelText('Open notifications'));

        expect(screen.getByText('Notifications')).toBeTruthy();
        expect(screen.getByText('Your financial pulse, in one place')).toBeTruthy();
    });

    it('navigates home when pressing the back button', () => {
        render(<TransactionsScreen />);

        fireEvent.press(screen.getByLabelText('Go back to home'));

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
