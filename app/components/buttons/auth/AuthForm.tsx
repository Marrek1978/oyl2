import { Form, Link, useActionData, useNavigation } from '@remix-run/react'
import React from 'react'
import SolidBtn from '../SolidBtn'
import { useSearchParams } from '@remix-run/react';
import { SignUp, LoginIcon } from '~/components/utilities/icons';

const AuthForm = () => {

  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const validationErrors = useActionData();

  const authMode = searchParams.get('mode') || 'login';
  const submitBtnText = authMode === 'login' ? 'Log In' : 'Sign Up';
  const toggleBtnCaption = authMode === 'login' ? 'Sign Up' : 'Log In';
  const btnIcon = authMode === 'login' ? LoginIcon : SignUp;
  const isSubmitting = navigation.state !== 'idle';


  return (
    <>
      <div className="card card-side bg-base-100 shadow-xl rounded-none m-auto ">
        <figure className="hidden object-fill sm:block max-w-[500px]">
          <img src="/images/lion.jpg" alt="Movie" className="hidden object-cover sm:block" />
        </figure>
        <div className="card-body px-0 sm:px-4 max-w-lg">
          <div className="flex min-h-full flex-col justify-center">
            <div className="mx-auto w-full max-w-md px-8">
              <h1 className="card-title text-3xl font-mont">Welcome!</h1>
              <p className="mt-2 font-mont">Organize your Life.  Achieve your Desires</p>
              <h2 className='text-xl font-mont mt-6'>{
                authMode === "login" ? "Login" : "Sign Up"}
              </h2>
              <Form method="post" className="space-y-6 mt-6 form-control w-full max-w-xs font-mont">
                <div>
                  <label className="label pl-0 " htmlFor="email" >
                    <span className="label-text " >Email Address</span>
                  </label>
                  <input
                    id="email"
                    required
                    autoFocus={true}
                    name="email"
                    type="email"
                    autoComplete="email"
                    aria-invalid={validationErrors?.errors?.email ? true : undefined}
                    aria-describedby="email-error"
                    placeholder="john@example.com"
                    className="input input-bordered w-full max-w-xs rounded-none"
                  />
                  {validationErrors?.errors?.email ? (
                    <div className="pt-1 text-red-700" id="email-error">
                      {validationErrors.errors.email}
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
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      aria-invalid={validationErrors?.errors?.password ? true : undefined}
                      aria-describedby="password-error"
                      className="input input-bordered w-full max-w-xs rounded-none"
                      placeholder="******"
                    />
                    {validationErrors?.errors?.password ? (
                      <div className="pt-1 text-red-700" id="password-error">
                        {validationErrors.errors.password}
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
                    <span className="label-text" >  Remember me</span>
                  </label>
                </div>

                <SolidBtn
                  text={isSubmitting ? "Authenticating...  " : submitBtnText}
                  onClickFunction={() => { }}
                  icon={btnIcon}
                  daisyUIBtnColor='primary'
                />

                <div className="flex items-center justify-between">
                  <div className="text-center text-sm text-gray-500">
                    Don't have an account?{" "}
                    <Link
                      className="text-blue-500 underline"
                      to={authMode === "login" ? "?mode=signup" : "?mode=login"}>
                      {toggleBtnCaption}
                    </Link>
                  </div>
                </div>
              </Form>
              
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default AuthForm