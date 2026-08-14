import React, { useEffect, useState } from "react";
import { Link2 } from "lucide-react";
import { getMetaConnectUrl, getMetaStatus } from "../../api/Meta";

const MetaIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Right after the OAuth round-trip, the backend redirects here with
    // ?meta=connected — show that instantly instead of waiting on the
    // status fetch below, and clean the param out of the URL.
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

  const connectMeta = () => {
    window.location.href = getMetaConnectUrl();
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

      {/* Connect row */}
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

        <button
          onClick={connectMeta}
          disabled={loading || isConnected}
          className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
            isConnected
              ? "cursor-not-allowed bg-green-100 text-green-700"
              : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          }`}
        >
          {loading ? "Checking..." : isConnected ? "Connected" : "Connect Meta"}
        </button>
      </div>
    </div>
  );
};

export default MetaIntegration;