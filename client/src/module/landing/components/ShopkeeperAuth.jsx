// components/ShopkeeperAuthModal.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, Smartphone, Store, Sparkles, Key, Rocket, UserRound } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import Button from "@/components/common/Button";
import { FREE_TRIAL } from "@/lib/constants/user";

// Validation schema
const authSchema = z.object({
  identifier: z.string().min(1, "Required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function ShopkeeperAuth() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("options");
  const { login, loading } = useAuth();


  const form = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    await login(data);
    navigate('/shop/dashboard');
  };

  const handleNavigate = (path) => {
    if (!path) return null;
    navigate(path);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full sm:w-auto gap-2">
          <Store className="h-4 w-4" /> I'm a Shopkeeper
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            {activeView === "login"
              ? "Shopkeeper Login"
              : activeView === "register"
                ? "Create Your Shop"
                : activeView === "trial"
                  ? "Start Free Trial"
                  : "Begin Your Journey"}
          </DialogTitle>
        </DialogHeader>

        {activeView === "options" ? (
          <div className="grid gap-4 py-4">
            {/* Login Card */}
            <div
              className="border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => setActiveView("login")}
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Key className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Existing Shopkeeper</h3>
                  <ul className="text-sm text-muted-foreground list-disc list-inside mt-1 space-y-1">
                    <li>Access your existing shop</li>
                    <li>View complete analytics</li>
                    <li>Manage products & orders</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Register Card */}
            <div
              className="border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => setActiveView("register")}
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Store className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Create New Shop</h3>
                  <ul className="text-sm text-muted-foreground list-disc list-inside mt-1 space-y-1">
                    <li>Complete business visibility</li>
                    <li>Direct customer access</li>
                    <li>Flexible fulfillment</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Free Trial Card */}
            <div
              className="border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => setActiveView("trial")}
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Rocket className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Free Trial</h3>
                  <ul className="text-sm text-muted-foreground list-disc list-inside mt-1 space-y-1">
                    <li>Basic analytics</li>
                    <li>Single-device access</li>
                    <li>Demo mode</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : activeView === "login" ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email, Mobile or Shop No.</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="Enter ..." {...field} />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <Smartphone className="h-4 w-4 text-muted-foreground" />
                          <Store className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" loading={loading}>
                Login
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => setActiveView("options")}
                >
                  ← Back to options
                </button>
              </div>
            </form>
          </Form>
        ) : activeView === "register" ? (
          <div className="mt-6 space-y-4">
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <h3 className="font-medium flex items-center gap-2">
                <Store className="h-4 w-4 text-primary" />
                Full Shop Account Benefits:
              </h3>
              <ul className="mt-2 text-sm space-y-1 text-muted-foreground list-disc list-inside">
                <li><span className="font-medium">Complete business visibility</span> <br /> Advanced analytics with real-time sales tracking</li>
                <li><span className="font-medium">Direct customer access</span> <br /> Customers can browse and order anytime from their devices</li>
                <li><span className="font-medium">Flexible fulfillment</span> <br /> Support for takeaway, delivery, and in-store pickup</li>
                {/* <li><span className="font-medium">Team collaboration</span> - Add staff members with role-based permissions</li> */}
              </ul>
            </div>

            <Button
              className="w-full gap-2"
              onClick={() => navigate('/shop/onboarding')}
            >
              <Store className="h-4 w-4" />
              Continue to Registration
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => setActiveView("options")}
              >
                ← Back to options
              </button>
            </div>
          </div>
        ) : (
          // Trial View
          <div className="mt-6 space-y-4">
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <h3 className="font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Trial Features:
              </h3>
              <ul className="mt-2 text-sm space-y-1 text-muted-foreground list-disc list-inside">
                <li><span className="font-medium">Basic analytics</span> <br /> View essential sales insights</li>
                <li><span className="font-medium">Single-device access</span> <br /> Use on one device at a time (data can be lost on clearing cache)</li>
                <li><span className="font-medium">Demo mode</span> <br /> Customers won't see your trial shop</li>
                <li><span className="font-medium">No payment needed</span> <br /> Start instantly without commitment</li>
              </ul>
            </div>

            {/* <Button onClick={() => handleNavigate('/shop/onboarding?free-trial=true')} className="w-full gap-2">
              <Rocket className="h-4 w-4" />
              Create a Free Account
            </Button> */}

            <Button onClick={() => {
              localStorage.setItem('accountType', FREE_TRIAL);
              handleNavigate('/shop/dashboard')
            }} className="w-full gap-2">
              <Rocket className="h-4 w-4" />
              Start Free Trial
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => setActiveView("options")}
              >
                ← Back to options
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}