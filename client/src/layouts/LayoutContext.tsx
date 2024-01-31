"use client";

import axios from "axios";
import { usePathname } from "next/navigation";
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
	const pathname = usePathname();

	useEffect(() => {
		if (pathname !== "/") {
			axios
				.get("http://localhost:8080/auth/session", { withCredentials: true })
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
		}
	}, [pathname]);

	return (
		<LayoutContext.Provider value={{ isAuthorized, setIsAuthorized }}>
			{children}
		</LayoutContext.Provider>
	);
}
