import { PaymentElement, useElements, useStripe, Elements } from "@stripe/react-stripe-js";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import { FaLock, FaChevronLeft, FaCheckCircle } from "react-icons/fa";
import { MdPayment } from "react-icons/md";

const stripePromise = loadStripe("pk_test_51T7Ls8F5lqqwKxrFgvxDNHl5W6cGJ3DvHWJ5WifVUS8yE5TKosOLG2h57zleXGEEzaHuYFd5foHOW7aJl8OxHw9q00N96duIWY");

export const StripeModal = ({ clientSecret, onSuccess, onCancel, totalPrice, passengerCount }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md border border-gray-200 shadow-xl overflow-hidden">

                {/* Modal Header */}
                <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-3">
                    <button
                        onClick={onCancel}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <FaChevronLeft className="text-xs" />
                    </button>
                    <div className="flex-1">
                        <p className="font-black text-gray-900 text-sm">Secure Payment</p>
                        <p className="text-xs text-gray-400">Step 2 of 2 — Payment</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-green-50 border border-green-100 px-2.5 py-1 rounded-xl">
                        <FaLock className="text-green-500 text-[10px]" />
                        <span className="text-[10px] font-bold text-green-600">SSL Secured</span>
                    </div>
                </div>

                {/* Step indicator */}
                <div className="px-6 pt-4 flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-400 text-xs font-bold flex items-center justify-center">
                            <FaCheckCircle className="text-xs" />
                        </div>
                        <span className="text-xs font-semibold text-orange-400 hidden sm:block">Review</span>
                    </div>
                    <div className="w-8 h-px bg-orange-300" />
                    <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">2</div>
                        <span className="text-xs font-semibold text-orange-500 hidden sm:block">Payment</span>
                    </div>
                </div>

                {/* Amount summary */}
                {totalPrice && (
                    <div className="mx-6 mt-4 bg-orange-50 border border-orange-100 rounded-2xl px-4 py-3 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-orange-600 font-semibold">
                                {passengerCount} passenger{passengerCount > 1 ? 's' : ''} · Service fee free
                            </p>
                            <p className="text-[10px] text-orange-400 mt-0.5">Total payable amount</p>
                        </div>
                        <p className="text-xl font-black text-orange-500">
                            Rs. {Number(totalPrice).toLocaleString()}
                        </p>
                    </div>
                )}

                {/* Stripe form */}
                <div className="px-6 pb-6 pt-4">
                    <Elements
                        stripe={stripePromise}
                        options={{
                            clientSecret,
                            appearance: {
                                theme: 'stripe',
                                variables: {
                                    colorPrimary: '#f97316',
                                    colorBackground: '#ffffff',
                                    colorText: '#1f2937',
                                    colorDanger: '#ef4444',
                                    fontFamily: 'inherit',
                                    borderRadius: '12px',
                                    spacingUnit: '4px',
                                },
                                rules: {
                                    '.Input': {
                                        border: '2px solid #e5e7eb',
                                        boxShadow: 'none',
                                        padding: '10px 14px',
                                    },
                                    '.Input:focus': {
                                        border: '2px solid #f97316',
                                        boxShadow: 'none',
                                        outline: 'none',
                                    },
                                    '.Label': {
                                        fontWeight: '600',
                                        fontSize: '12px',
                                        color: '#6b7280',
                                        marginBottom: '6px',
                                    },
                                    '.Tab': {
                                        border: '2px solid #e5e7eb',
                                        boxShadow: 'none',
                                        borderRadius: '12px',
                                    },
                                    '.Tab--selected': {
                                        border: '2px solid #f97316',
                                        boxShadow: 'none',
                                    },
                                    '.Tab:hover': {
                                        border: '2px solid #fdba74',
                                    },
                                }
                            },
                            paymentMethodCreation: 'manual',
                        }}
                    >
                        <CheckoutForm onSuccess={onSuccess} onCancel={onCancel} />
                    </Elements>
                </div>
            </div>
        </div>
    );
};

const CheckoutForm = ({ onSuccess, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);

        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin + "/bookings",
            },
            redirect: "if_required",
        });

        if (result.error) {
            toast.error(result.error.message);
            setIsProcessing(false);
        } else if (result.paymentIntent?.status === "succeeded") {
            onSuccess();
        }
    };

    return (
        <form onSubmit={handlePayment} className="space-y-5">

            <PaymentElement
                options={{
                    layout: 'tabs',
                    paymentMethodOrder: ['card'],
                }}
            />

            <button
                type="submit"
                disabled={isProcessing || !stripe}
                className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 px-5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
            >
                {isProcessing ? (
                    <>
                        <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Verifying Payment...
                    </>
                ) : (
                    <>
                        <MdPayment className="text-base" />
                        Confirm & Pay {" "}
                    </>
                )}
            </button>

            <button
                type="button"
                onClick={onCancel}
                className="w-full text-gray-400 text-xs font-semibold hover:text-gray-600 transition-colors py-1"
            >
                ← Go back to review
            </button>

            <p className="text-[10px] text-gray-300 text-center">
                Your payment is encrypted and processed securely via Stripe.
            </p>
        </form>
    );
};