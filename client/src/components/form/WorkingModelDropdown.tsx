import { MenuItem } from "@mui/material";
import BaseDropdown from "./BaseDropdown";

export enum WorkingModel {
	ONSITE = "Onsite",
	HYBRID = "Hybrid",
	REMOTE = "Remote",
}

type Props = {
	loadedModel?: WorkingModel | null;
};

export default function WorkingModelDropdown({ loadedModel }: Props) {
	return (
		<BaseDropdown
			fieldName="workingModel"
			preloadedValue={loadedModel}
			items={Object.entries(WorkingModel).map(([key, value]) => (
				<MenuItem key={value} value={value}>
					{value}
				</MenuItem>
			))}
		/>
	);
}
