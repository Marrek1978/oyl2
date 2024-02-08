import { useEffect } from "react";
import { json } from "@remix-run/node";
import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";

import Navbar from './components/nav/Navbar';
import navSytles from '~/styles/SideNav.css'
import Modal from '~/components/modals/Modal'
import FormStyles from '~/styles/FormCss.css';
import Error from '~/components/utilities/Error'
import { getUser } from "~/models/session.server";
import SolidBtn from "./components/buttons/SolidBtn";
import datePickerStyles from "~/styles/CustomCss.css";
import tailwindStylesheetUrl from "~/styles/tailwind.css";
import { ThemeProvider, useTheme } from './styles/ThemeContext';
import useGetNavigationState from "./components/utilities/useNavigationState";

import type { CustomError } from "./types/ErrorTypes";


export const links: LinksFunction = () => [
  // { rel: "stylesheet", href: stylesheet },
  { rel: "stylesheet", href: tailwindStylesheetUrl },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" },
  { rel: 'stylesheet', href: datePickerStyles },
  { rel: 'stylesheet', href: navSytles },
  { rel: 'stylesheet', href: FormStyles },
];


export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    return json({ user: await getUser(request) });
  }
  catch (error) { throw error; }
};

//!!  set type for server files, and '...FromDb' for loader functions.  Also, set type for 'user' in loader function

export default function App() {

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { theme } = useTheme();
  // const [isLoading, setIsLoading] = useState(false);

  const {
    isLoading,
    setIsLoading,
    navigationState
  } = useGetNavigationState();


  useEffect(() => {
    if (navigationState === 'loading') {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [navigationState, setIsLoading]);


  return (
    <html lang="en"
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
      <body className="min-h-screen bg-base-200">
        <main className=" h-full min-h-screen m-auto ">
          <Navbar />

          {isLoading && (
          <Modal onClose={() => { }} zIndex={20}>
            <span className="loading loading-spinner loading-lg"></span>
            </Modal>
            )}
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}



export function ErrorBoundary() {

  const error = useRouteError();

  return (
    <main>
      <Link to='/'>
        <SolidBtn
          text='Back to Safety'
          onClickFunction={() => { }}
        />
      </Link>

      {isRouteErrorResponse(error) && (
        <Error title={error.statusText}>
          <p>
            {error.data?.message ||
              "Something went wrong.  Please try again later."}
          </p>
          <p>
            Back to <Link to="/"> Safety</Link>
          </p>
        </Error>
      )}

      {!isRouteErrorResponse(error) && (error instanceof Error) && (
        <Error title={(error as CustomError).statusText} >
          <p>
            {error instanceof Error && (error as Error).message || "Something went wrong. Please try again later."}
          </p>
        </Error>
      )}

      {!isRouteErrorResponse(error) && !(error instanceof Error) && (
        <Error title="Unknown Error">
          <p>
            Something went wrong. An Unknown Error was created.  Please try again later.
            {error instanceof Error && (error as Error).message}
          </p>

        </Error>
      )}

    </main>
  )
}
