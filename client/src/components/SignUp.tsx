import { AuthFormType } from "@/app/page";
import { Box, Link, Typography, Grid, TextField, Button } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import validator from "validator";
import PasswordInput from "./PasswordInput";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {
	authFormType: AuthFormType;
	setAuthFormType: Dispatch<SetStateAction<AuthFormType>>;
};

type FormData = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
};

export default function SignUp({ authFormType, setAuthFormType }: Props) {
	const formMethods = useForm<FormData>();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = formMethods;
	const router = useRouter();

	const [showUserAlreadyExists, setShowUserAlreadyExists] =
		useState<boolean>(false);

	const mutation = useMutation({
		mutationFn: (data: FormData) =>
			axios.post("http://localhost:8080/auth/signup", data, {
				withCredentials: true,
			}),
		onSuccess: (data) => {
			if (data.data.event === "USER_ALREADY_EXISTS") {
				setShowUserAlreadyExists(true);
			} else if (data.data.event === "USER_CREATED_SUCCESS") {
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
			<Typography variant="h5">Sign up</Typography>
			{showUserAlreadyExists && (
				<Typography variant="body2" sx={{ fontStyle: "italic", m: 2 }}>
					You already have an existing account under this email. Try signing in.
				</Typography>
			)}
			<FormProvider {...formMethods}>
				<Box
					component="form"
					noValidate
					onSubmit={handleSubmit(onSubmit)}
					sx={{ mt: 1 }}
				>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<TextField
								autoComplete="given-name"
								required
								fullWidth
								id="firstName"
								label="First Name"
								size="small"
								error={errors.firstName != null}
								helperText={errors?.firstName && errors?.firstName?.message}
								{...register("firstName", { required: "Required" })}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								fullWidth
								id="lastName"
								label="Last Name"
								autoComplete="family-name"
								size="small"
								error={errors.lastName != null}
								helperText={errors?.lastName && errors?.lastName?.message}
								{...register("lastName", { required: "Required" })}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								id="email"
								label="Email Address"
								autoComplete="email"
								size="small"
								error={errors.email != null}
								helperText={errors?.email && errors?.email?.message}
								{...register("email", {
									required: "Required",
									validate: (value) => validator.isEmail(value),
								})}
							/>
						</Grid>
						<Grid item xs={12}>
							<PasswordInput authFormType={authFormType} />
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
			</FormProvider>
		</Box>
	);
}
