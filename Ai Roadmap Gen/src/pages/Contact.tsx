import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, MessageSquare, User, Send, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Contact = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Simulated contact form submission
            await new Promise(resolve => setTimeout(resolve, 800));

            toast({
                title: "Message Sent!",
                description: "We'll get back to you as soon as possible.",
            });
            setFormData({ name: "", email: "", message: "" });
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-4xl z-10">
                <Button
                    variant="ghost"
                    className="mb-8 text-slate-400 hover:text-white hover:bg-white/5"
                    onClick={() => navigate("/")}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                </Button>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-4">Get in Touch</h1>
                            <p className="text-slate-400 text-lg">
                                Have a question about the AI Roadmap Generator? We're here to help you on your learning journey.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <Card className="bg-[#0f172a]/50 border-blue-900/30">
                                <CardContent className="flex items-center gap-4 p-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-400">Email Us</p>
                                        <p className="text-white">harshalvidhate91@gmail.com</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <Card className="bg-[#0f172a] border-blue-900/50 shadow-2xl">
                        <CardHeader>
                            <CardTitle className="text-white">Send us a message</CardTitle>
                            <CardDescription className="text-slate-400">
                                Fill out the form below and we'll get back to you shortly.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-slate-300">Name</label>
                                    <Input
                                        id="name"
                                        placeholder="Your name"
                                        className="bg-[#1e293b] border-blue-900/30 text-white placeholder:text-slate-500 focus:border-blue-500/50"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-slate-300">Email</label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        className="bg-[#1e293b] border-blue-900/30 text-white placeholder:text-slate-500 focus:border-blue-500/50"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium text-slate-300">Message</label>
                                    <Textarea
                                        id="message"
                                        placeholder="How can we help?"
                                        className="bg-[#1e293b] border-blue-900/30 text-white placeholder:text-slate-500 focus:border-blue-500/50 min-h-[120px]"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white" disabled={isLoading}>
                                    {isLoading ? "Sending..." : <span className="flex items-center">Send Message <Send className="ml-2 h-4 w-4" /></span>}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Contact;
