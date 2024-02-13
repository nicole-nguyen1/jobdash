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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
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
	salary: number;
	location: string;
	workingModel: WorkingModel;
	color: string;
	description: string;
};

type RequestBody = {
	company: string;
	jobTitle: string;
	url: string | null;
	cardColor: string | null;
	companyURL: string;
	salary: number | null;
	location: string | null;
	workingModel: WorkingModel | null;
	description: string | null;
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
	const queryClient = useQueryClient();
	const [company, setCompany] = useState<Company | null>(null);
	const formMethods = useForm<FormData>({
		defaultValues: {
			company: company != null ? company : {},
			jobTitle: job.title,
			url: job.url ?? "",
			color: job.card_color ?? job.company_color,
			location: job.location ?? "",
			salary: job.salary ?? undefined,
			description: job.description ?? "",
			workingModel: job.working_model ?? undefined,
		},
	});
	const { register, handleSubmit, reset, setValue } = formMethods;

	useEffect(() => {
		axios
			.get("https://company.clearbit.com/v1/domains/find", {
				headers: {
					Authorization: "Bearer " + process.env.NEXT_PUBLIC_CLEARBIT_API_KEY,
				},
				params: {
					name: job.company_name,
				},
			})
			.then((res) => {
				setCompany(res.data);
				setValue("company", res.data);
			});
	}, []);

	const onDiscard = () => {
		reset();
		setOpen(false);
	};

	const { mutate, isPending, isSuccess, isError } = useMutation({
		mutationFn: (data: RequestBody) =>
			axios.post("http://localhost:8080/pipeline/update", data, {
				params: { job_id: job.id },
				withCredentials: true,
			}),
		onSuccess: (data) =>
			queryClient.setQueryData(["fetchJobs", { withCredentials: true }], data),
		onError: (error) => console.log(error),
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["fetchJobs"] }),
	});

	const onSubmit = async (data: FormData) => {
		const {
			company,
			jobTitle,
			url,
			color,
			salary,
			location,
			workingModel,
			description,
		} = data;

		const requestBody = {
			company: company.name,
			companyURL: company.domain,
			jobTitle,
			url: url.length > 0 ? url : null,
			cardColor: color === job.company_color ? null : color,
			salary: isNaN(salary) ? null : salary,
			location: location.length > 0 ? location : null,
			workingModel: workingModel.length > 0 ? workingModel : null,
			description:
				description != null && description.length > 0 ? description : null,
		};
		mutate(requestBody);
	};

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
							<Grid item xs={8}>
								<JobStatusDropdown
									loadedStatus={`${job.curr_status}-${job.substatus}`}
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
						<TextField
							id="url"
							label="Job Listing URL"
							{...formFieldProps}
							{...register("url")}
						/>
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
				</FormProvider>
			</DialogContent>
			<FormSubmitButtons
				onDiscard={onDiscard}
				onSubmit={handleSubmit(onSubmit)}
				isPending={isPending}
				isError={isError}
				isSuccess={isSuccess}
			/>
		</Dialog>
	);
}
