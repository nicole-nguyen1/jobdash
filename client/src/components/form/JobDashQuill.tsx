import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const toolbarOptions = [
	["bold", "italic", "underline"], // toggled buttons
	["blockquote", "code-block"],
	[{ list: "ordered" }, { list: "bullet" }],
	[{ indent: "-1" }, { indent: "+1" }], // outdent/indent
	["clean"], // remove formatting button
];

export default function JobDashQuill() {
	const { register, setValue, watch } = useFormContext();
	useEffect(() => {
		register("description");
	}, [register]);

	const onEditorStateChange = (editorState: string) => {
		setValue("description", editorState);
	};

	const editorContent = watch("description");

	return (
		<ReactQuill
			theme="snow"
			value={editorContent}
			onChange={onEditorStateChange}
			modules={{ toolbar: toolbarOptions }}
		/>
	);
}
