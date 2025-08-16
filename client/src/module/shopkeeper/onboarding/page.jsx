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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "lucide-react";

// Validation schema
const formSchema = z.object({
  shop_name: z.string().min(2, "Shop name is required"),
  shop_owner_name: z.string().min(2, "Owner name is required"),
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
});

export function ShopOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [touchedFields, setTouchedFields] = useState(new Set());

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange", // Validate on change
    defaultValues: {
      email: "",
      shop_category: "",
      mobile: "",
      password: "",
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

  const shopCategories = [
    "Grocery",
    "Pharmacy",
    "Restaurant",
    "Clothing",
    "Electronics",
    "Stationery",
    "Hardware",
    "Other",
  ];

  const steps = [
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
      title: "Payment",
      description: "Complete your registration",
    },
  ];

  // Clear errors when moving between steps
  useEffect(() => {
    form.clearErrors();
  }, [currentStep]);

  const nextStep = async () => {
    const currentFields = steps[currentStep - 1].fields;
    const result = await trigger(currentFields);

    if (result) {
      if (currentStep === steps.length - 1) {
        await handleSubmit();
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const data = form.getValues();
      console.log("Form data:", data);
      setCurrentStep(currentStep + 1);

      setPaymentSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = async () => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Payment successful");
      window.location.href = "/shop/dashboard";
    } finally {
      setIsSubmitting(false);
    }
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
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex flex-col items-center">
            <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Store className="text-primary h-8 w-8" />
            </div>
            <div className="flex space-x-2 mb-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-8 rounded-full ${
                    currentStep > index + 1
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
          {currentStep <= steps.length - 1 ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(nextStep)}
                className="space-y-4"
              >
                {/* Step 1: Shop Information */}
                {currentStep === 1 && (
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
                              {shopCategories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
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
                {currentStep === 2 && (
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
                {currentStep === 3 && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Create password (min 6 characters)"
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
          {currentStep > 1 && currentStep <= steps.length - 1 ? (
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

          {currentStep <= steps.length - 1 ? (
            <Button
              onClick={nextStep}
              className="gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {currentStep === steps.length - 1 ? "Submit" : "Next"}
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handlePayment}
              className="w-full gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Pay ₹50 & Complete Registration"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
