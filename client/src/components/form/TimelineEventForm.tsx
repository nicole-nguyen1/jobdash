import { Dialog, DialogContent, DialogTitle, Grid } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment, { Moment } from "moment";
import { Dispatch, SetStateAction } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { DatePickerElement } from "react-hook-form-mui";
import FormSubmitButtons from "./FormSubmitButtons";
import JobStatusDropdown from "./JobStatusDropdown";

export type TimelineEventFormData = {
	status: string;
	date: Moment | null;
};

export type TimelineEventRequestBody = {
	status: string;
	date: string;
	substatus: string | null;
};

type Props = {
	formTitle: string;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	isPending: boolean;
	onSubmit: (data: TimelineEventFormData) => Promise<void>;
	isError: boolean;
	loadedStatus?: string;
	loadedDate?: string | null;
	onDelete?: () => void;
};

export default function TimelineEventForm({
	formTitle,
	open,
	setOpen,
	isPending,
	onSubmit,
	isError,
	loadedStatus,
	loadedDate,
	onDelete,
}: Props) {
	const formMethods = useForm<TimelineEventFormData>({
		defaultValues: {
			status: loadedStatus,
			date: loadedDate != null ? moment(loadedDate) : null,
		},
	});
	const { handleSubmit, register, reset } = formMethods;

	const onCancel = () => {
		reset();
		setOpen(false);
	};

	return (
		<Dialog open={open} onClose={() => setOpen(false)}>
			<DialogTitle>{formTitle}</DialogTitle>
			<DialogContent sx={{ width: "300px" }}>
				<FormProvider {...formMethods}>
					<Grid container sx={{ mt: 1 }} rowGap={2}>
						<JobStatusDropdown loadedStatus={loadedStatus} />
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
					</Grid>
				</FormProvider>
			</DialogContent>
			<FormSubmitButtons
				onSubmit={handleSubmit(onSubmit)}
				isPending={isPending}
				onCancel={onCancel}
				isError={isError}
				onDelete={onDelete}
			/>
		</Dialog>
	);
}
