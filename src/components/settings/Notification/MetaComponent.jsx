import React, { useEffect, useState } from "react";
import { Link2 } from "lucide-react";
import { getMetaConnectUrl, getMetaStatus, disconnectMeta } from "../../../api/Meta";

export default function MetaComponent() {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false); // covers both connect + disconnect clicks

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("meta") === "connected") {
      setIsConnected(true);
      params.delete("meta");
      const cleanUrl =
        window.location.pathname +
        (params.toString() ? `?${params.toString()}` : "");
      window.history.replaceState({}, "", cleanUrl);
    }

    getMetaStatus()
      .then((res) => setIsConnected(res.data.connected))
      .catch((err) => console.error("Failed to fetch Meta status:", err))
      .finally(() => setLoading(false));
  }, []);

  const connectMeta = async () => {
    try {
      setActionLoading(true);
      const response = await getMetaConnectUrl();
      window.location.href = response.data.auth_url;
    } catch (error) {
      console.error("Failed to connect Meta:", error);
      setActionLoading(false);
    }
  };

  const disconnect = async () => {
    if (!window.confirm("Disconnect your Meta account? Lead syncing will stop.")) {
      return;
    }
    try {
      setActionLoading(true);
      await disconnectMeta();
      setIsConnected(false);
    } catch (error) {
      console.error("Failed to disconnect Meta:", error);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white px-20 py-10 shadow-lg mb-5">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
          <Link2 size={22} className="text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Meta Integration
          </h2>
          <h2 className="text-sm text-gray-500">
            Connect your Facebook & Instagram ad accounts to sync leads
            automatically.
          </h2>
        </div>
      </div>

      {/* Connect/Disconnect row */}
      <div className="flex items-center justify-between py-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Facebook / Instagram Ads
          </h3>
          <p className="text-sm text-gray-500">
            {isConnected
              ? "Your Meta account is connected. Leads from your ad accounts will sync here."
              : "Link your Meta Business account to start pulling in leads."}
          </p>
        </div>

        {isConnected ? (
          <button
            onClick={disconnect}
            disabled={loading || actionLoading}
            className="rounded-lg px-5 py-2 text-sm font-semibold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 transition disabled:opacity-50"
          >
            {actionLoading ? "Disconnecting..." : "Disconnect"}
          </button>
        ) : (
          <button
            onClick={connectMeta}
            disabled={loading || actionLoading}
            className="rounded-lg px-5 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Checking..." : actionLoading ? "Redirecting..." : "Connect Meta"}
          </button>
        )}
      </div>
    </div>
  );
}