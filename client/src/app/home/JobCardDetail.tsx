import CardColorPicker from "@/components/form/CardColorPicker";
import FormSubmitButtons from "@/components/form/FormSubmitButtons";
import JobDashQuill from "@/components/form/JobDashQuill";
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
import "react-quill/dist/quill.snow.css";
import CompanyAutocomplete, {
	Company,
} from "../../components/form/CompanyAutocomplete";
import JobStatusDropdown from "../../components/form/JobStatusDropdown";
import WorkingModelDropdown, {
	WorkingModel,
} from "../../components/form/WorkingModelDropdown";
import { JobsPayload } from "./page";

type FormData = {
	company: Company;
	jobTitle: string;
	url: string;
	status: string;
	date: Moment;
	salary: string;
	location: string;
	workingModel: WorkingModel;
	color: string;
	description: string;
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

type Props = {
	job: JobsPayload;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function JobCardDetail({ job, open, setOpen }: Props) {
	const [company, setCompany] = useState<Company | null>(null);
	const formMethods = useForm<FormData>();
	const { register, handleSubmit } = formMethods;

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
			<DialogContent sx={{ overflowY: "visible", width: "600px" }}>
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
											...register("date", { value: moment(job.lastUpdated) }),
										}}
										sx={{ mt: 1 }}
									/>
								</LocalizationProvider>
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
							<Grid item xs={9}>
								<TextField
									id="url"
									label="Job Listing URL"
									{...formFieldProps}
									{...register("url")}
								/>
							</Grid>
							<Grid item xs={3}>
								<CardColorPicker
									currCardColor={job.cardColor}
									textFieldProps={formFieldProps}
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
							<Grid item xs={4}>
								<TextField
									id="location"
									label="Location"
									{...formFieldProps}
									{...register("location")}
								/>
							</Grid>
							<Grid item xs={4}>
								<TextField
									id="salary"
									label="Salary"
									type="number"
									{...formFieldProps}
									{...register("salary")}
								/>
							</Grid>
							<Grid item xs={4}>
								<WorkingModelDropdown />
							</Grid>
						</Grid>
						<Typography variant="caption" sx={{ ml: 1 }}>
							Notes
						</Typography>
						<JobDashQuill />
					</Grid>
				</FormProvider>
			</DialogContent>
			<FormSubmitButtons
				onDiscard={() => {}}
				onSubmit={() => {}}
				isPending={false}
			/>
		</Dialog>
	);
}
