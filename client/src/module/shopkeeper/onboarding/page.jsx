// components/ShopOnboardingWizard.jsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Button from "@/components/common/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ToolTip from "@/components/common/ToolTip";
import {
  Loader2,
  Store,
  User,
  Phone,
  Mail,
  Lock,
  IndianRupee,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Check,
  Star,
  Rocket,
} from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import useShopStore from "@/store/shop";

// Validation schema
const formSchema = z.object({
  shop_name: z.string().min(1, "Shop name is required"),
  shop_owner_name: z.string().min(1, "Owner name is required"),
  shop_category: z.string().min(1, "Shop category is required"),
  mobile: z
    .string()
    .min(10, "Mobile must be 10 digits")
    .max(10, "Mobile must be 10 digits")
    .regex(/^[0-9]+$/, "Must be a valid mobile number"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password too long"),
  confirm_password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password too long")
  ,

});

export function ShopOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [touchedFields, setTouchedFields] = useState(new Set());
  const [searchParams] = useSearchParams();
  const freeTrial = searchParams.get("free-trial");
  const selectedPlan = searchParams.get("selected-plan");
  const createShop = searchParams.get("create-shop");
  const [billingPeriod, setBillingPeriod] = useState("monthly");
  const [selectedSubscriptionPlan, setSelectedSubscriptionPlan] = useState(null);
  const { categories } = useShopStore();
  const { signup, loading } = useAuth();

  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onSubmit", // Validate on change
    defaultValues: {
      email: "",
      shop_category: "",
      mobile: "",
      password: "",
      confirm_password: "",
      shop_name: "",
      shop_owner_name: "",
    },
  });

  const {
    trigger,
    formState: { errors },
  } = form;

  // Track touched fields
  const handleInputChange = (fieldName) => (e) => {
    if (!touchedFields.has(fieldName)) {
      setTouchedFields(new Set(touchedFields).add(fieldName));
    }
    // Clear error when user starts typing
    if (errors[fieldName]) {
      trigger(fieldName);
    }
  };

  const subscriptionPlans = [
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

  const PLAN_PAGE_TITLE = "Business Booster"
  const baseSteps = [
    {
      title: "Shop Information",
      description: "Tell us about your shop",
      fields: ["shop_name", "shop_owner_name", "shop_category"],
    },
    {
      title: "Contact Details",
      description: "How can we reach you?",
      fields: ["mobile", "email"],
    },
    {
      title: "Account Security",
      description: "Create your login credentials",
      fields: ["password"],
    },
    {
      title: PLAN_PAGE_TITLE,
      description: "Choose your business plan",
      fields: [],
    },
    {
      title: "Payment",
      description: "Complete your registration",
    },
  ];

  // Apply conditional logic based on search parameters
  let steps = [...baseSteps];

  if (freeTrial) {
    steps.shift(); // Remove shop information step
    steps.pop(); // Remove payment step
    steps = steps.filter(step => step.title !== PLAN_PAGE_TITLE); // Remove subscription step
  } else if (selectedPlan && createShop) {
    // Both parameters have values - remove subscription step
    steps = steps.filter(step => step.title !== PLAN_PAGE_TITLE);
  } else if (selectedPlan && !createShop) {
    // Only selected-plan has value - show only payment step
    steps = [{
      title: "Payment",
      description: "Complete your registration",
    }];
  }

  // Clear errors when moving between steps
  useEffect(() => {
    form.clearErrors();
  }, [currentStep]);

  const nextStep = async () => {
    const currentFields = steps[currentStep - 1].fields;

    // Skip validation for subscription step as it has no form fields
    if (steps[currentStep - 1].title !== PLAN_PAGE_TITLE && currentFields.length > 0) {
      const result = await trigger(currentFields);
      if (!result) return;
    }

    // Additional validation for password matching in Account Security step
    if (steps[currentStep - 1].title === "Account Security") {
      const { password, confirm_password } = form.getValues();
      if (password && password !== confirm_password) {
        form.setError('confirm_password', {
          type: 'manual',
          message: 'Passwords do not match'
        });
        return;
      }
      await createNewShopAndRegisterUser();
      // setCurrentStep(currentStep + 1);
    }

    // Validation for subscription step
    if (steps[currentStep - 1].title === PLAN_PAGE_TITLE) {
      if (!selectedSubscriptionPlan) {
        alert("Please select a subscription plan to continue.");
        return;
      }
    }

    setCurrentStep(currentStep + 1);

  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const createNewShopAndRegisterUser = async () => {
    const transformFormData = (formData) => {
      return {
        user_name: formData.shop_owner_name,
        shop_name: formData.shop_name,
        shop_category_id: formData.shop_category,
        mobile: formData.mobile,
        email: formData.email,
        password: formData.password
      };
    };
    const data = form.getValues();
    const apiData = transformFormData(data);
    await signup(apiData);
    setCurrentStep(currentStep + 1)
  };

  const handlePayment = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    window.location.href = "/shop/dashboard";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-4 left-4 md:top-6 md:left-6"
        onClick={() => (window.location.href = "/")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Button>
      <Card className="w-full max-w-md my-12">
        <CardHeader className="text-center">
          <div className="mx-auto flex flex-col items-center">
            <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Store className="text-primary h-8 w-8" />
            </div>
            <div className="flex space-x-2 mb-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-8 rounded-full ${currentStep > index + 1
                    ? "bg-primary"
                    : currentStep === index + 1
                      ? "bg-primary/50"
                      : "bg-gray-200"
                    }`}
                />
              ))}
            </div>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>
              {steps[currentStep - 1].description}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {(currentStep <= steps.length - 1) || freeTrial ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(nextStep)}
                className="space-y-4"
              >
                {/* Step 1: Shop Information */}
                {steps[currentStep - 1].title === "Shop Information" && (
                  <>
                    <FormField
                      control={form.control}
                      name="shop_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shop Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Enter shop name"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleInputChange("shop_name")(e);
                                }}
                              />
                              <Store className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shop_owner_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Owner Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Enter owner name"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleInputChange("shop_owner_name")(e);
                                }}
                              />
                              <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shop_category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shop Category</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              handleInputChange("shop_category")();
                              trigger("shop_category");
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories?.map((category) => (
                                <SelectItem key={category._id} value={category._id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* Step 2: Contact Details */}
                {steps[currentStep - 1].title === "Contact Details" && (
                  <>
                    <FormField
                      control={form.control}
                      name="mobile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Enter 10-digit mobile number"
                                {...field}
                                type="tel"
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleInputChange("mobile")(e);
                                }}
                              />
                              <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email (Optional)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Enter email address"
                                {...field}
                                type="email"
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleInputChange("email")(e);
                                }}
                              />
                              <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* Step 3: Account Security */}
                {steps[currentStep - 1].title === "Account Security" && (
                  <>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Create password"
                                {...field}
                                type="password"
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleInputChange("password")(e);
                                }}
                              />
                              <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirm_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Confirm password"
                                {...field}
                                type="password"
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleInputChange("confirm_password")(e);
                                }}
                              />
                              <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* Step 4: Subscription */}
                {steps[currentStep - 1].title === PLAN_PAGE_TITLE && (
                  <div className="space-y-6">
                    {/* Header */}
                    {/* <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Rocket className="mr-2 animate-bounce" size={20} />
                        <span className="text-lg font-semibold">Business Booster</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Choose the right plan for your business needs
                      </p>
                    </div> */}

                    {/* Billing Toggle */}
                    <div className="bg-gray-50 p-4 rounded-lg border">
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

                    {/* Plans */}
                    <div className="space-y-4">
                      {subscriptionPlans.map((plan, index) => (
                        <div
                          key={index}
                          className={`relative rounded-lg border p-4 cursor-pointer transition-all ${selectedSubscriptionPlan?.name === plan.name
                            ? "border-blue-300 ring-1 ring-blue-100 shadow-sm bg-blue-50"
                            : plan.popular
                              ? "border-blue-300 ring-1 ring-blue-100 shadow-sm"
                              : "border-gray-200 hover:border-gray-300"
                            }`}
                          onClick={() => setSelectedSubscriptionPlan(plan)}
                        >
                          {plan.popular && (
                            <div className="absolute top-4 right-4">
                              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200 px-2 py-1 text-xs">
                                <Star className="h-3 w-3 fill-blue-500 text-blue-500" />
                              </Badge>
                            </div>
                          )}

                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h3>

                              <div className="mb-3">
                                <div className="flex items-baseline">
                                  <span className="text-2xl font-bold text-gray-900">
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

                              <ul className="space-y-2">
                                {plan.features.map((feature, featureIndex) => (
                                  <li key={featureIndex} className="flex items-start">
                                    <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-gray-700">{feature.tag}</span>
                                    {feature.info && (
                                      <ToolTip type="Info" text={feature.info} />
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="ml-4">
                              <div className={`w-4 h-4 rounded-full border-2 ${selectedSubscriptionPlan?.name === plan.name
                                ? "bg-blue-600 border-blue-600"
                                : "border-gray-300"
                                }`}>
                                {selectedSubscriptionPlan?.name === plan.name && (
                                  <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Payment note */}
                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        All payments processed securely via Razorpay.
                      </p>
                    </div>
                  </div>
                )}
              </form>
            </Form>
          ) : (
            /* Step 4: Payment */
            <div className="space-y-6">
              <div className="bg-primary/10 p-6 rounded-lg text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <IndianRupee className="h-6 w-6 text-primary" />
                  <span className="text-2xl font-bold">50</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  One-time registration fee
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Payment Methods</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="gap-2">
                    UPI
                  </Button>
                  <Button variant="outline" className="gap-2">
                    Card
                  </Button>
                  <Button variant="outline" className="gap-2">
                    Net Banking
                  </Button>
                  <Button variant="outline" className="gap-2">
                    Wallet
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          {currentStep > 1 && (steps[currentStep - 1].title !== "Payment" || (selectedPlan && !createShop)) ? (
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" /> Previous
            </Button>
          ) : (
            <div></div>
          )}

          {/* {steps[currentStep - 1].title !== "Payment" ? ( */}
          <Button
            onClick={nextStep}
            className="gap-2"
            loading={loading}
          >
            <>
              {steps[currentStep - 1].title === "Account Security" ? "Submit" :
                steps[currentStep - 1].title === PLAN_PAGE_TITLE ? "Continue with Plan" : "Next"}
              {steps[currentStep - 1].title !== "Account Security" ? <ChevronRight className="h-4 w-4" /> :
                steps[currentStep - 1].title === "Payment" ? "Pay ₹50 & Complete Registration" : null}
            </>
          </Button>
          {/* ) : (
            <Button
              onClick={handlePayment}
              className="w-full gap-2"
              loading={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Pay ₹50 & Complete Registration"
              )}
            </Button>
          )} */}
        </CardFooter>
      </Card>
    </div>
  );
}
