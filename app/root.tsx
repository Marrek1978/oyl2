import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import Navbar from './components/nav/Navbar';

import { getUser } from "~/session.server";

// import stylesheet from "~/tailwind.css";
import tailwindStylesheetUrl from "~/styles/tailwind.css";
// import "tw-elements/dist/css/tw-elements.min.css";

// import "react-datepicker/dist/react-datepicker.css";
import datePickerStyles from "~/styles/CustomCss.css";
import navSytles from '~/styles/SideNav.css'
import { ThemeProvider, useTheme } from './styles/ThemeContext';

export const links: LinksFunction = () => [
  // { rel: "stylesheet", href: stylesheet },
  { rel: "stylesheet", href: tailwindStylesheetUrl },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" },
  { rel: 'stylesheet', href: datePickerStyles },
  { rel: 'stylesheet', href: navSytles }
];


export const loader = async ({ request }: LoaderArgs) => {
  return json({ user: await getUser(request) });
};



export default function App() {

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { theme } = useTheme();

  return (
    <html lang="en" className="m-h-full" 
    data-theme={theme}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/react-datepicker/2.14.1/react-datepicker.min.css" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

        <Links />
      </head>
      <body className="min-h-screen min-w-xs bg-base-200">
        <main className="flex flex-col min-h-screen min-w-xs m-auto ">
          <Navbar />
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
