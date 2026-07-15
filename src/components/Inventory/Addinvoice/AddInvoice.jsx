import React from 'react'
import InvoiceHeader from './InvoiceHeader'
import InvoiceInfo from './InvoiceInfo'
import AddressInfo from './AddressInfo'
import OrderedItems from './OrderedItems'

const AddInvoice = () => {
    return (
        <>
            <InvoiceHeader />
            <InvoiceInfo />
            <AddressInfo />
            <OrderedItems />
        </>
    )
}

export default AddInvoice