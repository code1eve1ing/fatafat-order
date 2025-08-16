// components/ShopkeeperAuthModal.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, Smartphone, Store } from "lucide-react";
import { Link } from "react-router-dom";

// Validation schema
const authSchema = z.object({
  identifier: z.string().min(1, "Required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function ShopkeeperAuth() {
  const [activeTab, setActiveTab] = useState("register");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // TODO: Implement auth API call
      console.log("Auth data:", data);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full sm:w-auto gap-2">
          <Store className="h-4 w-4" /> I'm a Shopkeeper
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            {activeTab === "login" ? "Shopkeeper Login" : "Create Your Shop"}
          </DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
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

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Login
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => setActiveTab("register")}
                  >
                    Create one
                  </button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="register">
            <div className="mt-6 text-center">
              <Link to="/shop/onboarding">
                <Button variant="outline" className="w-full mb-4 gap-2">
                  <Store className="h-4 w-4" />
                  Create Shop Account
                </Button>
              </Link>

              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => setActiveTab("login")}
                >
                  Login
                </button>
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
