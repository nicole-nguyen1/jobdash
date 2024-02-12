import { ListItemText, MenuItem } from "@mui/material";
import { pipelineStatusConfig } from "../../app/home/pipelineStatusTypes";
import BaseDropdown from "./BaseDropdown";

type Props = {
	loadedStatus?: string;
};

export default function JobStatusDropdown({ loadedStatus = "" }: Props) {
	return (
		<BaseDropdown
			fieldName="status"
			preloadedValue={loadedStatus}
			items={getDroplistItems()}
		/>
	);
}

function getDroplistItems() {
	let dropdownItems: any[] = [];
	Object.entries(pipelineStatusConfig).forEach(([status, subStatuses]) => {
		if (subStatuses.length < 2) {
			dropdownItems.push([
				<MenuItem key={status} value={status}>
					<ListItemText>{status}</ListItemText>
				</MenuItem>,
			]);
		} else {
			const subStatusItems = subStatuses.map((substatus) => {
				const statusWithSubstatus = `${status}-${substatus}`;
				return (
					<MenuItem key={statusWithSubstatus} value={statusWithSubstatus}>
						<ListItemText inset>{substatus}</ListItemText>
					</MenuItem>
				);
			});

			dropdownItems = dropdownItems.concat(
				[
					<MenuItem key={status} disabled>
						<ListItemText>{status}</ListItemText>
					</MenuItem>,
				].concat(subStatusItems)
			);
		}
	});
	return dropdownItems;
}
