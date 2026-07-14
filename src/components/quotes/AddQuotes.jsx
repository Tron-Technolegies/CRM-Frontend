import React from "react";
import QuoteInformation from "./Addquotes/QuoteInformation.jsx";
import AddressSection from "./Addquotes/AddressSection";
import QuoteHeader from "./Addquotes/QuoteHeader";
import NotesSection from "./Addquotes/NotesSection.jsx";
import QuotedItems from "./Addquotes/QuotedItems.jsx";

const AddQuotes = () => {
    return (
        <>
            <QuoteHeader />
            <QuoteInformation />
            <AddressSection />
            <QuotedItems />
            <NotesSection />
        </>
    );
};

export default AddQuotes;