import { Avatar, Box, Grid, Typography } from "@mui/material";
import { JobsPayload } from "./page";

type Props = {
	job: JobsPayload;
};

export default function JobCard({ job }: Props) {
	return (
		<Box
			key={job.id}
			sx={{
				backgroundColor: job.cardColor,
				padding: "8px",
				borderRadius: "4px",
				marginTop: "8px",
			}}
		>
			<Grid container direction="row">
				<Grid item sx={{ mr: 1 }}>
					<Avatar
						src={`https://logo.clearbit.com/${job.companyURL}`}
						sx={{ border: "2px solid white" }}
					/>
				</Grid>
				<Grid item>
					<Typography variant="body1" sx={{ fontWeight: "bold" }}>
						{job.title}
					</Typography>
					<Typography variant="body2">{job.companyName}</Typography>
				</Grid>
			</Grid>
		</Box>
	);
}
