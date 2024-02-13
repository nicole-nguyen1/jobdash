import TimelineEventForm, {
	TimelineEventFormData,
	TimelineEventRequestBody,
} from "@/components/form/TimelineEventForm";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { IconButton } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

type Props = {
	timelineID: string;
};

export default function AddTimelineEventButton({ timelineID }: Props) {
	const queryClient = useQueryClient();
	const [open, setOpen] = useState<boolean>(false);

	const { mutate, isPending, isSuccess, isError } = useMutation({
		mutationFn: (data: TimelineEventRequestBody) =>
			axios.post("http://localhost:8080/timeline/add", data, {
				params: { timeline_id: timelineID },
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

	const onSubmit = async (data: TimelineEventFormData) => {
		const { date, status } = data;
		const statuses = status.split("-");

		const requestBody = {
			date: date?.utc().format("YYYY-MM-DD") ?? "",
			status: statuses[0],
			substatus: statuses.length > 1 ? statuses[1] : null,
		};
		mutate(requestBody);
	};

	useEffect(() => {
		if (isSuccess) {
			setOpen(false);
		}
	}, [isSuccess]);

	return (
		<>
			<IconButton
				sx={{ width: "16px" }}
				onClick={() => setOpen(true)}
				disableFocusRipple
				disableRipple
			>
				<AddCircleIcon />
			</IconButton>
			<TimelineEventForm
				formTitle="Add Event"
				open={open}
				setOpen={setOpen}
				onSubmit={onSubmit}
				isPending={isPending}
				isError={isError}
			/>
		</>
	);
}
