import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Mail, Smartphone, Key, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";

export function LoginRegisterPopup({ open, onOpenChange, onSuccess }) {
    const [activeTab, setActiveTab] = useState("login");

    const handleLogin = (e) => {
        e.preventDefault();
        // In a real app, this would handle login
        onSuccess();
        onOpenChange(false);
    };

    const handleRegister = (e) => {
        e.preventDefault();
        // In a real app, this would handle registration
        onSuccess();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {activeTab === "login" ? "Login to Your Account" : "Create an Account"}
                    </DialogTitle>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="login-identifier">Email or Phone</Label>
                                <div className="relative">
                                    <Input
                                        id="login-identifier"
                                        placeholder="Enter your email or phone"
                                        required
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="login-password">Password</Label>
                                <Input
                                    id="login-password"
                                    type="password"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full gap-2">
                                <Key className="h-4 w-4" />
                                Login
                            </Button>
                        </form>
                    </TabsContent>

                    <TabsContent value="register">
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first-name">First Name</Label>
                                    <Input id="first-name" placeholder="John" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last-name">Last Name</Label>
                                    <Input id="last-name" placeholder="Doe" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+1 (555) 123-4567"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Create a password"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    placeholder="Confirm your password"
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full gap-2">
                                <UserPlus className="h-4 w-4" />
                                Create Account
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                    <p>
                        {activeTab === "login"
                            ? "Don't have an account? "
                            : "Already have an account? "}
                        <button
                            type="button"
                            className="text-primary hover:underline"
                            onClick={() => setActiveTab(activeTab === "login" ? "register" : "login")}
                        >
                            {activeTab === "login" ? "Register" : "Login"}
                        </button>
                    </p>
                </div>

                <div className="mt-4 text-center text-sm text-muted-foreground">
                    <p>
                        By continuing, you agree to our{" "}
                        <a href="#" className="text-primary hover:underline">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-primary hover:underline">
                            Privacy Policy
                        </a>
                        .
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}