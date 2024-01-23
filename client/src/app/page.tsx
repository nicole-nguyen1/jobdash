"use client";

import SignIn from "@/components/SignIn";
import {
	Box,
	Typography,
	createTheme,
	ThemeProvider,
	CssBaseline,
	Container,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const darkTheme = createTheme({
	palette: {
		mode: "dark",
	},
});

export default function Home() {
	const [showSignIn, setShowSignIn] = useState<boolean>(false);

	// useEffect(() => {
	// 	fetch("http://localhost:8080/api/home")
	// 		.then((res) => res.json())
	// 		.then((res) => setMessage(res.message));
	// }, []);

	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<Container component="main" maxWidth="sm">
				<Box
					sx={{
						marginTop: 8,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						borderWidth: "1px",
						borderStyle: "solid",
						borderColor: "primary.main",
						borderRadius: "4px",
						paddingX: 8,
						paddingY: 4,
					}}
				>
					<Box sx={{ textAlign: "center" }}>
						<Typography variant="h3">JobDash</Typography>
						<Typography variant="subtitle1">
							A job search tracker and insights tool
						</Typography>
					</Box>
					<SignIn />
				</Box>
			</Container>
		</ThemeProvider>
	);
}
