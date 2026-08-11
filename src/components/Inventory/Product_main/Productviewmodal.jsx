import { useEffect, useState } from "react";
import { X, Package, Pencil } from "lucide-react";
import { getProduct } from "../../../api/products";

function Badge({ children, dot, dotColor }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-[#E5E7EB] text-[#374151]">
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: dotColor }}
        />
      )}
      {children}
    </span>
  );
}

function DetailField({ label, value }) {
  return (
    <div>
      <div className="text-[11px] font-semibold tracking-wide text-[#9CA3AF] uppercase mb-1">
        {label}
      </div>
      <div className="text-sm font-semibold text-[#111827]">
        {value || "-"}
      </div>
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default function ProductViewModal({ productId, onClose, onEdit }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getProduct(productId);
        setProduct(data);
      } catch (err) {
        console.error("FETCH PRODUCT (view) ERROR:", err);
        setError("Could not load this product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!productId) return null;

  const isActive = product?.status === "active";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border border-[#E5E7EB] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-lg font-semibold text-[#111827]">
              Product Details
            </h2>
            <p className="text-sm text-[#6B7280] mt-1">
              Full details for this product
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B7280] hover:bg-gray-100"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {loading && <div className="text-[#6B7280] text-sm">Loading...</div>}

          {error && (
            <div className="px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          {!loading && !error && product && (
            <>
              {/* Highlight card */}
              <div className="flex items-center gap-4 p-4 rounded-xl border border-blue-100 bg-blue-50/50">
                <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Package size={20} className="text-white" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-[#111827] text-base truncate">
                    {product.name}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge dot dotColor={isActive ? "#22C55E" : "#9CA3AF"}>
                      {isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge>{product.productCode}</Badge>
                    <Badge className="capitalize">{product.productType}</Badge>
                  </div>
                </div>
              </div>

              {/* Product details grid */}
              <div className="mt-5 p-4 rounded-xl bg-[#F9FAFB]">
                <div className="text-[11px] font-semibold tracking-wide text-[#9CA3AF] uppercase mb-3">
                  Product Details
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <DetailField label="SKU" value={product.sku} />
                  <DetailField
                    label="Unit Price"
                    value={
                      typeof product.unitPrice === "number"
                        ? product.unitPrice.toFixed(2)
                        : product.unitPrice
                    }
                  />
                  <DetailField
                    label="Cost Price"
                    value={
                      typeof product.costPrice === "number"
                        ? product.costPrice.toFixed(2)
                        : product.costPrice
                    }
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <DetailField
                    label="Qty in Stock"
                    value={product.quantityInStock}
                  />
                  <DetailField
                    label="Reorder Level"
                    value={product.reorderLevel}
                  />
                  <DetailField label="Unit" value={product.unit} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <DetailField label="Vendor" value={product.vendor} />
                  <DetailField label="Manufacturer" value={product.manufacturer} />
                  <DetailField label="Category" value={product.category} />
                </div>
              </div>

              {/* Description */}
              <div className="mt-5 p-4 rounded-xl bg-[#F9FAFB]">
                <div className="text-[11px] font-semibold tracking-wide text-[#9CA3AF] uppercase mb-2">
                  Description
                </div>
                <div className="text-sm text-[#111827]">
                  {product.description || "No description added."}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!loading && !error && product && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E7EB]">
            <span className="text-xs text-[#6B7280]">
              Updated {formatDate(product.updatedAt)}
            </span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 h-11 rounded-xl border border-[#E5E7EB] text-[#111827] hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => onEdit(product.id)}
                className="px-4 h-11 rounded-xl bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
              >
                <Pencil size={16} />
                Edit Product
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}