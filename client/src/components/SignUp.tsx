import { AuthFormType } from "@/app/page";
import {
	Box,
	Avatar,
	Link,
	Typography,
	Grid,
	TextField,
	FormControlLabel,
	Checkbox,
	Button,
} from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";

type Props = {
	setAuthFormType: Dispatch<SetStateAction<AuthFormType>>;
};

export default function SignUp({ setAuthFormType }: Props) {
	return (
		<Box
			sx={{
				marginTop: 4,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			}}
		>
			<Typography variant="h5">Sign up</Typography>
			<Box component="form" noValidate onSubmit={() => {}} sx={{ mt: 1 }}>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6}>
						<TextField
							autoComplete="given-name"
							name="firstName"
							required
							fullWidth
							id="firstName"
							label="First Name"
							size="small"
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							required
							fullWidth
							id="lastName"
							label="Last Name"
							name="lastName"
							autoComplete="family-name"
							size="small"
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							size="small"
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="new-password"
							size="small"
						/>
					</Grid>
				</Grid>
				<Button
					type="submit"
					fullWidth
					variant="contained"
					sx={{ mt: 3, mb: 2 }}
				>
					Sign Up
				</Button>
				<Grid container justifyContent="flex-end">
					<Grid item>
						<Link onClick={() => setAuthFormType("SIGN_IN")} variant="body2">
							Already have an account? Sign in
						</Link>
					</Grid>
				</Grid>
			</Box>
		</Box>
	);
}
