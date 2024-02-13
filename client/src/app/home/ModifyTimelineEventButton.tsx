import TimelineEventForm, {
	TimelineEventFormData,
	TimelineEventRequestBody,
} from "@/components/form/TimelineEventForm";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

type Props = {
	eventID: string;
	loadedStatus: string;
	loadedDate: string;
};

export default function ModifyTimelineEventButton({
	eventID,
	loadedStatus,
	loadedDate,
}: Props) {
	const queryClient = useQueryClient();
	const [open, setOpen] = useState<boolean>(false);

	const updateMutation = useMutation({
		mutationFn: (data: TimelineEventRequestBody) =>
			axios.post("http://localhost:8080/timeline/update", data, {
				params: { event_id: eventID },
				withCredentials: true,
			}),
		onSuccess: (data) =>
			queryClient.setQueryData(
				["fetchTimeline", { withCredentials: true }],
				data
			),
		onError: (error) => console.log(error),
		onSettled: () =>
			queryClient.invalidateQueries({ queryKey: ["fetchTimeline"] }),
	});

	const deleteMutation = useMutation({
		mutationFn: () =>
			axios.post(
				"http://localhost:8080/timeline/delete",
				{},
				{
					params: { event_id: eventID },
					withCredentials: true,
				}
			),
		onSuccess: (data) =>
			queryClient.setQueryData(
				["fetchTimeline", { withCredentials: true }],
				data
			),
		onError: (error) => console.log(error),
		onSettled: () =>
			queryClient.invalidateQueries({ queryKey: ["fetchTimeline"] }),
	});

	const onSubmit = async (data: TimelineEventFormData) => {
		const { date, status } = data;
		const statuses = status.split("-");

		const requestBody = {
			date: date?.utc().format("YYYY-MM-DD") ?? "",
			status: statuses[0],
			substatus: statuses.length > 1 ? statuses[1] : null,
		};
		updateMutation.mutate(requestBody);
	};

	useEffect(() => {
		if (updateMutation.isSuccess) {
			setOpen(false);
		}
	}, [updateMutation.isSuccess]);

	return (
		<>
			<IconButton
				edge="end"
				sx={{ padding: "2px" }}
				onClick={() => setOpen(true)}
			>
				<EditIcon sx={{ fontSize: 14 }} />
			</IconButton>
			<TimelineEventForm
				formTitle="Modify Event"
				open={open}
				setOpen={setOpen}
				onSubmit={onSubmit}
				isPending={updateMutation.isPending}
				isError={updateMutation.isError}
				loadedStatus={loadedStatus}
				loadedDate={loadedDate}
				onDelete={() => deleteMutation.mutate()}
			/>
		</>
	);
}
