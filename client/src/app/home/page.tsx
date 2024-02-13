"use client";

import { WorkingModel } from "@/components/form/WorkingModelDropdown";
import { Container, Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PipelineStage from "./PipelineStage";
import { pipelineStatusConfig } from "./pipelineStatusTypes";

export type JobsPayload = {
	id: string;
	title: string;
	company_name: string;
	company_color: string;
	company_url: string;
	card_color: string | null;
	curr_status: string;
	substatus: string;
	timeline_id: string;
	latest_update: string;
	url: string;
	location: string | null;
	salary: number | null;
	working_model: WorkingModel | null;
	description: string | null;
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
							(job: JobsPayload) => job.curr_status === stage
						)}
					/>
				))}
			</Grid>
		</Container>
	);
}
