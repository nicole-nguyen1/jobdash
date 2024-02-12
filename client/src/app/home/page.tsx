"use client";

import { Container, Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PipelineStage from "./PipelineStage";
import { pipelineStatusConfig } from "./pipelineStatusTypes";

export type JobsPayload = {
	id: string;
	title: string;
	companyName: string;
	currStatus: string;
	substatus: string;
	cardColor: string;
	companyURL: string;
	timelineID: string;
	lastUpdated: string;
};

export default function Home() {
	const pipelineStages: Array<string> = Object.keys(pipelineStatusConfig);

	const fetchJobs = async () => {
		const result = await axios.get("http://localhost:8080/pipeline/", {
			withCredentials: true,
		});
		return result.data;
	};

	const { data } = useQuery({
		queryKey: ["fetchJobs"],
		queryFn: () => fetchJobs(),
	});

	return (
		<Container maxWidth="xl" sx={{ mt: 4, mb: 4, height: "100%" }}>
			<Grid
				container
				direction="row"
				columnSpacing={1}
				columns={12}
				sx={{ flexWrap: "nowrap" }}
			>
				{pipelineStages.map((stage) => (
					<PipelineStage
						key={stage}
						stage={stage}
						jobs={(data ?? []).filter(
							(job: JobsPayload) => job.currStatus === stage
						)}
					/>
				))}
			</Grid>
		</Container>
	);
}
