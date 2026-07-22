import React from "react";
import { useNavigate } from "react-router-dom";


const QuoteHeader = ({ saveQuote, editId }) => {

    const navigate = useNavigate();


    return (
        <div className="m-6 flex items-center justify-between">

            <h1 className="text-3xl font-bold">
                Quotes
            </h1>


            <div className="flex items-center space-x-4">

                <button
                    onClick={() => navigate("/quotes")}
                    className="border font-semibold rounded-md px-3 py-2"
                >
                    Cancel
                </button>


                <button
                    onClick={saveQuote}
                    className="bg-[#2B61FF] text-white py-2 px-7 rounded-md"
                >
                    {editId ? "Update Quote" : "Save Quote"}
                </button>


            </div>

        </div>
    );
};


export default QuoteHeader;