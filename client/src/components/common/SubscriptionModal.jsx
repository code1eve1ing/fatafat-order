import React, { useState } from "react";
import { X, Check, Star, Shield, Zap, Globe, Users, TrendingUp, CreditCard, Smartphone, Rocket, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ToolTip from "./ToolTip";

const SubscriptionModal = ({ isOpen, onClose, onSelectPlan }) => {
    const [billingPeriod, setBillingPeriod] = useState("monthly");

    const plans = [
        {
            name: "Starter",
            price: { monthly: "12", yearly: "120" },
            popular: false,
            features: [
                { tag: "Online Shop" },
                { tag: "Chat with Customer" },
                { tag: "Track Orders History" },
                { tag: "Accept Online Orders ", info: "0.04% Charge Applies on Online Payment)" },
                { tag: "Sales Reports" },
                { tag: "Export Data (CSV/Excel)" }
            ],
        },
        {
            name: "Professional",
            price: { monthly: "60", yearly: "600" },
            popular: true,
            features: [
                { tag: "Basic Plan Features" },
                { tag: "Live Whatsapp Alerts", info: "150 Free Alerts/Month On Orders - Later ₹0.150 for each alert" },
                { tag: "Customize Online Shop" },
                { tag: "50 Image Uploads", info: "Additional Charges For More Uploads" }
            ],
        },

    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:rounded-lg [&>button:first-of-type]:hidden">
                <div className="bg-white">
                    {/* Header */}
                    <DialogHeader showCloseButton={false} className="px-6 py-5 border-b border-gray-100">
                        <div>
                            <DialogTitle className="flex items-cente text-gray-900">
                                <Rocket className="mr-2 animate-bounce" size={20} /> Business Booster
                            </DialogTitle>
                            <DialogDescription className="mt-1 text-gray-500 text-left">
                                Choose the right plan for your business needs
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    {/* Billing Toggle */}
                    <div className="px-6 pt-4 pb-6 bg-gray-50 border-b border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            {/* <span className="text-sm font-medium text-gray-700 mb-2 sm:mb-0">
                                Billing cycle
                            </span> */}
                            <Tabs
                                value={billingPeriod}
                                onValueChange={setBillingPeriod}
                                className="w-full"
                            >
                                <TabsList className="grid grid-cols-2 w-full">
                                    <TabsTrigger value="monthly" className="text-sm">
                                        Monthly
                                    </TabsTrigger>
                                    <TabsTrigger value="yearly" className="text-sm relative">
                                        Yearly <span className="ml-1 text-xs text-green-600 absolute -bottom-5 left-[50%] translate-x-[-50%]">Save Upto 20%</span>
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </div>

                    {/* Plans */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            {plans.map((plan, index) => (
                                <div
                                    key={index}
                                    className={`relative rounded-lg border bg-card p-5 h-full flex flex-col ${plan.popular
                                        ? "border-blue-300 ring-1 ring-blue-100 shadow-sm"
                                        : "border-gray-200"
                                        }`}
                                >
                                    {plan.popular && (
                                        <div className="absolute top-[1.42rem] right-0 transform -translate-x-1/2">
                                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200 px-2 py-1 text-xs">
                                                <Star className="h-3 w-3 fill-blue-500 text-blue-500" />
                                                {/* {plan.badge} */}
                                            </Badge>
                                        </div>
                                    )}
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h3>

                                    <div className="mb-3">
                                        <div className="flex items-baseline">
                                            <span className="text-3xl font-bold text-gray-900">
                                                ₹{billingPeriod === "monthly" ? plan.price.monthly : plan.price.yearly}
                                            </span>
                                            <span className="text-gray-500 ml-1">
                                                /{billingPeriod === "monthly" ? "month" : "year"}
                                            </span>
                                        </div>
                                        {billingPeriod === "yearly" && (
                                            <div className="flex items-center mt-1">
                                                <span className="text-sm text-gray-400 line-through mr-2">
                                                    ₹{Number(plan.price.monthly) * 12}
                                                </span>
                                                <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">
                                                    Save {(((Number(plan.price.monthly) * 12) - Number(plan.price.yearly)) / (Number(plan.price.monthly) * 12) * 100).toFixed(2)}%
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <ul className="space-y-3 mb-6 flex-grow">
                                        {plan.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-start">
                                                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                                <span className="text-sm text-gray-700">{feature.tag}</span> {
                                                    feature.info && (
                                                        <ToolTip type="Info" text={feature.info} />
                                                    )
                                                }
                                            </li>
                                        ))}
                                    </ul>

                                    <Button
                                        className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-900 hover:bg-gray-800"}`}
                                        onClick={() => onSelectPlan(plan)}
                                    >
                                        Get Started
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {/* Included in all plans */}
                        {/* <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                                <Shield className="h-5 w-5 text-blue-500 mr-2" />
                                Included in every plan:
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {includedInAll.map((item, index) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <div key={index} className="flex items-center text-sm text-gray-600">
                                            <IconComponent className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                                            <span>{item.text}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div> */}

                        {/* Payment note */}
                        <div className="mt-6 text-center">
                            <p className="text-xs text-gray-500 flex items-center justify-center">
                                {/* <Smartphone className="h-3 w-3 mr-1 text-gray-400" /> */}
                                All payments processed securely via Razorpay.
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export { SubscriptionModal };