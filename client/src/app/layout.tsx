import JobDashThemeProvider from "@/components/global/JobDashThemeProvider";
import ReactQueryClientProvider from "@/components/global/ReactQueryClientProvider";
import AppLayout from "@/layouts/AppLayout";
import LayoutProvider from "@/layouts/LayoutContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<JobDashThemeProvider>
			<ReactQueryClientProvider>
				<LayoutProvider>
					<html lang="en">
						<body className={inter.className}>
							<AppLayout>{children}</AppLayout>
						</body>
					</html>
				</LayoutProvider>
			</ReactQueryClientProvider>
		</JobDashThemeProvider>
	);
}
