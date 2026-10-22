import { useEffect, useState } from "react";
import {
  RefreshCw,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Radio,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Layers,
  Info,
} from "lucide-react";
import { FaFacebook, FaMeta } from "react-icons/fa6";
import { getMetaConnectUrl, getMetaStatus, disconnectMeta } from "../../../api/Meta";

/**
 * Normalizes Meta status responses handling both camelCase and snake_case backend payloads.
 */
const normalizeMetaStatus = (data = {}) => {
  const isConnected = Boolean(data.connected);
  const rawPages = Array.isArray(data.pages) ? data.pages : [];

  const pages = rawPages.map((p, idx) => ({
    id: p.id ?? p.page_id ?? p.pageId ?? idx,
    pageId: String(p.pageId ?? p.page_id ?? ""),
    pageName: p.pageName ?? p.page_name ?? "",
    isActive: Boolean(p.isActive ?? p.is_active ?? true),
  }));

  const primaryPageId = data.pageId ?? data.page_id ?? (pages[0]?.pageId || "");
  const primaryPageName = data.pageName ?? data.page_name ?? (pages[0]?.pageName || "");

  // Check explicit backend boolean flags, fallback to presence of pages or primary page ID
  const explicitHasConnectedPage =
    data.hasConnectedPage !== undefined
      ? data.hasConnectedPage
      : data.has_connected_page;

  const hasConnectedPage =
    explicitHasConnectedPage !== undefined
      ? Boolean(explicitHasConnectedPage)
      : Boolean(primaryPageId || pages.length > 0);

  const adAccountId = data.adAccountId ?? data.ad_account_id ?? "";
  const metaUserId = data.metaUserId ?? data.meta_user_id ?? "";
  const hasPageAccessToken = Boolean(
    data.hasPageAccessToken ?? data.has_page_access_token
  );
  const hasAccessToken = Boolean(data.hasAccessToken ?? data.has_access_token);
  const lastSynced =
    data.lastSyncedAt ??
    data.last_synced_at ??
    data.updatedAt ??
    data.updated_at ??
    data.createdAt ??
    data.created_at ??
    null;

  return {
    connected: isConnected,
    hasConnectedPage,
    pageId: primaryPageId,
    pageName: primaryPageName,
    pages,
    adAccountId,
    metaUserId,
    hasPageAccessToken,
    hasAccessToken,
    lastSynced,
  };
};

