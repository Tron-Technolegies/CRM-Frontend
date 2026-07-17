import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Signup = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    company_name: "",
    company_email: "",
    company_phone: "",
    company_website: "",
  });

  const { register, loading, error, setError } = useAuth();


  const setField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword ||
      !form.company_name ||
      !form.company_email
    ) {
      setError("Please fill all required fields");
      return;
    }


    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }


    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }


    try {

      await register({

        name: form.name.trim(),

        email: form.email
          .trim()
          .toLowerCase(),

        password: form.password,

        company_name: form.company_name.trim(),

        company_email: form.company_email
          .trim()
          .toLowerCase(),

        company_phone: form.company_phone,

        company_website: form.company_website,

      });


      navigate("/login");


    } catch (err) {

      console.log(err);

    }

  };



  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">

      <div className="w-full max-w-2xl">


        <div className="text-center mb-8">

          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">

            <span className="text-white text-3xl font-bold">
              C
            </span>

          </div>


          <h1 className="text-3xl font-bold text-slate-900">
            Create your CRM Account
          </h1>


          <p className="text-sm text-slate-500 mt-2">
            Register your company and create your admin account
          </p>


        </div>



        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">


          {error && (

            <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">

              {error}

            </div>

          )}



          <div className="space-y-8">



            <section>


              <div className="flex items-center gap-3 mb-5">


                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-semibold">

                  1

                </div>


                <div>

                  <h2 className="font-semibold text-slate-900">
                    Account Information
                  </h2>

                  <p className="text-xs text-slate-500">
                    Create your administrator profile
                  </p>

                </div>


              </div>



              <div className="space-y-4">



                <div>

                  <label className="text-sm font-medium text-slate-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>


                  <input

                    value={form.name}

                    onChange={(e) =>
                      setField("name", e.target.value)
                    }

                    placeholder="Enter your full name"

                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"

                  />

                </div>




                <div>

                  <label className="text-sm font-medium text-slate-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>


                  <input

                    type="email"

                    value={form.email}

                    onChange={(e) =>
                      setField("email", e.target.value)
                    }

                    placeholder="admin@company.com"

                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"

                  />


                </div>





                <div className="grid grid-cols-2 gap-4">


                  <div>

                    <label className="text-sm font-medium text-slate-700">
                      Password <span className="text-red-500">*</span>
                    </label>


                    <input

                      type="password"

                      value={form.password}

                      onChange={(e) =>
                        setField("password", e.target.value)
                      }

                      placeholder="Minimum 8 characters"

                      className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"

                    />

                  </div>




                  <div>

                    <label className="text-sm font-medium text-slate-700">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>


                    <input

                      type="password"

                      value={form.confirmPassword}

                      onChange={(e) =>
                        setField("confirmPassword", e.target.value)
                      }

                      placeholder="Confirm password"

                      className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"

                    />

                  </div>


                </div>


              </div>


            </section>





            <section className="border-t border-slate-100 pt-7">


              <div className="flex items-center gap-3 mb-5">


                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold">

                  2

                </div>


                <div>

                  <h2 className="font-semibold text-slate-900">
                    Company Information
                  </h2>


                  <p className="text-xs text-slate-500">
                    Tell us about your organization
                  </p>


                </div>


              </div>




              <div className="space-y-4">


                <div>

                  <label className="text-sm font-medium text-slate-700">
                    Company Name <span className="text-red-500">*</span>
                  </label>


                  <input

                    value={form.company_name}

                    onChange={(e) =>
                      setField("company_name", e.target.value)
                    }

                    placeholder="Enter company name"

                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"

                  />

                </div>




                <div>

                  <label className="text-sm font-medium text-slate-700">
                    Company Email <span className="text-red-500">*</span>
                  </label>


                  <input

                    type="email"

                    value={form.company_email}

                    onChange={(e) =>
                      setField("company_email", e.target.value)
                    }

                    placeholder="contact@company.com"

                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"

                  />

                </div>




                <div className="grid grid-cols-2 gap-4">


                  <div>

                    <label className="text-sm font-medium text-slate-700">
                      Phone Number
                    </label>


                    <input

                      value={form.company_phone}

                      onChange={(e) =>
                        setField("company_phone", e.target.value)
                      }

                      placeholder="+91 9876543210"

                      className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"

                    />

                  </div>




                  <div>

                    <label className="text-sm font-medium text-slate-700">
                      Website
                    </label>


                    <input

                      value={form.company_website}

                      onChange={(e) =>
                        setField("company_website", e.target.value)
                      }

                      placeholder="https://company.com"

                      className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"

                    />


                  </div>


                </div>


              </div>


            </section>





            <button

              onClick={handleSubmit}

              disabled={loading}

              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition shadow-sm disabled:opacity-60"

            >

              {loading
                ? "Creating Account..."
                : "Create Company Account"
              }

            </button>



          </div>





          <p className="text-center text-sm text-slate-500 mt-7">

            Already have an account?{" "}

            <Link

              to="/login"

              className="text-blue-600 font-semibold hover:text-blue-700"

            >

              Sign in

            </Link>

          </p>



        </div>


      </div>


    </div>
  );
};


export default Signup;