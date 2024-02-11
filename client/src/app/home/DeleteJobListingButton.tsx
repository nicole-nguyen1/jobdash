import DeleteIcon from "@mui/icons-material/Delete";
import { LoadingButton } from "@mui/lab";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

type Props = {
	jobID: string;
};

export default function DeleteJobListingButton({ jobID }: Props) {
	const queryClient = useQueryClient();
	const [open, setOpen] = useState<boolean>(false);

	const archiveMutation = useMutation({
		mutationFn: () =>
			axios.post(
				"http://localhost:8080/pipeline/archive",
				{},
				{
					params: { job_id: jobID },
					withCredentials: true,
				}
			),
		onSuccess: (data) =>
			queryClient.setQueryData(["fetchJobs", { withCredentials: true }], data),
		onError: (error) => console.log(error),
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["fetchJobs"] }),
	});

	const onArchive = () => {
		archiveMutation.mutate();
	};

	const deleteMutation = useMutation({
		mutationFn: () =>
			axios.post(
				"http://localhost:8080/pipeline/delete",
				{},
				{
					params: { job_id: jobID },
					withCredentials: true,
				}
			),
		onSuccess: (data) =>
			queryClient.setQueryData(["fetchJobs", { withCredentials: true }], data),
		onError: (error) => console.log(error),
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["fetchJobs"] }),
	});

	const onDelete = () => {
		deleteMutation.mutate();
	};

	return (
		<>
			<IconButton
				edge="end"
				sx={{ padding: "2px" }}
				onClick={() => setOpen(true)}
			>
				<DeleteIcon sx={{ fontSize: 14 }} />
			</IconButton>
			<Dialog open={open} onClose={() => setOpen(false)}>
				<DialogTitle>Archive or Delete</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to delete this job? If you archive, you can
						still access the job and make changes to it.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<LoadingButton
						variant="contained"
						onClick={onArchive}
						loading={archiveMutation.isPending || deleteMutation.isPending}
					>
						<span>Archive</span>
					</LoadingButton>
					<LoadingButton
						variant="contained"
						onClick={onDelete}
						loading={archiveMutation.isPending || deleteMutation.isPending}
					>
						<span>Delete</span>
					</LoadingButton>
					<LoadingButton
						onClick={() => setOpen(false)}
						loading={archiveMutation.isPending || deleteMutation.isPending}
					>
						<span>Cancel</span>
					</LoadingButton>
				</DialogActions>
			</Dialog>
		</>
	);
}
