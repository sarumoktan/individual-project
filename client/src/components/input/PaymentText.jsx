import React, { useEffect, useState } from 'react';
import { IoMdInformationCircleOutline } from "react-icons/io";

export default function PaymentText({
    id,
    label,
    label2,
    placeholder,
    onChange,
    type = "text",
    value,
    error,
    cardType, 
    maxLength,
    sourceURL
}) {

    const handleCardNumberChange = (e) => {
        let val = e.target.value.replace(/\D/g, '').slice(0, 16); 
        val = val.replace(/(.{4})(?=.)/g, '$1 '); 
        onChange({ target: { name: id, value: val } }); 
    };

    const handleChange = type === 'text' && id === 'card_number' ? handleCardNumberChange : onChange;


    const getCVVPlaceholder = () => {
        if (cardType === 'visa' || cardType === 'mastercard') {
            return 'CVN (3 digits)';
        } else if (cardType === 'amex') {
            return 'CVN (4 digits)';
        }
        return 'CVN';
    };

    return (
        <div className={` flex sm:flex-row flex-col justify-between`}>
            <label
                htmlFor={id}
                className={`block mb-2 text-sm font-medium text-black sm:min-w-40 tracking-wide`}
            >
                {label}
            </label>
            <div className={`flex-grow`}>
                {label2 && (
                    <label
                        className={`block mb-2 text-xs font-medium text-gray-500 dark:text-white min-w-40 tracking-wide`}
                    >
                        {label2}
                    </label>
                )}

                <div className={`flex justify-start items-center gap-1`}>
                    <input
                        type={type}
                        id={id}
                        name={id}
                        value={value}
                        placeholder={placeholder || getCVVPlaceholder()}
                        onChange={handleChange}
                        className={`border ${id === 'cvv' ? 'max-w-20  ' : 'min-w-full' } ${error ? 'border-red-500' : 'border-gray-300'} text-xs bg-gray-50 text-gray-900 rounded-lg block p-2.5 ${value && 'bg-blue-100 '}`}
                        maxLength={maxLength}
                    />
                    {
                        sourceURL && (
                            <img
                                className="w-20 h-10"
                                src={sourceURL}
                                alt="Credit Card"
                            />
                        )
                    }
                </div>
                {error && (
                    <p className="flex justify-start items-center gap-1 text-red-500 text-xs pt-1">
                        <IoMdInformationCircleOutline className={'scale-125'} />
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
}
