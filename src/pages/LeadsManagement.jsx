import { Plus } from "lucide-react";
import { useState } from "react";

import LeadsKpis from "../components/leads/LeadsKpis";
import LeadsList from "../components/leads/LeadsList";
import LeadFormModal from "../components/leads/LeadFormModal";
import CustomerFormModal from "../components/customers/CustomerFormModal";
import AccountFormModal from "../components/accounts/AccountFormModal";
import DealFormModal from "../components/deals/DealFormModal";
import ConfirmDialog from "../components/ui/ConfirmDialog";

import { useToast } from "../components/ui/toastContext";

import useLead from "../hooks/useLead";

import { addLead, updateLead, deleteLead, convertLead } from "../api/lead";


export default function LeadsManagement() {
  const { pushToast } = useToast();

  const { leads, staff, loading, fetchLeads, setLeads } = useLead();

  // Add / edit lead
  const [addOpen, setAddOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editLead, setEditLead] = useState(null);

  // Conversion flow
  const [convertLeadId, setConvertLeadId] = useState(null);
  const [convertType, setConvertType] = useState(null); // "customer" | "account" | null
  const [isDealFlow, setIsDealFlow] = useState(false);
  const [showConvertChoice, setShowConvertChoice] = useState(false);
  const [dealStep, setDealStep] = useState(false); // true once we've moved to the deal-details step
  const [pendingEntityForm, setPendingEntityForm] = useState(null); // staged customer/account payload, deal flow only
  const [entitySubmitLoading, setEntitySubmitLoading] = useState(false);
  const [dealSubmitLoading, setDealSubmitLoading] = useState(false);

  // Delete
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);


  const resetConversionState = () => {
    setConvertLeadId(null);
    setConvertType(null);
    setIsDealFlow(false);
    setShowConvertChoice(false);
    setDealStep(false);
    setPendingEntityForm(null);
  };


  /* Start conversion */
  const handleConvert = (leadId, type) => {
    resetConversionState();
    setConvertLeadId(leadId);

    if (type === "deal") {
      // Deal conversion needs a Customer or Account underneath it —
      // ask which one before opening the data-collection form.
      setIsDealFlow(true);
      setShowConvertChoice(true);
      return;
    }

    setConvertType(type);
  };


  /* After choosing Customer / Account for a deal conversion */
  const continueDealConversion = type => {
    setConvertType(type);
    setShowConvertChoice(false);
  };


  /* Customer/Account form finished — either submit now, or move to the deal step */
  const handleEntityContinue = async form => {
    if (isDealFlow) {
      setPendingEntityForm(form);
      setDealStep(true);
      return;
    }

    await submitConversion(form, null);
  };


  /* Deal form finished — submit everything collected so far */
  const handleDealContinue = async dealForm => {
    await submitConversion(pendingEntityForm, dealForm);
  };


  /* Shared submit for both flows */
  const submitConversion = async (entityForm, dealForm) => {
    const setLoadingFlag = dealForm ? setDealSubmitLoading : setEntitySubmitLoading;
    setLoadingFlag(true);

    try {
      const payload = {
        create_customer: convertType === "customer",
        create_account: convertType === "account",
        create_deal: isDealFlow,
        customer_data: convertType === "customer" ? entityForm : null,
        account_data: convertType === "account" ? entityForm : null,
      };

      if (isDealFlow && dealForm) {
        payload.related_type = convertType; // "customer" or "account" — required by convert_lead's deal branch
        payload.deal_name = dealForm.dealName;
        payload.deal_amount = Number(dealForm.dealAmount);
        payload.stage = dealForm.stage;
        payload.assigned_to = dealForm.assignedTo || null;
        payload.expected_closing_date = dealForm.expectedCloseDate || null;
        payload.deal_source = dealForm.dealSource;
        payload.priority = dealForm.priority;
        payload.description = dealForm.description;
      }

      await convertLead(convertLeadId, payload);

      pushToast({
        title: "Lead converted",
        message: isDealFlow ? "Deal created successfully" : "Conversion successful",
        variant: "success",
      });

      resetConversionState();
      await fetchLeads();
    } catch (error) {
      console.error(error);

      pushToast({
        title: "Conversion failed",
        variant: "error",
      });
      // Keep whichever step is open so the user doesn't lose their input.
    } finally {
      setLoadingFlag(false);
    }
  };


  // Prefill for the Deal step, derived from whatever the customer/account
  // form just collected (companyName for Customer, acc_name for Account).
  const defaultDealPrefill = pendingEntityForm
    ? {
        companyName: pendingEntityForm.companyName || pendingEntityForm.acc_name || "",
      }
    : null;


  const requestDelete = id => {
    setDeleteTargetId(id);
    setConfirmDeleteOpen(true);
  };


  const confirmDelete = async () => {
    if (!deleteTargetId) return;

    setDeleteLoading(true);

    try {
      await deleteLead(deleteTargetId);

      setLeads(prev => prev.filter(lead => lead.id !== deleteTargetId));

      pushToast({
        title: "Lead deleted",
        variant: "success",
      });

      setConfirmDeleteOpen(false);
      setDeleteTargetId(null);
    } catch (error) {
      console.error(error);

      pushToast({
        title: "Failed to delete lead",
        variant: "error",
      });
      // Leave the confirm dialog open on failure so the user can retry.
    } finally {
      setDeleteLoading(false);
    }
  };


  const handleAddLead = async form => {
    setAddLoading(true);

    try {
      await addLead({
        full_name: form.fullName.trim(),
        phone_number: `${form.countryCode} ${form.phoneNumber.trim()}`,
        email: form.email.trim(),
        company_name: form.companyName.trim(),
        lead_source: form.leadSource,
        priority: form.priority,
        expected_closing_date: form.expectedClosingDate || null,
        lead_description: form.description.trim(),
        assigned_to: form.assignedTo || null,
      });

      await fetchLeads();

      pushToast({
        title: "Lead created",
        variant: "success",
      });

      setAddOpen(false);
    } catch (error) {
      console.error(error);

      pushToast({
        title: "Failed to add lead",
        variant: "error",
      });
      // Keep the modal open on failure so the user's entries aren't lost.
    } finally {
      setAddLoading(false);
    }
  };


  const handleUpdateLead = async form => {
    if (!editLead) return;

    setAddLoading(true);

    try {
      await updateLead(editLead.id, {
        full_name: form.fullName.trim(),
        phone_number: form.countryCode
          ? `${form.countryCode} ${form.phoneNumber.trim()}`
          : form.phoneNumber.trim(),
        email: form.email.trim(),
        company_name: form.companyName.trim(),
        lead_source: form.leadSource,
        priority: form.priority,
        status: form.status.toLowerCase(),
        expected_closing_date: form.expectedClosingDate || null,
        lead_description: form.description.trim(),
        assigned_to: form.assignedTo || null,
      });

      await fetchLeads();

      pushToast({
        title: "Lead updated",
        variant: "success",
      });

      setEditLead(null);
    } catch (error) {
      console.error(error);

      pushToast({
        title: "Update failed",
        variant: "error",
      });
      // Keep the modal open on failure so the user's edits aren't lost.
    } finally {
      setAddLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center h-64 items-center">
        Loading leads...
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-[28px] font-semibold">Leads</h1>

        <button
          onClick={() => setAddOpen(true)}
          className="
            h-11 px-5 rounded-xl
            bg-blue-600 text-white
            flex items-center gap-2
          "
        >
          <Plus size={18} />
          Add Lead
        </button>
      </div>

      <LeadsKpis leads={leads} />

      <LeadsList
        leads={leads}
        staff={staff}
        onDelete={requestDelete}
        onEdit={setEditLead}
        onConvert={handleConvert}
      />

      <LeadFormModal
        open={addOpen || !!editLead}
        onClose={() => {
          setAddOpen(false);
          setEditLead(null);
        }}
        onSubmit={editLead ? handleUpdateLead : handleAddLead}
        loading={addLoading}
        initialData={editLead}
        staff={staff}
      />

      {/* Choose Customer / Account (deal conversion only) */}
      {showConvertChoice && (
        <div
          className="
            fixed inset-0
            bg-black/40
            flex items-center justify-center
            z-50
          "
        >
          <div
            className="
              bg-white
              rounded-2xl
              p-6
              w-[350px]
              space-y-4
            "
          >
            <h2 className="font-bold text-lg">Create Deal With</h2>

            <button
              onClick={() => continueDealConversion("customer")}
              className="w-full bg-blue-600 text-white py-3 rounded-xl"
            >
              Customer
            </button>

            <button
              onClick={() => continueDealConversion("account")}
              className="w-full bg-purple-600 text-white py-3 rounded-xl"
            >
              Account
            </button>

            <button
              onClick={resetConversionState}
              className="w-full border py-3 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Step 1: Customer details */}
      <CustomerFormModal
        open={convertType === "customer" && !dealStep}
        onClose={resetConversionState}
        convertMode={true}
        leadId={convertLeadId}
        onContinue={handleEntityContinue}
        loading={entitySubmitLoading}
      />

      {/* Step 1: Account details */}
      <AccountFormModal
        open={convertType === "account" && !dealStep}
        onClose={resetConversionState}
        convertMode={true}
        leadId={convertLeadId}
        onContinue={handleEntityContinue}
        loading={entitySubmitLoading}
      />

      {/* Step 2 (deal flow only): Deal details */}
      <DealFormModal
        open={isDealFlow && dealStep}
        onClose={resetConversionState}
        onBack={() => setDealStep(false)}
        onSubmit={handleDealContinue}
        loading={dealSubmitLoading}
        convertMode={true}
        leadId={convertLeadId}
        prefill={defaultDealPrefill}
      />

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete lead?"
        description="This action cannot be undone."
        confirmText="Delete"
        danger
        loading={deleteLoading}
        onCancel={() => {
          if (!deleteLoading) {
            setConfirmDeleteOpen(false);
            setDeleteTargetId(null);
          }
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}