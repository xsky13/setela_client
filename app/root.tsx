import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.scss";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import api from "./api";
import Authenticate from "./Components/Auth/Authenticate";
import LoadingScreen from "./Components/LoadingScreen";
import ErrorScreen from "./Components/ErrorScreen";
import { isAxiosError } from "axios";
import { AuthContext } from "./context/AuthContext";
import Header from "./Components/Header";


const queryClient = new QueryClient()
export const links: Route.LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&family=Rubik:ital,wght@0,300..900;1,300..900&display=swap",
	},
];

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				<QueryClientProvider client={queryClient}>
					<AppContent>{children}</AppContent>
					<ScrollRestoration />
					<Scripts />
				</QueryClientProvider>
			</body>
		</html>
	);
}

function AppContent({ children }: { children: React.ReactNode }) {
	const { data: user, isLoading: userLoading, isError, error } = useQuery({ queryKey: ['todos'], 
		queryFn: async () => {
			const response = await api.get('/auth/user')
			return response.data;
		},
		retry: 0
	});


	if (userLoading) return <LoadingScreen />
	if (isAxiosError(error) && error.response?.status !== 401) return <ErrorScreen />;
	if (user == undefined) return <Authenticate />
	return (
		<AuthContext value={user}>
			<Header />
			<div style={{ paddingTop: '7rem' }}>
				{children}
			</div>
		</AuthContext>
	);
	
}

export default function App() {
	return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details =
			error.status === 404
				? "The requested page could not be found."
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}
