import { camelCaseToWords } from "@/app/utils/camelcaseToWords";
import {
	FormControl,
	InputLabel,
	Select,
	SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

type Props = {
	fieldName: string;
	items: React.ReactNode;
	preloadedValue?: string | null;
};

export default function BaseDropdown({
	fieldName,
	items,
	preloadedValue = "",
}: Props) {
	const [value, setValue] = useState<string>("");
	const { register } = useFormContext();

	const label = camelCaseToWords(fieldName);

	const handleChange = (e: SelectChangeEvent<string>) => {
		setValue(e.target.value);
	};

	useEffect(() => {
		if (preloadedValue != null && preloadedValue.length > 0) {
			setValue(preloadedValue);
		}
	}, [preloadedValue]);

	return (
		<FormControl required sx={{ width: "100%" }}>
			<InputLabel
				variant="outlined"
				size="small"
				id={`${fieldName}-label`}
				htmlFor={fieldName}
				shrink={true}
			>
				{label}
			</InputLabel>
			<Select
				id={fieldName}
				value={value}
				label={label}
				size="small"
				fullWidth
				notched
				MenuProps={MenuProps}
				{...register(fieldName)}
				defaultValue={value}
				onChange={(e) => handleChange(e)}
			>
				{items}
			</Select>
		</FormControl>
	);
}
