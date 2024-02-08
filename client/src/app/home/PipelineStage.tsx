import { Box, Grid, Typography } from "@mui/material";
import AddJobListingButton from "./AddJobListingButton";
import JobCard from "./JobCard";
import { JobsPayload } from "./page";

type Props = {
	stage: string;
	jobs: Array<JobsPayload>;
};

export default function PipelineStage({ stage, jobs }: Props) {
	return (
		<Grid item key={stage} xs={2}>
			<Box
				sx={{
					backgroundColor: (theme) =>
						theme.palette.mode === "light"
							? theme.palette.grey[200]
							: theme.palette.grey[800],
					padding: "8px",
					borderRadius: "4px",
				}}
			>
				<Typography variant="body1" sx={{ fontWeight: "bold", mb: 2 }}>
					{stage}
				</Typography>
				<AddJobListingButton />
				{jobs.map((job) => (
					<JobCard key={job.id} job={job} />
				))}
			</Box>
		</Grid>
	);
}
