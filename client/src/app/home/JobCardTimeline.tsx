import { Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import AddTimelineEventButton from "./AddTimelineEventButton";
import TimelineCard, { EventPayload } from "./TimelineCard";

type Props = {
	timelineID: string;
};

export default function JobCardTimeline({ timelineID }: Props) {
	const fetchTimeline = async () => {
		const result = await axios.get(
			`http://localhost:8080/timeline/${timelineID}`,
			{
				withCredentials: true,
			}
		);
		return result.data;
	};

	const { data } = useQuery({
		queryKey: ["fetchTimeline"],
		queryFn: () => fetchTimeline(),
	});

	console.log(data);

	return (
		<Grid
			container
			item
			xs={4}
			sx={{ padding: "16px 16px 16px 0" }}
			direction="column"
		>
			<Grid item sx={{ textAlign: "center" }}>
				<AddTimelineEventButton timelineID={timelineID} />
			</Grid>
			{(data ?? []).map((event: EventPayload, idx: number) => (
				<TimelineCard
					event={event}
					idx={idx}
					key={event.id}
					timelineID={timelineID}
				/>
			))}
		</Grid>
	);
}
