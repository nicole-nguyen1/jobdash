"use client";

import React, { useEffect, useState } from "react";

export default function Home() {
	const [message, setMessage] = useState("");

	useEffect(() => {
		fetch("http://localhost:8080/api/home")
			.then((res) => res.json())
			.then((res) => setMessage(res.message));
	}, []);

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			{/* <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex"> */}
			<h1 className="text-lg">{message}</h1>
		</main>
	);
}
