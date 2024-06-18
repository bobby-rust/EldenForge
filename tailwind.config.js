/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
		screens: {
			xs: "320px",
			sm: "640px",
			// => @media (min-width: 640px) { ... }

			md: "930px",
			// => @media (min-width: 768px) { ... }

			lg: "1032px",
			// => @media (min-width: 1024px) { ... }

			"2lg": "1050px",

			xl: "1225px",
			// => @media (min-width: 1280px) { ... }

			"2xl": "1550px",
			// => @media (min-width: 1536px) { ... }

			"2.5xl": "1800px",

			"3xl": "2048px",

			"4xl": "2560px",
		},
	},
	plugins: [require("tailwindcss-animate"), require("daisyui")],
	daisyui: {
		themes: [
			{
				light: {
					...require("daisyui/src/theming/themes")["light"],
					primary: "#ef8b09",
					secondary: "#1e293b",
				},
			},
			{
				dark: {
					...require("daisyui/src/theming/themes")["dark"],
					primary: "#ef8b09",
					secondary: "#475569",
				},
			},
			"cupcake",
			"bumblebee",
			"emerald",
			"corporate",
			"synthwave",
			"retro",
			"cyberpunk",
			"valentine",
			"halloween",
			"garden",
			"forest",
			"aqua",
			"lofi",
			"pastel",
			"fantasy",
			"wireframe",
			"black",
			"luxury",
			"dracula",
			"cmyk",
			"autumn",
			"business",
			"acid",
			"lemonade",
			"night",
			"coffee",
			"winter",
			"dim",
			"nord",
			"sunset",
		],
	},
};
