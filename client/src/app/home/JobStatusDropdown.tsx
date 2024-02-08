import {
	FormControl,
	InputLabel,
	ListItemText,
	MenuItem,
	Select,
	SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { pipelineStatusConfig } from "./pipelineStatusTypes";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

export default function JobStatusDropdown() {
	const [status, setStatus] = useState<string>("");
	const { register } = useFormContext();

	const handleChange = (e: SelectChangeEvent<string>) => {
		setStatus(e.target.value);
	};

	const droplistItems = getDroplistItems(status);

	return (
		<FormControl required sx={{ width: "100%" }}>
			<InputLabel
				variant="outlined"
				size="small"
				id="status-label"
				htmlFor="status"
				shrink={true}
			>
				Status
			</InputLabel>
			<Select
				id="status"
				value={status}
				label="Status"
				size="small"
				sx={{ mb: 1 }}
				fullWidth
				notched
				MenuProps={MenuProps}
				{...register("status")}
				defaultValue={status}
				onChange={(e) => handleChange(e)}
			>
				{droplistItems}
			</Select>
		</FormControl>
	);
}

function getDroplistItems(currStatus: string) {
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
