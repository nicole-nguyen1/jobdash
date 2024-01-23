import { AuthFormType } from "@/app/page";
import {
	Box,
	Typography,
	TextField,
	FormControlLabel,
	Checkbox,
	Button,
	Grid,
	Link,
	Card,
} from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";

type Props = {
	setAuthFormType: Dispatch<SetStateAction<AuthFormType>>;
};

export default function SignIn({ setAuthFormType }: Props) {
	return (
		<Box
			sx={{
				marginTop: 4,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			}}
		>
			<Typography variant="h5">Sign in</Typography>
			<Box component="form" onSubmit={() => {}} noValidate sx={{ mt: 1 }}>
				<TextField
					margin="dense"
					required
					fullWidth
					id="email"
					label="Email Address"
					name="email"
					autoComplete="email"
					size="small"
				/>
				<TextField
					margin="dense"
					required
					fullWidth
					name="password"
					label="Password"
					type="password"
					id="password"
					autoComplete="current-password"
					size="small"
				/>
				<FormControlLabel
					control={<Checkbox value="remember" color="primary" />}
					label="Remember me"
				/>
				<Button
					type="submit"
					fullWidth
					variant="contained"
					sx={{ mt: 3, mb: 2 }}
				>
					Sign In
				</Button>
				<Grid container>
					<Grid item xs>
						<Link onClick={() => setAuthFormType("FORGOT_PW")} variant="body2">
							Forgot password?
						</Link>
					</Grid>
					<Grid item>
						<Link onClick={() => setAuthFormType("SIGN_UP")} variant="body2">
							{"Don't have an account? Sign Up"}
						</Link>
					</Grid>
				</Grid>
			</Box>
		</Box>
	);
}
