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
} from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";
import { FormProvider, useForm } from "react-hook-form";
import validator from "validator";
import PasswordInput from "./PasswordInput";

type Props = {
	authFormType: AuthFormType;
	setAuthFormType: Dispatch<SetStateAction<AuthFormType>>;
	setEmail: Dispatch<SetStateAction<string>>;
};

type FormData = {
	email: string;
	password: string;
};

export default function SignIn({
	authFormType,
	setAuthFormType,
	setEmail,
}: Props) {
	const formMethods = useForm<FormData>();
	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors },
	} = formMethods;

	const onSubmit = (data: FormData) => {
		console.log(data);
	};

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
			<FormProvider {...formMethods}>
				<Box
					component="form"
					onSubmit={handleSubmit(onSubmit)}
					noValidate
					sx={{ mt: 1 }}
				>
					<TextField
						margin="dense"
						required
						fullWidth
						id="email"
						label="Email Address"
						autoComplete="email"
						size="small"
						{...register("email", {
							validate: (value) => validator.isEmail(value),
						})}
					/>
					<PasswordInput authFormType={authFormType} />
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
							<Link
								onClick={() => {
									setEmail(getValues("email"));
									setAuthFormType("FORGOT_PW");
								}}
								variant="body2"
							>
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
			</FormProvider>
		</Box>
	);
}
