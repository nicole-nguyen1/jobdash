import {
	Avatar,
	Dialog,
	DialogContent,
	DialogTitle,
	Grid,
	TextField,
	TextFieldProps,
	Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment, { Moment } from "moment";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { DatePickerElement } from "react-hook-form-mui";
import CompanyAutocomplete, { Company } from "./CompanyAutocomplete";
import JobStatusDropdown from "./JobStatusDropdown";
import { JobsPayload } from "./page";

type FormData = {
	company: Company;
	jobTitle: string;
	url: string;
	status: string;
	date: Moment;
};

const formFieldProps: TextFieldProps = {
	margin: "dense",
	fullWidth: true,
	size: "small",
	InputLabelProps: {
		shrink: true,
	},
	sx: { mb: 1 },
};

const style = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 600,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};

type Props = {
	job: JobsPayload;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function JobCardDetail({ job, open, setOpen }: Props) {
	const [company, setCompany] = useState<Company | null>(null);
	const [companies, setCompanies] = useState<any[]>([]);
	const [companyLogoColor, setCompanyLogoColor] = useState<string | null>(null);
	const [date, setDate] = useState<Moment | undefined>(moment(job.lastUpdated));
	const formMethods = useForm<FormData>();
	const { register, handleSubmit, reset } = formMethods;

	useEffect(() => {
		axios
			.get("https://company.clearbit.com/v1/domains/find", {
				headers: {
					Authorization: "Bearer " + process.env.NEXT_PUBLIC_CLEARBIT_API_KEY,
				},
				params: {
					name: job.companyName,
				},
			})
			.then((res) => setCompany(res.data));
	}, []);

	return (
		<Dialog open={open} onClose={() => setOpen(false)}>
			<DialogTitle>
				<Grid
					container
					direction="row"
					columns={12}
					columnGap={2}
					sx={{ alignItems: "center" }}
				>
					<Grid item sx={{ mr: 2 }} xs={1}>
						<Avatar
							src={`https://logo.clearbit.com/${job.companyURL}`}
							sx={{
								border: "2px solid white",
								width: 48,
								height: 48,
								backgroundColor: "white",
							}}
						/>
					</Grid>
					<Grid item xs={10}>
						<Typography variant="h5" sx={{ fontWeight: "bold" }}>
							{job.title}
						</Typography>
						<Typography variant="body1">{job.companyName}</Typography>
					</Grid>
				</Grid>
			</DialogTitle>
			<DialogContent sx={{ overflowY: "visible", width: "500px" }}>
				<FormProvider {...formMethods}>
					<Grid container direction="column" rowGap={1}>
						<Grid
							container
							item
							direction="row"
							columns={12}
							spacing={2}
							alignItems="center"
						>
							<Grid item xs={6}>
								<CompanyAutocomplete
									company={company}
									setCompany={setCompany}
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									id="jobTitle"
									label="Job Title"
									defaultValue={job.title}
									{...formFieldProps}
									{...register("jobTitle")}
								/>
							</Grid>
						</Grid>
						<Grid
							container
							item
							direction="row"
							columns={12}
							spacing={2}
							alignItems="center"
						>
							<Grid item xs={6}>
								<JobStatusDropdown
									loadedStatus={`${job.currStatus}-${job.substatus}`}
								/>
							</Grid>
							<Grid item xs={6}>
								<LocalizationProvider dateAdapter={AdapterMoment}>
									<DatePickerElement
										label="Date"
										name="date"
										required
										inputProps={{
											InputLabelProps: { shrink: true },
											size: "small",
											required: true,
											fullWidth: true,
											...register("date", { value: date }),
										}}
										sx={{ mt: 1 }}
									/>
								</LocalizationProvider>
							</Grid>
						</Grid>
					</Grid>
				</FormProvider>
			</DialogContent>
		</Dialog>
	);
}
