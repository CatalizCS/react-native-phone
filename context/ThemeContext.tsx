import React, { createContext, useState, useContext, ReactNode } from "react";

const lightTheme = {
	background: "#FFFFFF",
	text: "#333333",
	primary: "#6200EE",
	accent: "#03DAC6",
	secondary: "#018786",
	surface: "#F5F5F5",
	error: "#B00020",
	transparent: "rgba(0,0,0,0)",
};

const darkTheme = {
	background: "#121212",
	text: "#E1E1E1",
	primary: "#BB86FC",
	accent: "#03DAC6",
	secondary: "#03DAC6",
	surface: "#1E1E1E",
	error: "#CF6679",
	transparent: "rgba(0,0,0,0)",
};

type Theme = typeof lightTheme;

interface ThemeContextProps {
	theme: Theme;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [theme, setTheme] = useState<Theme>(lightTheme);

	const toggleTheme = () => {
		setTheme((prevTheme) =>
			prevTheme === lightTheme ? darkTheme : lightTheme
		);
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = (): ThemeContextProps => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};
