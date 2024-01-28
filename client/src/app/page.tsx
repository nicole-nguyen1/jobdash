"use client";

import ForgotPassword from "@/components/ForgotPassword";
import SignIn from "@/components/SignIn";
import SignUp from "@/components/SignUp";
import {
	Box,
	Typography,
	createTheme,
	ThemeProvider,
	CssBaseline,
	Container,
} from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

const darkTheme = createTheme({
	palette: {
		mode: "dark",
	},
});

const queryClient = new QueryClient();

export type AuthFormType = "SIGN_UP" | "SIGN_IN" | "FORGOT_PW";

export default function Home() {
	const [authFormType, setAuthFormType] = useState<AuthFormType>("SIGN_IN");
	const [email, setEmail] = useState<string>("");

	// useEffect(() => {
	// 	fetch("http://localhost:8080/api/home")
	// 		.then((res) => res.json())
	// 		.then((res) => setMessage(res.message));
	// }, []);

	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<QueryClientProvider client={queryClient}>
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
							<Typography variant="h1">JobDash</Typography>
							<Typography variant="subtitle1">
								A job search tracker and insights tool
							</Typography>
						</Box>
						{authFormType === "SIGN_IN" && (
							<SignIn
								authFormType={authFormType}
								setAuthFormType={setAuthFormType}
								setEmail={setEmail}
							/>
						)}
						{authFormType === "SIGN_UP" && (
							<SignUp
								authFormType={authFormType}
								setAuthFormType={setAuthFormType}
							/>
						)}
						{authFormType === "FORGOT_PW" && (
							<ForgotPassword setAuthFormType={setAuthFormType} email={email} />
						)}
					</Box>
				</Container>
			</QueryClientProvider>
		</ThemeProvider>
	);
}
