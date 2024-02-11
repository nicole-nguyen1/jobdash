import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { LoadingButton } from "@mui/lab";
import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Divider,
	FormControl,
	Modal,
	TextField,
	TextFieldProps,
	Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ColorThief from "colorthief";
import { Moment } from "moment";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { DatePickerElement } from "react-hook-form-mui";
import rgbToHex from "../utils/rgbToHex";
import CompanyAutocomplete, { Company } from "./CompanyAutocomplete";
import JobStatusDropdown from "./JobStatusDropdown";

type FormData = {
	company: Company;
	jobTitle: string;
	url: string;
	status: string;
	date: Moment;
};

type RequestBody = {
	company: string;
	jobTitle: string;
	url: string | null;
	date: string;
	status: string;
	substatus: string | null;
	companyColor: string | null;
	companyURL: string;
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
	const [company, setCompany] = useState<Company | null>(null);
	const [companies, setCompanies] = useState<any[]>([]);
	const [companyLogoColor, setCompanyLogoColor] = useState<string | null>(null);
	const formMethods = useForm<FormData>();
	const { register, handleSubmit, reset } = formMethods;

	const onDiscard = () => {
		reset();
		setOpen(false);
	};

	const { mutate, isPending, isIdle, isSuccess, isError } = useMutation({
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

		const requestBody: RequestBody = {
			company: company.name,
			jobTitle,
			url: url.length > 0 ? url : null,
			date: date.format("YYYY-MM-DD"),
			status: statuses[0],
			substatus: statuses.length > 1 ? statuses[1] : null,
			companyColor: companyLogoColor,
			companyURL: company.domain,
		};
		mutate(requestBody);
	};

	useEffect(() => {
		if (isSuccess) {
			setOpen(false);
		}
	}, [isSuccess]);

	useEffect(() => {
		if (company != null) {
			const img = new Image();
			img.crossOrigin = "Anonymous";
			img.src = company.logo;

			if (!img.complete) {
				img.addEventListener("load", function () {
					setCompanyLogoColor(rgbToHex(colorThief.getColor(img)));
				});
			}
		}
	}, [company]);

	return (
		<>
			<Button variant="contained" fullWidth onClick={() => setOpen(true)}>
				<AddIcon />
			</Button>
			<Modal
				open={open}
				onClose={() => setOpen(false)}
				aria-labelledby="modal-add-job-listing"
			>
				<Box>
					<FormProvider {...formMethods}>
						<Card sx={style}>
							<CardHeader title="Add Job" sx={{ textAlign: "center" }} />
							<CardContent sx={{ paddingX: 0 }}>
								{isError && (
									<Typography
										variant="body2"
										sx={{ fontStyle: "italic", m: 2 }}
									>
										Error saving job. Try again or report bug.
									</Typography>
								)}
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
										}}
										sx={{ mt: 1 }}
									/>
								</LocalizationProvider>
								<Divider sx={{ margin: "16px 0" }} />
								<FormControl sx={{ width: "100%", padding: "4px" }}>
									<TextField
										id="url"
										label="Import from Job Listing URL"
										{...formFieldProps}
										{...register("url")}
									/>
									<Divider>or</Divider>
									<CompanyAutocomplete
										company={company}
										companies={companies}
										setCompany={setCompany}
										setCompanies={setCompanies}
									/>
									<TextField
										id="jobTitle"
										label="Job Title"
										{...formFieldProps}
										{...register("jobTitle")}
									/>
								</FormControl>
							</CardContent>
							<CardActions sx={{ justifyContent: "end" }}>
								<LoadingButton
									size="small"
									variant="contained"
									startIcon={<DeleteIcon />}
									onClick={onDiscard}
									loading={isPending}
									loadingPosition="start"
								>
									<span>Discard</span>
								</LoadingButton>
								<LoadingButton
									size="small"
									variant="contained"
									startIcon={<SaveIcon />}
									type="submit"
									onClick={handleSubmit(onSubmit)}
									loading={isPending}
									loadingPosition="start"
								>
									<span>Save Job</span>
								</LoadingButton>
							</CardActions>
						</Card>
					</FormProvider>
				</Box>
			</Modal>
		</>
	);
}
