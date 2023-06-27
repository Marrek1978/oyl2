import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { createUser, verifyLogin } from "~/models/user.server";
import { getUserId } from "~/models/session.server";
// import { safeRedirect, validateEmail } from "~/utils";
import AuthForm from "~/components/buttons/auth/AuthForm";
// import { ca } from "date-fns/locale";
import { validateCredentials } from "~/models/validation.server";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/dashboard");
  return null;
};

export const action = async ({ request }: ActionArgs) => {

  console.log('in login action')
  //return errors - will be caught by component's 
  const searchParams = new URL(request.url).searchParams;
  const authMode = searchParams.get("mode") || 'login';

  const formData = await request.formData();
  const email = formData.get("email")! as string;
  const password = formData.get("password")! as string;
  // const redirectTo = safeRedirect(formData.get("redirectTo"), "/dashboard");
  const remember = formData.get("remember");

  let user = null
  // let validated = null

  try {
    validateCredentials({ email, password })
  } catch (validationError) {
    console.log('validation error', validationError)
    return json({ errors: validationError })
  }


  console.log('credentials validated')
  //!  put create session in signup and login
  try {
    if (authMode === 'login') {
      return await verifyLogin(
        email,
        password,
        remember === "on" ? true : false,
      );
    } else {
      return await createUser(email,password, remember === "on" ? true : false,);
    }
  } catch (error) {
    if (error instanceof Error) {
      return json(
        { errors: { email: error?.message || 'Your credentials are not verified.', password: null } },
        { status: 400 }
      );
    }
  }

   return redirect('/dashboard')
};

export const meta: V2_MetaFunction = () => [{ title: "Login" }];

export default function Index() {
  // const [searchParams] = useSearchParams();
  // const redirectTo = searchParams.get("redirectTo") || "/";       //!  login redirect
  // const actionData = useActionData<typeof action>();
  // const emailRef = useRef<HTMLInputElement>(null);
  // const passwordRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   if (actionData?.errors?.email) {
  //     emailRef.current?.focus();
  //   } else if (actionData?.errors?.password) {
  //     passwordRef.current?.focus();
  //   }
  // }, [actionData]);

  return (
    <main className="relative min-h-[90vh] grid p-2 sm:p-6">
      <AuthForm />
    </main>
  );
}
