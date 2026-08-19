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

export const THEMES: Record<string, Theme> = {
    classic: {
        id: "classic",
        name: "Classic",
        description: "Traditional book styling with serif fonts",
        colors: {
            primary: "#1a1a1a",
            secondary: "#4a4a4a",
            background: "#ffffff",
            text: "#2d2d2d",
            accent: "#8b4513",
            muted: "#999999",
        },
        fonts: {
            body: "Georgia, serif",
            heading: "Garamond, serif",
            code: "Courier New, monospace",
        },
        spacing: {
            small: 8,
            medium: 16,
            large: 24,
        },
    },

    modern: {
        id: "modern",
        name: "Modern",
        description: "Clean, contemporary design with sans-serif fonts",
        colors: {
            primary: "#000000",
            secondary: "#333333",
            background: "#ffffff",
            text: "#1a1a1a",
            accent: "#0066cc",
            muted: "#666666",
        },
        fonts: {
            body: "Inter, sans-serif",
            heading: "Helvetica Neue, sans-serif",
            code: "Monaco, monospace",
        },
        spacing: {
            small: 10,
            medium: 20,
            large: 30,
        },
    },

    minimal: {
        id: "minimal",
        name: "Minimal",
        description: "Minimal design with focus on content",
        colors: {
            primary: "#2d2d2d",
            secondary: "#5a5a5a",
            background: "#fafafa",
            text: "#3a3a3a",
            accent: "#4a4a4a",
            muted: "#8a8a8a",
        },
        fonts: {
            body: "system-ui, sans-serif",
            heading: "system-ui, sans-serif",
            code: "SF Mono, monospace",
        },
        spacing: {
            small: 6,
            medium: 12,
            large: 18,
        },
    },

    vintage: {
        id: "vintage",
        name: "Vintage",
        description: "Nostalgic, classic typography",
        colors: {
            primary: "#3e2723",
            secondary: "#5d4037",
            background: "#f5f5dc",
            text: "#4e342e",
            accent: "#8d6e63",
            muted: "#a1887f",
        },
        fonts: {
            body: "Baskerville, serif",
            heading: "Palatino, serif",
            code: "Courier, monospace",
        },
        spacing: {
            small: 12,
            medium: 18,
            large: 28,
        },
    },

    academic: {
        id: "academic",
        name: "Academic",
        description: "Scholarly appearance for academic works",
        colors: {
            primary: "#1a237e",
            secondary: "#303f9f",
            background: "#ffffff",
            text: "#212121",
            accent: "#3f51b5",
            muted: "#757575",
        },
        fonts: {
            body: "Times New Roman, serif",
            heading: "Times New Roman, serif",
            code: "Consolas, monospace",
        },
        spacing: {
            small: 8,
            medium: 16,
            large: 24,
        },
    },

    dark: {
        id: "dark",
        name: "Dark Mode",
        description: "Dark theme for comfortable reading",
        colors: {
            primary: "#e0e0e0",
            secondary: "#b0b0b0",
            background: "#1a1a1a",
            text: "#e8e8e8",
            accent: "#bb86fc",
            muted: "#808080",
        },
        fonts: {
            body: "Georgia, serif",
            heading: "Arial, sans-serif",
            code: "Fira Code, monospace",
        },
        spacing: {
            small: 10,
            medium: 20,
            large: 30,
        },
    },

    technical: {
        id: "technical",
        name: "Technical",
        description: "Optimized for technical documentation",
        colors: {
            primary: "#263238",
            secondary: "#37474f",
            background: "#ffffff",
            text: "#263238",
            accent: "#00897b",
            muted: "#78909c",
        },
        fonts: {
            body: "Roboto, sans-serif",
            heading: "Roboto, sans-serif",
            code: "Fira Code, monospace",
        },
        spacing: {
            small: 8,
            medium: 16,
            large: 24,
        },
    },

    elegant: {
        id: "elegant",
        name: "Elegant",
        description: "Refined and sophisticated styling",
        colors: {
            primary: "#1c1c1c",
            secondary: "#4a4a4a",
            background: "#fdfdf9",
            text: "#2c2c2c",
            accent: "#c9a961",
            muted: "#9a9a9a",
        },
        fonts: {
            body: "Crimson Text, serif",
            heading: "Playfair Display, serif",
            code: "Source Code Pro, monospace",
        },
        spacing: {
            small: 10,
            medium: 20,
            large: 32,
        },
    },
};

export class ThemeService {
    getAllThemes(): Theme[] {
        return Object.values(THEMES);
    }

    getTheme(id: string): Theme | undefined {
        return THEMES[id];
    }

    applyTheme(theme: Theme): string {
        return `
:root {
    --color-primary: ${theme.colors.primary};
    --color-secondary: ${theme.colors.secondary};
    --color-background: ${theme.colors.background};
    --color-text: ${theme.colors.text};
    --color-accent: ${theme.colors.accent};
    --color-muted: ${theme.colors.muted};

    --font-body: ${theme.fonts.body};
    --font-heading: ${theme.fonts.heading};
    --font-code: ${theme.fonts.code};

    --spacing-small: ${theme.spacing.small}px;
    --spacing-medium: ${theme.spacing.medium}px;
    --spacing-large: ${theme.spacing.large}px;
}

body {
    font-family: var(--font-body);
    color: var(--color-text);
    background-color: var(--color-background);
}

h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    color: var(--color-primary);
}

code, pre {
    font-family: var(--font-code);
}
        `.trim();
    }
}
