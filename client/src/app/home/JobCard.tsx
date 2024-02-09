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
			<Grid container direction="row" columns={8} sx={{ alignItems: "center" }}>
				<Grid item sx={{ mr: 2 }} xs={1}>
					<Avatar
						src={`https://logo.clearbit.com/${job.companyURL}`}
						sx={{
							border: "2px solid white",
							width: 32,
							height: 32,
							backgroundColor: "white",
						}}
					/>
				</Grid>
				<Grid item xs={6}>
					<Typography variant="body2" sx={{ fontWeight: "bold" }}>
						{job.title}
					</Typography>
					<Typography variant="subtitle2">{job.companyName}</Typography>
				</Grid>
			</Grid>
		</Box>
	);
}
