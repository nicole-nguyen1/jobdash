import {
	Avatar,
	Grid,
	InputAdornment,
	Typography,
	debounce,
} from "@mui/material";
import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";
import { AutocompleteElement } from "react-hook-form-mui";

export type Company = {
	name: string;
	domain: string;
	logo: string;
};

type Props = {
	companies: Array<Company>;
	company: Company | null;
	setCompany: Dispatch<SetStateAction<Company | null>>;
	setCompanies: Dispatch<SetStateAction<Array<Company>>>;
};

export default function CompanyAutocomplete({
	companies,
	company,
	setCompany,
	setCompanies,
}: Props) {
	const [inputValue, setInputValue] = useState("");

	const loadOptions = async (input: string) => {
		if (input.length === 0) {
			return;
		}
		await axios
			.get(
				`https://autocomplete.clearbit.com/v1/companies/suggest?query=${input}`
			)
			.then((res) => setCompanies(res.data));
	};

	const debouncedLoadOptions = debounce(loadOptions, 1000);

	return (
		<AutocompleteElement
			name="company"
			options={companies ?? []}
			label="Company"
			textFieldProps={{
				InputLabelProps: { shrink: true },
				InputProps: {
					startAdornment:
						company != null ? (
							<InputAdornment position="start">
								<Avatar
									alt={company.name}
									src={company.logo}
									sx={{ width: 20, height: 20, ml: 1 }}
								/>
							</InputAdornment>
						) : null,
				},
			}}
			autocompleteProps={{
				isOptionEqualToValue: (option, value) => {
					if (value != null) {
						return option.name === value.name;
					}
					return false;
				},
				size: "small",
				getOptionLabel: (option) => option.name,
				value: company,
				onChange: (_e, newValue, reason) => {
					setCompany(newValue);
					setInputValue(newValue != null ? newValue.name : "");
				},
				inputValue,
				onInputChange: (_e, newValue, reason) => {
					setCompany(null);
					setInputValue(newValue);
					debouncedLoadOptions(newValue);
				},
				sx: { mt: 1, mb: 1 },
				renderOption: (props, option) => {
					return (
						<li key={option.name} {...props}>
							<Grid container alignItems="center">
								<Grid item sx={{ display: "flex" }}>
									<Avatar
										alt={option.name}
										src={option.logo}
										sx={{ width: 20, height: 20 }}
									/>
								</Grid>
								<Grid
									item
									sx={{
										width: "calc(100% - 44px)",
										wordWrap: "break-word",
										paddingLeft: "16px",
									}}
								>
									<Typography variant="body2">{option.name}</Typography>
									<Typography variant="subtitle2">{option.domain}</Typography>
								</Grid>
							</Grid>
						</li>
					);
				},
			}}
		/>
	);
}
