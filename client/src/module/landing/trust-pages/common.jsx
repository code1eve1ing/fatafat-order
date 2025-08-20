import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageCircle, Mail, MapPin, Phone, Shield, RefreshCw, Heart, FileText, Scale, AlertTriangle, BookOpen } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function AboutPage() {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Navigation - Same as landing page */}
            <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold">
                        FO
                    </div>
                    <span className="text-xl font-bold text-primary">Fatafat Order</span>
                </div>
                <div className="flex space-x-4">
                    <Button variant="outline" onClick={() => navigate("/")}>Back to Home</Button>
                </div>
            </nav>

            {/* About Content */}
            <section className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-center mb-8">About FatafatOrder</h1>

                    <Card className="mb-12">
                        <CardHeader>
                            <CardTitle>Our Story</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p>
                                FatafatOrder was born from a simple observation: small local shopkeepers were struggling to compete
                                in an increasingly digital world, while customers wanted the convenience of online shopping without
                                the complexity of creating accounts and remembering passwords.
                            </p>
                            <p>
                                Founded in 2023, our platform began as a side project to help a few neighborhood stores in our
                                community establish an online presence. We noticed that many shop owners had incredible products
                                but lacked the technical skills or resources to build websites or manage complex e-commerce systems.
                            </p>
                            <p>
                                The name "Fatafat" means "quickly" in several South Asian languages, representing our commitment
                                to creating a fast, simple solution for both shopkeepers and customers.
                            </p>
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <Card>
                            <CardHeader>
                                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                                    <Heart className="text-primary" />
                                </div>
                                <CardTitle>Our Mission</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>
                                    To democratize e-commerce for small businesses by providing an intuitive, accessible platform
                                    that requires no technical knowledge. We believe every shopkeeper deserves the opportunity to
                                    thrive in the digital economy.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                                    <Shield className="text-primary" />
                                </div>
                                <CardTitle>Our Values</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 list-disc list-inside">
                                    <li>Simplicity in design and user experience</li>
                                    <li>Accessibility for all technical skill levels</li>
                                    <li>Privacy and data protection</li>
                                    <li>Supporting local businesses and communities</li>
                                    <li>Continuous improvement based on user feedback</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Why We Exist</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p>
                                In today's fast-paced world, we noticed two significant problems:
                            </p>
                            <ol className="list-decimal list-inside space-y-2 pl-4">
                                <li className="font-medium">Small shopkeepers were being left behind in the digital revolution</li>
                                <li className="font-medium">Customers hated the friction of account creation for simple purchases</li>
                            </ol>
                            <p>
                                FatafatOrder solves both issues with a unique approach that allows customers to shop without accounts
                                while giving shopkeepers an easy way to manage their online presence. Our device-based identification
                                system means customers can order seamlessly while shopkeepers still get the data they need to manage orders.
                            </p>
                            <p>
                                We're more than just a platform—we're a bridge between traditional retail and the digital future,
                                ensuring that small businesses can compete and thrive.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Footer - Same as landing page */}
            <footer className="bg-gray-100 py-12 mt-12">
                <div className="container mx-auto px-4">
                    <div className="text-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()} FatafatOrder. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

export function ContactPage() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Form submission logic would go here
        console.log("Form submitted:", formData);
        alert("Thank you for your message. We'll get back to you soon!");
        setFormData({ name: "", email: "", subject: "", message: "" });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Navigation */}
            <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold">
                        FO
                    </div>
                    <span className="text-xl font-bold text-primary">Fatafat Order</span>
                </div>
                <div className="flex space-x-4">
                    <Button variant="outline" onClick={() => navigate("/")}>Back to Home</Button>
                </div>
            </nav>

            {/* Contact Content */}
            <section className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
                    <p className="text-center text-muted-foreground mb-12">
                        Have questions or need support? We're here to help you.
                    </p>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>

                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                                        <Mail className="text-primary h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Email Us</h3>
                                        <p className="text-muted-foreground">support@fatafatorder.com</p>
                                        <p className="text-muted-foreground">business@fatafatorder.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                                        <Phone className="text-primary h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Call Us</h3>
                                        <p className="text-muted-foreground">+1 (555) 123-4567</p>
                                        <p className="text-muted-foreground">Mon-Fri, 9am-5pm EST</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                                        <MessageCircle className="text-primary h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">WhatsApp</h3>
                                        <p className="text-muted-foreground">
                                            <a href="https://wa.me/15551234567" className="text-primary hover:underline">
                                                Message us on WhatsApp
                                            </a>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                                        <MapPin className="text-primary h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Visit Us</h3>
                                        <p className="text-muted-foreground">
                                            123 Commerce Street<br />
                                            Business District<br />
                                            New York, NY 10001
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Send us a Message</CardTitle>
                                    <CardDescription>
                                        Fill out the form below and we'll get back to you as soon as possible.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                placeholder="Your name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="your.email@example.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="subject">Subject</Label>
                                            <Input
                                                id="subject"
                                                name="subject"
                                                placeholder="What is this regarding?"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="message">Message</Label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                placeholder="Type your message here..."
                                                rows={5}
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <Button type="submit" className="w-full">
                                            Send Message
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-100 py-12 mt-12">
                <div className="container mx-auto px-4">
                    <div className="text-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()} FatafatOrder. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

