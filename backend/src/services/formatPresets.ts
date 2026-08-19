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

export const FORMAT_PRESETS: Record<string, FormatPreset> = {
    novel: {
        id: "novel",
        name: "Novel",
        description: "Standard format for fiction novels",
        category: "fiction",
        pageSize: "6x9",
        margins: {
            top: 25,
            right: 20,
            bottom: 25,
            left: 20,
        },
        typography: {
            bodyFont: "Georgia, serif",
            headingFont: "Georgia, serif",
            bodySize: 11,
            headingSize: 18,
            lineHeight: 1.5,
            paragraphSpacing: 12,
        },
        layout: {
            columns: 1,
            headerHeight: 15,
            footerHeight: 15,
            firstLineIndent: 15,
        },
        chapterStyle: {
            startOnNewPage: true,
            numberingStyle: "numeric",
            titleAlignment: "center",
            titleCase: "uppercase",
        },
    },

    academic: {
        id: "academic",
        name: "Academic Paper",
        description: "Format for academic papers and theses",
        category: "academic",
        pageSize: "A4",
        margins: {
            top: 25,
            right: 25,
            bottom: 25,
            left: 30,
        },
        typography: {
            bodyFont: "Times New Roman, serif",
            headingFont: "Times New Roman, serif",
            bodySize: 12,
            headingSize: 14,
            lineHeight: 2,
            paragraphSpacing: 0,
        },
        layout: {
            columns: 1,
            headerHeight: 20,
            footerHeight: 20,
            firstLineIndent: 0,
        },
        chapterStyle: {
            startOnNewPage: true,
            numberingStyle: "numeric",
            titleAlignment: "left",
            titleCase: "none",
        },
    },

    technical: {
        id: "technical",
        name: "Technical Manual",
        description: "Format for technical documentation and manuals",
        category: "technical",
        pageSize: "letter",
        margins: {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
        },
        typography: {
            bodyFont: "Arial, sans-serif",
            headingFont: "Arial, sans-serif",
            bodySize: 10,
            headingSize: 14,
            lineHeight: 1.4,
            paragraphSpacing: 8,
        },
        layout: {
            columns: 1,
            headerHeight: 15,
            footerHeight: 15,
            firstLineIndent: 0,
        },
        chapterStyle: {
            startOnNewPage: false,
            numberingStyle: "numeric",
            titleAlignment: "left",
            titleCase: "none",
        },
    },

    manuscript: {
        id: "manuscript",
        name: "Manuscript Submission",
        description: "Industry-standard manuscript format for submissions",
        category: "fiction",
        pageSize: "letter",
        margins: {
            top: 25,
            right: 25,
            bottom: 25,
            left: 25,
        },
        typography: {
            bodyFont: "Courier New, monospace",
            headingFont: "Courier New, monospace",
            bodySize: 12,
            headingSize: 12,
            lineHeight: 2,
            paragraphSpacing: 0,
        },
        layout: {
            columns: 1,
            headerHeight: 15,
            footerHeight: 15,
            firstLineIndent: 12.5,
        },
        chapterStyle: {
            startOnNewPage: true,
            numberingStyle: "none",
            titleAlignment: "center",
            titleCase: "uppercase",
        },
    },

    ebook: {
        id: "ebook",
        name: "eBook",
        description: "Optimized for digital reading",
        category: "fiction",
        pageSize: "A5",
        margins: {
            top: 15,
            right: 15,
            bottom: 15,
            left: 15,
        },
        typography: {
            bodyFont: "Georgia, serif",
            headingFont: "Arial, sans-serif",
            bodySize: 12,
            headingSize: 16,
            lineHeight: 1.6,
            paragraphSpacing: 10,
        },
        layout: {
            columns: 1,
            headerHeight: 0,
            footerHeight: 0,
            firstLineIndent: 0,
        },
        chapterStyle: {
            startOnNewPage: true,
            numberingStyle: "none",
            titleAlignment: "left",
            titleCase: "capitalize",
        },
    },

    textbook: {
        id: "textbook",
        name: "Textbook",
        description: "Format for educational textbooks",
        category: "academic",
        pageSize: "letter",
        margins: {
            top: 20,
            right: 20,
            bottom: 20,
            left: 25,
        },
        typography: {
            bodyFont: "Arial, sans-serif",
            headingFont: "Arial, sans-serif",
            bodySize: 11,
            headingSize: 16,
            lineHeight: 1.5,
            paragraphSpacing: 10,
        },
        layout: {
            columns: 1,
            headerHeight: 20,
            footerHeight: 20,
            firstLineIndent: 0,
        },
        chapterStyle: {
            startOnNewPage: true,
            numberingStyle: "numeric",
            titleAlignment: "left",
            titleCase: "capitalize",
        },
    },
};

export class FormatPresetService {
    getAllPresets(): FormatPreset[] {
        return Object.values(FORMAT_PRESETS);
    }

    getPreset(id: string): FormatPreset | undefined {
        return FORMAT_PRESETS[id];
    }

    getPresetsByCategory(category: FormatPreset["category"]): FormatPreset[] {
        return Object.values(FORMAT_PRESETS).filter(
            (preset) => preset.category === category
        );
    }
}
