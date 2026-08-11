import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { loginUser, loading, error, setError } = useAuth();


  const setField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };


  const handleSubmit = async () => {

    if (!form.email || !form.password) {

      setError("Email and password are required");
      return;

    }


    try {

      await loginUser({

        email: form.email.trim().toLowerCase(),

        password: form.password,

      });


      navigate("/");


    } catch (err) {

      console.log(err);

    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EFF6FF] to-[#F8FAFC] flex items-center justify-center p-4">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8">


          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-rose-50 border border-rose-100 text-sm text-rose-600">
              {error}
            </div>
          )}



          <div className="space-y-5">


            <div>

              <label className="text-sm font-medium text-[#374151]">
                Email Address
              </label>


              <input
                type="email"
                value={form.email}

                onChange={(e) =>
                  setField("email", e.target.value)
                }

                onKeyDown={(e) =>
                  e.key === "Enter" && handleSubmit()
                }

                placeholder="you@company.com"

                className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 text-sm outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
              />

            </div>



            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-[#374151]">
                  Password
                </label>

                <a
                  href="#"
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </a>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setField("password", e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="Enter your password"
                  className="h-11 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 pr-12 text-sm outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>




            <button

              type="button"

              onClick={handleSubmit}
              disabled={loading}

              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition text-white text-sm font-semibold shadow-sm shadow-blue-200"

            >

              {loading ? "Signing in..." : "Sign In"}

            </button>


          </div>




          <p className="text-center text-sm text-slate-500 mt-7">

            Do not have an account?{" "}


            <Link

              to="/signup"

              className="text-blue-600 font-semibold hover:text-blue-700"

            >

              Sign up

            </Link>


          </p>



        </div>


      </div>


    </div>
  );
};


export default Login;