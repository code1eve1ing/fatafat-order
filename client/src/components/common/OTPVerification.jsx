import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Mail, Phone, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:5002/api/orders';

export function OTPVerification({ onVerificationComplete, onCancel }) {
    const [step, setStep] = useState('input'); // 'input', 'verify', 'verified'
    const [contactType, setContactType] = useState('email');
    const [identifier, setIdentifier] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    // Countdown timer for resend OTP
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const validateIdentifier = () => {
        if (contactType === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(identifier);
        } else {
            const mobileRegex = /^[6-9]\d{9}$/;
            return mobileRegex.test(identifier);
        }
    };

    const sendOTP = async () => {
        if (!validateIdentifier()) {
            toast.error(contactType === 'email' ? 'Please enter a valid email address' : 'Please enter a valid 10-digit mobile number');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    identifier,
                    type: contactType
                })
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                setStep('verify');
                setCountdown(60); // 60 seconds countdown
            } else {
                toast.error(data.message || 'Failed to send OTP');
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            toast.error('Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const verifyOTP = async () => {
        if (otp.length !== 6) {
            toast.error('Please enter a 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    identifier,
                    otp,
                    type: contactType
                })
            });

            const data = await response.json();

            if (data.success) {
                toast.success('OTP verified successfully!');
                setStep('verified');
                // Pass the verified contact info to parent
                onVerificationComplete({
                    type: contactType,
                    identifier,
                    verified: true
                });
            } else {
                toast.error(data.message || 'Invalid OTP');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            toast.error('Failed to verify OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = () => {
        if (countdown === 0) {
            sendOTP();
        }
    };

    if (step === 'verified') {
        return (
            <Card className="w-full max-w-md mx-auto">
                <CardContent className="pt-6">
                    <div className="text-center">
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Verification Complete!</h3>
                        <p className="text-muted-foreground">
                            Your {contactType} has been verified successfully.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-center">
                    {step === 'input' ? 'Verify Your Contact' : 'Enter OTP'}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {step === 'input' && (
                    <>
                        <div>
                            <Label className="text-base font-medium">Choose verification method:</Label>
                            <RadioGroup
                                value={contactType}
                                onValueChange={setContactType}
                                className="flex gap-6 mt-2"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="email" id="email" />
                                    <Label htmlFor="email" className="flex items-center gap-2 cursor-pointer">
                                        <Mail className="h-4 w-4" />
                                        Email
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="mobile" id="mobile" />
                                    <Label htmlFor="mobile" className="flex items-center gap-2 cursor-pointer">
                                        <Phone className="h-4 w-4" />
                                        Mobile
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div>
                            <Label htmlFor="identifier">
                                {contactType === 'email' ? 'Email Address' : 'Mobile Number'}
                            </Label>
                            <Input
                                id="identifier"
                                type={contactType === 'email' ? 'email' : 'tel'}
                                placeholder={contactType === 'email' ? 'your@email.com' : '9876543210'}
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                className="mt-1"
                            />
                            {contactType === 'mobile' && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    Enter 10-digit mobile number without +91
                                </p>
                            )}
                        </div>
                    </>
                )}

                {step === 'verify' && (
                    <>
                        <div className="text-center">
                            <p className="text-muted-foreground mb-4">
                                We've sent a 6-digit OTP to your {contactType}:
                            </p>
                            <p className="font-medium">{identifier}</p>
                        </div>

                        <div>
                            <Label htmlFor="otp">Enter OTP</Label>
                            <Input
                                id="otp"
                                type="text"
                                placeholder="123456"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                className="mt-1 text-center text-lg tracking-widest"
                                maxLength={6}
                            />
                        </div>

                        <div className="text-center">
                            <Button
                                variant="link"
                                onClick={handleResendOTP}
                                disabled={countdown > 0 || loading}
                                className="text-sm"
                            >
                                {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                            </Button>
                        </div>
                    </>
                )}
            </CardContent>
            <CardFooter className="flex gap-2">
                <Button
                    variant="outline"
                    onClick={onCancel}
                    className="flex-1"
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button
                    onClick={step === 'input' ? sendOTP : verifyOTP}
                    disabled={loading || (step === 'input' && !identifier) || (step === 'verify' && otp.length !== 6)}
                    className="flex-1"
                >
                    {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {step === 'input' ? 'Send OTP' : 'Verify OTP'}
                </Button>
            </CardFooter>
        </Card>
    );
}
