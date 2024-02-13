import { Avatar, Box, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { timeFromNow } from "../utils/timeFromNow";
import DeleteJobListingButton from "./DeleteJobListingButton";
import JobCardDetail from "./JobCardDetail";
import { JobsPayload } from "./page";

type Props = {
	job: JobsPayload;
};

export default function JobCard({ job }: Props) {
	const [openJobDetail, setOpenJobDetail] = useState<boolean>(false);
	const [showDeleteButton, setShowDeleteButton] = useState<boolean>(false);
	return (
		<>
			<Box
				key={job.id}
				sx={{
					backgroundColor: job.card_color ?? job.company_color,
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
					<Grid
						container
						item
						direction="row"
						xs={10}
						columnGap={1}
						onClick={() => setOpenJobDetail(true)}
						sx={{ alignItems: "center" }}
					>
						<Grid item sx={{ mr: 2 }} xs={1}>
							<Avatar
								src={`https://logo.clearbit.com/${job.company_url}`}
								sx={{
									border: "2px solid white",
									width: 24,
									height: 24,
									backgroundColor: "white",
								}}
							/>
						</Grid>
						<Grid item xs={9}>
							<Typography variant="body2" sx={{ fontWeight: "bold" }}>
								{job.title}
							</Typography>
							<Typography variant="subtitle2">{job.company_name}</Typography>
						</Grid>
					</Grid>
					<Grid container item xs={1} direction="column">
						<Grid item sx={{ height: 20 }}>
							{showDeleteButton && <DeleteJobListingButton jobID={job.id} />}
						</Grid>
						<Grid item>
							<Typography variant="caption">
								{timeFromNow(job.latest_update)}
							</Typography>
						</Grid>
					</Grid>
				</Grid>
			</Box>
			{openJobDetail && (
				<JobCardDetail
					job={job}
					open={openJobDetail}
					setOpen={setOpenJobDetail}
				/>
			)}
		</>
	);
}
