import { AuthFormType } from "@/app/page";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import React, { useMemo, useState } from "react";
import { FieldErrors, UseFormRegister, useFormContext } from "react-hook-form";
import validator from "validator";

type Props = {
	authFormType: AuthFormType;
};

const PASSWORD_REQUIREMENTS_STR =
	"Must be 8-20 characters long and have at least 1 number and 1 symbol";

export default function PasswordInput({ authFormType }: Props) {
	const {
		register,
		formState: { errors },
	} = useFormContext();
	const [showPassword, setShowPassword] = useState(false);

	const autoComplete = useMemo(() => {
		switch (authFormType) {
			case "SIGN_IN":
				return "current-password";
			case "SIGN_UP":
				return "new-password";
			default:
				return undefined;
		}
	}, [authFormType]);

	const registerOptions = useMemo(() => {
		switch (authFormType) {
			case "SIGN_IN":
				return {};
			case "SIGN_UP":
				return {
					minLength: { value: 8, message: PASSWORD_REQUIREMENTS_STR },
					maxLength: { value: 20, message: PASSWORD_REQUIREMENTS_STR },
					required: "Required",
					validate: (value: string) =>
						(validator.isStrongPassword(value) && value.length < 21) ||
						PASSWORD_REQUIREMENTS_STR,
				};
			default:
				return {};
		}
	}, [authFormType]);

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	return (
		<TextField
			required
			fullWidth
			label="Password"
			type={showPassword ? "text" : "password"}
			id="password"
			autoComplete={autoComplete}
			size="small"
			error={errors?.password != null}
			helperText={
				authFormType === "SIGN_UP" &&
				errors?.password &&
				String(errors?.password.message)
			}
			InputProps={{
				endAdornment: (
					<InputAdornment position="end">
						<IconButton
							aria-label="toggle password visibility"
							onClick={handleClickShowPassword}
							edge="end"
						>
							{showPassword ? <VisibilityOff /> : <Visibility />}
						</IconButton>
					</InputAdornment>
				),
			}}
			{...register("password", registerOptions)}
		/>
	);
}
