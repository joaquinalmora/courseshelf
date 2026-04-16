import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "react-router";

import "./globals.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <main className="page-shell">
        <section className="empty-state">
          <h1>Page not found</h1>
          <p>The page you requested does not exist.</p>
        </section>
      </main>
    );
  }

  const message = error instanceof Error ? error.message : "An unexpected error occurred.";

  return (
    <main className="page-shell">
      <section className="empty-state">
        <h1>Unexpected error</h1>
        <p>{message}</p>
      </section>
    </main>
  );
}
