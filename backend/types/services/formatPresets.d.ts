export interface FormatPreset {
    id: string;
    name: string;
    description: string;
    category: "fiction" | "non-fiction" | "academic" | "technical";
    pageSize: "A4" | "A5" | "letter" | "6x9";
    margins: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    typography: {
        bodyFont: string;
        headingFont: string;
        bodySize: number;
        headingSize: number;
        lineHeight: number;
        paragraphSpacing: number;
    };
    layout: {
        columns: number;
        columnGap?: number;
        headerHeight: number;
        footerHeight: number;
        firstLineIndent: number;
    };
    chapterStyle: {
        startOnNewPage: boolean;
        numberingStyle: "numeric" | "roman" | "none";
        titleAlignment: "left" | "center" | "right";
        titleCase: "uppercase" | "capitalize" | "none";
    };
}
export declare const FORMAT_PRESETS: Record<string, FormatPreset>;
export declare class FormatPresetService {
    getAllPresets(): FormatPreset[];
    getPreset(id: string): FormatPreset | undefined;
    getPresetsByCategory(category: FormatPreset["category"]): FormatPreset[];
}