export function PrivacyPolicyPage() {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Navigation */}
            <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold">
                        FO
                    </div>
                    <span className="text-xl font-bold text-primary">Fatafat Order</span>
                </div>
                <div className="flex space-x-4">
                    <Button variant="outline" onClick={() => navigate("/")}>Back to Home</Button>
                </div>
            </nav>

            {/* Privacy Policy Content */}
            <section className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-center mb-8">Privacy Policy</h1>
                    <p className="text-center text-muted-foreground mb-12">Last updated: {new Date().toLocaleDateString()}</p>

                    <div className="prose prose-sm max-w-none">
                        <Card className="mb-8">
                            <CardContent className="pt-6">
                                <p className="mb-4">
                                    At FatafatOrder, we take your privacy seriously. This Privacy Policy describes how we collect, use,
                                    and share your personal information when you use our platform.
                                </p>
                            </CardContent>
                        </Card>

                        <h2>Information We Collect</h2>
                        <p>
                            We collect information you provide directly to us, such as when you create an account, complete a transaction,
                            or contact us for support. This may include:
                        </p>
                        <ul>
                            <li>Contact information (name, email address, phone number)</li>
                            <li>Business information (shop name, address, products)</li>
                            <li>Transaction information</li>
                            <li>Device information (IP address, browser type, device identifiers)</li>
                        </ul>

                        <h2>How We Use Your Information</h2>
                        <p>We use the information we collect to:</p>
                        <ul>
                            <li>Provide, maintain, and improve our services</li>
                            <li>Process transactions and send related information</li>
                            <li>Send you technical notices, updates, and support messages</li>
                            <li>Respond to your comments, questions, and requests</li>
                            <li>Monitor and analyze trends, usage, and activities</li>
                            <li>Detect, investigate, and prevent fraudulent transactions</li>
                        </ul>

                        <h2>Cookies and Similar Technologies</h2>
                        <p>
                            We use cookies and similar technologies to track activity on our platform and hold certain information.
                            Cookies are files with a small amount of data that may include an anonymous unique identifier.
                        </p>
                        <p>
                            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However,
                            if you do not accept cookies, you may not be able to use some portions of our service.
                        </p>

                        <h2>Google AdSense</h2>
                        <p>
                            We use Google AdSense to display advertisements on our platform. Google uses cookies to serve ads based on
                            a user's prior visits to our website or other websites.
                        </p>
                        <p>
                            Google's use of advertising cookies enables it and its partners to serve ads to our users based on their
                            visit to our sites and/or other sites on the Internet.
                        </p>
                        <p>
                            Users may opt out of personalized advertising by visiting{" "}
                            <a href="https://www.google.com/settings/ads" className="text-primary hover:underline">
                                Google Ads Settings
                            </a>.
                        </p>

                        <h2>Data Retention</h2>
                        <p>
                            We will retain your personal information only for as long as is necessary for the purposes set out in this
                            Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal
                            obligations, resolve disputes, and enforce our policies.
                        </p>

                        <h2>Your Rights</h2>
                        <p>Depending on your location, you may have the right to:</p>
                        <ul>
                            <li>Access and receive a copy of your personal information</li>
                            <li>Rectify or update your personal information</li>
                            <li>Delete your personal information</li>
                            <li>Restrict or object to our processing of your personal information</li>
                            <li>Data portability</li>
                        </ul>

                        <h2>Changes to This Privacy Policy</h2>
                        <p>
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
                            Privacy Policy on this page and updating the "Last updated" date.
                        </p>

                        <h2>Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at{" "}
                            <a href="mailto:privacy@fatafatorder.com" className="text-primary hover:underline">
                                privacy@fatafatorder.com
                            </a>.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-100 py-12 mt-12">
                <div className="container mx-auto px-4">
                    <div className="text-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()} FatafatOrder. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

