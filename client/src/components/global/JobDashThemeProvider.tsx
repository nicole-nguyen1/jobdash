"use client";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import React from "react";

const darkTheme = createTheme({
	palette: {
		mode: "dark",
	},
});

export default function JobDashThemeProvider({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	);
}
