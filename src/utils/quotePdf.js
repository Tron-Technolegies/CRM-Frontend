import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getQuote } from "../api/quotes";

/**
 * Format numeric currency values cleanly for PDF (avoiding encoding issues with glyphs).
 */
export function formatPdfCurrency(value) {
  const num = Number(value || 0);
  return `INR ${num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format address object or string into lines of text.
 */
function formatAddressLines(addr) {
  if (!addr) return [];
  if (typeof addr === "string") {
    return addr.split("\n").map((s) => s.trim()).filter(Boolean);
  }
  const lines = [];
  const primary = [addr.address || addr.flatNo, addr.streetAdd || addr.streetAddress || addr.street_address]
    .filter(Boolean)
    .join(", ");
  if (primary) lines.push(primary);

  const cityStateZip = [addr.city, addr.state, addr.zipCode || addr.zip_code].filter(Boolean).join(", ");
  if (cityStateZip) lines.push(cityStateZip);

  if (addr.country) lines.push(addr.country);
  return lines;
}

/**
 * Retrieve company profile from authenticated session storage.
 */
function getCompanyDetails() {
  try {
    const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (userStr) {
      const user = JSON.parse(userStr);
      const companyName =
        user.company_name || user.companyName || user.company || "Tron Technologies";
      const companyEmail = user.company_email || user.email || "";
      const companyPhone = user.company_phone || user.phone || user.mobile || "";
      const companyWebsite = user.company_website || user.website || "";
      const addressLines = [
        user.street || user.address,
        user.city,
        user.state,
        user.zipCode || user.zip_code,
        user.country,
      ].filter(Boolean);

      return {
        name: companyName,
        email: companyEmail,
        phone: companyPhone,
        website: companyWebsite,
        address: addressLines.join(", "),
      };
    }
  } catch (err) {
    console.error("Failed to parse company details from user session:", err);
  }

  return {
    name: "Tron Technologies",
    email: "info@company.com",
    phone: "",
    website: "",
    address: "",
  };
}

/**
 * Calculate line item financial figures safely.
 */
function calculateLineItem(item) {
  const qty = Number(item.quantity || 1);
  const price = Number(item.listPrice ?? item.unitPrice ?? item.price ?? 0);
  const discount = Number(item.discount || 0);
  const taxRate = Number(item.tax || 0);

  const base = qty * price;
  const afterDiscount = Math.max(0, base - discount);
  const taxAmount = afterDiscount * (taxRate / 100);

  const lineTotal =
    item.lineTotal !== undefined && item.lineTotal !== null
      ? Number(item.lineTotal)
      : afterDiscount + taxAmount;

  return {
    productName: item.product || item.productName || item.name || "Product / Service",
    description: item.description || "",
    quantity: qty,
    price,
    discount,
    taxRate,
    taxAmount,
    lineTotal,
  };
}

/**
 * Generate a professional jsPDF document for a Quote.
 */
export function generateQuotePdfDoc(quote = {}) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm
  const rightMarginX = pageWidth - margin; // 196mm

  const company = getCompanyDetails();
  const quoteNumber =
    quote.quoteNumber ||
    quote.quote_number ||
    (quote.id ? `QT-${String(quote.id).padStart(4, "0")}` : "QUOTATION");

  const issueDate =
    quote.quoteDate ||
    quote.createdAt?.slice(0, 10) ||
    quote.created_at?.slice(0, 10) ||
    new Date().toISOString().slice(0, 10);

  const stage = (quote.quoteStage || quote.quote_stage || "Draft").toUpperCase();

  // ---------------------------------------------------------
  // 1. Header: Company Brand (Left) & Quotation Info (Right)
  // ---------------------------------------------------------
  let currentY = 18;

  // Company Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(company.name, margin, currentY);

  // Document Title (Right)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(37, 99, 235); // blue-600
  doc.text("QUOTATION", rightMarginX, currentY, { align: "right" });

  currentY += 6;

  // Company sub-details (Left)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139); // slate-500
  let companyY = currentY;
  if (company.address) {
    const addressLines = doc.splitTextToSize(company.address, 95);
    doc.text(addressLines, margin, companyY);
    companyY += addressLines.length * 4;
  }
  const contactParts = [company.email, company.phone, company.website].filter(Boolean);
  if (contactParts.length > 0) {
    doc.text(contactParts.join("  •  "), margin, companyY);
    companyY += 4.5;
  }

  // Quote Metadata (Right)
  let metaY = currentY;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text(`Quote #: ${quoteNumber}`, rightMarginX, metaY, { align: "right" });
  metaY += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Date: ${issueDate}`, rightMarginX, metaY, { align: "right" });
  metaY += 4.5;

  if (quote.validUntil || quote.valid_until) {
    const validityStr = quote.validUntil || quote.valid_until;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(217, 119, 6); // amber-600
    doc.text(`Valid Until: ${validityStr}`, rightMarginX, metaY, { align: "right" });
    metaY += 4.5;
  }

  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(`Status: ${stage}`, rightMarginX, metaY, { align: "right" });
  metaY += 5;

  currentY = Math.max(companyY, metaY) + 3;

  // Header Divider
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.4);
  doc.line(margin, currentY, rightMarginX, currentY);

  currentY += 6;

  // ---------------------------------------------------------
  // 2. Customer (Bill To) & Quote Details Section
  // ---------------------------------------------------------
  const infoColWidth = (contentWidth - 8) / 2;
  const leftColX = margin;
  const rightColX = margin + infoColWidth + 8;
  const infoBoxStartY = currentY;

  // Left Column: Bill To / Customer
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(37, 99, 235);
  doc.text("CUSTOMER / BILL TO", leftColX, currentY);

  let leftY = currentY + 5;
  const customerName =
    quote.customerName ||
    quote.customer ||
    quote.contactName ||
    quote.accountName ||
    "—";

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(customerName, leftColX, leftY);
  leftY += 4.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);

  if (quote.accountName && quote.accountName !== customerName && quote.accountName !== "—") {
    doc.text(`Account: ${quote.accountName}`, leftColX, leftY);
    leftY += 4;
  }
  if (quote.contactName && quote.contactName !== customerName) {
    doc.text(`Contact: ${quote.contactName}`, leftColX, leftY);
    leftY += 4;
  }

  const billingLines = formatAddressLines(quote.billingAddress || quote.billing_add);
  if (billingLines.length > 0) {
    billingLines.forEach((line) => {
      const splitLines = doc.splitTextToSize(line, infoColWidth);
      doc.text(splitLines, leftColX, leftY);
      leftY += splitLines.length * 3.8;
    });
  }

  // Right Column: Quote Information
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(37, 99, 235);
  doc.text("QUOTATION DETAILS", rightColX, currentY);

  let rightY = currentY + 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);

  const addRightDetail = (label, val) => {
    if (!val) return;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text(`${label}:`, rightColX, rightY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(String(val), rightColX + 28, rightY);
    rightY += 4.5;
  };

  if (quote.subject) addRightDetail("Subject", quote.subject);
  if (quote.dealName) addRightDetail("Deal", quote.dealName);
  const owner = quote.quoteOwner || quote.owner || quote.assignedTo;
  if (owner) addRightDetail("Prepared By", owner);
  if (quote.carrier) addRightDetail("Carrier", quote.carrier);

  const shippingLines = formatAddressLines(quote.shippingAddress || quote.shipping_add);
  if (shippingLines.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text("Ship To:", rightColX, rightY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    rightY += 4;
    shippingLines.forEach((line) => {
      const splitLines = doc.splitTextToSize(line, infoColWidth);
      doc.text(splitLines, rightColX, rightY);
      rightY += splitLines.length * 3.8;
    });
  }

  currentY = Math.max(leftY, rightY) + 6;

  // ---------------------------------------------------------
  // 3. Products / Line Items Table
  // ---------------------------------------------------------
  const rawProducts = Array.isArray(quote.products) && quote.products.length > 0
    ? quote.products
    : Array.isArray(quote.items) && quote.items.length > 0
    ? quote.items
    : [];

  const lineItems = rawProducts.map(calculateLineItem);

  const tableRows = lineItems.length > 0
    ? lineItems.map((item, index) => {
        const itemDesc = item.description
          ? `${item.productName}\n${item.description}`
          : item.productName;
        return [
          String(index + 1),
          itemDesc,
          String(item.quantity),
          formatPdfCurrency(item.price),
          item.discount > 0 ? `-${formatPdfCurrency(item.discount)}` : "—",
          item.taxRate > 0 ? `${item.taxRate}%` : "0%",
          formatPdfCurrency(item.lineTotal),
        ];
      })
    : [["1", "No line items specified", "1", "—", "—", "—", formatPdfCurrency(quote.grandTotal || 0)]];

  autoTable(doc, {
    startY: currentY,
    head: [["#", "Item Description", "Qty", "Price", "Discount", "Tax", "Total"]],
    body: tableRows,
    theme: "striped",
    headStyles: {
      fillColor: [37, 99, 235], // #2563EB
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: "bold",
      halign: "left",
      cellPadding: 3,
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 10 },
      1: { halign: "left", cellWidth: 70 },
      2: { halign: "center", cellWidth: 14 },
      3: { halign: "right", cellWidth: 26 },
      4: { halign: "right", cellWidth: 22 },
      5: { halign: "center", cellWidth: 15 },
      6: { halign: "right", cellWidth: 25 },
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
      textColor: [30, 41, 59],
      valign: "middle",
      overflow: "linebreak",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // slate-50
    },
    margin: { left: margin, right: margin },
  });

  currentY = doc.lastAutoTable.finalY + 6;

  // Check if summary and terms need a new page
  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }

  // ---------------------------------------------------------
  // 4. Financial Totals & Terms / Notes Section
  // ---------------------------------------------------------
  const subtotal = lineItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const totalDiscount = lineItems.reduce((acc, item) => acc + item.discount, 0);
  const totalTax = lineItems.reduce((acc, item) => acc + item.taxAmount, 0);
  const calculatedGrandTotal = Math.max(0, subtotal - totalDiscount) + totalTax;
  const grandTotal =
    quote.grandTotal !== undefined && quote.grandTotal !== null
      ? Number(quote.grandTotal)
      : calculatedGrandTotal;

  const totalsBoxWidth = 75;
  const totalsBoxX = rightMarginX - totalsBoxWidth;
  let totalsY = currentY;

  // Draw Summary Lines (Right side)
  const drawSummaryLine = (label, valueStr, isBold = false, isAccent = false) => {
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(isAccent ? 37 : 71, isAccent ? 99 : 85, isAccent ? 235 : 105);
    doc.text(label, totalsBoxX, totalsY);
    doc.text(valueStr, rightMarginX, totalsY, { align: "right" });
    totalsY += 5;
  };

  if (lineItems.length > 0) {
    drawSummaryLine("Subtotal", formatPdfCurrency(subtotal));
    if (totalDiscount > 0) {
      drawSummaryLine("Total Discount", `-${formatPdfCurrency(totalDiscount)}`);
    }
    drawSummaryLine("Taxes", `+${formatPdfCurrency(totalTax)}`);
  }

  // Grand Total highlight box
  doc.setFillColor(241, 245, 249); // slate-100
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(0.4);
  doc.roundedRect(totalsBoxX - 2, totalsY, totalsBoxWidth + 2, 9, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text("Grand Total", totalsBoxX + 2, totalsY + 6);
  doc.setTextColor(37, 99, 235); // blue-600
  doc.text(formatPdfCurrency(grandTotal), rightMarginX - 2, totalsY + 6, { align: "right" });

  totalsY += 15;

  // Left side: Terms & Conditions and Validity
  const termsText =
    quote.termsConditions ||
    quote.terms_conditions ||
    quote.termsAndConditions ||
    quote.terms_and_conditions ||
    "";
  const descText = quote.description || "";
  const validityText = quote.validUntil || quote.valid_until;

  const notesWidth = contentWidth - totalsBoxWidth - 10;
  let notesY = currentY;

  if (validityText) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text("Quote Validity:", margin, notesY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text(`This quotation is valid until ${validityText}.`, margin + 25, notesY);
    notesY += 6;
  }

  if (termsText) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text("Terms & Conditions:", margin, notesY);
    notesY += 4.5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    const splitTerms = doc.splitTextToSize(termsText, notesWidth);
    doc.text(splitTerms, margin, notesY);
    notesY += splitTerms.length * 3.8 + 4;
  }

  if (descText) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text("Notes:", margin, notesY);
    notesY += 4.5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    const splitDesc = doc.splitTextToSize(descText, notesWidth);
    doc.text(splitDesc, margin, notesY);
    notesY += splitDesc.length * 3.8 + 4;
  }

  // ---------------------------------------------------------
  // 5. Footer (Applied to all pages)
  // ---------------------------------------------------------
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Subtle divider above footer
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, 283, rightMarginX, 283);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text("Thank you for your business. For questions, contact us using the details above.", margin, 288);

    doc.setFont("helvetica", "normal");
    doc.text(`Page ${i} of ${totalPages}`, rightMarginX, 288, { align: "right" });
  }

  return doc;
}

/**
 * Downloads a quote PDF, fetching full details if necessary.
 * Reuses the same download logic pattern (Blob -> ObjectURL -> anchor click).
 *
 * @param {object|string|number} quoteOrId - Either full quote data or quote ID
 * @param {string} [quoteNumberFallback] - Fallback identifier
 * @returns {Promise<string>} The quote number that was downloaded
 */
export async function downloadQuotePdf(quoteOrId, quoteNumberFallback) {
  let quote = quoteOrId;

  // If passed an ID or a summary object lacking line items, fetch full quote
  const isIdOnly = typeof quote === "number" || typeof quote === "string";
  const lacksProducts = typeof quote === "object" && quote !== null && (!quote.products || quote.products.length === 0);

  if (isIdOnly || lacksProducts) {
    const targetId = isIdOnly ? quote : quote?.id;
    if (targetId) {
      try {
        const full = await getQuote(targetId);
        if (full) {
          quote = typeof quote === "object" ? { ...quote, ...full } : full;
        }
      } catch (err) {
        console.warn("Could not fetch full quote details for PDF, proceeding with available data:", err);
      }
    }
  }

  const doc = generateQuotePdfDoc(quote || {});
  const quoteNumber =
    quote?.quoteNumber ||
    quote?.quote_number ||
    (quote?.id ? `QT-${String(quote.id).padStart(4, "0")}` : quoteNumberFallback || "quote");

  const blob = doc.output("blob");
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${quoteNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);

  return quoteNumber;
}

