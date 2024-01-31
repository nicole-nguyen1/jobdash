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
import React, { Dispatch, SetStateAction, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import validator from "validator";
import PasswordInput from "./PasswordInput";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

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
	const router = useRouter();

	const [showLoginError, setShowLoginError] = useState<boolean>(false);

	const mutation = useMutation({
		mutationFn: (data: FormData) =>
			axios.post("http://localhost:8080/auth/login", data, {
				withCredentials: true,
			}),
		onSuccess: (data) => {
			console.log(data);
			if (data.data.event === "USER_LOGIN_FAILED") {
				setShowLoginError(true);
			} else if (data.data.event === "USER_LOGIN_SUCCESS") {
				router.push("/home");
			}
		},
		onError: (error) => console.log({ error }),
	});

	const onSubmit = (data: FormData) => {
		mutation.mutate(data);
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
			{showLoginError && (
				<Typography variant="body2" sx={{ fontStyle: "italic", m: 2 }}>
					Try a different email and/or password or reset your password.
				</Typography>
			)}
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
