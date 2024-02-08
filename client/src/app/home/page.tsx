"use client";

import { Container, Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import PipelineStage from "./PipelineStage";
import { pipelineStatusConfig } from "./pipelineStatusTypes";

export type JobsPayload = {
	id: string;
	title: string;
	companyName: string;
	currStatus: string;
	cardColor: string;
	companyURL: string;
};

export default function Home() {
	const pipelineStages: Array<string> = Object.keys(pipelineStatusConfig);
	const [jobs, setJobs] = useState<Array<JobsPayload>>([]);

	const fetchJobs = async () => {
		const result = await axios.get("http://localhost:8080/pipeline/", {
			withCredentials: true,
		});
		setJobs(result.data);
	};

	const { data, error } = useQuery({
		queryKey: ["fetchJobs"],
		queryFn: fetchJobs,
	});

	return (
		<Container maxWidth="xl" sx={{ mt: 4, mb: 4, height: "100%" }}>
			<Grid container direction="row" columnSpacing={4} columns={12}>
				{pipelineStages.map((stage) => (
					<PipelineStage
						key={stage}
						stage={stage}
						jobs={jobs.filter((job) => job.currStatus === stage)}
					/>
				))}
			</Grid>
		</Container>
	);
}
