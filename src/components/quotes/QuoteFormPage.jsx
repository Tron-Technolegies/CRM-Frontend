// import { useEffect, useMemo, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Search, Plus, Trash2 } from "lucide-react";
// import useQuotes from "../../hooks/useQuotes";
// import useDeals from "../../hooks/useDeal";
// import useProducts from "../../hooks/useProducts";
// import useAccount from "../../hooks/useAccount";
// import {
//   blankQuoteForm,
//   fromApiResponse,
//   toApiPayload,
//   emptyLineItem,
//   lineTotal,
// } from "../../utils/quoteMapping";

// const formatCurrency = (value) =>
//   new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value || 0);

// const QuoteFormPage = () => {
//   const navigate = useNavigate();
//   const { id } = useParams(); // present only on /quotes/edit/:id

//   const { loadQuote, saveQuote, loading: saving } = useQuotes();
//   const { deals, fetchDeals } = useDeals();
//   const { products, fetchProducts } = useProducts();
//   const { accounts, staff } = useAccount();

//   const [form, setForm] = useState(blankQuoteForm());
//   const [errors, setErrors] = useState({});
//   const [initializing, setInitializing] = useState(!!id);

//   useEffect(() => {
//     fetchDeals?.();
//     fetchProducts?.();
//   }, []);

//   useEffect(() => {
//     if (!id) {
//       setForm(blankQuoteForm());
//       return;
//     }
//     (async () => {
//       setInitializing(true);
//       const data = await loadQuote(id);
//       if (data) setForm(fromApiResponse(data));
//       setInitializing(false);
//     })();
//   }, [id]);

//   const selectedAccount = useMemo(
//     () => (accounts || []).find((a) => String(a.id) === String(form.accountId)),
//     [accounts, form.accountId]
//   );

//   const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
//   const setAddressField = (group, key, value) =>
//     setForm((prev) => ({ ...prev, [group]: { ...prev[group], [key]: value } }));

//   const handleLineChange = (key, field, value) => {
//     setForm((prev) => ({
//       ...prev,
//       products: prev.products.map((line) => {
//         if (line.key !== key) return line;
//         const updated = { ...line, [field]: value };
//         if (field === "productId") {
//           const product = (products || []).find((p) => String(p.id) === String(value));
//           if (product) {
//             updated.productName = product.name;
//             updated.description = product.description || "";
//             updated.listPrice = product.unit_price ?? product.unitPrice ?? 0;
//             updated.tax = product.tax_percentage ?? product.taxPercentage ?? 0;
//           }
//         }
//         return updated;
//       }),
//     }));
//   };

//   const addLine = () => setForm((prev) => ({ ...prev, products: [...prev.products, emptyLineItem()] }));
//   const removeLine = (key) =>
//     setForm((prev) => ({ ...prev, products: prev.products.filter((l) => l.key !== key) }));

//   useEffect(() => {
//     if (form.copyBilling) {
//       setForm((prev) => ({ ...prev, shippingAddress: { ...prev.billingAddress } }));
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [form.copyBilling, form.billingAddress]);

//   const subtotal = form.products.reduce((sum, l) => sum + Number(l.quantity || 0) * Number(l.listPrice || 0), 0);
//   const totalDiscount = form.products.reduce((sum, l) => sum + Number(l.discount || 0), 0);
//   const totalTax = form.products.reduce((sum, l) => {
//     const discounted = Number(l.quantity || 0) * Number(l.listPrice || 0) - Number(l.discount || 0);
//     return sum + discounted * (Number(l.tax || 0) / 100);
//   }, 0);
//   const grandTotal = subtotal - totalDiscount + totalTax;

//   const validate = () => {
//     const next = {};
//     if (!form.subject.trim()) next.subject = "Subject is required";
//     setErrors(next);
//     return Object.keys(next).length === 0;
//   };

//   const handleSave = async (andNew = false) => {
//     if (!validate()) return;
//     try {
//       await saveQuote(toApiPayload(form), id);
//       if (andNew) {
//         setForm(blankQuoteForm());
//         navigate("/quotes/add");
//       } else {
//         navigate("/quotes");
//       }
//     } catch (err) {
//       console.error("SAVE QUOTE ERROR:", err);
//     }
//   };

