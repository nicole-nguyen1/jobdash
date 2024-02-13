import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { LoadingButton } from "@mui/lab";
import { DialogActions, Typography } from "@mui/material";

type Props = {
	isPending: boolean;
	onCancel: () => void;
	onSubmit: () => void;
	isError: boolean;
	isSuccess?: boolean;
	onDelete?: () => void;
};

export default function FormSubmitButtons({
	isPending,
	onCancel,
	onSubmit,
	isError,
	onDelete,
	isSuccess = false,
}: Props) {
	return (
		<DialogActions>
			{isError && (
				<Typography
					variant="body2"
					sx={{ fontStyle: "italic", m: 2, color: "rgba(255, 0, 0, 0.9)" }}
				>
					Error saving job. Try again or report bug.
				</Typography>
			)}
			{isSuccess && (
				<Typography variant="body2" sx={{ fontStyle: "italic", m: 2 }}>
					Saved successfully.
				</Typography>
			)}
			<LoadingButton
				size="small"
				variant="outlined"
				onClick={onCancel}
				loading={isPending}
			>
				<span>Cancel</span>
			</LoadingButton>
			{onDelete != null && (
				<LoadingButton
					size="small"
					variant="contained"
					startIcon={<DeleteIcon />}
					onClick={onDelete}
					loading={isPending}
					loadingPosition="start"
				>
					<span>Delete</span>
				</LoadingButton>
			)}
			<LoadingButton
				size="small"
				variant="contained"
				startIcon={<SaveIcon />}
				type="submit"
				onClick={onSubmit}
				loading={isPending}
				loadingPosition="start"
			>
				<span>Save</span>
			</LoadingButton>
		</DialogActions>
	);
}
