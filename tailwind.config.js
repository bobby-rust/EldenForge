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
				"fade-in": {
					from: { opacity: 0 },
					to: { opacity: 1 },
				},

				"border-shine": {
					"100%": {
						transform: "rotate(-360deg)",
					},
				},

				"slide-down": {
					"0%": { transform: "translateY(-15%)", opacity: 0 },
					"25%": { opacity: 0 },
					"100%": { transform: "translateY(0)", opacity: 1 },
				},

				"slide-up": {
					"0%": { transform: "translateY(0)", opacity: 1 },
					"50%": { opacity: 0 },
					"100%": { transform: "translateY(-15%)", opacity: 0 },
				},
				"grid-slide-down": {
					from: { transform: "translateY(var(--description-height))" },
					to: { transform: "translateY(0)" },
				},
				"grid-slide-up": {
					from: { transform: "translateY(0)" },
					to: { transform: "translateY(var(--description-height))" },
				},
				"landing-slide-up": {
					from: { transform: "translateY(100%)", opacity: 0 },
					"50%": { opacity: 0.25 },
					to: { transform: "translateY(0)", opacity: 1 },
				},
				wiggle: {
					"0%, 100%": { transform: "rotate(-0.3deg)" },
					"50%": { transform: "rotate(0.3deg)" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"fade-in": "fade-in 0.4s ease-out",
				wiggle: "wiggle 0.5s ease-in-out infinite",
				"description-slide-down": "slide-down 0.5s ease-out",
				"description-slide-up": "slide-up 0.2s ease-out forwards",
				"grid-slide-down": "grid-slide-down 0.5s ease-out",
				"grid-slide-up": "grid-slide-up 0.5s ease-out forwards",
				"landing-slide-up": "landing-slide-up 0.5s ease-out",
				"border-shine": "border-shine 3s ease-in-out infinite",
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

			"2xl": "1600px",
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