//   if (initializing) {
//     return <div className="p-6 text-sm text-[#6B7280]">Loading quote...</div>;
//   }

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-semibold text-[#111827]">Quotes</h1>
//         <div className="flex gap-2">
//           <button
//             onClick={() => navigate("/quotes")}
//             className="h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#111827] hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={() => handleSave(true)}
//             disabled={saving}
//             className="h-11 px-4 rounded-xl border border-blue-600 text-sm font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-60"
//           >
//             Save and New
//           </button>
//           <button
//             onClick={() => handleSave(false)}
//             disabled={saving}
//             className="h-11 px-4 rounded-xl bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
//           >
//             {id ? "Update Quote" : "Save Quote"}
//           </button>
//         </div>
//       </div>

//       {/* Quote Information */}
//       <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 mb-5">
//         <h2 className="text-sm font-semibold text-blue-600 mb-4">Quote Information</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="text-xs font-medium text-[#6B7280]">SUBJECT *</label>
//             <input
//               value={form.subject}
//               onChange={(e) => setField("subject", e.target.value)}
//               placeholder="e.g. Website Overhaul Q1"
//               className="w-full h-11 mt-1 px-3 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:ring-4 focus:ring-blue-100"
//             />
//             {errors.subject && <p className="text-xs text-red-600 mt-1">{errors.subject}</p>}
//           </div>
//           <div>
//             <label className="text-xs font-medium text-[#6B7280]">QUOTE STAGE</label>
//             <select
//               value={form.quoteStage}
//               onChange={(e) => setField("quoteStage", e.target.value)}
//               className="w-full h-11 mt-1 px-3 rounded-xl border border-[#E5E7EB] text-sm bg-white outline-none focus:ring-4 focus:ring-blue-100"
//             >
//               <option value="draft">Draft</option>
//               <option value="negotiation">Negotiation</option>
//               <option value="delivered">Delivered</option>
//               <option value="on_hold">On Hold</option>
//               <option value="confirmed">Confirmed</option>
//               <option value="closed_won">Closed Won</option>
//               <option value="closed_lost">Closed Lost</option>
//             </select>
//           </div>

//           <div>
//             <label className="text-xs font-medium text-[#6B7280]">VALID UNTIL</label>
//             <input
//               type="date"
//               value={form.validUntil}
//               onChange={(e) => setField("validUntil", e.target.value)}
//               className="w-full h-11 mt-1 px-3 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:ring-4 focus:ring-blue-100"
//             />
//           </div>
//           <div>
//             <label className="text-xs font-medium text-[#6B7280]">DEAL NAME</label>
//             <div className="relative mt-1">
//               <select
//                 value={form.dealId}
//                 onChange={(e) => {
//                   const deal = (deals || []).find((d) => String(d.id) === String(e.target.value));
//                   setField("dealId", e.target.value);
//                   if (deal) {
//                     setField("contactName", deal.contactName || deal.contact_name || form.contactName);
//                     if (!form.accountId && (deal.accountId || deal.account_id)) {
//                       setField("accountId", String(deal.accountId || deal.account_id));
//                     }
//                   }
//                 }}
//                 className="w-full h-11 pl-10 pr-3 rounded-xl border border-[#E5E7EB] text-sm bg-white outline-none focus:ring-4 focus:ring-blue-100"
//               >
//                 <option value="">Lookup deals...</option>
//                 {(deals || []).map((d) => (
//                   <option key={d.id} value={d.id}>
//                     {d.deal_name || d.name}
//                   </option>
//                 ))}
//               </select>
//               <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//             </div>
//           </div>

//           <div>
//             <label className="text-xs font-medium text-[#6B7280]">CARRIER</label>
//             <input
//               value={form.carrier}
//               onChange={(e) => setField("carrier", e.target.value)}
//               placeholder="FedEx, UPS, etc."
//               className="w-full h-11 mt-1 px-3 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:ring-4 focus:ring-blue-100"
//             />
//           </div>
//           <div>
//             <label className="text-xs font-medium text-[#6B7280]">TEAM</label>
//             <select
//               value={form.team}
//               onChange={(e) => setField("team", e.target.value)}
//               className="w-full h-11 mt-1 px-3 rounded-xl border border-[#E5E7EB] text-sm bg-white outline-none focus:ring-4 focus:ring-blue-100"
//             >
//               <option value="">Sales North America</option>
//               <option value="website">Website</option>
//               <option value="referral">Referral</option>
//               <option value="social">Social Media</option>
//             </select>
//           </div>

//           <div>
//             <label className="text-xs font-medium text-[#6B7280]">QUOTE OWNER</label>
//             <select
//               value={form.assignedTo}
//               onChange={(e) => setField("assignedTo", e.target.value)}
//               className="w-full h-11 mt-1 px-3 rounded-xl border border-[#E5E7EB] text-sm bg-white outline-none focus:ring-4 focus:ring-blue-100"
//             >
//               <option value="">Name</option>
//               {(staff || []).map((member) => (
//                 <option key={member.id} value={member.id}>
//                   {member.full_name || member.fullName || member.name || `Staff #${member.id}`}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="text-xs font-medium text-[#6B7280]">CONTACT NAME</label>
//             <input
//               value={form.contactName}
//               onChange={(e) => setField("contactName", e.target.value)}
//               placeholder="Contact name"
//               className="w-full h-11 mt-1 px-3 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:ring-4 focus:ring-blue-100"
//             />
//           </div>

//           {/* <div>
//             <label className="text-xs font-medium text-[#6B7280]">ACCOUNT NAME</label>
//             <select
//               value={form.accountId}
//               onChange={(e) => {
//                 const account = (accounts || []).find((a) => String(a.id) === String(e.target.value));
//                 setField("accountId", e.target.value);
//                 if (account) {
//                   setField("billingAddress", {
//                     country: account.billingAddress?.country || account.billing_address?.country || "",
//                     address: account.billingAddress?.address || account.billing_address?.address || "",
//                     streetAdd: account.billingAddress?.street_address || account.billing_address?.street_address || "",
//                     city: account.billingAddress?.city || account.billing_address?.city || "",
//                     state: account.billingAddress?.state || account.billing_address?.state || "",
//                     zipCode: account.billingAddress?.zip_code || account.billing_address?.zip_code || "",
//                   });
//                   setField("shippingAddress", {
//                     country: account.shippingAddress?.country || account.shipping_address?.country || "",
//                     address: account.shippingAddress?.address || account.shipping_address?.address || "",
//                     streetAdd: account.shippingAddress?.street_address || account.shipping_address?.street_address || "",
//                     city: account.shippingAddress?.city || account.shipping_address?.city || "",
//                     state: account.shippingAddress?.state || account.shipping_address?.state || "",
//                     zipCode: account.shippingAddress?.zip_code || account.shipping_address?.zip_code || "",
//                   });
//                 }
//               }}
//               className="w-full h-11 mt-1 px-3 rounded-xl border border-[#E5E7EB] text-sm bg-white outline-none focus:ring-4 focus:ring-blue-100"
//             >
//               <option value="">Name</option>
//               {(accounts || []).map((a) => (
//                 <option key={a.id} value={a.id}>
//                   {a.account_name || a.accountName}
//                 </option>
//               ))}
//             </select>
//           </div> */}
//         </div>
//       </div>

//       {/* Addresses */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
//         <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
//           <h2 className="text-sm font-semibold text-blue-600 mb-4">Billing Address</h2>
//           <AddressFields value={form.billingAddress} onChange={(k, v) => setAddressField("billingAddress", k, v)} />
//         </div>
//         <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-sm font-semibold text-blue-600">Shipping Address</h2>
//             <label className="flex items-center gap-2 text-xs text-[#6B7280]">
//               Copy Billing
//               <button
//                 type="button"
//                 onClick={() => setField("copyBilling", !form.copyBilling)}
//                 className={`w-9 h-5 rounded-full transition ${form.copyBilling ? "bg-blue-600" : "bg-gray-300"}`}
//               >
//                 <span
//                   className={`block w-4 h-4 bg-white rounded-full shadow transform transition ${
//                     form.copyBilling ? "translate-x-4" : "translate-x-0.5"
//                   }`}
//                 />
//               </button>
//             </label>
//           </div>
//           <AddressFields
//             value={form.shippingAddress}
//             onChange={(k, v) => setAddressField("shippingAddress", k, v)}
//             disabled={form.copyBilling}
//           />
//         </div>
//       </div>

//       {/* Quoted Items */}
//       <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 mb-5">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-sm font-semibold text-blue-600">Quoted Items</h2>
//           <button onClick={addLine} className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
//             <Plus className="w-4 h-4" /> Add Line Item
//           </button>
//         </div>

//         <table className="w-full text-sm">
//           <thead>
//             <tr className="text-left text-xs font-medium text-[#6B7280] uppercase">
//               <th className="py-2 pr-2">#</th>
//               <th className="py-2 pr-2">Product Name</th>
//               <th className="py-2 pr-2">Quantity</th>
//               <th className="py-2 pr-2">List Price</th>
//               <th className="py-2 pr-2">Discount ($)</th>
//               <th className="py-2 pr-2">Tax (%)</th>
//               <th className="py-2 pr-2">Total</th>
//               <th className="py-2"></th>
//             </tr>
//           </thead>
//           <tbody>
//             {form.products.map((line, idx) => (
//               <tr key={line.key} className="border-t border-[#E5E7EB]">
//                 <td className="py-2 pr-2 text-[#6B7280]">{idx + 1}</td>
//                 <td className="py-2 pr-2">
//                   <select
//                     value={line.productId}
//                     onChange={(e) => handleLineChange(line.key, "productId", e.target.value)}
//                     className="w-full h-9 px-2 rounded-lg border border-[#E5E7EB] text-sm"
//                   >
//                     <option value="">Select product...</option>
//                     {(products || []).map((p) => (
//                       <option key={p.id} value={p.id}>
//                         {p.name}
//                       </option>
//                     ))}
//                   </select>
//                 </td>
//                 <td className="py-2 pr-2">
//                   <input
//                     type="number"
//                     min={1}
//                     value={line.quantity}
//                     onChange={(e) => handleLineChange(line.key, "quantity", Number(e.target.value))}
//                     className="w-20 h-9 px-2 rounded-lg border border-[#E5E7EB] text-sm"
//                   />
//                 </td>
//                 <td className="py-2 pr-2 text-[#111827]">{formatCurrency(line.listPrice)}</td>
//                 <td className="py-2 pr-2">
//                   <input
//                     type="number"
//                     min={0}
//                     value={line.discount}
//                     onChange={(e) => handleLineChange(line.key, "discount", Number(e.target.value))}
//                     className="w-24 h-9 px-2 rounded-lg border border-[#E5E7EB] text-sm"
//                   />
//                 </td>
//                 <td className="py-2 pr-2 text-[#111827]">{line.tax}%</td>
//                 <td className="py-2 pr-2 font-medium text-[#111827]">{formatCurrency(lineTotal(line))}</td>
//                 <td className="py-2">
//                   {form.products.length > 1 && (
//                     <button onClick={() => removeLine(line.key)} className="text-[#6B7280] hover:text-red-600">
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <div className="flex justify-end mt-4">
//           <div className="w-64 space-y-1 text-sm">
//             <div className="flex justify-between text-[#6B7280]">
//               <span>Subtotal</span>
//               <span className="text-[#111827] font-medium">{formatCurrency(subtotal)}</span>
//             </div>
//             <div className="flex justify-between text-[#6B7280]">
//               <span>Tax</span>
//               <span className="text-[#111827] font-medium">{formatCurrency(totalTax)}</span>
//             </div>
//             <div className="flex justify-between text-[#6B7280]">
//               <span>Discount</span>
//               <span className="text-red-500 font-medium">-{formatCurrency(totalDiscount)}</span>
//             </div>
//             <div className="flex justify-between pt-2 border-t border-[#E5E7EB] font-semibold text-[#111827]">
//               <span>Grand Total</span>
//               <span className="text-blue-600">{formatCurrency(grandTotal)}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Terms & Description */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//         <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
//           <h2 className="text-sm font-semibold text-blue-600 mb-3">Terms & Conditions</h2>
//           <textarea
//             value={form.termsConditions}
//             onChange={(e) => setField("termsConditions", e.target.value)}
//             rows={4}
//             placeholder="Legal notes, payment terms, or policy links..."
//             className="w-full p-3 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:ring-4 focus:ring-blue-100"
//           />
//         </div>
//         <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
//           <h2 className="text-sm font-semibold text-blue-600 mb-3">Description</h2>
//           <textarea
//             value={form.description}
//             onChange={(e) => setField("description", e.target.value)}
//             rows={4}
//             placeholder="Internal comments or detailed breakdown for this quote..."
//             className="w-full p-3 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:ring-4 focus:ring-blue-100"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// const AddressFields = ({ value, onChange, disabled }) => {
//   const set = (field, val) => onChange(field, val);
//   return (
//     <>
//       <textarea
//         value={value.streetAdd}
//         onChange={(e) => set("streetAdd", e.target.value)}
//         disabled={disabled}
//         placeholder="Street Address"
//         className="mt-2 w-full min-h-[80px] rounded-xl border border-[#E5E7EB] p-3 text-sm outline-none resize-none disabled:bg-gray-50"
//       />
//       <div className="grid grid-cols-2 gap-3 mt-3">
//         <input
//           placeholder="City"
//           value={value.city}
//           onChange={(e) => set("city", e.target.value)}
//           disabled={disabled}
//           className="h-11 px-3 rounded-xl border border-[#E5E7EB] text-sm outline-none disabled:bg-gray-50"
//         />
//         <input
//           placeholder="State"
//           value={value.state}
//           onChange={(e) => set("state", e.target.value)}
//           disabled={disabled}
//           className="h-11 px-3 rounded-xl border border-[#E5E7EB] text-sm outline-none disabled:bg-gray-50"
//         />
//       </div>
//       <div className="grid grid-cols-2 gap-3 mt-3">
//         <input
//           placeholder="Zip Code"
//           value={value.zipCode}
//           onChange={(e) => set("zipCode", e.target.value)}
//           disabled={disabled}
//           className="h-11 px-3 rounded-xl border border-[#E5E7EB] text-sm outline-none disabled:bg-gray-50"
//         />
//         <input
//           placeholder="Country"
//           value={value.country}
//           onChange={(e) => set("country", e.target.value)}
//           disabled={disabled}
//           className="h-11 px-3 rounded-xl border border-[#E5E7EB] text-sm outline-none disabled:bg-gray-50"
//         />
//       </div>
//     </>
//   );
// };

// export default QuoteFormPage;

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Search, Plus, Trash2 } from "lucide-react";
import useQuotes from "../../hooks/useQuotes";
import useDeals from "../../hooks/useDeal";
import useProducts from "../../hooks/useProducts";
import useAccount from "../../hooks/useAccount";
import {
  blankQuoteForm,
  fromApiResponse,
  toApiPayload,
  emptyLineItem,
  lineTotal,
} from "../../utils/quoteMapping";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value || 0);

const QuoteFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // present only on /quotes/edit/:id

  const { loadQuote, saveQuote, loading: saving } = useQuotes();
  const { deals, fetchDeals } = useDeals();
  const { products, fetchProducts } = useProducts();
  const { staff } = useAccount();

  const [form, setForm] = useState(blankQuoteForm());
  const [errors, setErrors] = useState({});
  const [initializing, setInitializing] = useState(!!id);

  useEffect(() => {
    fetchDeals?.();
    fetchProducts?.();
  }, []);

  useEffect(() => {
    if (!id) {
      setForm(blankQuoteForm());
      return;
    }
    (async () => {
      setInitializing(true);
      const data = await loadQuote(id);
      if (data) setForm(fromApiResponse(data));
      setInitializing(false);
    })();
  }, [id]);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const setAddressField = (group, key, value) =>
    setForm((prev) => ({ ...prev, [group]: { ...prev[group], [key]: value } }));

  const handleLineChange = (key, field, value) => {
    setForm((prev) => ({
      ...prev,
      products: prev.products.map((line) => {
        if (line.key !== key) return line;
        const updated = { ...line, [field]: value };
        if (field === "productId") {
          const product = (products || []).find((p) => String(p.id) === String(value));
          if (product) {
            updated.productName = product.name;
            updated.description = product.description || "";
            updated.listPrice = product.unit_price ?? product.unitPrice ?? 0;
            updated.tax = product.tax_percentage ?? product.taxPercentage ?? 0;
          }
        }
        return updated;
      }),
    }));
  };

  const addLine = () => setForm((prev) => ({ ...prev, products: [...prev.products, emptyLineItem()] }));
  const removeLine = (key) =>
    setForm((prev) => ({ ...prev, products: prev.products.filter((l) => l.key !== key) }));

  // Deal selection drives account + customer automatically — no manual pick needed
  const handleDealChange = (dealId) => {
    const deal = (deals || []).find((d) => String(d.id) === String(dealId));
    setField("dealId", dealId);

    if (deal) {
      setForm((prev) => ({
        ...prev,
        dealId,
        contactName: deal.contactName || deal.contact_name || prev.contactName,
        accountId: deal.accountId ?? deal.account_id ?? "",
        accountName: deal.accountName ?? deal.account_name ?? "",
        customerId: deal.customerId ?? deal.customer_id ?? "",
        customerName: deal.customerName ?? deal.customer_name ?? "",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        dealId: "",
        accountId: "",
        accountName: "",
        customerId: "",
        customerName: "",
      }));
    }
  };

  useEffect(() => {
    if (form.copyBilling) {
      setForm((prev) => ({ ...prev, shippingAddress: { ...prev.billingAddress } }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.copyBilling, form.billingAddress]);

  const subtotal = form.products.reduce((sum, l) => sum + Number(l.quantity || 0) * Number(l.listPrice || 0), 0);
  const totalDiscount = form.products.reduce((sum, l) => sum + Number(l.discount || 0), 0);
  const totalTax = form.products.reduce((sum, l) => {
    const discounted = Number(l.quantity || 0) * Number(l.listPrice || 0) - Number(l.discount || 0);
    return sum + discounted * (Number(l.tax || 0) / 100);
  }, 0);
  const grandTotal = subtotal - totalDiscount + totalTax;

  const validate = () => {
    const next = {};
    if (!form.subject.trim()) next.subject = "Subject is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async (andNew = false) => {
    if (!validate()) return;
    try {
      await saveQuote(toApiPayload(form), id);
      if (andNew) {
        setForm(blankQuoteForm());
        navigate("/quotes/add");
      } else {
        navigate("/quotes");
      }
    } catch (err) {
      console.error("SAVE QUOTE ERROR:", err);
    }
  };

  if (initializing) {
    return <div className="p-6 text-sm text-[#6B7280]">Loading quote...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#111827]">Quotes</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/quotes")}
            className="h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#111827] hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="h-11 px-4 rounded-xl border border-blue-600 text-sm font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-60"
          >
            Save and New
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="h-11 px-4 rounded-xl bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {id ? "Update Quote" : "Save Quote"}
          </button>
        </div>
      </div>

      {/* Quote Information */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 mb-5">
        <h2 className="text-sm font-semibold text-blue-600 mb-4">Quote Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-[#6B7280]">SUBJECT *</label>
            <input
              value={form.subject}
              onChange={(e) => setField("subject", e.target.value)}
              placeholder="e.g. Website Overhaul Q1"
              className="w-full h-11 mt-1 px-3 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:ring-4 focus:ring-blue-100"
            />
            {errors.subject && <p className="text-xs text-red-600 mt-1">{errors.subject}</p>}
          </div>
          <div>
            <label className="text-xs font-medium text-[#6B7280]">QUOTE STAGE</label>
            <select
              value={form.quoteStage}
              onChange={(e) => setField("quoteStage", e.target.value)}
              className="w-full h-11 mt-1 px-3 rounded-xl border border-[#E5E7EB] text-sm bg-white outline-none focus:ring-4 focus:ring-blue-100"
            >
              <option value="draft">Draft</option>
              <option value="negotiation">Negotiation</option>
              <option value="delivered">Delivered</option>
              <option value="on_hold">On Hold</option>
              <option value="confirmed">Confirmed</option>
              <option value="closed_won">Closed Won</option>
              <option value="closed_lost">Closed Lost</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-[#6B7280]">VALID UNTIL</label>
            <input
              type="date"
              value={form.validUntil}
              onChange={(e) => setField("validUntil", e.target.value)}
              className="w-full h-11 mt-1 px-3 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:ring-4 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#6B7280]">DEAL NAME</label>
            <div className="relative mt-1">
              <select
                value={form.dealId}
                onChange={(e) => handleDealChange(e.target.value)}
                className="w-full h-11 pl-10 pr-3 rounded-xl border border-[#E5E7EB] text-sm bg-white outline-none focus:ring-4 focus:ring-blue-100"
              >
                <option value="">Lookup deals...</option>
                {(deals || []).map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.deal_name || d.name}
                  </option>
                ))}
              </select>
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#6B7280]">CARRIER</label>
            <input
              value={form.carrier}
              onChange={(e) => setField("carrier", e.target.value)}
              placeholder="FedEx, UPS, etc."
              className="w-full h-11 mt-1 px-3 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:ring-4 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#6B7280]">TEAM</label>
            <select
              value={form.team}
              onChange={(e) => setField("team", e.target.value)}
              className="w-full h-11 mt-1 px-3 rounded-xl border border-[#E5E7EB] text-sm bg-white outline-none focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Sales North America</option>
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="social">Social Media</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-[#6B7280]">QUOTE OWNER</label>
            <select
              value={form.assignedTo}
              onChange={(e) => setField("assignedTo", e.target.value)}
              className="w-full h-11 mt-1 px-3 rounded-xl border border-[#E5E7EB] text-sm bg-white outline-none focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Name</option>
              {(staff || []).map((member) => (
                <option key={member.id} value={member.id}>
                  {member.full_name || member.fullName || member.name || `Staff #${member.id}`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-[#6B7280]">CONTACT NAME</label>
            <input
              value={form.contactName}
              onChange={(e) => setField("contactName", e.target.value)}
              placeholder="Contact name"
              className="w-full h-11 mt-1 px-3 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {/* Account & Customer are derived from the linked Deal — read-only, no manual entry */}
          <div>
            <label className="text-xs font-medium text-[#6B7280]">ACCOUNT NAME</label>
            <input
              value={form.accountName || ""}
              readOnly
              placeholder="Auto-filled from deal"
              className="w-full h-11 mt-1 px-3 rounded-xl border border-[#E5E7EB] text-sm bg-gray-50 text-[#6B7280] cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#6B7280]">CUSTOMER NAME</label>
            <input
              value={form.customerName || ""}
              readOnly
              placeholder="Auto-filled from deal"
              className="w-full h-11 mt-1 px-3 rounded-xl border border-[#E5E7EB] text-sm bg-gray-50 text-[#6B7280] cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <h2 className="text-sm font-semibold text-blue-600 mb-4">Billing Address</h2>
          <AddressFields value={form.billingAddress} onChange={(k, v) => setAddressField("billingAddress", k, v)} />
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-blue-600">Shipping Address</h2>
            <label className="flex items-center gap-2 text-xs text-[#6B7280]">
              Copy Billing
              <button
                type="button"
                onClick={() => setField("copyBilling", !form.copyBilling)}
                className={`w-9 h-5 rounded-full transition ${form.copyBilling ? "bg-blue-600" : "bg-gray-300"}`}
              >
                <span
                  className={`block w-4 h-4 bg-white rounded-full shadow transform transition ${
                    form.copyBilling ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </button>
            </label>
          </div>
          <AddressFields
            value={form.shippingAddress}
            onChange={(k, v) => setAddressField("shippingAddress", k, v)}
            disabled={form.copyBilling}
          />
        </div>
      </div>

      {/* Quoted Items */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-blue-600">Quoted Items</h2>
          <button onClick={addLine} className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
            <Plus className="w-4 h-4" /> Add Line Item
          </button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-medium text-[#6B7280] uppercase">
              <th className="py-2 pr-2">#</th>
              <th className="py-2 pr-2">Product Name</th>
              <th className="py-2 pr-2">Quantity</th>
              <th className="py-2 pr-2">List Price</th>
              <th className="py-2 pr-2">Discount ($)</th>
              <th className="py-2 pr-2">Tax (%)</th>
              <th className="py-2 pr-2">Total</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {form.products.map((line, idx) => (
              <tr key={line.key} className="border-t border-[#E5E7EB]">
                <td className="py-2 pr-2 text-[#6B7280]">{idx + 1}</td>
                <td className="py-2 pr-2">
                  <select
                    value={line.productId}
                    onChange={(e) => handleLineChange(line.key, "productId", e.target.value)}
                    className="w-full h-9 px-2 rounded-lg border border-[#E5E7EB] text-sm"
                  >
                    <option value="">Select product...</option>
                    {(products || []).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2 pr-2">
                  <input
                    type="number"
                    min={1}
                    value={line.quantity}
                    onChange={(e) => handleLineChange(line.key, "quantity", Number(e.target.value))}
                    className="w-20 h-9 px-2 rounded-lg border border-[#E5E7EB] text-sm"
                  />
                </td>
                <td className="py-2 pr-2 text-[#111827]">{formatCurrency(line.listPrice)}</td>
                <td className="py-2 pr-2">
                  <input
                    type="number"
                    min={0}
                    value={line.discount}
                    onChange={(e) => handleLineChange(line.key, "discount", Number(e.target.value))}
                    className="w-24 h-9 px-2 rounded-lg border border-[#E5E7EB] text-sm"
                  />
                </td>
                <td className="py-2 pr-2 text-[#111827]">{line.tax}%</td>
                <td className="py-2 pr-2 font-medium text-[#111827]">{formatCurrency(lineTotal(line))}</td>
                <td className="py-2">
                  {form.products.length > 1 && (
                    <button onClick={() => removeLine(line.key)} className="text-[#6B7280] hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-4">
          <div className="w-64 space-y-1 text-sm">
            <div className="flex justify-between text-[#6B7280]">
              <span>Subtotal</span>
              <span className="text-[#111827] font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#6B7280]">
              <span>Tax</span>
              <span className="text-[#111827] font-medium">{formatCurrency(totalTax)}</span>
            </div>
            <div className="flex justify-between text-[#6B7280]">
              <span>Discount</span>
              <span className="text-red-500 font-medium">-{formatCurrency(totalDiscount)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#E5E7EB] font-semibold text-[#111827]">
              <span>Grand Total</span>
              <span className="text-blue-600">{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Description */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <h2 className="text-sm font-semibold text-blue-600 mb-3">Terms & Conditions</h2>
          <textarea
            value={form.termsConditions}
            onChange={(e) => setField("termsConditions", e.target.value)}
            rows={4}
            placeholder="Legal notes, payment terms, or policy links..."
            className="w-full p-3 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:ring-4 focus:ring-blue-100"
          />
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <h2 className="text-sm font-semibold text-blue-600 mb-3">Description</h2>
          <textarea
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            rows={4}
            placeholder="Internal comments or detailed breakdown for this quote..."
            className="w-full p-3 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:ring-4 focus:ring-blue-100"
          />
        </div>
      </div>
    </div>
  );
};

const AddressFields = ({ value, onChange, disabled }) => {
  const set = (field, val) => onChange(field, val);
  return (
    <>
      <textarea
        value={value.streetAdd}
        onChange={(e) => set("streetAdd", e.target.value)}
        disabled={disabled}
        placeholder="Street Address"
        className="mt-2 w-full min-h-[80px] rounded-xl border border-[#E5E7EB] p-3 text-sm outline-none resize-none disabled:bg-gray-50"
      />
      <div className="grid grid-cols-2 gap-3 mt-3">
        <input
          placeholder="City"
          value={value.city}
          onChange={(e) => set("city", e.target.value)}
          disabled={disabled}
          className="h-11 px-3 rounded-xl border border-[#E5E7EB] text-sm outline-none disabled:bg-gray-50"
        />
        <input
          placeholder="State"
          value={value.state}
          onChange={(e) => set("state", e.target.value)}
          disabled={disabled}
          className="h-11 px-3 rounded-xl border border-[#E5E7EB] text-sm outline-none disabled:bg-gray-50"
        />
      </div>
      <div className="grid grid-cols-2 gap-3 mt-3">
        <input
          placeholder="Zip Code"
          value={value.zipCode}
          onChange={(e) => set("zipCode", e.target.value)}
          disabled={disabled}
          className="h-11 px-3 rounded-xl border border-[#E5E7EB] text-sm outline-none disabled:bg-gray-50"
        />
        <input
          placeholder="Country"
          value={value.country}
          onChange={(e) => set("country", e.target.value)}
          disabled={disabled}
          className="h-11 px-3 rounded-xl border border-[#E5E7EB] text-sm outline-none disabled:bg-gray-50"
        />
      </div>
    </>
  );
};

export default QuoteFormPage;