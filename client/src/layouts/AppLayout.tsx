"use client";

import React, { useContext } from "react";
import AuthorizedUserLayout from "./AuthorizedUserLayout";
import { LayoutContext } from "./LayoutContext";

export default function AppLayout({
	children,
}: {
	children: React.ReactNode;
}): React.ReactNode {
	const { isAuthorized } = useContext(LayoutContext);

	return isAuthorized ? (
		<AuthorizedUserLayout>{children}</AuthorizedUserLayout>
	) : (
		children
	);
}
