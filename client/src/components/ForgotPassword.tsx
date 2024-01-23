import { AuthFormType } from "@/app/page";
import { Box, Typography, TextField, Button, Grid } from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";

type Props = {
	setAuthFormType: Dispatch<SetStateAction<AuthFormType>>;
};

export default function ForgotPassword({ setAuthFormType }: Props) {
	return (
		<Box
			sx={{
				marginTop: "8px",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			}}
		>
			<Typography variant="h6">Forgot password?</Typography>
			<Box component="form" onSubmit={() => {}} noValidate sx={{ mt: 1 }}>
				<TextField
					margin="dense"
					required
					fullWidth
					id="email"
					label="Email Address"
					name="email"
					autoComplete="email"
					autoFocus
					size="small"
				/>
				<Grid container direction="row" columnGap={1}>
					<Grid item xs>
						<Button
							type="submit"
							variant="outlined"
							sx={{ mt: 3, mb: 2 }}
							onClick={() => setAuthFormType("SIGN_IN")}
						>
							Back
						</Button>
					</Grid>
					<Grid item>
						<Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
							Request password reset
						</Button>
					</Grid>
				</Grid>
			</Box>
		</Box>
	);
}
