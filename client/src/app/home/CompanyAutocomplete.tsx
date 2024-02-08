import { Avatar, Grid, Typography, debounce } from "@mui/material";
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

	const loadOptions = (input: string) => {
		if (input.length === 0) {
			return;
		}
		fetch(
			`https://autocomplete.clearbit.com/v1/companies/suggest?query=${input}`
		)
			.then((res) => res.json())
			.then((res) => setCompanies(res));
	};

	const debouncedLoadOptions = debounce(loadOptions, 1000);

	return (
		<AutocompleteElement
			name="company"
			options={companies ?? []}
			label="Company"
			textFieldProps={{
				InputLabelProps: { shrink: true },
			}}
			autocompleteProps={{
				isOptionEqualToValue: (option, value) => {
					if (value != null) {
						return option.name === value.name;
					}
					return false;
				},
				getOptionLabel: (option) => option.name,
				value: company,
				onChange: (_e, newValue) => {
					setCompany(newValue);
					setInputValue(newValue != null ? newValue.name : "");
				},
				inputValue,
				onInputChange: (_e, newValue) => {
					setInputValue(newValue);
					debouncedLoadOptions(newValue);
				},
				renderOption: (props, option) => {
					return (
						<li key={option.name} {...props}>
							<Grid container alignItems="center">
								<Grid item sx={{ display: "flex", width: 44 }}>
									<Avatar alt={option.name} src={option.logo} />
								</Grid>
								<Grid
									item
									sx={{
										width: "calc(100% - 44px)",
										wordWrap: "break-word",
									}}
								>
									<Typography variant="body1">{option.name}</Typography>
									<Typography variant="body2">{option.domain}</Typography>
								</Grid>
							</Grid>
						</li>
					);
				},
			}}
		/>
	);
}
