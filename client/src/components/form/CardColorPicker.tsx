import { Button, Popover, TextField, TextFieldProps } from "@mui/material";
import { useState } from "react";
import { CirclePicker } from "react-color";
import { useFormContext } from "react-hook-form";

type Props = {
	currCardColor: string;
	textFieldProps: TextFieldProps;
};

export default function CardColorPicker({
	currCardColor,
	textFieldProps,
}: Props) {
	const [value, setValue] = useState<string | null>(null);
	const [anchorEl, setAnchorEl] = useState<null | HTMLInputElement>(null);
	const { register } = useFormContext();

	const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);

	return (
		<>
			<TextField
				id="card-color-picker"
				label="Card Color"
				onClick={handleClick}
				InputProps={{
					style: {
						backgroundColor: value == null ? currCardColor : value,
					},
				}}
				{...register("color")}
				{...textFieldProps}
			/>
			<Popover
				id="color-picker-popover"
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				slotProps={{ paper: { sx: { padding: "16px" } } }}
			>
				<CirclePicker
					color={value == null ? currCardColor : value}
					onChange={(c) => {
						setValue(c.hex);
					}}
				/>
				<Button
					variant="contained"
					sx={{ mt: 2 }}
					onClick={() => setValue(currCardColor)}
				>
					Reset to company color
				</Button>
			</Popover>
		</>
	);
}
