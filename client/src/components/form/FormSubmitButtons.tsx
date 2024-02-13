import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { LoadingButton } from "@mui/lab";
import { DialogActions, Typography } from "@mui/material";

type Props = {
	isPending: boolean;
	onDiscard: () => void;
	onSubmit: () => void;
	isError: boolean;
	isSuccess?: boolean;
};

export default function FormSubmitButtons({
	isPending,
	onDiscard,
	onSubmit,
	isError,
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
				onClick={onSubmit}
				loading={isPending}
				loadingPosition="start"
			>
				<span>Save Job</span>
			</LoadingButton>
		</DialogActions>
	);
}
