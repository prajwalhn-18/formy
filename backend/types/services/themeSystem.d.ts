export interface ColorScheme {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
    muted: string;
}
export interface Theme {
    id: string;
    name: string;
    description: string;
    colors: ColorScheme;
    fonts: {
        body: string;
        heading: string;
        code: string;
    };
    spacing: {
        small: number;
        medium: number;
        large: number;
    };
}
export declare const THEMES: Record<string, Theme>;
export declare class ThemeService {
    getAllThemes(): Theme[];
    getTheme(id: string): Theme | undefined;
    applyTheme(theme: Theme): string;
}
