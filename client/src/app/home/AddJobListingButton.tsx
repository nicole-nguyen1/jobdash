import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
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
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import ColorThief from "colorthief";
import { Moment } from "moment";
import { useState } from "react";
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
	const [open, setOpen] = useState<boolean>(false);
	const [company, setCompany] = useState<Company | null>(null);
	const [companies, setCompanies] = useState<any[]>([]);
	const formMethods = useForm<FormData>();
	const { register, handleSubmit, reset } = formMethods;

	const onDiscard = () => {
		reset();
		setOpen(false);
	};

	const mutation = useMutation({
		mutationFn: (data: RequestBody) =>
			axios.post("http://localhost:8080/pipeline/add", data, {
				withCredentials: true,
			}),
		onSuccess: (data) => console.log(data),
		onError: (error) => console.log(error),
	});

	const onSubmit = (data: FormData) => {
		const { company, jobTitle, status, url, date } = data;
		const statuses = status.split("-");
		const img = new Image();
		img.crossOrigin = "Anonymous";
		img.src = company.logo;

		img.addEventListener("load", () => {});

		const requestBody: RequestBody = {
			company: company.name,
			jobTitle,
			url: url.length > 0 ? url : null,
			date: date.format("YYYY-MM-DD"),
			status: statuses[0],
			substatus: statuses.length > 1 ? statuses[1] : null,
			companyColor: rgbToHex(colorThief.getColor(img)),
			companyURL: company.domain,
		};
		console.log(requestBody);
		mutation.mutate(requestBody);
	};

	return (
		<>
			<Button variant="contained" fullWidth onClick={() => setOpen(true)}>
				<AddIcon />
			</Button>
			<Modal
				open={open}
				onClose={() => setOpen(false)}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box>
					<FormProvider {...formMethods}>
						<Card sx={style}>
							<CardHeader title="Add Job" sx={{ textAlign: "center" }} />
							<CardContent sx={{ paddingX: 0 }}>
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
								<Button
									size="small"
									variant="contained"
									startIcon={<DeleteIcon />}
									onClick={onDiscard}
								>
									Discard
								</Button>
								<Button
									size="small"
									variant="contained"
									startIcon={<SaveIcon />}
									type="submit"
									onClick={handleSubmit(onSubmit)}
								>
									Save Job
								</Button>
							</CardActions>
						</Card>
					</FormProvider>
				</Box>
			</Modal>
		</>
	);
}
