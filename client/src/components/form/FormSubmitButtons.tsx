import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { LoadingButton } from "@mui/lab";
import { DialogActions } from "@mui/material";

type Props = {
	isPending: boolean;
	onDiscard: () => void;
	onSubmit: () => void;
};

export default function FormSubmitButtons({
	isPending,
	onDiscard,
	onSubmit,
}: Props) {
	return (
		<DialogActions>
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
