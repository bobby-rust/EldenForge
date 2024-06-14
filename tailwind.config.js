/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			gridAutoColumns: {
				autofit: "repeat(auto-fit, minmax(200px, 1fr))",
			},
			keyframes: {
				fadeIn: {
					"0%": { opacity: 0 },
					"100%": { opacity: 1 },
				},
				fadeOut: {
					"0%": { opacity: 1 },
					// "99%": { display: "block" },
					"100%": { opacity: 0 },
				},
				// slideDown: {
				// 	"0%": { transform: "translateY(-360px)" },
				// 	"100%": { transform: "translateY(100px)" },
				// },
				// slideUp: {
				// 	"0%": { transform: "translateY(460px)" },
				// 	// "99%": { transform: "translateY(-400px)" },
				// 	"100%": { transform: "translateY(0px)" },
				// },
			},
			animation: {
				fadeIn: "fadeIn 0.5s ease-in-out forwards",
				fadeOut: "fadeOut 0.5s ease-in-out forwards",
				// slideDown: "slideDown 0.5s ease-in-out forwards",
				// slideUp: "slideUp 0.5s ease-in-out forwards",
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
	plugins: [require("daisyui")],
	daisyui: {
		themes: [
			"light",
			"dark",
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
