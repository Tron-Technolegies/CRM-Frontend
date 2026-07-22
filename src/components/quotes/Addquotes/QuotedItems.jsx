import React from "react";

const QuotedItems = ({
    formData,
    handleChange,
    productsList
}) => {


    const products = formData.products || [];
    const addLineItem = () => {
        const updatedProducts = [
            ...products,
            {
                product: "",
                quantity: 1,
                discount: 0
            }
        ];

        handleChange({
            target: {
                name: "products",
                value: updatedProducts
            }
        });

    };



    const updateProduct = (index, field, value) => {
        const updatedProducts = [...products];
        updatedProducts[index][field] = value;

        handleChange({
            target: {
                name: "products",
                value: updatedProducts
            }
        });

    };

    // const calculateTotal = (item) => {
    //     const price = Number(item.list_price || 0);
    //     const quantity = Number(item.quantity || 0);
    //     const discount = Number(item.discount || 0);
    //     const tax = Number(item.tax || 0);

    //     const amount = quantity * price;
    //     const discountedAmount = amount - discount;
    //     const total = discountedAmount + (discountedAmount * tax / 100);

    //     return total; // remove toFixed()
    // };

    // const subtotal = products.reduce(
    //     (sum, item) => sum + calculateTotal(item),
    //     0
    // );


    return (

        <div className="border border-gray-300 shadow-lg rounded-lg mx-6 overflow-hidden">
            <div className="flex justify-between p-6 bg-[#EFF6FF]">

                <h1 className="text-[#004EDC] font-semibold">
                    Quoted Items
                </h1>
                <button
                    onClick={addLineItem}
                    className="text-[#004EDC] font-semibold">
                    + Add Line Item
                </button>
            </div>
            <div className="overflow-x-auto bg-white">
                <table className="w-full text-sm">
                    <thead>

                        <tr className="text-left text-slate-400 text-xs uppercase tracking-wide border-b">

                            <th className="px-6 py-3">
                                #
                            </th>

                            <th className="px-2 py-3">
                                Product Name
                            </th>
                            <th className="px-2 py-3">
                                Quantity
                            </th>
                            <th className="px-2 py-3">
                                Discount
                            </th>
                            {/* <th className="px-6 py-3 text-right">
                                Total
                            </th> */}
                        </tr>
                    </thead>
                    <tbody>


                        {
                            products.map((item, index) => (

                                <tr
                                    key={index}
                                >
                                    <td className="px-6 py-4">
                                        {index + 1}
                                    </td>
                                    <td className="px-2 py-4">
                                        <select
                                            value={item.product}
                                            onChange={(e) => {

                                                const productId = Number(e.target.value);

                                                const selected = productsList.find(
                                                    p => p.id === productId
                                                );

                                                const updatedProducts = [...products];

                                                updatedProducts[index] = {
                                                    ...updatedProducts[index],
                                                    product: productId,
                                                    list_price: selected?.unit_price || 0,
                                                    tax: selected?.tax_percentage || 0
                                                };

                                                handleChange({
                                                    target: {
                                                        name: "products",
                                                        value: updatedProducts
                                                    }
                                                });

                                            }}
                                            className="border rounded-md px-3 py-2 w-full"
                                        >

                                            <option value="">
                                                Select Product
                                            </option>

                                            {productsList.map(product => (

                                                <option
                                                    key={product.id}
                                                    value={product.id}
                                                >
                                                    {product.name}
                                                </option>

                                            ))}

                                        </select>
                                    </td>
                                    <td className="px-2 py-4">

                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                updateProduct(
                                                    index,
                                                    "quantity",
                                                    e.target.value
                                                )
                                            }
                                            className="w-20 border rounded-md px-2 py-2"
                                        />
                                    </td>
                                    <td className="px-2 py-4">

                                        <input
                                            type="number"
                                            value={item.discount}
                                            onChange={(e) =>
                                                updateProduct(
                                                    index,
                                                    "discount",
                                                    e.target.value
                                                )
                                            }
                                            className="w-20 border rounded-md px-2 py-2"
                                        />
                                    </td>
                                    {/* <td className="px-6 py-4 text-right font-semibold">
                                        {calculateTotal(item).toFixed(2)}
                                    </td> */}
                                </tr>

                            ))
                        }
                    </tbody>
                </table>
            </div >
            <div className="flex justify-end px-6 py-6">
                <div className="w-full max-w-xs space-y-3">
                    {/* <div className="flex justify-between text-sm">

                        <span>
                            Subtotal
                        </span>
                        <span className="font-semibold">
                            {subtotal.toFixed(2)}
                        </span>

                    </div> */}
                    {/* <div className="border-t pt-3 flex justify-between">

                        <span className="font-semibold">
                            Grand Total
                        </span>
                        <span className="text-blue-600 font-bold text-xl">

                            {subtotal.toFixed(2)}

                        </span>


                    </div> */}


                </div>


            </div>


        </div >

    );
};


export default QuotedItems;