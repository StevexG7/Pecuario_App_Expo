export const theme = {
    primary: {
        main: '#F0E8C9',    // Main Color
        text: '#141E46',    // Text Color
        contrastText: '#2B3D09', // Contrast Text Color
        button: '#FDCB48',  // Button Color
    },
    secondary: {
        main: '#B0A780',
        card_1: '#F0E8C9',
        card_2: '#FAF6E7',
        card_3: '#FAF8F1',
        background: '#FAF6E7',
    },
} as const;

// Type for the theme
export type Theme = typeof theme;

// Type for accessing theme colors
export type ThemeColors = {
    primary: {
        main: string;
        text: string;
        contrastText: string;
        button: string;
    };
    secondary: {
        main: string;
        card_1: string;
        card_2: string;
        card_3: string;
        background: string;
    };
};

