import { render } from "@testing-library/react-native";
import React from "react";
import Notifications from "../app/notifications";

describe("Notifications Screen", () => {
    test("renders the Notifications screen", async () => {
        const { getByText } = await render(<Notifications />);
        expect(getByText(/Notifications/i)).toBeTruthy();
    });
});