export function RefundPolicyPage() {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Navigation */}
            <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold">
                        FO
                    </div>
                    <span className="text-xl font-bold text-primary">Fatafat Order</span>
                </div>
                <div className="flex space-x-4">
                    <Button variant="outline" onClick={() => navigate("/")}>Back to Home</Button>
                </div>
            </nav>

            {/* Refund Policy Content */}
            <section className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-center mb-8">Refund & Return Policy</h1>
                    <p className="text-center text-muted-foreground mb-12">Last updated: {new Date().toLocaleDateString()}</p>

                    <div className="prose prose-sm max-w-none">
                        <Card className="mb-8">
                            <CardContent className="pt-6">
                                <p>
                                    At FatafatOrder, we strive to ensure customer satisfaction. However, please note that we act as a
                                    platform connecting shopkeepers and customers. Therefore, all refund and return requests are handled
                                    by the individual shopkeepers.
                                </p>
                            </CardContent>
                        </Card>

                        <h2>General Policy</h2>
                        <p>
                            Since FatafatOrder is a platform that enables transactions between customers and shopkeepers, the refund
                            and return policies are set by each individual shopkeeper. We encourage customers to review the specific
                            policies of each shop before making a purchase.
                        </p>

                        <h2>Digital Products and Services</h2>
                        <p>
                            For digital products or services purchased through our platform (such as subscription plans for shopkeepers),
                            we offer a 14-day money-back guarantee from the date of purchase if you are not satisfied with our service.
                            To request a refund, please contact us at{" "}
                            <a href="mailto:support@fatafatorder.com" className="text-primary hover:underline">
                                support@fatafatorder.com
                            </a>.
                        </p>

                        <h2>Physical Goods</h2>
                        <p>
                            For physical goods purchased from shopkeepers on our platform, refunds and returns are handled according to
                            each shopkeeper's policy. Typically, shopkeepers accept returns within a specified period (often 7-30 days)
                            provided the item is unused and in its original packaging.
                        </p>

                        <h2>How to Request a Refund or Return</h2>
                        <ol>
                            <li>Contact the shopkeeper directly through our platform's messaging system</li>
                            <li>Explain the reason for your refund or return request</li>
                            <li>Provide your order details and any supporting evidence (photos, etc.)</li>
                            <li>The shopkeeper will respond with instructions for returning the item (if applicable)</li>
                        </ol>

                        <h2>Non-Refundable Items</h2>
                        <p>Certain types of items cannot be returned, such as:</p>
                        <ul>
                            <li>Perishable goods (food, flowers, etc.)</li>
                            <li>Personal care products</li>
                            <li>Customized or personalized items</li>
                            <li>Digital products with download or access already provided</li>
                        </ul>

                        <h2>Late or Missing Refunds</h2>
                        <p>
                            If you haven't received a refund yet, first check your bank account again. Then contact your credit card
                            company, as it may take some time before your refund is officially posted. If you've done all of this and
                            you still have not received your refund, please contact the shopkeeper directly.
                        </p>

                        <h2>Exchanges</h2>
                        <p>
                            We only replace items if they are defective or damaged. If you need to exchange an item for the same one,
                            contact the shopkeeper directly.
                        </p>

                        <h2>Dispute Resolution</h2>
                        <p>
                            In the event that you and a shopkeeper cannot reach an agreement regarding a refund or return, you may
                            contact our support team at{" "}
                            <a href="mailto:support@fatafatorder.com" className="text-primary hover:underline">
                                support@fatafatorder.com
                            </a>{" "}
                            and we will mediate the dispute to find a fair resolution for both parties.
                        </p>

                        <h2>Contact Us</h2>
                        <p>
                            If you have any questions about our Refund Policy, please contact us at{" "}
                            <a href="mailto:support@fatafatorder.com" className="text-primary hover:underline">
                                support@fatafatorder.com
                            </a>.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-100 py-12 mt-12">
                <div className="container mx-auto px-4">
                    <div className="text-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()} FatafatOrder. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

