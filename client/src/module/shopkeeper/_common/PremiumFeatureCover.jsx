import React, { useState, useEffect } from "react";
import { Crown, Check, X, Zap, Shield, Rocket } from "lucide-react";
import { SubscriptionModal } from "./SubscriptionModal";
import { PaymentModal } from "./PaymentModal";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FREE_TRIAL } from "@/lib/constants/user";
import { useNavigate, useSearchParams } from "react-router-dom";

const FreeTrialModal = ({ isOpen, onClose, onRegisterShop }) => {
  const features = [
    "Create unlimited products",
    "Manage inventory in real-time",
    "Accept online orders",
    "Track sales and analytics",
    "Customer management tools"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 sm:rounded-lg [&>button:first-of-type]:hidden">
        <div className="bg-white">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="flex items-center text-gray-900">
                  <Rocket className="mr-2 text-blue-500" size={20} />
                  Unlock Premium Features
                </DialogTitle>
                <DialogDescription className="mt-1 text-gray-500 text-left">
                  Register your shop to get full access to all features
                </DialogDescription>
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
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
              <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                <Shield className="h-4 w-4 mr-2 text-blue-600" />
                Premium Features (Purchase Required!)
              </h4>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full h-11 text-base font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                onClick={onRegisterShop}
              >
                <Zap className="h-4 w-4 mr-2" />
                Register Your Shop to Get Started
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Already registered? Complete your shop registration to unlock all features
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// autoShowSubscriptonModal should be only one per page...
const PremiumFeatureCover = ({ children, className, autoShowSubscriptonModal = false }) => {
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isFreeTrialModalOpen, setIsFreeTrialModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [accountType, setAccountType] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if user is on FREE_TRIAL
    const accountType = localStorage.getItem('accountType');
    setAccountType(accountType || '');
  }, []);

  const handleSelectPlan = (plan, billingPeriod) => {
    setSelectedPlan({ ...plan, billingPeriod });
    setIsSubscriptionModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  const onClick = () => {
    if (accountType === FREE_TRIAL) {
      setIsFreeTrialModalOpen(true);
    } else {
      setIsSubscriptionModalOpen(true);
    }
  };

  const handleRegisterShop = () => {
    // Redirect to shop registration page
    navigate('/shop/onboarding?redirect-from=' + window.location.pathname);
  };

  useEffect(() => {
    if (autoShowSubscriptonModal && searchParams.get('show-subscription-plan') === 'true') {
      setIsSubscriptionModalOpen(true);
    }
  }, [searchParams, autoShowSubscriptonModal])

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
          setIsPaymentModalOpen(false);
          setIsSubscriptionModalOpen(true);
        }}
        selectedPlan={selectedPlan}
      />

      <FreeTrialModal
        isOpen={isFreeTrialModalOpen}
        onClose={() => setIsFreeTrialModalOpen(false)}
        onRegisterShop={handleRegisterShop}
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