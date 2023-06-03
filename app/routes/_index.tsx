import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { verifyLogin } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { safeRedirect, validateEmail } from "~/utils";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/dashboard");
  return json({});
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");
  const remember = formData.get("remember");

  if (!validateEmail(email)) {
    return json(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { email: null, password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { email: null, password: "Password is too short" } },
      { status: 400 }
    );
  }

  const user = await verifyLogin(email, password);

  if (!user) {
    return json(
      { errors: { email: "Invalid email or password", password: null } },
      { status: 400 }
    );
  }

  return createUserSession({
    redirectTo,
    remember: remember === "on" ? true : false,
    request,
    userId: user.id,
  });
};

export const meta: V2_MetaFunction = () => [{ title: "Login" }];


export default function Index() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";       //!  login redirect
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <main className="relative min-h-[90vh] bg-base-100 grid p-2 sm:p-6 ">
      <div className="card card-side bg-base-100 shadow-xl 
        m-auto  ">
        <figure className="hidden object-fill sm:block"><img src="https://picsum.photos/id/237/300/500" alt="Movie" className="hidden object-fill  sm:block" /></figure>
        <div className="card-body px-0 sm:px-4 max-w-lg">
          <div className="flex min-h-full flex-col justify-center">
            <div className="mx-auto w-full max-w-md px-8">
              <h1 className="card-title text-3xl">Welcome!</h1>
              <p className="mt-2">Organize your Life.  Achieve your Desires</p>
              <Form method="post" className="space-y-6 mt-8 form-control w-full max-w-xs">
                <div>
                  <label className="label pl-0" htmlFor="email" >
                    <span className="label-text" >Email Address</span>
                  </label>
                  <input
                    ref={emailRef}
                    id="email"
                    required
                    autoFocus={true}
                    name="email"
                    type="email"
                    autoComplete="email"
                    aria-invalid={actionData?.errors?.email ? true : undefined}
                    aria-describedby="email-error"
                    placeholder="john@example.com"
                    className="input input-bordered w-full max-w-xs"
                  />
                  {actionData?.errors?.email ? (
                    <div className="pt-1 text-red-700" id="email-error">
                      {actionData.errors.email}
                    </div>
                  ) : null}
                </div>

                <div>

                  <label className="label pl-0" htmlFor="password" >
                    <span className="label-text" >Password</span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      ref={passwordRef}
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      aria-invalid={actionData?.errors?.password ? true : undefined}
                      aria-describedby="password-error"
                      className="input input-bordered w-full max-w-xs"
                      placeholder="******"
                    />
                    {actionData?.errors?.password ? (
                      <div className="pt-1 text-red-700" id="password-error">
                        {actionData.errors.password}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />

                  <label className="label" htmlFor="remember" >
                    <span className="label-text" >Remember me</span>
                  </label>
                </div>
                <input type="hidden" name="redirectTo" value={redirectTo} />
                <button
                  type="submit"
                  // className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
                  className="btn btn-primary btn-block"
                >
                  Log in
                </button>
                <div className="flex items-center justify-between">
                  <div className="text-center text-sm text-gray-500">
                    Don't have an account?{" "}
                    <Link
                      className="text-blue-500 underline"
                      to={{
                        pathname: "/join",
                        search: searchParams.toString(),
                      }}
                    >
                      Sign up
                    </Link>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
