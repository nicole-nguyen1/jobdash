import FormSubmitButtons from "@/components/form/FormSubmitButtons";
import { Dialog, Divider, Grid } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import { Company } from "../../components/form/CompanyAutocomplete";
import { WorkingModel } from "../../components/form/WorkingModelDropdown";
import JobCardDetailContent, {
	JobDetailFormData,
} from "./JobCardDetailContent";
import JobCardTimeline from "./JobCardTimeline";
import { JobsPayload } from "./page";

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

type Props = {
	job: JobsPayload;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function JobCardDetail({ job, open, setOpen }: Props) {
	const queryClient = useQueryClient();
	const [company, setCompany] = useState<Company | null>(null);
	const formMethods = useForm<JobDetailFormData>({
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
	const { handleSubmit, reset } = formMethods;

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
			});
	}, []);

	const onCancel = () => {
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

	const onSubmit = async (data: JobDetailFormData) => {
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
		<Dialog
			open={open}
			onClose={() => setOpen(false)}
			sx={{
				"& .MuiDialog-container": {
					"& .MuiPaper-root": {
						width: "100%",
						maxWidth: "900px",
					},
				},
			}}
		>
			<Grid
				container
				columns={16}
				direction="row"
				justifyContent="space-between"
			>
				<FormProvider {...formMethods}>
					<JobCardDetailContent
						job={job}
						company={company}
						setCompany={setCompany}
					/>
				</FormProvider>
				<Divider orientation="vertical" sx={{ height: "auto", mt: 1 }} />
				<JobCardTimeline timelineID={job.timeline_id} />
			</Grid>
			<FormSubmitButtons
				onCancel={onCancel}
				onSubmit={handleSubmit(onSubmit)}
				isPending={isPending}
				isError={isError}
				isSuccess={isSuccess}
			/>
		</Dialog>
	);
}
