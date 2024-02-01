"use client";

import { Container, Grid } from "@mui/material";
import PipelineStage from "./PipelineStage";
import { pipelineStatusConfig } from "./pipelineStatusTypes";

export default function Home() {
	const pipelineStages: Array<string> = Object.keys(pipelineStatusConfig);
	return (
		<Container maxWidth="xl" sx={{ mt: 4, mb: 4, height: "100%" }}>
			<Grid container direction="row" columnSpacing={4} columns={12}>
				{pipelineStages.map((stage) => (
					<PipelineStage key={stage} stage={stage} />
				))}
			</Grid>
		</Container>
	);
}
