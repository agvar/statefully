export const Colors= {
    //Primary brand colors
    primary: '#1E3A5F',           // Navy Blue- primary buttons, accents
    secondary: '#CD7F32' ,        // Bronze -seecondary accents

    //state colors (flow vs drained)
    flow: '#007AFF',              // Blue -postive/creative state
    drain: '#FF6B35',              // Orange - negetive /overwhelmed state

    // Background colors
    background: {
        dark: '#000000',            // Think Stream dark background
        light: '#F2F2F7',           // Do Board/Pulse Background
        lightGray: '#F5F5F5',       // Subtle Background variation
        card: '#FFFFFF',            // Card Backgrounds
        cardDark : '#2C2C2E',       // Dark card background
    },

    //Text Colors
    text: {
     dark:{
        primary: '#FFFFFF' ,         // white text on dark background
        secondary: '#8E8E93',        // Gray test on dark background
        tertiary: '#636366'         // Lighter Gray for less important text
     },
     light:{
        primary: '#000000' ,        // Black text on light background
        secondary: '#3C3C43',       // Dark Grey on light background
        tertiary: '#8E8E93'        // Medium Gray for less important text
     }
    },

    //UI element colors
    border: {
        light: '#E5E5EA',           //Light border
        dark: '#38383A'            //Dark border
    },

    //Tab bar colors
    tabBar: {
        active: '#007AFF',         //iOS Blue for active tab
        inactive: '#8E8E93',       // Gray for inactive tab
        background: '#F2F2F7'      // Tab bar background
    },

    //Status colors

    success: '#34C759',            //Green for success status
    warning: '#FF9500',            // Orange for warning
    error: '#FF3B30',              //Red for error
    info: '#5AC8FA'                //Light blue for info

};

//Typography scale
export const Typography= {
    //Font sizes
    size:{
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 28,
        '4xl': 32,
        '5xl': 36,
    },

    //Font weights 
    weight :{
        regular: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const
    },

    //Line heights ( multipliers of font size)
    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
    },
};

//Spacing system (multiples of 8)
export const  Spacing ={
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
};

//Border radius

export const BorderRadius= {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 999, //Fully rounded (for cicular elements)
};

//Shadows (iOS -style elevation)
export const Shadows= {
    // small shadow for subtle elevation
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1},
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2, //Android
    },
    // small shadow for cards
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4, //Android
    },
    // Large shadow for modals/floating elements
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4},
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8, //Android
    },
};

//Layout constants

export const Layout= {
    // Screen padding
    screenPadding: Spacing.md,

    // Card padding
    cardPadding: Spacing.md,

    // Tab bar height(included safe area
    tabBarHeight: 88,

    // Header height
    headerHeight: 44,

    //Common dimensions
    buttonHeight: 48,
    inputHeight: 44,
    iconSize: 24
};