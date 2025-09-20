import React, { useState, useEffect } from "react";
import { X, Smartphone, Shield, Zap, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const PaymentModal = ({ isOpen, onClose, selectedPlan }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [phonePeLoaded, setPhonePeLoaded] = useState(false);

    useEffect(() => {
        // Load PhonePe SDK script dynamically
        const script = document.createElement('script');
        script.src = 'https://mercury-t2.phonepe.com/transact/js/checkout.js';
        script.async = true;
        script.onload = () => setPhonePeLoaded(true);
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    const handleUPIPayment = async () => {
        setIsProcessing(true);

        try {
            // Get the correct price based on billing period
            const currentPrice = selectedPlan.billingPeriod === 'yearly' 
                ? selectedPlan.price.yearly 
                : selectedPlan.price.monthly;
            
            // Convert price to paise (PhonePe expects amount in paise for INR)
            const amount = parseInt(currentPrice.replace(/[^0-9]/g, '')) * 100;

            // Create PhonePe payment request
            const paymentData = {
                merchantId: process.env.REACT_APP_PHONEPE_MERCHANT_ID || 'PGTESTPAYUAT',
                merchantTransactionId: 'MT' + Date.now(),
                merchantUserId: 'MUID' + Date.now(),
                amount: amount,
                redirectUrl: window.location.origin + '/payment/callback',
                redirectMode: 'POST',
                callbackUrl: window.location.origin + '/api/payment/callback',
                mobileNumber: '9999999999',
                paymentInstrument: {
                    type: 'PAY_PAGE'
                }
            };

            // For demo purposes using test environment
            const response = await fetch('/api/payment/initiate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...paymentData,
                    planName: selectedPlan.name,
                    billingPeriod: selectedPlan.billingPeriod
                })
            });

            const result = await response.json();
            
            if (result.success && result.data.instrumentResponse.redirectInfo) {
                // Redirect to PhonePe payment page
                window.location.href = result.data.instrumentResponse.redirectInfo.url;
            } else {
                throw new Error('Failed to initiate payment');
            }
        } catch (error) {
            console.error('Payment error:', error);
            alert('Payment failed. Please try again.');
            setIsProcessing(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[80vh] overflow-y-auto p-0 sm:rounded-lg [&>button:first-of-type]:hidden">
                <div className="bg-white">
                    {/* Header */}
                    <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100 ">
                        <div className="flex justify-between items-start">
                            <div>
                                <DialogTitle className="text-xl font-bold text-gray-900">
                                    Complete Payment
                                </DialogTitle>
                                <p className="text-sm text-gray-500 mt-1">
                                    Secure payment via PhonePe
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-full p-1 hover:bg-gray-100 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </DialogHeader>

                    <div className="px-6 py-4">
                        {/* Order Summary */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-gray-700">Plan</span>
                                <span className="font-semibold text-gray-900">{selectedPlan?.name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">Amount</span>
                                <span className="text-2xl font-bold text-gray-900">
                                    ₹{selectedPlan?.billingPeriod === 'yearly' 
                                        ? selectedPlan?.price.yearly 
                                        : selectedPlan?.price.monthly}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-sm text-gray-500">Billing Period</span>
                                <span className="text-sm font-medium text-gray-700 capitalize">
                                    {selectedPlan?.billingPeriod || 'monthly'}
                                </span>
                            </div>
                            <Badge className="mt-3 bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                                <Zap className="h-3 w-3 mr-1" />
                                Zero fees on UPI payments
                            </Badge>
                        </div>

                        {/* Payment Content */}
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-3">
                                    <Smartphone className="h-6 w-6 text-blue-600" />
                                </div>
                                <h4 className="font-medium text-gray-900 text-lg">UPI Payment</h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    You'll be redirected to PhonePe's secure payment gateway
                                </p>
                            </div>

                            <Button
                                className="w-full h-11 text-base font-medium"
                                onClick={handleUPIPayment}
                                disabled={isProcessing || !phonePeLoaded}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    `Pay ₹${selectedPlan?.billingPeriod === 'yearly' 
                                        ? selectedPlan?.price.yearly 
                                        : selectedPlan?.price.monthly} via UPI`
                                )}
                            </Button>

                            {/* Benefits Section */}
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <h5 className="font-medium text-blue-900 mb-3 flex items-center">
                                    <Shield className="h-4 w-4 mr-2 text-blue-600" />
                                    Why choose UPI?
                                </h5>
                                <ul className="space-y-2 text-sm text-blue-800">
                                    <li className="flex items-start">
                                        <Check className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                        <span>Zero transaction fees - save 2% compared to cards</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Check className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                        <span>Instant payment confirmation</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Check className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                        <span>Works with all UPI apps</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Security Note */}
                            <div className="flex items-center justify-center text-xs text-gray-500">
                                <Shield className="h-3 w-3 mr-1 text-gray-400" />
                                All payments are secure and encrypted
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-lg">
                        <p className="text-xs text-gray-500 text-center">
                            Your subscription will automatically renew. You can cancel anytime from your account settings.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export { PaymentModal };