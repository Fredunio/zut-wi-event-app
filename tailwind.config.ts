import type { Config } from "tailwindcss";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const lightTheme = require("daisyui/src/theming/themes")["light"];
// eslint-disable-next-line @typescript-eslint/no-var-requires
const darkTheme = require("daisyui/src/theming/themes")["dark"];

export default {
    content: ["./app/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            borderWidth: {
                1: "1px",
                3: "3px",
            },
        },
    },
    plugins: [require("@tailwindcss/typography"), require("daisyui")],
    daisyui: {
        // TODO: modify themes
        themes: [
            {
                light: {
                    ...lightTheme,
                    secondary: "green",
                },
            },
            {
                dark: {
                    ...darkTheme,
                    secondary: "green",
                },
            },
        ],
        darkTheme: "dark",
        base: true,
    },
} satisfies Config;
