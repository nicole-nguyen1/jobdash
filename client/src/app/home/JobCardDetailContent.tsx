import CardColorPicker from "@/components/form/CardColorPicker";
import CompanyAutocomplete, {
	Company,
} from "@/components/form/CompanyAutocomplete";
import JobDashQuill from "@/components/form/JobDashQuill";
import WorkingModelDropdown, {
	WorkingModel,
} from "@/components/form/WorkingModelDropdown";
import {
	Avatar,
	DialogContent,
	DialogTitle,
	Grid,
	TextField,
	TextFieldProps,
	Typography,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { JobsPayload } from "./page";

type Props = {
	job: JobsPayload;
	company: Company | null;
	setCompany: Dispatch<SetStateAction<Company | null>>;
};

export type JobDetailFormData = {
	company: Company;
	jobTitle: string;
	url: string;
	salary: number;
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

export default function JobCardDetailContent({
	job,
	company,
	setCompany,
}: Props) {
	// const formMethods = useForm<JobDetailFormData>({
	// 	defaultValues: {
	// 		company: company != null ? company : {},
	// 		jobTitle: job.title,
	// 		url: job.url ?? "",
	// 		color: job.card_color ?? job.company_color,
	// 		location: job.location ?? "",
	// 		salary: job.salary ?? undefined,
	// 		description: job.description ?? "",
	// 		workingModel: job.working_model ?? undefined,
	// 	},
	// });
	const formMethods = useFormContext();
	const { register, setValue } = formMethods;

	useEffect(() => {
		if (company != null) {
			setValue("company", company);
		}
	}, [company]);

	return (
		<Grid item xs={10}>
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
							src={`https://logo.clearbit.com/${job.company_url}`}
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
						<Typography variant="body1">{job.company_name}</Typography>
					</Grid>
				</Grid>
			</DialogTitle>
			<DialogContent sx={{ overflowY: "visible" }}>
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
							<CompanyAutocomplete company={company} setCompany={setCompany} />
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
						<Grid item xs={8}>
							<TextField
								id="url"
								label="Job Listing URL"
								{...formFieldProps}
								{...register("url")}
							/>
						</Grid>
						<Grid item xs={4}>
							<CardColorPicker
								companyColor={job.company_color}
								currCardColor={job.card_color ?? job.company_color}
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
								{...register("salary", { valueAsNumber: true })}
							/>
						</Grid>
						<Grid item xs={4}>
							<WorkingModelDropdown loadedModel={job.working_model} />
						</Grid>
					</Grid>
					<Typography variant="caption" sx={{ ml: 1 }}>
						Notes
					</Typography>
					<JobDashQuill />
				</Grid>
			</DialogContent>
		</Grid>
	);
}
