import { Avatar, Box, Grid, Typography } from "@mui/material";
import moment from "moment";
import { useState } from "react";
import DeleteJobListingButton from "./DeleteJobListingButton";
import { JobsPayload } from "./page";

moment.updateLocale("en", {
	relativeTime: {
		future: "in %s",
		past: "%s",
		s: "s",
		ss: "%ss",
		m: "m",
		mm: "%dm",
		h: "h",
		hh: "%dh",
		d: "d",
		dd: "%dd",
		M: "mo",
		MM: "%dM",
		y: "y",
		yy: "%dY",
	},
});

type Props = {
	job: JobsPayload;
};

export default function JobCard({ job }: Props) {
	const [showDeleteButton, setShowDeleteButton] = useState<boolean>(false);
	return (
		<Box
			key={job.id}
			sx={{
				backgroundColor: job.cardColor,
				padding: "8px",
				borderRadius: "4px",
				marginTop: "8px",
			}}
			onMouseEnter={() => setShowDeleteButton(true)}
			onMouseLeave={() => setShowDeleteButton(false)}
		>
			<Grid
				container
				direction="row"
				columns={12}
				sx={{ alignItems: "center", justifyContent: "space-between" }}
			>
				<Grid item sx={{ mr: 2 }} xs={1}>
					<Avatar
						src={`https://logo.clearbit.com/${job.companyURL}`}
						sx={{
							border: "2px solid white",
							width: 24,
							height: 24,
							backgroundColor: "white",
						}}
					/>
				</Grid>
				<Grid item xs={8}>
					<Typography variant="body2" sx={{ fontWeight: "bold" }}>
						{job.title}
					</Typography>
					<Typography variant="subtitle2">{job.companyName}</Typography>
				</Grid>
				<Grid container item xs={1} direction="column">
					<Grid item sx={{ height: 20 }}>
						{showDeleteButton && <DeleteJobListingButton jobID={job.id} />}
					</Grid>
					<Grid item>
						<Typography variant="caption">
							{moment(job.lastUpdated).fromNow(true)}
						</Typography>
					</Grid>
				</Grid>
			</Grid>
		</Box>
	);
}
