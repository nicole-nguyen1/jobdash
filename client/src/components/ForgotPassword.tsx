import { AuthFormType } from "@/app/page";
import { Box, Typography, TextField, Button, Grid } from "@mui/material";
import React, { Dispatch, SetStateAction, useCallback, useState } from "react";
import validator from "validator";

type Props = {
	setAuthFormType: Dispatch<SetStateAction<AuthFormType>>;
};

export default function ForgotPassword({ setAuthFormType }: Props) {
	const [email, setEmail] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const [showEmailSentMessage, setShowEmailSentMessage] =
		useState<boolean>(false);

	const onSubmit = (e: React.SyntheticEvent) => {
		const isEmailValid = validator.isEmail(email);
		if (isEmailValid) {
			setError(null);
			setShowEmailSentMessage(true);
		} else {
			setError("Invalid email address");
		}

		e.preventDefault();
	};

	const onChange = useCallback(
		(e: React.SyntheticEvent) => {
			if (showEmailSentMessage) {
				setShowEmailSentMessage(false);
			}
			setError(null);
			setEmail((e.target as HTMLInputElement).value);
		},
		[showEmailSentMessage]
	);

	return (
		<Box
			sx={{
				marginTop: 4,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				width: "100%",
			}}
		>
			<Box sx={{ textAlign: "center" }}>
				<Typography variant="h5">Forgot password?</Typography>
				{showEmailSentMessage && (
					<Typography variant="body2" sx={{ fontStyle: "italic", m: 2 }}>
						If you have an email registered with us, you will receive an email
						with a link to reset your password shortly.
					</Typography>
				)}
			</Box>
			<Box
				component="form"
				onSubmit={(e) => onSubmit(e)}
				sx={{ mt: 1, width: "100%" }}
			>
				<TextField
					margin="dense"
					required
					fullWidth
					id="email"
					label="Email Address"
					name="email"
					autoComplete="email"
					size="small"
					onChange={(e) => onChange(e)}
					error={error != null}
					helperText={error}
				/>
				<Grid container direction="row" columns={10} columnGap={4}>
					<Grid item columns={2}>
						<Button
							variant="outlined"
							sx={{ mt: 3, mb: 2 }}
							onClick={() => setAuthFormType("SIGN_IN")}
							fullWidth
						>
							Back
						</Button>
					</Grid>
					<Grid item xs columns={4}>
						<Button
							type="submit"
							variant="contained"
							fullWidth
							sx={{ mt: 3, mb: 2 }}
						>
							Request password reset
						</Button>
					</Grid>
				</Grid>
			</Box>
		</Box>
	);
}
