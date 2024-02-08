"use client";

import { usePathname } from "next/navigation";
import React, { useContext } from "react";
import AuthorizedUserLayout from "./AuthorizedUserLayout";
import { LayoutContext } from "./LayoutContext";

export default function AppLayout({
	children,
}: {
	children: React.ReactNode;
}): React.ReactNode {
	const { isAuthorized } = useContext(LayoutContext);
	const pathname = usePathname();

	return isAuthorized && pathname !== "/" ? (
		<AuthorizedUserLayout>{children}</AuthorizedUserLayout>
	) : pathname === "/" ? (
		children
	) : (
		<div />
	);
}
