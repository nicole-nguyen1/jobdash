import { AuthFormType } from "@/app/page";
import { Box, Typography, TextField, Button, Grid } from "@mui/material";
import React, { Dispatch, SetStateAction, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import validator from "validator";

type Props = {
	setAuthFormType: Dispatch<SetStateAction<AuthFormType>>;
	email: string;
};

type FormData = {
	email: string;
};

export default function ForgotPassword({ setAuthFormType, email }: Props) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();
	const [showEmailSentMessage, setShowEmailSentMessage] =
		useState<boolean>(false);

	const onSubmit = (data: FormData) => {
		setShowEmailSentMessage(true);
	};

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
				onSubmit={handleSubmit(onSubmit)}
				sx={{ mt: 1, width: "100%" }}
			>
				<TextField
					margin="dense"
					required
					fullWidth
					id="email"
					label="Email Address"
					autoComplete="email"
					size="small"
					defaultValue={email}
					error={errors.email != null}
					helperText={errors?.email && "Invalid email address"}
					{...register("email", {
						required: "Email is required",
						validate: (value) => validator.isEmail(value),
					})}
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
