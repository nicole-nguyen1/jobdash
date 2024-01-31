"use client";

import axios from "axios";
import {
	Dispatch,
	SetStateAction,
	createContext,
	useEffect,
	useState,
} from "react";

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

	useEffect(() => {
		axios
			.get("http://localhost:8080/auth/home", { withCredentials: true })
			.then((res) => {
				if (res.status === 200) {
					setIsAuthorized(true);
				}
			})
			.catch((error) => {
				if (error.status === 401) {
					setIsAuthorized(false);
				}
			});
	}, []);

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
