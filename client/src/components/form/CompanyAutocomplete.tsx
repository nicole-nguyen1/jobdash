import {
	Autocomplete,
	Avatar,
	Grid,
	InputAdornment,
	TextField,
	Typography,
	debounce,
} from "@mui/material";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";

export type Company = {
	name: string;
	domain: string;
	logo: string;
};

type Props = {
	company?: Company | null;
	setCompany?: Dispatch<SetStateAction<Company | null>> | null;
};

export default function CompanyAutocomplete({
	company = null,
	setCompany = null,
}: Props) {
	const { register } = useFormContext();
	const [autoCompleteValue, setAutoCompleteValue] = useState<Company | null>(
		company ?? null
	);
	const [inputValue, setInputValue] = useState("");
	const [options, setOptions] = useState<Company[]>([]);

	const loadOptions = async (input: string) => {
		if (input.length === 0) {
			return;
		}
		await axios
			.get(
				`https://autocomplete.clearbit.com/v1/companies/suggest?query=${input}`
			)
			.then((res) => setOptions(res.data));
	};

	const debouncefetch = useMemo(() => debounce(loadOptions, 1000), []);

	useEffect(() => {
		if (inputValue === "") {
			setOptions(autoCompleteValue ? [autoCompleteValue] : []);
		}

		debouncefetch(inputValue);
	}, [autoCompleteValue, inputValue, debouncefetch]);

	useEffect(() => {
		if (company != null) {
			setAutoCompleteValue(company);
		}
	}, [company]);

	return (
		<Autocomplete
			id="company"
			getOptionLabel={(option) =>
				typeof option === "string" ? option : option.name
			}
			filterOptions={(x) => x}
			options={options}
			autoComplete
			includeInputInList
			filterSelectedOptions
			value={autoCompleteValue}
			isOptionEqualToValue={(option, value) => {
				return option.name === value.name;
			}}
			onChange={(_event, newValue) => {
				setOptions(newValue ? [newValue, ...options] : options);
				setAutoCompleteValue(newValue);
			}}
			onInputChange={(_event, newInputValue) => {
				setCompany && setCompany(null);
				setInputValue(newInputValue);
			}}
			renderInput={(params) => (
				<TextField
					label="Company"
					size="small"
					fullWidth
					InputLabelProps={{ ...params.InputLabelProps, shrink: true }}
					InputProps={{
						...params.InputProps,
						startAdornment:
							autoCompleteValue != null ? (
								<InputAdornment position="start">
									<Avatar
										alt={autoCompleteValue.name}
										src={autoCompleteValue.logo}
										sx={{ width: 18, height: 18, ml: 1 }}
									/>
								</InputAdornment>
							) : null,
					}}
					inputProps={params.inputProps}
					{...register("company", { setValueAs: (v) => autoCompleteValue })}
				/>
			)}
			renderOption={(props, option) => {
				return (
					<li {...props} key={option.name}>
						<Grid container alignItems="center">
							<Grid item sx={{ display: "flex" }}>
								<Avatar
									alt={option.name}
									src={option.logo}
									sx={{ width: 18, height: 18 }}
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
			}}
		/>
	);
}
