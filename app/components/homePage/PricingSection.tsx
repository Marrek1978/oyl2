import React from 'react'

function PricingSection() {
  return (
    <>
      {/* <!-- Container for demo purpose --> */}
      <div className="container my-24 mx-auto md:px-6">
        {/* <!-- Section: Design Block --> */}
        <section className="mb-32">
          <h2 className="mb-12 text-center text-3xl font-bold">Pricing</h2>


          <div className="mb-6">
            <div className="hidden opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
              id="pills-home02" role="tabpanel" aria-labelledby="pills-home-tab02" data-te-tab-active>
              <div className="grid gap-6 lg:grid-cols-3 lg:gap-x-12">
                <div className="mb-6 lg:mb-0">
                  <div
                    className="block h-full rounded-lg  bg-base-100  shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
                    <div className="border-b-2 border-neutral-100 border-opacity-100 p-6 text-center dark:border-opacity-10">
                      <p className="mb-4 text-sm uppercase">
                        <strong>Monthly</strong>
                      </p>
                      <h3 className="mb-6 text-3xl">
                        <strong>$ 129</strong>
                        <small className="text-base text-neutral-500 dark:text-neutral-300">/year</small>
                      </h3>

                      <button type="button"
                        className="inline-block w-full rounded bg-[hsl(0,0%,95%)] px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-[hsl(0,0%,93%)] focus:bg-[hsl(0,0%,95%)] focus:outline-none focus:ring-0 active:bg-[hsl(0,0%,90%)]"
                        data-te-ripple-init data-te-ripple-color="light">
                        Buy
                      </button>
                    </div>

                  </div>
                </div>

                <div className="mb-6 lg:mb-0">
                  <div
                    className="block h-full rounded-lg bg-base-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
                    <div className="border-b-2 border-neutral-100 border-opacity-100 p-6 text-center dark:border-opacity-10">
                      <p className="mb-4 text-sm uppercase">
                        <strong>Yearly</strong>
                      </p>
                      <h3 className="mb-6 text-3xl">
                        <strong>$ 299</strong>
                        <small className="text-base text-neutral-500 dark:text-neutral-300">/year</small>
                      </h3>
                      <button type="button"
                        className="inline-block w-full rounded bg-primary px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                        data-te-ripple-init data-te-ripple-color="light">
                        Buy
                      </button>
                    </div>

                  </div>
                </div>


              </div>
            </div>
           
          </div>
        </section>
      </div>
    </>
  )
}

export default PricingSection