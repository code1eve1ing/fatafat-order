import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send } from "lucide-react";

export function FloatingChat({ shopId }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    // Simulate receiving messages
    useEffect(() => {
        if (!isOpen || messages.length > 0) return;

        // Initial shop greeting
        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                {
                    id: 1,
                    text: "Hello! Welcome to our shop. How can I help you today?",
                    sender: "shop",
                    timestamp: new Date(),
                }
            ]);
        }, 1000);
    }, [isOpen, messages.length]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        // Add user message
        const userMessage = {
            id: messages.length + 1,
            text: newMessage,
            sender: "user",
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);
        setNewMessage("");

        // Simulate shop reply
        setIsTyping(true);
        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                {
                    id: messages.length + 2,
                    text: "Thanks for your message! We'll get back to you shortly.",
                    sender: "shop",
                    timestamp: new Date(),
                }
            ]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <div className="w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col border border-gray-200">
                    {/* Chat Header */}
                    <div className="bg-primary text-white p-3 rounded-t-lg flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <MessageCircle className="h-5 w-5" />
                            <span className="font-medium">Chat with Shop</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:text-gray-200"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-xs p-3 rounded-lg ${message.sender === "user"
                                        ? "bg-primary text-white"
                                        : "bg-gray-100 text-gray-800"}`}
                                >
                                    {message.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                                    <div className="flex space-x-1">
                                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Message Input */}
                    <div className="p-3 border-t">
                        <div className="flex space-x-2">
                            <Input
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                            />
                            <Button
                                size="icon"
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim()}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
                >
                    <MessageCircle className="h-6 w-6" />
                </button>
            )}
        </div>
    );
}