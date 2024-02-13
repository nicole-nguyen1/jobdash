import { Box, Grid, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { timeFromNow } from "../utils/timeFromNow";
import ModifyTimelineEventButton from "./ModifyTimelineEventButton";

export type EventPayload = {
	id: string;
	date: string;
	status: string;
	substatus: string;
};

type Props = {
	event: EventPayload;
	idx: number;
	timelineID: string;
};

export default function TimelineCard({ event, idx, timelineID }: Props) {
	const theme = useTheme();
	const [showEditButton, setShowEditButton] = useState<boolean>(false);
	return (
		<Box
			key={event.id}
			sx={{
				padding: "8px",
				borderRadius: "4px",
				marginTop: "8px",
				borderWidth: "1px",
				borderStyle: "solid",
				borderColor:
					idx === 0 ? theme.palette.grey[600] : theme.palette.grey[400],
				backgroundColor: idx === 0 ? theme.palette.grey[600] : "inherit",
				height: "66px",
			}}
			onMouseEnter={() => setShowEditButton(true)}
			onMouseLeave={() => setShowEditButton(false)}
		>
			<Grid
				container
				columns={6}
				direction="row"
				sx={{ alignItems: "center", justifyContent: "space-between" }}
			>
				<Grid item xs={5}>
					<Typography>{event.status}</Typography>
					<Typography variant="caption">{event.substatus}</Typography>
				</Grid>
				<Grid container item xs={1} direction="column">
					<Grid item sx={{ height: 20 }}>
						{showEditButton && (
							<ModifyTimelineEventButton
								eventID={event.id}
								loadedStatus={`${event.status}-${event.substatus}`}
								loadedDate={event.date}
							/>
						)}
					</Grid>
					<Grid item>
						<Typography variant="caption">{timeFromNow(event.date)}</Typography>
					</Grid>
				</Grid>
			</Grid>
		</Box>
	);
}
