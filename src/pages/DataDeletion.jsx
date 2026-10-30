import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield,
  Trash2,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Mail,
  Building2,
  Clock,
  HelpCircle,
  KeyRound,
  FileText,
} from "lucide-react";
import { FaMeta } from "react-icons/fa6";

export default function DataDeletion() {
  const navigate = useNavigate();
  const [isAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false;
    return Boolean(localStorage.getItem("access_token"));
  });

  const handleReturnToCRM = () => {
    if (window.history.length > 1 && document.referrer && document.referrer.includes(window.location.host)) {
      navigate(-1);
    } else {
      navigate(isAuthenticated ? "/" : "/login");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Brand */}
          <Link
            to={isAuthenticated ? "/" : "/login"}
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
            aria-label="Tron CRM Home"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <span className="text-lg font-black tracking-wider">C</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-slate-900 leading-tight flex items-center gap-1.5">
                Tron CRM
                <span className="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200">
                  Data Protection
                </span>
              </span>
              <span className="text-xs text-slate-500">Tron Technologies</span>
            </div>
          </Link>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleReturnToCRM}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition shadow-xs cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>{isAuthenticated ? "Back to CRM" : "Sign In"}</span>
            </button>
            {isAuthenticated ? (
              <Link
                to="/"
                className="hidden sm:inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-blue-700 shadow-sm shadow-blue-200 transition"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/signup"
                className="hidden sm:inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-blue-700 shadow-sm shadow-blue-200 transition"
              >
                Create Account
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-white via-blue-50/25 to-slate-50 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50/80 px-3.5 py-1 text-xs font-semibold text-rose-700 mb-4">
              <Trash2 size={14} className="text-rose-600" />
              <span>User Data Deletion Protocol</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
              User Data Deletion Instructions
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Step-by-step guidance on how to revoke permissions, trigger automated Meta data-deletion requests for Facebook &amp; Instagram Lead Ads integrations, and request erasure of personal lead records.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <Clock size={16} className="text-blue-600" />
                Last Updated: October 28, 2026
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1">
                <FaMeta size={14} className="text-blue-600" /> Meta Platform Compliance
              </span>
              <span className="text-slate-300">•</span>
              <Link to="/privacy-policy" className="text-blue-600 hover:underline font-medium">
                View Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
        {/* Important Notice Card */}
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50/80 via-white to-blue-50/40 p-6 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Shield size={22} />
            </div>
            <div className="space-y-1.5 text-sm text-slate-700">
              <h2 className="font-bold text-slate-900 text-base">
                Overview of the Meta Lead Ads Integration
              </h2>
              <p className="leading-relaxed">
                Tron CRM provides an optional direct integration with Meta Platforms, Inc. (&quot;Meta&quot;) to synchronize prospective customer leads submitted through Facebook and Instagram Lead Ads into an enterprise customer pipeline. In accordance with Meta Platform Terms and global privacy standards, users who connected their Facebook account or whose lead data was ingested may revoke authorization and request data deletion as described below.
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: How to Request Deletion via Facebook */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
              01
            </span>
            <h2 className="text-2xl font-bold text-slate-900">
              How to Request Data Deletion via Facebook
            </h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            If you connected your Facebook account or authorized a Facebook Page for Tron CRM Lead Ads integration, follow these steps to disconnect the application and initiate an automated data-deletion request through Facebook:
          </p>

          {/* Stepper Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <ol className="relative border-l border-blue-100 ml-3 space-y-8">
              {/* Step 1 */}
              <li className="ml-6">
                <span className="absolute -left-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white ring-4 ring-white text-xs font-bold">
                  1
                </span>
                <h3 className="font-bold text-slate-900 text-base mb-1">
                  Sign in to Facebook
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Open Facebook (<a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1 font-medium">facebook.com <ExternalLink size={12} /></a>) on your browser or mobile device, and log in to the account that was used to connect the CRM integration.
                </p>
              </li>

              {/* Step 2 */}
              <li className="ml-6">
                <span className="absolute -left-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white ring-4 ring-white text-xs font-bold">
                  2
                </span>
                <h3 className="font-bold text-slate-900 text-base mb-1">
                  Navigate to Settings &amp; Permissions
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Click on your profile picture in the top right corner of Facebook, select <strong>Settings &amp; Privacy</strong>, and then click <strong>Settings</strong>.
                </p>
              </li>

              {/* Step 3 */}
              <li className="ml-6">
                <span className="absolute -left-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white ring-4 ring-white text-xs font-bold">
                  3
                </span>
                <h3 className="font-bold text-slate-900 text-base mb-1">
                  Open Business Integrations or Apps and Websites
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  In the left sidebar menu, look under the <strong>Permissions</strong> or <strong>Security</strong> section:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-xs sm:text-sm text-slate-600">
                  <li>If using a personal or business profile managing Pages: Open <strong>Business Integrations</strong>.</li>
                  <li>Alternatively, navigate to <strong>Apps and Websites</strong> (direct link: <a href="https://www.facebook.com/settings?tab=business_tools" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium inline-flex items-center gap-1">Facebook Business Tools <ExternalLink size={12} /></a>).</li>
                </ul>
              </li>

              {/* Step 4 */}
              <li className="ml-6">
                <span className="absolute -left-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white ring-4 ring-white text-xs font-bold">
                  4
                </span>
                <h3 className="font-bold text-slate-900 text-base mb-1">
                  Locate &quot;CRM Lead Ads Integration&quot;
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Browse your active authorized applications to find the <strong>CRM Lead Ads Integration</strong> application (associated with Tron CRM).
                </p>
              </li>

              {/* Step 5 */}
              <li className="ml-6">
                <span className="absolute -left-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white ring-4 ring-white text-xs font-bold">
                  5
                </span>
                <h3 className="font-bold text-slate-900 text-base mb-1">
                  Remove Application &amp; Request Data Deletion
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Click the <strong>Remove</strong> button next to the application. Follow the on-screen instructions provided by Facebook:
                </p>
                <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs sm:text-sm text-slate-700 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <KeyRound size={16} className="text-blue-600" />
                    <span>Difference between App Removal and Data Deletion:</span>
                  </div>
                  <p className="leading-relaxed">
                    <strong>Removing the application</strong> revokes Facebook authorization, rendering Page access tokens invalid and stopping real-time webhook lead syncing.
                  </p>
                  <p className="leading-relaxed">
                    <strong>Requesting data deletion</strong> sends an automated signed callback to our server endpoint to trigger the removal of stored integration records. Removing the app and requesting data deletion are related but distinct actions.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* Section 2: What Happens to the Data (Backend Transparency) */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
              02
            </span>
            <h2 className="text-2xl font-bold text-slate-900">
              What Happens When Deletion Is Requested
            </h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            We are committed to total transparency regarding what our backend automated cleanup workflow actually removes:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
            {/* What is deleted */}
            <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-base">
                <CheckCircle2 size={20} className="text-emerald-600" />
                <span>What Is Removed by Meta Deletion Callback</span>
              </div>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-2.5 list-disc pl-4 leading-relaxed">
                <li>
                  <strong>Stored Meta Integration Credentials:</strong> The matching <code className="text-xs bg-slate-100 px-1 py-0.5 rounded font-mono">MetaIntegration</code> record associated with the user ID is deactivated and removed from active synchronization.
                </li>
                <li>
                  <strong>Associated Facebook Page Records:</strong> Stored <code className="text-xs bg-slate-100 px-1 py-0.5 rounded font-mono">MetaPage</code> tokens, Page IDs, and authorization keys are erased.
                </li>
                <li>
                  <strong>Lead-Gen Webhook Subscriptions:</strong> Real-time webhook event listening for the connected ad account and pages ceases immediately.
                </li>
                <li>
                  <strong>Confirmation Tracking:</strong> A verifiable confirmation code and status record are created to provide confirmation to Meta.
                </li>
              </ul>
            </div>

            {/* What is NOT deleted automatically */}
            <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5 text-amber-900 font-bold text-base">
                <AlertTriangle size={20} className="text-amber-600" />
                <span>Important: What Is NOT Automatically Deleted</span>
              </div>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-2.5 list-disc pl-4 leading-relaxed">
                <li>
                  <strong>Existing CRM Lead Records:</strong> Historical customer lead entries previously imported into the CRM pipeline are <strong>NOT automatically purged</strong> by the automated Meta integration cleanup callback.
                </li>
                <li>
                  <strong>Subscriber Company Data:</strong> Deals, quotations, tasks, call logs, and customer accounts remain intact within the subscriber&apos;s workspace to prevent unintentional operational disruption.
                </li>
                <li>
                  <strong>Manual Deletion Required for Leads:</strong> If an individual prospective customer requires the deletion of their personal CRM Lead records, a manual request must be submitted as described below.
                </li>
              </ul>
            </div>
          </div>

          {/* Warning box */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-xs sm:text-sm text-amber-900 flex items-start gap-3">
            <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Notice of Accurate Representation:</strong> Tron Technologies does not claim or promise automated deletion of CRM database entities that the backend workflow does not actually delete. To request the complete erasure of your contact details or lead records from an enterprise customer&apos;s CRM database, please follow the manual deletion procedure below.
            </p>
          </div>
        </section>

        {/* Section 3: How to Request Deletion of CRM Lead Records */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
              03
            </span>
            <h2 className="text-2xl font-bold text-slate-900">
              Requesting Complete Deletion of CRM Lead Records
            </h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            If you are an individual whose contact details were submitted through an Instant Form on Facebook or Instagram and you want your lead record completely erased from the CRM, you have two options:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Building2 size={16} className="text-blue-600" />
                <span>Option A: Contact the Business (Data Controller)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                The business or advertiser whose Facebook ad you interacted with is the primary Data Controller. They can immediately delete or purge your lead record directly from their Tron CRM Leads Management module with zero delay.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Mail size={16} className="text-indigo-600" />
                <span>Option B: Contact Tron CRM Support Directly</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                If you are unable to reach the advertiser, send a direct deletion request to our Data Protection support team. We will locate the matching lead record and coordinate with the tenant to execute permanent erasure within 30 days.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Support & Contact Information */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
              04
            </span>
            <h2 className="text-2xl font-bold text-slate-900">
              Support &amp; Contact Information
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-5">
            <p className="text-sm text-slate-600 leading-relaxed">
              If you have any questions, encounter difficulties removing the integration, or need confirmation regarding your deletion status, please contact our support desk:
            </p>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-5 space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Building2 size={16} className="text-blue-600" />
                <span>Tron Technologies — CRM Data Protection Office</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm pt-1">
                <div>
                  <span className="text-slate-500 block font-medium">Customer Support Email:</span>
                  <a
                    href="mailto:trontechnologies.access@gmail.com"
                    className="font-mono text-blue-600 hover:underline font-semibold"
                  >
                    trontechnologies.access@gmail.com
                  </a>
                </div>

                <div>
                  <span className="text-slate-500 block font-medium">Privacy &amp; Compliance Office:</span>
                  <a
                    href="mailto:trontechnologies.access@gmail.com"
                    className="font-mono text-blue-600 hover:underline font-semibold"
                  >
                    trontechnologies.access@gmail.com
                  </a>
                </div>

                <div>
                  <span className="text-slate-500 block font-medium">Response SLA:</span>
                  <span className="text-slate-700 font-medium">Acknowledgment within 48 hours; completion within 30 days</span>
                </div>

                <div>
                  <span className="text-slate-500 block font-medium">Required Information:</span>
                  <span className="text-slate-700">Full name, email address, and Facebook Page name engaged</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/privacy-policy"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
              >
                <FileText size={16} />
                <span>Read Full Privacy Policy</span>
              </Link>
              <span className="text-slate-300">•</span>
              <button
                onClick={handleReturnToCRM}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>{isAuthenticated ? "Return to CRM Workspace" : "Return to Login"}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Section 5: Frequently Asked Questions */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
              05
            </span>
            <h2 className="text-2xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-2">
                <HelpCircle size={16} className="text-blue-600" />
                Does removing the integration from Facebook delete all my historical CRM leads?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                No. Removing the integration from Facebook deactivates your Page tokens and deletes the stored OAuth credentials so that no new leads are fetched. Existing leads already inside the CRM pipeline remain untouched. For complete erasure of specific lead contacts, a direct deletion request must be submitted.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-2">
                <HelpCircle size={16} className="text-blue-600" />
                How can I check the status of my Meta data-deletion request?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                When Facebook delivers an automated deletion request to our callback endpoint, our system generates a unique confirmation code and returns a status tracking URL to Facebook. You can check the status via the link provided in your Facebook deletion receipt.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-2">
                <HelpCircle size={16} className="text-blue-600" />
                Can I reconnect Meta Lead Ads later after disconnecting?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Yes. Authorized CRM administrators can re-initiate OAuth authorization at any time by navigating to <strong>Settings &gt; Notifications</strong> and clicking <strong>Connect Meta</strong>.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
                C
              </div>
              <span className="text-sm font-bold text-slate-900">Tron CRM</span>
              <span className="text-xs text-slate-400">| © 2026 Tron Technologies. All rights reserved.</span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500">
              <Link to="/privacy-policy" className="hover:text-blue-600 transition">
                Privacy Policy
              </Link>
              <Link to="/data-deletion" className="hover:text-blue-600 font-semibold text-blue-600">
                Data Deletion
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/" className="hover:text-slate-900 transition">
                    Dashboard
                  </Link>
                  <Link to="/settings" className="hover:text-slate-900 transition">
                    Settings
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-slate-900 transition">
                    Sign In
                  </Link>
                  <Link to="/signup" className="hover:text-slate-900 transition">
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