export function TermsConditionsPage() {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Navigation */}
            <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold">
                        FO
                    </div>
                    <span className="text-xl font-bold text-primary">Fatafat Order</span>
                </div>
                <div className="flex space-x-4">
                    <Button variant="outline" onClick={() => navigate('/')} >Back to Home</Button>
                </div>
            </nav>

            {/* Terms & Conditions Content */}
            <section className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <FileText className="text-primary h-8 w-8" />
                        </div>
                        <h1 className="text-4xl font-bold mb-4">Terms and Conditions</h1>
                        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
                    </div>

                    <Card className="mb-8">
                        <CardContent className="pt-6">
                            <p className="mb-4">
                                Welcome to FatafatOrder! These Terms and Conditions govern your use of our platform and services.
                                By accessing or using FatafatOrder, you agree to be bound by these Terms.
                            </p>
                            <p>
                                Please read these Terms carefully before using our platform. If you do not agree to these Terms,
                                you may not access or use our services.
                            </p>
                        </CardContent>
                    </Card>

                    <div className="prose prose-sm max-w-none">
                        <h2 className="flex items-center gap-2">
                            <Scale className="h-5 w-5 text-primary" />
                            1. Definitions
                        </h2>
                        <p>In these Terms:</p>
                        <ul>
                            <li>"Platform" refers to the FatafatOrder website, mobile applications, and related services.</li>
                            <li>"User", "you", "your" refers to any person or entity using our Platform.</li>
                            <li>"Shopkeeper" refers to merchants who use our Platform to sell products or services.</li>
                            <li>"Customer" refers to individuals who use our Platform to purchase products or services.</li>
                            <li>"Content" refers to text, images, videos, product information, and other materials posted on our Platform.</li>
                        </ul>

                        <h2 className="flex items-center gap-2 mt-8">
                            <BookOpen className="h-5 w-5 text-primary" />
                            2. Account Registration
                        </h2>
                        <p>To access certain features of our Platform, you may need to register for an account.</p>
                        <ul>
                            <li>You must provide accurate and complete information during registration.</li>
                            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                            <li>You are responsible for all activities that occur under your account.</li>
                            <li>You must be at least 18 years old to create an account on our Platform.</li>
                            <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
                        </ul>

                        <h2 className="flex items-center gap-2 mt-8">
                            <Shield className="h-5 w-5 text-primary" />
                            3. User Responsibilities
                        </h2>
                        <p>As a user of our Platform, you agree to:</p>
                        <ul>
                            <li>Use the Platform only for lawful purposes</li>
                            <li>Not engage in any fraudulent, deceptive, or harmful activities</li>
                            <li>Not upload or share any content that is illegal, offensive, or infringes on others' rights</li>
                            <li>Not attempt to disrupt or interfere with the Platform's security or functionality</li>
                            <li>Not use automated systems or software to extract data from our Platform</li>
                            <li>Comply with all applicable laws and regulations</li>
                        </ul>

                        <h2 className="flex items-center gap-2 mt-8">
                            <AlertTriangle className="h-5 w-5 text-primary" />
                            4. Intellectual Property Rights
                        </h2>
                        <p>
                            All content on our Platform, including text, graphics, logos, and software, is the property of
                            FatafatOrder or our licensors and is protected by intellectual property laws.
                        </p>
                        <p>You may not:</p>
                        <ul>
                            <li>Copy, reproduce, modify, or create derivative works of our content without permission</li>
                            <li>Use our trademarks or logos without prior written consent</li>
                            <li>Reverse engineer, decompile, or disassemble any part of our Platform</li>
                        </ul>
                        <p>
                            By posting content on our Platform, you grant us a non-exclusive, royalty-free license to use,
                            display, and distribute that content in connection with our services.
                        </p>

                        <h2 className="flex items-center gap-2 mt-8">
                            <FileText className="h-5 w-5 text-primary" />
                            5. Transactions and Payments
                        </h2>
                        <p>
                            FatafatOrder facilitates transactions between Shopkeepers and Customers but is not a party to
                            these transactions.
                        </p>
                        <ul>
                            <li>Shopkeepers are responsible for accurately describing their products and services</li>
                            <li>Customers are responsible for reading product descriptions before purchasing</li>
                            <li>All prices are set by Shopkeepers and are subject to change</li>
                            <li>Payment processing may be handled by third-party services</li>
                            <li>Disputes regarding transactions should be resolved directly between Shopkeepers and Customers</li>
                        </ul>

                        <h2 className="flex items-center gap-2 mt-8">
                            <Shield className="h-5 w-5 text-primary" />
                            6. Disclaimer of Warranties
                        </h2>
                        <p>
                            Our Platform is provided on an "as is" and "as available" basis. We do not warrant that:
                        </p>
                        <ul>
                            <li>The Platform will meet your specific requirements</li>
                            <li>The Platform will be uninterrupted, timely, secure, or error-free</li>
                            <li>The results from using the Platform will be accurate or reliable</li>
                            <li>The quality of any products, services, or information obtained through the Platform will meet your expectations</li>
                        </ul>

                        <h2 className="flex items-center gap-2 mt-8">
                            <AlertTriangle className="h-5 w-5 text-primary" />
                            7. Limitation of Liability
                        </h2>
                        <p>
                            To the fullest extent permitted by law, FatafatOrder shall not be liable for any indirect,
                            incidental, special, consequential, or punitive damages, including but not limited to:
                        </p>
                        <ul>
                            <li>Loss of profits, data, use, goodwill, or other intangible losses</li>
                            <li>Damages resulting from your access to or use of, or inability to access or use, the Platform</li>
                            <li>Damages resulting from any conduct or content of any third party on the Platform</li>
                            <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                        </ul>

                        <h2 className="flex items-center gap-2 mt-8">
                            <FileText className="h-5 w-5 text-primary" />
                            8. Third-Party Links and Services
                        </h2>
                        <p>
                            Our Platform may contain links to third-party websites or services that are not owned or
                            controlled by FatafatOrder.
                        </p>
                        <p>
                            We have no control over, and assume no responsibility for, the content, privacy policies,
                            or practices of any third-party websites or services. You acknowledge and agree that
                            FatafatOrder shall not be responsible or liable for any damage or loss caused by or in
                            connection with the use of any such content, goods, or services available on or through
                            any such websites or services.
                        </p>

                        <h2 className="flex items-center gap-2 mt-8">
                            <Scale className="h-5 w-5 text-primary" />
                            9. Indemnification
                        </h2>
                        <p>
                            You agree to indemnify and hold harmless FatafatOrder and its affiliates, officers,
                            directors, employees, and agents from any claims, damages, losses, liabilities, and
                            expenses (including legal fees) arising out of or in connection with:
                        </p>
                        <ul>
                            <li>Your use of the Platform</li>
                            <li>Your violation of these Terms</li>
                            <li>Your violation of any rights of another party</li>
                            <li>Your violation of any applicable laws or regulations</li>
                        </ul>

                        <h2 className="flex items-center gap-2 mt-8">
                            <FileText className="h-5 w-5 text-primary" />
                            10. Changes to Terms
                        </h2>
                        <p>
                            We reserve the right to modify or replace these Terms at any time. If we make material
                            changes, we will provide notice through our Platform or by other means to give you the
                            opportunity to review the changes before they become effective.
                        </p>
                        <p>
                            Your continued use of the Platform after any changes to the Terms constitutes acceptance
                            of those changes.
                        </p>

                        <h2 className="flex items-center gap-2 mt-8">
                            <Scale className="h-5 w-5 text-primary" />
                            11. Governing Law
                        </h2>
                        <p>
                            These Terms shall be governed by and construed in accordance with the laws of the
                            jurisdiction in which FatafatOrder operates, without regard to its conflict of law
                            provisions.
                        </p>

                        <h2 className="flex items-center gap-2 mt-8">
                            <FileText className="h-5 w-5 text-primary" />
                            12. Severability
                        </h2>
                        <p>
                            If any provision of these Terms is held to be invalid or unenforceable by a court,
                            the remaining provisions of these Terms will remain in effect.
                        </p>

                        <h2 className="flex items-center gap-2 mt-8">
                            <AlertTriangle className="h-5 w-5 text-primary" />
                            13. Entire Agreement
                        </h2>
                        <p>
                            These Terms constitute the entire agreement between you and FatafatOrder regarding
                            our Platform and supersede all prior and contemporaneous written or oral agreements
                            between us.
                        </p>

                        <h2 className="flex items-center gap-2 mt-8">
                            <Shield className="h-5 w-5 text-primary" />
                            14. Contact Information
                        </h2>
                        <p>
                            If you have any questions about these Terms, please contact us at:
                        </p>
                        <p>
                            Email: <a href="mailto:legal@fatafatorder.com" className="text-primary hover:underline">legal@fatafatorder.com</a>
                            <br />
                            Address: 123 Commerce Street, Business District, New York, NY 10001
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-100 py-12 mt-12">
                <div className="container mx-auto px-4">
                    <div className="text-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()} FatafatOrder. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}