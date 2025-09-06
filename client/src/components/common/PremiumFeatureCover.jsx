import React, { useState, useEffect } from "react";
import { Crown, X, Check, Star, Loader2, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { SubscriptionModal } from "./SubscriptionModal";
import { PaymentModal } from "./PaymentModal";
const plans = [
  {
    name: "Basic",
    price: "₹10",
    period: "month",
    popular: false,
    features: [

      // "Customer Management (Basic)",
      // "Notifications & Alerts",
    ]
  },
  {
    name: "Premium",
    price: "₹50",
    period: "month",
    popular: true,
    features: [

    ]
  },
  {
    name: "Ultimate",
    price: "₹1,499",
    period: "month",
    popular: false,
    features: [
      "All Professional features",
      "Multi-store management",
      "API access",
      "Dedicated account manager",
      "Custom integrations",
      "24/7 phone support"
    ]
  }
];


// Example usage component
const PremiumFeatureCover = ({ children, className, }) => {
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setIsSubscriptionModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  const onClick = () => {
    setIsSubscriptionModalOpen(true);
  };

  return (
    <div className={className + " relative overflow-hidden"}>
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        onSelectPlan={handleSelectPlan}
      />
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false)
          setIsSubscriptionModalOpen(true)
        }}
        selectedPlan={selectedPlan}
      />
      {children}
      <div
        className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-cyan-50/40 to-gray-300/40 backdrop-blur-[1.2px] flex items-center justify-center cursor-pointer"
        onClick={onClick}
      >
        <div className="p-1 rounded-full bg-white outline-1 outline-cyan-500 backdrop-blur-[1.2px]">
          <Crown className="text-pink-500" size={10} />
        </div>
      </div>
    </div>
  );
};

export default PremiumFeatureCover;
export { PaymentModal };