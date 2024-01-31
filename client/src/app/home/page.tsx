"use client";

import { Button, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Home() {
	// const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
	// const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
	const router = useRouter();

	// useEffect(() => {
	// 	if (!isAuthorized) {
	// 		axios
	// 			.get("http://localhost:8080/auth/home", {
	// 				withCredentials: true,
	// 			})
	// 			.then((res) => {
	// 				setIsCheckingAuth(false);
	// 				if (res.status === 200) {
	// 					setIsAuthorized(true);
	// 				}
	// 			})
	// 			.catch((error) => {
	// 				if (error.response.status === 401) {
	// 					setIsCheckingAuth(false);
	// 					setIsAuthorized(false);
	// 					router.push("/");
	// 				}
	// 			});
	// 	}
	// }, [isAuthorized, router]);

	const onClick = async () => {
		const res = await axios
			.post("http://localhost:8080/auth/logout", {}, { withCredentials: true })
			.then((res) => res.data);
		if (res.event === "USER_LOGOUT_SUCCESS") {
			router.push("/");
		}
	};

	// return isCheckingAuth || !isAuthorized ? (
	// 	<div />
	// ) :

	return (
		<div>
			<Typography>
				Hello world! You have reached the home page for your logged in
				experience.
			</Typography>
			<Button onClick={onClick}>Logout</Button>
		</div>
	);
}
