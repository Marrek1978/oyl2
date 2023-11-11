import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { createUser, verifyLogin } from "~/models/user.server";
import { getUserId } from "~/models/session.server";
import AuthForm from "~/components/buttons/auth/AuthForm";
import { validateCredentials } from "~/models/validation.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/dash");
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {

  //return errors - will be caught by component's 
  const searchParams = new URL(request.url).searchParams;
  const authMode = searchParams.get("mode") || 'login';

  const formData = await request.formData();
  const email = formData.get("email")! as string;
  const password = formData.get("password")! as string;
  const remember = formData.get("remember");

  try {
    validateCredentials({ email, password })
  } catch (validationError) {
    return (validationError)
  }


  //!  put create session in signup and login
  try {
    if (authMode === 'login') {
      return await verifyLogin(
        email,
        password,
        remember === "on" ? true : false,
      );
    } else {
      return await createUser(email, password, remember === "on" ? true : false,);
    }
  } catch (error) {
    if (error instanceof Error) {
      return json(
        { email: error?.message || 'Your credentials are not verified.', password: null },
        { status: 400 }
      );
    }
  }

  return redirect('/dash')
};

export const meta: MetaFunction = () => [{ title: "Login" }];

export default function Index() {

  return (
    <main className="relative min-h-[90vh] grid p-2 sm:p-6">
      <AuthForm />
    </main>
  );
}
