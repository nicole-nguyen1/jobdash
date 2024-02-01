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
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import JobStatusDropdown from "./JobStatusDropdown";
import { PipelineStatus } from "./pipelineStatusTypes";

type AddJobListingFormData = {
	company: string;
	jobTitle: string;
	url: URL;
	status: PipelineStatus;
	// substatus: AppliedType | InterviewType | OfferType | DecisionType | null;
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

export default function AddJobListingButton() {
	const [open, setOpen] = useState<boolean>(false);
	const formMethods = useForm<AddJobListingFormData>();
	const { register, handleSubmit, getValues, reset } = formMethods;

	const onDiscard = () => {
		reset();
		setOpen(false);
	};

	const onSubmit = (data: AddJobListingFormData) => {
		console.log(data);
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
								<Divider sx={{ margin: "16px 0" }} />
								<FormControl sx={{ width: "100%", padding: "4px" }}>
									<TextField
										id="url"
										label="Import from Job Listing URL"
										{...formFieldProps}
										{...register("url")}
									/>
									<Divider>or</Divider>
									<TextField
										id="company"
										label="Company"
										{...formFieldProps}
										{...register("company")}
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
