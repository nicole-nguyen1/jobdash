"use client";

import AddIcon from "@mui/icons-material/Add";
import { Box, Container, Grid, Typography } from "@mui/material";

enum PipelineStatus {
	APPLIED = "Applied",
	RECRUITER_SCREEN = "Recruiter Screen",
	INTERVIEW = "Interview",
	ONSITE = "Onsite",
	OFFER = "Offer",
	DECISION = "Decision",
}

enum AppliedType {
	COLD_APPLIED = "Cold Applied",
	RECRUITED = "Recruited",
	REFERRED = "Referred",
}

enum InterviewType {
	MANAGER_SCREEN = "Manager Screen",
	TAKE_HOME_ASSIGNMENT = "Take Home Assignment",
	TECHNICAL_SCREEN = "Technical Screen",
}

enum OfferType {
	OFFER_ACCEPTED = "Offer Accepted",
	OFFER_DECLINED = "Offer Declined",
	OFFER_EXTENDED = "Offer Extended",
	OFFER_RESCINDED = "Offer Rescinded",
}

enum DecisionType {
	ACCEPTED = "Accepted",
	CLOSED_ROLE = "Closed Role",
	DECLINED_ROLE = "Declined Role",
	DID_NOT_PASS_INTERVIEW = "Did Not Pass Interview",
	DID_NOT_PASS_SCREEN = "Did Not Pass Screen",
	GHOSTED = "Ghosted",
}

const pipelineStatusConfig = {
	[PipelineStatus.APPLIED]: [
		AppliedType.COLD_APPLIED,
		AppliedType.RECRUITED,
		AppliedType.REFERRED,
	],
	[PipelineStatus.RECRUITER_SCREEN]: [],
	[PipelineStatus.INTERVIEW]: [
		InterviewType.MANAGER_SCREEN,
		InterviewType.TAKE_HOME_ASSIGNMENT,
		InterviewType.TECHNICAL_SCREEN,
	],
	[PipelineStatus.ONSITE]: [],
	[PipelineStatus.OFFER]: [
		OfferType.OFFER_ACCEPTED,
		OfferType.OFFER_DECLINED,
		OfferType.OFFER_EXTENDED,
		OfferType.OFFER_RESCINDED,
	],
	[PipelineStatus.DECISION]: [
		DecisionType.ACCEPTED,
		DecisionType.CLOSED_ROLE,
		DecisionType.DECLINED_ROLE,
		DecisionType.DID_NOT_PASS_INTERVIEW,
		DecisionType.DID_NOT_PASS_SCREEN,
		DecisionType.GHOSTED,
	],
};

export default function Home() {
	const pipelineStages: Array<string> = Object.keys(pipelineStatusConfig);
	return (
		<Container maxWidth="xl" sx={{ mt: 4, mb: 4, height: "100%" }}>
			<Grid container direction="row" columnSpacing={4} columns={12}>
				{pipelineStages.map((stage) => (
					<Grid item key={stage} xs={2}>
						<Box
							sx={{
								backgroundColor: (theme) =>
									theme.palette.mode === "light"
										? theme.palette.grey[200]
										: theme.palette.grey[800],
								padding: "8px",
							}}
						>
							<Typography variant="body1" sx={{ fontWeight: "bold" }}>
								{stage}
							</Typography>
							<Box
								sx={{
									backgroundColor: (theme) =>
										theme.palette.mode === "light"
											? theme.palette.grey[300]
											: theme.palette.grey[700],
									padding: "8px",
									margin: "8px 0",
									textAlign: "center",
								}}
							>
								<AddIcon />
							</Box>
						</Box>
					</Grid>
				))}
			</Grid>
		</Container>
	);
}
