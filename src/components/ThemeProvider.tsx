import React, { ReactNode, createContext } from "react";

/**
 * The ThemeContextType is a type that represents the shape of the context object
 * that is used to manage the state of the application's theme.
 *
 * It consists of two properties:
 * - `theme`: a string that represents the current theme of the application.
 * - `setTheme`: a function that allows components to update the theme of the application.
 *
 * The `setTheme` function takes a string parameter which is the new theme to be set.
 */
interface ThemeContextType {
	/**
	 * The current theme of the application.
	 */
	theme: string;

	/**
	 * A function that allows components to update the theme of the application.
	 *
	 * @param {string} theme - The new theme to be set.
	 */
	setTheme: (theme: string) => void;
}

/**
 * The ThemeContext is a React context that provides the current theme of the application and
 * a function to update it.
 */
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * The `ThemeProviderProps` interface defines the props that the `ThemeProvider` component accepts.
 * It requires the `children` prop to be of type `ReactNode`.
 */
interface ThemeProviderProps {
	/**
	 * The children components that will have access to the theme context.
	 */
	children: ReactNode;
}

/**
 * The `ThemeProvider` component is a wrapper component that provides the current theme and a
 * function to update it to all its child components.
 *
 * @param {ThemeProviderProps} props - The props that the component accepts.
 * @returns {JSX.Element} - The wrapped components.
 */
export function ThemeProvider({ children }: ThemeProviderProps): JSX.Element {
	// Get the current theme from local storage, or default to "light" if not set.
	const [theme, setTheme] = React.useState(localStorage.getItem("theme") || "light");

	// Update the theme in local storage and the document's data-theme attribute whenever the theme changes.
	React.useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem("theme", theme);
	}, [theme]);

	// Provide the current theme and a function to update it to all child components.
	return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}
