import { Colors, Fonts } from '../constants/theme';

describe('theme configuration', () => {
    it('defines the light and dark color palettes', () => {
        expect(Colors.light.text).toBe('#11181C');
        expect(Colors.light.background).toBe('#fff');
        expect(Colors.dark.text).toBe('#ECEDEE');
        expect(Colors.dark.background).toBe('#151718');
    });

    it('provides font definitions', () => {
        expect(Fonts).toBeDefined();
        expect(Fonts.sans).toEqual(expect.any(String));
        expect(Fonts.sans.length).toBeGreaterThan(0);
    });
});
