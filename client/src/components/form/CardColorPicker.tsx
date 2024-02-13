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
	const [color, setColor] = useState<string | null>(null);
	const [anchorEl, setAnchorEl] = useState<null | HTMLInputElement>(null);
	const { register, setValue } = useFormContext();

	const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const loadedColor = color == null ? currCardColor : color;

	return (
		<>
			<TextField
				id="card-color-picker"
				label="Card Color"
				onClick={handleClick}
				InputProps={{
					style: {
						color: loadedColor,
						backgroundColor: loadedColor,
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
					color={loadedColor}
					onChange={(c) => {
						setColor(c.hex);
						setValue("color", c.hex);
					}}
				/>
				<Button
					variant="contained"
					sx={{ mt: 2 }}
					onClick={() => {
						setColor(currCardColor);
						setValue("color", currCardColor);
					}}
				>
					Reset to company color
				</Button>
			</Popover>
		</>
	);
}
