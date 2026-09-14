import { render } from "@testing-library/react-native";
import React from "react";

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
let Home: any;

describe("Home Screen", () => {
    beforeEach(() => {
        (useLocalSearchParams as jest.Mock).mockReturnValue({
            demoEmail: 'demo@example.com',
            income: '2500',
            expenses: '700',
            currency: 'USD',
        });

        Home = require('../app/(tabs)/index').default;
    });

    test("renders the Home screen", async () => {
        const { getByText } = await render(<Home />);

        expect(getByText(/Have a good day!/i)).toBeTruthy();
    });
});