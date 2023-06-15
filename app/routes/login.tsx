import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { verifyLogin } from "~/models/user.server";
import { createUserSession, getUserId } from "~/models/session.server";
import { safeRedirect, validateEmail } from "~/utils";
import AuthForm from "~/components/auth/AuthForm";
import { ca } from "date-fns/locale";
import { validateCredentials } from "~/models/validation.server";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/dashboard");
  return null;
};

export const action = async ({ request }: ActionArgs) => {

  //return errors - will be caught by component's 
  // const searchParams = new URL(request.url).searchParams;
  // const authMode = searchParams.get("mode") || 'login';

  const formData = await request.formData();
  const email = formData.get("email")! as string;
  const password = formData.get("password")! as string;
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/dashboard");
  const remember = formData.get("remember");

  let user = null
  let validated = null

  try{
    validated =  validateCredentials({email,password})
  }catch(validationError){
    return json({errors:validationError})
  }


  //!  put create session in signup and login
  // try {
  //   if (authMode === 'login') {
  //     console.log('in auth mode login')
  //     return await login(creddentials);
  //   } else {
  //     return await signup(creddentials);
  //   }
  // } catch (error) {
  //   if(error.status === 422){
  //     return {creddentials: error.message}
  //   }
  // }

  // if (!user) {
  //   return json(
  //     { errors: { email: "Invalid email or password", password: null } },
  //     { status: 400 }
  //   );
  // }

  // return createUserSession({
  //   redirectTo,
  //   remember: remember === "on" ? true : false,
  //   request,
  //   userId: user.id,
  // });
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
