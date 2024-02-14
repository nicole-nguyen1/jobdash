import FormSubmitButtons from "@/components/form/FormSubmitButtons";
import AddIcon from "@mui/icons-material/Add";
import {
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	Grid,
	TextField,
	TextFieldProps,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ColorThief from "colorthief";
import { Moment } from "moment";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { DatePickerElement } from "react-hook-form-mui";
import CompanyAutocomplete, {
	Company,
} from "../../components/form/CompanyAutocomplete";
import JobStatusDropdown from "../../components/form/JobStatusDropdown";
import rgbToHex from "../utils/rgbToHex";

type FormData = {
	company: Company;
	jobTitle: string | null;
	url: string | null;
	status: string;
	date: Moment;
};

type RequestBody = {
	company?: string;
	jobTitle?: string;
	url?: string | null;
	date: string;
	status: string;
	substatus: string | null;
	companyColor?: string | null;
	companyURL?: string;
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
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};

const colorThief = new ColorThief();

export default function AddJobListingButton() {
	const queryClient = useQueryClient();
	const [open, setOpen] = useState<boolean>(false);
	const [companyName, setCompanyName] = useState<string | null>(null);
	const [fetchedCompany, setFetchedCompany] = useState<Company | null>(null);
	const [companyLogoColor, setCompanyLogoColor] = useState<string | null>(null);
	const formMethods = useForm<FormData>();
	const { register, handleSubmit, reset, watch } = formMethods;

	const onCancel = () => {
		reset({
			url: null,
			jobTitle: null,
		});
		setOpen(false);
	};

	const { mutate, isPending, isSuccess, isError } = useMutation({
		mutationFn: (data: RequestBody) =>
			axios.post("http://localhost:8080/pipeline/add", data, {
				withCredentials: true,
			}),
		onSuccess: (data) =>
			queryClient.setQueryData(["fetchJobs", { withCredentials: true }], data),
		onError: (error) => console.log(error),
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["fetchJobs"] }),
	});

	const onSubmit = async (data: FormData) => {
		const { company, jobTitle, status, url, date } = data;
		const statuses = status.split("-");

		let requestBody: RequestBody = {
			date: date.utc().format("YYYY-MM-DD") ?? null,
			status: statuses[0],
			substatus: statuses.length > 1 ? statuses[1] : null,
			company: company?.name ?? fetchedCompany?.name,
			companyColor: companyLogoColor,
			companyURL: company?.domain ?? fetchedCompany?.domain,
		};

		if (url != null && url.length > 0) {
			requestBody = { ...requestBody, url };
		} else {
			requestBody = {
				...requestBody,
				jobTitle: jobTitle ?? "",
			};
		}

		console.log(requestBody);
		mutate(requestBody);
	};

	useEffect(() => {
		if (isSuccess) {
			onCancel();
		}
	}, [isSuccess]);

	const setLogoColor = useCallback((logo: string) => {
		const img = new Image();
		img.crossOrigin = "Anonymous";
		img.src = logo;

		if (!img.complete) {
			img.addEventListener("load", function () {
				setCompanyLogoColor(rgbToHex(colorThief.getColor(img)));
			});
		}
	}, []);

	useEffect(() => {
		const subscription = watch((data) => {
			if (data.company != null) {
				setLogoColor(data?.company.logo ?? "");
			} else if (data.url != null && data.url.length > 0) {
				const url = new URL(data.url);
				const splitPath = url.pathname.split("/");
				const companyName = splitPath[1];
				setCompanyName(companyName);
			}
		});
		return () => subscription.unsubscribe();
	}, [watch]);

	useEffect(() => {
		if (companyName != null) {
			axios
				.get("https://company.clearbit.com/v1/domains/find", {
					headers: {
						Authorization: "Bearer " + process.env.NEXT_PUBLIC_CLEARBIT_API_KEY,
					},
					params: {
						name: companyName,
					},
				})
				.then((res) => {
					setFetchedCompany(res.data);
					setLogoColor(res.data.logo);
				});
		}
	}, [companyName]);

	return (
		<>
			<Button variant="contained" fullWidth onClick={() => setOpen(true)}>
				<AddIcon />
			</Button>
			<Dialog open={open} onClose={() => setOpen(false)}>
				<DialogTitle>Add Job</DialogTitle>
				<DialogContent sx={{ overflowY: "visible", width: "500px" }}>
					<FormProvider {...formMethods}>
						<Grid container direction="column" rowGap={2}>
							<JobStatusDropdown />
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
										...register("date"),
									}}
								/>
							</LocalizationProvider>
							<Divider />
							<Grid container direction="column" rowGap={1}>
								<TextField
									id="url"
									label="Import from Job Listing URL"
									{...formFieldProps}
									{...register("url")}
								/>
								<Divider sx={{ padding: "4px" }}>or</Divider>
								<CompanyAutocomplete />
								<TextField
									id="jobTitle"
									label="Job Title"
									{...formFieldProps}
									{...register("jobTitle")}
								/>
							</Grid>
						</Grid>
					</FormProvider>
				</DialogContent>
				<FormSubmitButtons
					onCancel={onCancel}
					onSubmit={handleSubmit(onSubmit)}
					isPending={isPending}
					isError={isError}
				/>
			</Dialog>
		</>
	);
}
