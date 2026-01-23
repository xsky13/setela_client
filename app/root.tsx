import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useNavigation,
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
import { Toaster } from "sonner";
import { useEffect } from "react";

if (typeof document !== 'undefined') {
  	import('bootstrap/dist/js/bootstrap.bundle.min.js');
}

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
		href: "https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap",
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
	const { data: user, isLoading: userLoading, isError, error } = useQuery({
		queryKey: ['todos'],
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
			<Toaster />
			<Header />
			<div style={{ paddingTop: '5.51rem' }}>
				{children}
			</div>
		</AuthContext>
	);

}

export default function App() {
	const navigation = useNavigation();
	const isNavigating = Boolean(navigation.location);
	return <>
		{
			isNavigating ? <LoadingScreen /> : <Outlet />
		}
	</>;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details =
			error.status === 404
				? "La pagina que esta buscando no existe."
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	useEffect(() => {
		document.title = 'Error'
	}, [])

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
