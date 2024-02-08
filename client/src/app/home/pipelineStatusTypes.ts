export enum PipelineStatus {
	APPLIED = "Applied",
	RECRUITER_SCREEN = "Recruiter Screen",
	INTERVIEW = "Interview",
	ONSITE = "Onsite",
	OFFER = "Offer",
	DECISION = "Decision",
}

export enum AppliedType {
	COLD_APPLIED = "Cold Applied",
	RECRUITED = "Recruited",
	REFERRED = "Referred",
}

export enum RecruiterScreenType {
	REQUESTED_TO_SCHEDULE = "Requested To Schedule",
	SCHEDULED_SCREEN = "Scheduled Screen",
}

export enum InterviewType {
	MANAGER_SCREEN = "Manager Screen",
	TAKE_HOME_ASSIGNMENT = "Take Home Assignment",
	TECHNICAL_SCREEN = "Technical Screen",
}

export enum OfferType {
	OFFER_ACCEPTED = "Offer Accepted",
	OFFER_DECLINED = "Offer Declined",
	OFFER_EXTENDED = "Offer Extended",
	OFFER_RESCINDED = "Offer Rescinded",
}

export enum DecisionType {
	ACCEPTED = "Accepted",
	CLOSED_ROLE = "Closed Role",
	DECLINED_ROLE = "Declined Role",
	DID_NOT_PASS_INTERVIEW = "Did Not Pass Interview",
	DID_NOT_PASS_SCREEN = "Did Not Pass Screen",
	GHOSTED = "Ghosted",
	NO_RESPONSE = "No Response",
}

export const pipelineStatusConfig = {
	[PipelineStatus.APPLIED]: [
		AppliedType.COLD_APPLIED,
		AppliedType.RECRUITED,
		AppliedType.REFERRED,
	],
	[PipelineStatus.RECRUITER_SCREEN]: [
		RecruiterScreenType.REQUESTED_TO_SCHEDULE,
		RecruiterScreenType.SCHEDULED_SCREEN,
	],
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