export default function MetaComponent() {
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Initialize notifications from OAuth callback query params without triggering cascading effect renders
  const [successBanner, setSuccessBanner] = useState(() => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    return params.get("meta") === "connected"
      ? "Meta account connected successfully! Retrieving page details..."
      : null;
  });

  const [errorMessage, setErrorMessage] = useState(() => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    const metaParam = params.get("meta");
    const reasonParam = params.get("reason");

    if (metaParam === "error") {
      const errorDescriptions = {
        pages_failed:
          "Failed to retrieve Facebook Pages from Meta Graph API. Please ensure your Facebook user has Admin or Editor access to the Facebook Page and granted permissions.",
        no_code:
          "Meta authorization was cancelled or no authorization code was returned.",
        no_state:
          "OAuth security state validation failed. Please try connecting again.",
        bad_state:
          "OAuth session state expired or was invalid. Please try connecting again.",
        company_not_found:
          "CRM company tenant could not be identified for this integration.",
        unhandled_exception:
          "An unexpected error occurred during Meta authentication. Please try again.",
      };
      return (
        errorDescriptions[reasonParam] ||
        `Meta connection failed (${reasonParam || "unknown error"}). Please reconnect.`
      );
    }
    return null;
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    setErrorMessage(null);
    try {
      const res = await getMetaStatus();
      const rawData = res?.data ?? res ?? {};
      setStatusData(normalizeMetaStatus(rawData));
    } catch (err) {
      console.error("Failed to refresh Meta integration status:", err);
      const apiMsg =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.message ||
        "Failed to refresh Meta integration status. Please check your connection or retry.";
      setErrorMessage(apiMsg);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    let isSubscribed = true;

    // Clean URL query parameters once mounted
    const params = new URLSearchParams(window.location.search);
    if (params.get("meta")) {
      params.delete("meta");
      params.delete("reason");
      const cleanUrl =
        window.location.pathname +
        (params.toString() ? `?${params.toString()}` : "");
      window.history.replaceState({}, "", cleanUrl);
    }

    getMetaStatus()
      .then((res) => {
        if (!isSubscribed) return;
        const rawData = res?.data ?? res ?? {};
        setStatusData(normalizeMetaStatus(rawData));
      })
      .catch((err) => {
        if (!isSubscribed) return;
        console.error("Failed to fetch Meta integration status:", err);
        const apiMsg =
          err.response?.data?.message ||
          err.response?.data?.detail ||
          err.message ||
          "Failed to load Meta integration status. Please check your connection or retry.";
        setErrorMessage(apiMsg);
      })
      .finally(() => {
        if (!isSubscribed) return;
        setLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, []);

  const handleConnect = async () => {
    try {
      setActionLoading(true);
      setErrorMessage(null);
      const response = await getMetaConnectUrl();
      const authUrl = response?.data?.auth_url || response?.auth_url;
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        throw new Error("No authorization URL returned by backend.");
      }
    } catch (error) {
      console.error("Failed to initiate Meta connection:", error);
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Failed to initiate Meta connection. Please try again."
      );
      setActionLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (
      !window.confirm(
        "Disconnect your Meta account? Lead syncing will stop and all connected Facebook Pages will be unlinked."
      )
    ) {
      return;
    }

    try {
      setActionLoading(true);
      setErrorMessage(null);
      await disconnectMeta();

      // Immediately clear state so no stale Page names or IDs remain visible
      setStatusData({
        connected: false,
        hasConnectedPage: false,
        pageId: null,
        pageName: null,
        pages: [],
        adAccountId: null,
        metaUserId: null,
        hasPageAccessToken: false,
        hasAccessToken: false,
        lastSynced: null,
      });
      setSuccessBanner("Meta integration disconnected successfully.");

      // Refresh to confirm with backend
      await handleRefresh();
    } catch (error) {
      console.error("Failed to disconnect Meta:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to disconnect Meta. Please try again."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const copyToClipboard = (text, id) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Determine effective pages array for display
  const effectivePages =
    statusData?.pages && statusData.pages.length > 0
      ? statusData.pages
      : statusData?.pageId
      ? [
          {
            id: statusData.pageId,
            pageId: statusData.pageId,
            pageName: statusData.pageName || "Connected Facebook Page",
            isActive: true,
          },
        ]
      : [];

  const isConnected = Boolean(statusData?.connected);
  const hasPage = Boolean(
    statusData?.hasConnectedPage && (effectivePages.length > 0 || statusData?.pageName || statusData?.pageId)
  );

  return (
    <div className="rounded-2xl bg-white px-6 md:px-12 lg:px-16 py-8 md:py-10 shadow-lg mb-6 border border-gray-100 transition-all">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
            <FaFacebook size={30} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Meta Ads Integration
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <FaMeta className="inline" size={11} /> Lead Ads
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              Connect Facebook & Instagram ad accounts to automatically capture and sync leads in real time.
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="self-start sm:self-center">
          {loading ? (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              <RefreshCw size={12} className="animate-spin text-gray-500" />
              Checking Status...
            </span>
          ) : isConnected && hasPage ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Connected
            </span>
          ) : isConnected && !hasPage ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              <AlertTriangle size={13} className="text-amber-600" />
              No Page Connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
              <span className="h-2 w-2 rounded-full bg-gray-400" />
              Not Connected
            </span>
          )}
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="mt-5 flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800 animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button
            onClick={() => setSuccessBanner(null)}
            className="text-emerald-600 hover:text-emerald-800 font-medium text-xs ml-4 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Error Banner (State E) */}
      {errorMessage && (
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-800">
          <div className="flex items-start sm:items-center gap-3">
            <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5 sm:mt-0" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition cursor-pointer"
            >
              <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
              Retry
            </button>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-gray-400 hover:text-gray-600 text-xs px-2 py-1 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="mt-6">
        {/* State D: Initial Loading Indicator */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
              <FaMeta className="absolute inset-0 m-auto text-blue-600" size={16} />
            </div>
            <p className="mt-4 text-sm font-medium text-gray-700">
              Retrieving Meta integration details...
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Checking connected Facebook account and page authorizations.
            </p>
          </div>
        ) : !isConnected ? (
          /* State A: Meta is not connected */
          <div className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
                <div className="flex items-center gap-2 text-blue-600 mb-1.5 font-semibold text-sm">
                  <Radio size={16} /> Real-time Lead Sync
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Automatically pull customer submissions from Facebook & Instagram lead forms directly into your CRM pipeline.
                </p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
                <div className="flex items-center gap-2 text-indigo-600 mb-1.5 font-semibold text-sm">
                  <Layers size={16} /> Multi-Page Support
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Connect multiple brand pages simultaneously and route leads seamlessly without missing enquiries.
                </p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
                <div className="flex items-center gap-2 text-emerald-600 mb-1.5 font-semibold text-sm">
                  <ShieldCheck size={16} /> Enterprise Isolation
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Strict tenant-level token security ensures your lead data and ad accounts remain private and fully protected.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
              <div>
                <h3 className="text-base font-semibold text-gray-800">
                  Ready to link your Meta account?
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Click below to authorize your Facebook Business account and select your connected Pages.
                </p>
              </div>
              <button
                onClick={handleConnect}
                disabled={actionLoading}
                className="inline-flex items-center justify-center gap-2.5 rounded-xl px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/25 transition disabled:opacity-50 cursor-pointer"
              >
                <FaFacebook size={18} />
                {actionLoading ? "Redirecting to Facebook..." : "Connect Meta"}
              </button>
            </div>
          </div>
        ) : isConnected && !hasPage ? (
          /* State C: Meta is connected, but no Facebook Page is available */
          <div className="py-2 space-y-5">
            <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-5">
              <div className="flex items-start gap-3.5">
                <AlertTriangle size={22} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-amber-900">
                    No Facebook Page Available
                  </h3>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Your Facebook account is connected, but no Facebook Page is available. Please reconnect Meta and grant the required Page permissions, or check whether your account has access to a Facebook Page.
                  </p>
                  <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside pt-1">
                    <li>Confirm that your personal Facebook account has Admin or Editor role on the Facebook Page.</li>
                    <li>Ensure you check "Select All" or check the box for your Page during the Facebook authorization prompt.</li>
                    <li>Check that the Page has not been deleted or unpublished on Facebook.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Account Details if provided */}
            {(statusData.metaUserId || statusData.adAccountId) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-gray-50 rounded-xl p-4 border border-gray-100">
                {statusData.metaUserId && (
                  <div>
                    <span className="text-gray-400 block font-medium">Meta User ID:</span>
                    <span className="font-mono text-gray-700 font-semibold">{statusData.metaUserId}</span>
                  </div>
                )}
                {statusData.adAccountId && (
                  <div>
                    <span className="text-gray-400 block font-medium">Ad Account ID:</span>
                    <span className="font-mono text-gray-700 font-semibold">{statusData.adAccountId}</span>
                  </div>
                )}
              </div>
            )}

            {/* Action Bar for State C */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleConnect}
                  disabled={actionLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  <FaFacebook size={16} />
                  {actionLoading ? "Redirecting..." : "Reconnect Meta"}
                </button>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing || actionLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
                  {refreshing ? "Checking..." : "Refresh Status"}
                </button>
              </div>

              <button
                onClick={handleDisconnect}
                disabled={actionLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-600 border border-red-200 bg-red-50/50 hover:bg-red-100 transition disabled:opacity-50 cursor-pointer"
              >
                <Trash2 size={15} />
                {actionLoading ? "Disconnecting..." : "Disconnect Meta"}
              </button>
            </div>
          </div>
        ) : (
          /* State B: Meta is connected and Facebook Page is available */
          <div className="space-y-6">
            {/* Integration Metadata Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                <span className="text-xs text-gray-500 font-medium block">Connection Status</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="text-sm font-bold text-gray-800">Connected & Active</span>
                </div>
              </div>

              {statusData.metaUserId && (
                <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                  <span className="text-xs text-gray-500 font-medium block">Meta User ID</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-mono font-semibold text-gray-800 truncate" title={statusData.metaUserId}>
                      {statusData.metaUserId}
                    </span>
                    <button
                      onClick={() => copyToClipboard(statusData.metaUserId, "metaUser")}
                      className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                      title="Copy Meta User ID"
                    >
                      {copiedId === "metaUser" ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              )}

              {statusData.adAccountId && (
                <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                  <span className="text-xs text-gray-500 font-medium block">Ad Account ID</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-mono font-semibold text-gray-800 truncate" title={statusData.adAccountId}>
                      {statusData.adAccountId}
                    </span>
                    <button
                      onClick={() => copyToClipboard(statusData.adAccountId, "adAccount")}
                      className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                      title="Copy Ad Account ID"
                    >
                      {copiedId === "adAccount" ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                <span className="text-xs text-gray-500 font-medium block">Lead Syncing</span>
                <div className="flex items-center gap-2 mt-1">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-700">Webhook Ready</span>
                </div>
              </div>
            </div>

            {/* Dedicated Connected Facebook Page Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-gray-800">
                    {effectivePages.length > 1
                      ? `Connected Facebook Pages (${effectivePages.length})`
                      : "Connected Facebook Page"}
                  </h3>
                  <span className="text-xs text-gray-400">
                    {effectivePages.length > 1
                      ? "Leads submitted to any of these pages will sync into the CRM"
                      : "Live synchronized lead source"}
                  </span>
                </div>
              </div>

              {/* Pages Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {effectivePages.map((page, index) => {
                  const isPrimary =
                    page.pageId === statusData.pageId ||
                    (!statusData.pageId && index === 0);
                  const isCopied = copiedId === `page-${page.pageId || index}`;

                  return (
                    <div
                      key={page.id || page.pageId || index}
                      className="relative rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/30 to-indigo-50/20 p-5 shadow-xs hover:border-blue-300 transition"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/30">
                            <FaFacebook size={22} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-base font-bold text-gray-900 leading-snug">
                                {page.pageName || "Facebook Page"}
                              </h4>
                              {isPrimary && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 border border-blue-200">
                                  Primary
                                </span>
                              )}
                            </div>
                            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium mt-0.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Connected
                            </span>
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100/70 text-emerald-800">
                          <CheckCircle2 size={13} className="text-emerald-600" />
                          Active
                        </span>
                      </div>

                      {/* Page Metadata Details */}
                      <div className="mt-4 pt-3 border-t border-blue-100/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-gray-400 block font-medium">Page Name:</span>
                          <span className="font-semibold text-gray-800 text-sm">
                            {page.pageName || statusData.pageName || "Facebook Page"}
                          </span>
                        </div>

                        <div>
                          <span className="text-gray-400 block font-medium">Page ID:</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono font-semibold text-gray-800 text-xs bg-white/80 px-2 py-0.5 rounded border border-gray-200">
                              {page.pageId || statusData.pageId}
                            </span>
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  page.pageId || statusData.pageId,
                                  `page-${page.pageId || index}`
                                )
                              }
                              className="text-gray-400 hover:text-blue-600 p-1 transition cursor-pointer"
                              title="Copy Page ID"
                            >
                              {isCopied ? (
                                <Check size={13} className="text-emerald-600" />
                              ) : (
                                <Copy size={13} />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Synchronization Info Notice */}
            <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-4 flex items-start gap-3 text-xs text-blue-900">
              <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-semibold">Automatic Lead Ingestion: </span>
                When prospective customers fill out an Instant Form on any linked Facebook Page, their contact information, form questions, and ad campaign identifiers are received and processed into your CRM leads pipeline.
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing || actionLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 shadow-xs transition disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw size={14} className={refreshing ? "animate-spin text-blue-600" : "text-gray-500"} />
                  {refreshing ? "Refreshing..." : "Refresh Status"}
                </button>

                <button
                  onClick={handleConnect}
                  disabled={actionLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium border border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-blue-700 transition disabled:opacity-50 cursor-pointer"
                  title="Reconnect to grant additional permissions or refresh expired tokens"
                >
                  <ExternalLink size={14} />
                  Reconnect / Switch Account
                </button>
              </div>

              <button
                onClick={handleDisconnect}
                disabled={actionLoading || refreshing}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 transition shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <Trash2 size={15} />
                {actionLoading ? "Disconnecting..." : "Disconnect Meta"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}