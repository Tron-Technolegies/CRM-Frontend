import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8000/api/admin" });

export default function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("token");

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

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      setError("Name, email and password are required");
      return;
    }

    if (!inviteToken && (!form.company_name || !form.company_email)) {
      setError("Company name and company email are required");
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

    setLoading(true);
    setError("");

    try {
      const payload = inviteToken
        ? { token: inviteToken, name: form.name, password: form.password }
        : {
            name: form.name,
            email: form.email.trim().toLowerCase(),
            password: form.password,
            company_name: form.company_name,
            company_email: form.company_email.trim().toLowerCase(),
            company_phone: form.company_phone,
            company_website: form.company_website,
          };

      const res = await api.post("/staff/signup/", payload);

      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EFF6FF] to-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <span className="text-white font-bold text-2xl">C</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A]">
            {inviteToken ? "Set up your account" : "Create your CRM"}
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            {inviteToken ? "You've been invited to join a workspace" : "Start your free account today"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8">

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-rose-50 border border-rose-100 text-sm text-rose-600">
              {error}
            </div>
          )}

          <div className="space-y-5">

            {/* Personal Info Section */}
            <div>
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-4">
                Personal Information
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[#374151]">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    placeholder="John Smith"
                    className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 text-sm outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>

                {!inviteToken && (
                  <div>
                    <label className="text-sm font-medium text-[#374151]">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                      placeholder="you@company.com"
                      className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 text-sm outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[#374151]">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => setField("password", e.target.value)}
                      placeholder="Min 8 characters"
                      className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 text-sm outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#374151]">
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={form.confirmPassword}
                      onChange={(e) => setField("confirmPassword", e.target.value)}
                      placeholder="Repeat password"
                      className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 text-sm outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Company Info Section — hide for invited users */}
            {!inviteToken && (
              <div>
                <div className="h-px bg-[#F1F5F9] my-2" />
                <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-4 mt-4">
                  Company Information
                </p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-[#374151]">
                        Company Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        value={form.company_name}
                        onChange={(e) => setField("company_name", e.target.value)}
                        placeholder="Acme Inc."
                        className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 text-sm outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#374151]">
                        Company Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={form.company_email}
                        onChange={(e) => setField("company_email", e.target.value)}
                        placeholder="info@acme.com"
                        className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 text-sm outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-[#374151]">Phone</label>
                      <input
                        value={form.company_phone}
                        onChange={(e) => setField("company_phone", e.target.value)}
                        placeholder="+91 9876543210"
                        className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 text-sm outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#374151]">Website</label>
                      <input
                        value={form.company_website}
                        onChange={(e) => setField("company_website", e.target.value)}
                        placeholder="https://acme.com"
                        className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 text-sm outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition text-white text-sm font-semibold disabled:opacity-60 shadow-sm shadow-blue-200"
            >
              {loading
                ? inviteToken ? "Creating account..." : "Creating company..."
                : inviteToken ? "Create Account" : "Create Company & Account"
              }
            </button>
          </div>

          <p className="text-center text-sm text-[#64748B] mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-[#94A3B8] mt-6">
          © 2026 CRM Platform. All rights reserved.
        </p>
      </div>
    </div>
  );
}