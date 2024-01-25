import { AuthFormType } from "@/app/page";
import { VisibilityOff, Visibility } from "@mui/icons-material";
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
	IconButton,
	InputAdornment,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import validator from "validator";
import PasswordInput from "./PasswordInput";

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

const PASSWORD_REQUIREMENTS_STR =
	"Must be 8-20 characters long and have at least 1 number and 1 symbol";

export default function SignUp({ authFormType, setAuthFormType }: Props) {
	const formMethods = useForm<FormData>();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = formMethods;
	const [showPassword, setShowPassword] = useState(false);

	console.log(errors);

	const onSubmit = (data: FormData) => {};

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
