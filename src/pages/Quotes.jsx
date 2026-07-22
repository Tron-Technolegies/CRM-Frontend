import React from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import QuotesTable from '../components/quotes/QuotesTable'

const Quotes = () => {


  return (

    <div className="mt-5 ">
      <div className="flex items-center justify-between mb-15">
        <h1 className="text-[28px] font-bold text-[#111827]">Quotes</h1>
        <Link to="/addquote">
          <button
            type="button"
            className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium flex items-center gap-2">
            <Plus size={18} />
            Add Quote
          </button>
        </Link>
      </div>
      <QuotesTable />
    </div>

  )
}

export default Quotes