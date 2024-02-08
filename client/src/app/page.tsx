"use client";

import { Box, Container, Typography } from "@mui/material";
import { useState } from "react";
import ForgotPassword from "../components/auth/ForgotPassword";
import SignIn from "../components/auth/SignIn";
import SignUp from "../components/auth/SignUp";

export type AuthFormType = "SIGN_UP" | "SIGN_IN" | "FORGOT_PW";

export default function App() {
	const [authFormType, setAuthFormType] = useState<AuthFormType>("SIGN_IN");
	const [email, setEmail] = useState<string>("");

	return (
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
	);
}
