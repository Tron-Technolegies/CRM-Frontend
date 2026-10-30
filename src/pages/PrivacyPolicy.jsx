import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield,
  Lock,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  Clock,
  UserCheck,
  Server,
  Trash2,
  Mail,
  Building2,
  Layers,
  ArrowUp,
  Database,
} from "lucide-react";
import { FaFacebook, FaMeta } from "react-icons/fa6";

const SECTIONS = [
  { id: "introduction", title: "1. Introduction & Overview" },
  { id: "information-collected", title: "2. Information We Collect" },
  { id: "how-information-used", title: "3. How Information Is Used" },
  { id: "meta-integration", title: "4. Facebook & Instagram Lead Ads" },
  { id: "multi-tenant-isolation", title: "5. Tenant Isolation & Access Control" },
  { id: "data-sharing", title: "6. Data Sharing & Third Parties" },
  { id: "data-security", title: "7. Data Storage & Security" },
  { id: "data-retention", title: "8. Data Retention Policies" },
  { id: "privacy-rights", title: "9. Your Privacy Rights (GDPR & CCPA)" },
  { id: "data-deletion", title: "10. Personal Data Deletion Requests" },
  { id: "cookies", title: "11. Cookies & Storage Technologies" },
  { id: "third-party-services", title: "12. Third-Party Services" },
  { id: "childrens-privacy", title: "13. Children's Privacy" },
  { id: "policy-changes", title: "14. Policy Updates" },
  { id: "contact-information", title: "15. Contact & Support" },
];

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("introduction");
  const [showBackToTop, setShowBackToTop] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      // Toggle back to top button
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }

      // Track active section based on scroll position
      const scrollPosition = window.scrollY + 160;
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
                  Trust & Safety
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
      <section className="border-b border-slate-200 bg-gradient-to-b from-white via-blue-50/20 to-slate-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-blue-700 mb-4">
              <Shield size={14} className="text-blue-600" />
              <span>Enterprise Privacy & Data Governance</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
              Tron Technologies Privacy Policy
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              How Tron CRM collects, processes, protects, and stores corporate customer information, authorized user credentials, and lead records imported through our Facebook and Instagram Lead Ads integrations.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <Clock size={16} className="text-blue-600" />
                Effective Date: October 24, 2026
              </span>
              <span className="text-slate-300">•</span>
              <span>Version: 2.4.0</span>
              <span className="text-slate-300">•</span>
              <span>Applies to Tron CRM Web & API Platform</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Body with Sticky Sidebar + Content */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Table of Contents (Sticky on Desktop) */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
                <FileText size={18} className="text-blue-600" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Table of Contents
                </h2>
              </div>
              <nav className="max-h-[calc(100vh-220px)] overflow-y-auto space-y-1 pr-1 text-xs sm:text-sm">
                {SECTIONS.map((section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition flex items-center justify-between cursor-pointer ${
                        isActive
                          ? "bg-blue-50 font-semibold text-blue-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-normal"
                      }`}
                    >
                      <span className="truncate">{section.title}</span>
                      {isActive && <ChevronRight size={14} className="shrink-0 text-blue-600" />}
                    </button>
                  );
                })}
              </nav>

              {/* Quick Contact Card */}
              <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-1">
                  <Mail size={14} className="text-blue-600" />
                  <span>Privacy Inquiries</span>
                </div>
                <p className="text-slate-600 mb-2 leading-relaxed">
                  Questions regarding personal data processing or Meta lead record deletion?
                </p>
                <button
                  onClick={() => scrollToSection("data-deletion")}
                  className="w-full text-center py-1.5 px-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                >
                  Request Data Deletion
                </button>
              </div>
            </div>
          </aside>

          {/* Document Content */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-12">
            {/* Notice Callout */}
            <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50/70 to-indigo-50/50 p-6 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <Shield size={20} />
                </div>
                <div className="space-y-1.5 text-sm text-slate-700">
                  <h3 className="font-bold text-slate-900 text-base">
                    Our Commitment to Privacy & Lead Transparency
                  </h3>
                  <p className="leading-relaxed">
                    Tron Technologies is committed to maintaining the highest standards of data integrity, confidentiality, and user rights. Whether you are an enterprise customer using Tron CRM or a prospective customer whose contact details were submitted through a connected Meta Lead Ad form, this document provides complete transparency into our data practices.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 1 */}
            <section id="introduction" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
                  01
                </span>
                <h2 className="text-2xl font-bold text-slate-900">
                  1. Introduction & Scope
                </h2>
              </div>
              <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                <p>
                  This Privacy Policy applies to the Tron CRM platform, web application (hosted at{" "}
                  <a href="https://tron-crm.netlify.app" className="text-blue-600 underline font-medium hover:text-blue-700">
                    tron-crm.netlify.app
                  </a>
                  ), backend API endpoints (hosted at{" "}
                  <a href="https://crm-backend-ejfr.onrender.com" className="text-blue-600 underline font-medium hover:text-blue-700">
                    crm-backend-ejfr.onrender.com
                  </a>
                  ), and all associated tools operated by <strong>Tron Technologies</strong> (&quot;Tron Technologies&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;).
                </p>
                <p>
                  Tron CRM is an enterprise Multi-Tenant Customer Relationship Management platform. In the context of applicable data protection laws (including the European Union General Data Protection Regulation (&quot;GDPR&quot;) and the California Consumer Privacy Act (&quot;CCPA/CPRA&quot;)):
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Tron Technologies as a Data Controller:</strong> We act as a Data Controller with respect to account administrative data, such as staff email addresses, passwords, company profiles, and billing configurations provided when creating an account.
                  </li>
                  <li>
                    <strong>Tron Technologies as a Data Processor:</strong> We act as a Data Processor on behalf of our enterprise business subscribers (&quot;Customers&quot; or &quot;Tenants&quot;) with respect to all customer records, deals, pipeline information, and lead records collected directly or imported from integrated platforms (such as Meta Lead Ads). The subscriber remains the Data Controller for their respective tenant database.
                  </li>
                </ul>
              </div>
            </section>

            <hr className="border-slate-200" />

            {/* Section 2 */}
            <section id="information-collected" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
                  02
                </span>
                <h2 className="text-2xl font-bold text-slate-900">
                  2. Information We Collect
                </h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                We only collect and process information necessary to provide our CRM services, execute role-based workflows, and maintain tenant isolation:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 mb-2">
                    <Building2 size={16} className="text-blue-600" />
                    <span>Account & Organization Data</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                    <li>Full Name of account administrators and staff members</li>
                    <li>Business email addresses and encrypted password credentials</li>
                    <li>Company name, contact phone number, website, and company email</li>
                    <li>Designated role and permission assignments (RBAC)</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 mb-2">
                    <Database size={16} className="text-indigo-600" />
                    <span>CRM Operational & Pipeline Records</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                    <li>Lead records (names, phone numbers, email addresses, inquiry types)</li>
                    <li>Accounts, customers, contacts, and deal stages</li>
                    <li>Quotations, sales orders, purchase orders, invoices, and product details</li>
                    <li>Task assignments, notes, call logs, and customer interaction history</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 mb-2">
                    <FaMeta size={16} className="text-blue-600" />
                    <span>Meta Integration Data</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                    <li>Authorized Meta User ID and Ad Account IDs</li>
                    <li>Connected Facebook Page names and Facebook Page IDs</li>
                    <li>Leadgen submission identifiers and custom Instant Form field responses</li>
                    <li>Webhook delivery verification tokens and event timestamps</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 mb-2">
                    <Server size={16} className="text-emerald-600" />
                    <span>Technical & Diagnostic Data</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                    <li>Internet Protocol (IP) addresses and browser user-agent headers</li>
                    <li>JSON Web Tokens (JWT) for secure session authentication</li>
                    <li>Audit logs of record creation, updates, and permission changes</li>
                    <li>System error reports strictly for platform resilience and debugging</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 flex items-start gap-3">
                <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Categories of Data Not Collected:</strong> Tron Technologies does not intentionally collect or process sensitive biometric data, health information, political affiliations, sexual orientation, or criminal history. Payment card transactions are processed through specialized compliant billing vendors; raw card numbers (PANs) are never stored on our servers.
                </p>
              </div>
            </section>

            <hr className="border-slate-200" />

            {/* Section 3 */}
            <section id="how-information-used" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
                  03
                </span>
                <h2 className="text-2xl font-bold text-slate-900">
                  3. How Information Is Used
                </h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                We process collected data exclusively for legitimate business purposes pursuant to our contractual agreements with our subscribers and valid legal bases:
              </p>
              <ul className="space-y-2.5 text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Service Delivery:</strong> To authenticate staff members, initialize multi-tenant workspaces, and enable customer relationship workflows.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Lead Automation & Routing:</strong> To ingest inbound inquiries from Meta Lead Ads, map form fields to CRM contact attributes, and assign records to authorized team members.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Platform Security:</strong> To prevent unauthorized cross-tenant data access, validate HMAC webhook signatures, block suspicious logins, and maintain audit logs.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Communication:</strong> To deliver essential transactional notices, account invitations, and in-app system updates.</span>
                </li>
              </ul>
            </section>

            <hr className="border-slate-200" />

            {/* Section 4: Meta Facebook and Instagram Lead Ads (KEY SECTION) */}
            <section id="meta-integration" className="scroll-mt-24 space-y-5">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
                  04
                </span>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-2xl font-bold text-slate-900">
                    4. Facebook & Instagram Lead Ads Integration
                  </h2>
                  <span className="rounded-md bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 flex items-center gap-1.5">
                    <FaFacebook size={12} className="text-blue-600" />
                    <FaMeta size={12} /> Meta Lead Ads
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-200 bg-white p-6 shadow-xs space-y-4">
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  Tron CRM offers an optional, direct integration with Meta Platforms, Inc. (&quot;Meta&quot;) allowing authorized business subscribers to connect their Facebook Business accounts and automatically import prospective customer leads generated via Facebook and Instagram Lead Ads.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Lock size={14} className="text-blue-600" />
                      OAuth 2.0 Authorization Flow
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Connecting Meta requires an administrator to explicitly authenticate through Meta&apos;s OAuth dialog. We request specific scopes (<code className="text-blue-700 bg-blue-50 px-1 rounded">pages_show_list</code>, <code className="text-blue-700 bg-blue-50 px-1 rounded">pages_read_engagement</code>, <code className="text-blue-700 bg-blue-50 px-1 rounded">pages_manage_ads</code>, and <code className="text-blue-700 bg-blue-50 px-1 rounded">leads_retrieval</code>) solely to retrieve the authorized Facebook Pages and pull incoming form submissions.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Shield size={14} className="text-emerald-600" />
                      Cryptographic Webhook Verification
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Lead submissions are delivered via real-time Meta webhooks. Tron CRM verifies every payload using SHA-256 HMAC signature validation (<code className="text-blue-700 bg-blue-50 px-1 rounded">X-Hub-Signature-256</code>) with our secure App Secret to guarantee that only authentic, untampered events from Meta are ingested.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2 text-sm text-slate-600 leading-relaxed">
                  <h4 className="font-bold text-slate-900">Data Processed via the Meta Integration:</h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                    <li><strong>Lead Contact Details:</strong> Full name, telephone number, email address, company name, and custom questionnaire answers submitted by individuals on Meta Instant Forms.</li>
                    <li><strong>Meta Campaign Identifiers:</strong> Meta Lead ID (<code className="font-mono text-xs">leadgen_id</code>), Form ID, Page ID, and Ad ID, used to match leads to their respective marketing source.</li>
                    <li><strong>Access Tokens:</strong> Page access tokens and authorization credentials are stored in encrypted form, scoped strictly to the subscriber&apos;s tenant, and are <strong>never</strong> exposed in client-side responses or browser inspection.</li>
                  </ul>
                  <p>
                    <strong>Disconnection and Token Revocation:</strong> Subscribers may disconnect their Meta account at any time through the Tron CRM Settings &gt; Notifications integration card. Upon disconnection, stored Page access tokens are immediately deactivated, and lead synchronization stops completely. Users may also revoke Tron CRM&apos;s permissions at any time directly through their{" "}
                    <a
                      href="https://www.facebook.com/settings?tab=business_tools"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline font-semibold hover:text-blue-700"
                    >
                      Facebook Business Integrations Settings
                    </a>.
                  </p>
                </div>
              </div>
            </section>

            <hr className="border-slate-200" />

            {/* Section 5 */}
            <section id="multi-tenant-isolation" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
                  05
                </span>
                <h2 className="text-2xl font-bold text-slate-900">
                  5. Multi-Tenant Isolation & Role-Based Access Control
                </h2>
              </div>
              <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                <p>
                  Tron CRM is built with architectural multi-tenancy. Every database query, API endpoint, and webhook handler enforces strict company-level isolation:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-2 font-bold text-slate-900 mb-1.5 text-sm">
                      <Layers size={16} className="text-blue-600" />
                      <span>Zero Cross-Tenant Leakage</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Data belonging to Company A is cryptographically and relationally isolated from Company B. No subscriber or staff member can view or query lead records, Facebook Pages, or customer profiles outside their assigned tenant.
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-2 font-bold text-slate-900 mb-1.5 text-sm">
                      <UserCheck size={16} className="text-indigo-600" />
                      <span>Granular RBAC Permissions</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Within each tenant, access is restricted using Role-Based Access Control (RBAC). Staff members only have permission to access specific modules (e.g. <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">lead.view</code>, <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">integration.view</code>) as designated by their account administrator.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-slate-200" />

            {/* Section 6 */}
            <section id="data-sharing" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
                  06
                </span>
                <h2 className="text-2xl font-bold text-slate-900">
                  6. Data Sharing & Third-Party Disclosure
                </h2>
              </div>
              <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                <p className="font-semibold text-slate-900">
                  We do not sell, rent, monetize, or trade your personal data or lead records to advertisers or third-party data brokers under any circumstances.
                </p>
                <p>
                  We share personal data only in the following limited, controlled situations:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                  <li>
                    <strong>Essential Subprocessors & Cloud Infrastructure:</strong> We engage verified cloud hosting providers (e.g., Netlify for frontend delivery, Render for containerized API execution, and managed relational database providers) to host the platform under confidentiality and data protection agreements.
                  </li>
                  <li>
                    <strong>Connected Third-Party Integrations:</strong> When a subscriber explicitly connects an integration (such as Meta Lead Ads or Twilio telephony services), data is shared strictly as necessary to execute the requested feature.
                  </li>
                  <li>
                    <strong>Legal & Regulatory Compliance:</strong> We may disclose data if required by enforceable court order, subpoena, or applicable statutory law, provided we notify the affected subscriber where legally permissible.
                  </li>
                  <li>
                    <strong>Corporate Transactions:</strong> In the event of a merger, acquisition, or sale of company assets, customer data will remain subject to the commitments in this Privacy Policy.
                  </li>
                </ul>
              </div>
            </section>

            <hr className="border-slate-200" />

            {/* Section 7 */}
            <section id="data-security" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
                  07
                </span>
                <h2 className="text-2xl font-bold text-slate-900">
                  7. Data Storage & Security Measures
                </h2>
              </div>
              <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                <p>
                  Tron Technologies implements technical, administrative, and physical safeguards designed to protect personal data from accidental loss, unauthorized access, alteration, and disclosure:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
                    <Lock size={20} className="text-blue-600 mx-auto mb-2" />
                    <h4 className="text-xs font-bold text-slate-900 mb-1">Encryption in Transit</h4>
                    <p className="text-[11px] text-slate-500">All browser and API communication is enforced over HTTPS with TLS 1.3 encryption.</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
                    <Shield size={20} className="text-indigo-600 mx-auto mb-2" />
                    <h4 className="text-xs font-bold text-slate-900 mb-1">Credential Hashing</h4>
                    <p className="text-[11px] text-slate-500">User passwords are cryptographically salted and hashed using industry-standard algorithms.</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
                    <Server size={20} className="text-emerald-600 mx-auto mb-2" />
                    <h4 className="text-xs font-bold text-slate-900 mb-1">Restricted Token Storage</h4>
                    <p className="text-[11px] text-slate-500">OAuth tokens are stored securely with zero exposure in public logs or client states.</p>
                  </div>
                </div>
                <div className="rounded-xl bg-slate-100/80 p-3.5 text-xs text-slate-600 mt-2">
                  <span className="font-semibold text-slate-800">Security Verification Notice: </span>
                  <em>[To be confirmed by Tron Technologies: Formal third-party security certifications such as SOC 2 Type II or ISO 27001 will be listed here upon completion of external compliance audits.]</em>
                </div>
              </div>
            </section>

            <hr className="border-slate-200" />

            {/* Section 8 */}
            <section id="data-retention" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
                  08
                </span>
                <h2 className="text-2xl font-bold text-slate-900">
                  8. Data Retention Policies
                </h2>
              </div>
              <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                <p>
                  We retain personal data and CRM records only for as long as necessary to fulfill the operational purposes outlined in this policy or as required by applicable tax, accounting, and legal requirements:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                  <li>
                    <strong>Active Tenant CRM Data:</strong> Lead records, customer contacts, quotations, and pipeline history are retained for the duration of the subscriber&apos;s active account lifecycle.
                  </li>
                  <li>
                    <strong>Subscriber-Initiated Deletion:</strong> Subscribers may delete individual leads, purge organization data, or request account closure at any time through the in-app Data &amp; Privacy settings.
                  </li>
                  <li>
                    <strong>Integrated Meta Tokens:</strong> When an integration is disconnected, OAuth tokens are immediately marked inactive and removed from active synchronization processes.
                  </li>
                  <li>
                    <strong>System Logs &amp; Backups:</strong> Server diagnostic logs and backup snapshots are cycled on regular rotation intervals pursuant to our infrastructure retention policies.
                  </li>
                </ul>
                <p className="text-xs text-slate-500 italic">
                  [Note for Tron Technologies: Specific statutory retention schedules (e.g. 7 years for financial records) should be formally verified and updated based on your jurisdiction.]
                </p>
              </div>
            </section>

            <hr className="border-slate-200" />

            {/* Section 9 */}
            <section id="privacy-rights" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
                  09
                </span>
                <h2 className="text-2xl font-bold text-slate-900">
                  9. Your Privacy Rights (GDPR, CCPA/CPRA & Global Laws)
                </h2>
              </div>
              <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                <p>
                  Depending on your geographic residency, you may have specific statutory rights regarding your personal data:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">Right to Access / Know</h4>
                    <p className="text-xs text-slate-600">The right to request confirmation of whether we process your data and receive a copy of your personal records.</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">Right to Rectification</h4>
                    <p className="text-xs text-slate-600">The right to correct inaccurate, incomplete, or outdated personal information in your profile.</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">Right to Erasure (&quot;Forgotten&quot;)</h4>
                    <p className="text-xs text-slate-600">The right to request permanent deletion of your personal information, subject to statutory exceptions.</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">Right to Data Portability</h4>
                    <p className="text-xs text-slate-600">The right to receive your data in a structured, commonly used machine-readable format (e.g. PDF or CSV).</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 pt-1">
                  We will never discriminate against any user for exercising their legal privacy rights.
                </p>
              </div>
            </section>

            <hr className="border-slate-200" />

            {/* Section 10: Data Deletion Requests (KEY FOR META) */}
            <section id="data-deletion" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
                  10
                </span>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-slate-900">
                    10. Personal Data Deletion Requests
                  </h2>
                  <span className="rounded-md bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-800 flex items-center gap-1">
                    <Trash2 size={12} /> Data Erasure
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                <p className="text-sm text-slate-700 leading-relaxed">
                  In compliance with Meta Platform Policies and international privacy regulations, individuals whose data was captured via Meta Lead Ads or entered into Tron CRM have full rights to request the deletion of their personal records.
                </p>

                <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                    How to Submit a Data Deletion Request:
                  </h4>
                  <ol className="list-decimal pl-5 text-xs sm:text-sm text-slate-700 space-y-2">
                    <li>
                      <strong>Directly to the Enterprise Subscriber (Recommended):</strong> If your lead was submitted to a specific business or Facebook Page using Tron CRM, please contact that business directly. As the Data Controller, they can instantly delete your record from their pipeline.
                    </li>
                    <li>
                      <strong>Directly to Tron Technologies:</strong> Send an email to our Data Protection team at{" "}
                      <a
                        href="mailto:trontechnologies.access@gmail.com"
                        className="font-mono font-semibold text-blue-700 hover:underline bg-white px-2 py-0.5 rounded border border-blue-200"
                      >
                        trontechnologies.access@gmail.com
                      </a>{" "}
                      with the subject line <em>&quot;Personal Data Deletion Request - Meta Lead Ads&quot;</em>. Include your full name, email address, phone number, and the Facebook Page name you engaged with.
                    </li>
                    <li>
                      <strong>Through Facebook Business Integrations:</strong> You can revoke Tron CRM&apos;s permission to access your information at any time via your Facebook Settings &gt; Apps and Websites.
                    </li>
                  </ol>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-slate-600">
                  <h4 className="font-bold text-slate-900">Processing Timeline & Verification:</h4>
                  <p>
                    Upon receiving your request, we verify identity to protect against fraudulent erasure. We coordinate with the respective subscriber to erase your contact details, lead history, and notes from active databases within <strong>30 calendar days</strong>, providing confirmation upon completion.
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    to="/data-deletion"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold border border-blue-200 transition"
                  >
                    <Trash2 size={14} className="text-blue-600" />
                    <span>View Dedicated Meta Data Deletion Instructions</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </section>

            <hr className="border-slate-200" />

            {/* Section 11 */}
            <section id="cookies" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
                  11
                </span>
                <h2 className="text-2xl font-bold text-slate-900">
                  11. Cookies & Storage Technologies
                </h2>
              </div>
              <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                <p>
                  Tron CRM uses browser storage (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded">localStorage</code>) and essential session cookies strictly required for platform operation:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                  <li>
                    <strong>Authentication Tokens:</strong> Securely holding JWT session access tokens (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded">access_token</code>, <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">refresh_token</code>) to keep authorized users authenticated while navigating the platform.
                  </li>
                  <li>
                    <strong>Interface Preferences:</strong> Preserving workspace preferences such as sidebar collapse state and notification sound preferences.
                  </li>
                </ul>
                <p className="text-xs text-slate-500">
                  We do not use third-party cross-site advertising cookies or sell user browsing history.
                </p>
              </div>
            </section>

            <hr className="border-slate-200" />

            {/* Section 12 */}
            <section id="third-party-services" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
                  12
                </span>
                <h2 className="text-2xl font-bold text-slate-900">
                  12. Third-Party Services
                </h2>
              </div>
              <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                <p>
                  Our services interface with select third-party enterprise providers to fulfill business functionalities:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="rounded-xl border border-slate-200 bg-white p-3.5">
                    <span className="font-bold text-slate-900 block mb-1">Meta Platforms (Facebook & Instagram)</span>
                    <span className="text-slate-500">For optional Lead Ads ingestion and Facebook Page integration.</span>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3.5">
                    <span className="font-bold text-slate-900 block mb-1">Netlify & Render</span>
                    <span className="text-slate-500">For secure cloud deployment, static asset distribution, and API compute.</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  Each third-party service operates under its respective privacy terms. We encourage users to review Meta&apos;s Privacy Policy at{" "}
                  <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    facebook.com/privacy/policy
                  </a>.
                </p>
              </div>
            </section>

            <hr className="border-slate-200" />

            {/* Section 13 */}
            <section id="childrens-privacy" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
                  13
                </span>
                <h2 className="text-2xl font-bold text-slate-900">
                  13. Children&apos;s Privacy
                </h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Tron CRM is exclusively an enterprise business-to-business (B2B) application designed for corporate organizations and commercial professionals. It is not intended for use by children or minors under 18 years of age. We do not knowingly collect or solicit personal data from children. If we learn that we have inadvertently collected information from a minor, we will promptly purge the data from our systems.
              </p>
            </section>

            <hr className="border-slate-200" />

            {/* Section 14 */}
            <section id="policy-changes" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
                  14
                </span>
                <h2 className="text-2xl font-bold text-slate-900">
                  14. Changes to This Privacy Policy
                </h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                We may revise this Privacy Policy periodically to reflect enhancements in Tron CRM functionality, changes in legal requirements, or adjustments to our Meta integration workflows. When material changes occur, we will update the &quot;Effective Date&quot; at the top of this page and notify registered account administrators via in-app banner or email. Your continued use of Tron CRM after updates constitutes acknowledgment of the revised policy.
              </p>
            </section>

            <hr className="border-slate-200" />

            {/* Section 15 */}
            <section id="contact-information" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
                  15
                </span>
                <h2 className="text-2xl font-bold text-slate-900">
                  15. Contact Information & Data Protection Office
                </h2>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 text-sm text-slate-600">
                <p>
                  For inquiries, concerns, requests to exercise your statutory privacy rights, or questions regarding our Meta Lead Ads integration, please contact:
                </p>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-2.5 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Building2 size={16} className="text-blue-600" />
                    <span>Tron Technologies (Tron CRM)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="font-semibold text-slate-700 block">Privacy & Compliance Office:</span>
                      <a
                        href="mailto:trontechnologies.access@gmail.com"
                        className="font-mono text-blue-600 hover:underline font-semibold"
                      >
                        trontechnologies.access@gmail.com
                      </a>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700 block">General Support:</span>
                      <a
                        href="mailto:trontechnologies.access@gmail.com"
                        className="font-mono text-blue-600 hover:underline font-semibold"
                      >
                        trontechnologies.access@gmail.com
                      </a>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700 block">Registered Legal Address:</span>
                      <span className="text-slate-600">
                        [To be supplied by Tron Technologies: Corporate Headquarters Address]
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700 block">Data Protection Representative:</span>
                      <span className="text-slate-600">
                        [To be supplied: Designated DPO / EU Representative]
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleReturnToCRM}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition cursor-pointer"
                  >
                    <ArrowLeft size={16} />
                    <span>{isAuthenticated ? "Return to CRM Workspace" : "Return to Tron CRM Login"}</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      )}

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
              <Link to="/privacy-policy" className="hover:text-blue-600 font-semibold text-blue-600">
                Privacy Policy
              </Link>
              <Link to="/data-deletion" className="hover:text-blue-600 transition">
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
