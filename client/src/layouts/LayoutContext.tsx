"use client";

import { Dispatch, SetStateAction, createContext, useState } from "react";

type LayoutContext = {
	isAuthorized: boolean;
	setIsAuthorized: Dispatch<SetStateAction<boolean>>;
};

export const LayoutContext = createContext<LayoutContext>({
	isAuthorized: false,
	setIsAuthorized: () => {},
});

export default function LayoutProvider({
	children,
}: {
	children: React.ReactNode;
}): React.ReactNode {
	const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

	return (
		<LayoutContext.Provider
			value={{
				isAuthorized,
				setIsAuthorized,
			}}
		>
			{children}
		</LayoutContext.Provider>
	);
}
